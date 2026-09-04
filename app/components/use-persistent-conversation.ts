'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  CareConversationMessage,
  CareConversationMessageInput,
  CareConversationSender,
} from './care-demo-types';

type ApiMessage = {
  id: string;
  patientId: string;
  encounterId: string;
  sender: CareConversationSender;
  context: CareConversationMessageInput['context'];
  body: string;
  sentAtIso: string;
  deliveryState: 'delivered' | 'read';
};

function formatMessageTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Agora';

  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function toCareMessage(message: ApiMessage, version: number): CareConversationMessage {
  return {
    id: message.id,
    patientId: message.patientId,
    encounterId: message.encounterId,
    version,
    sender: message.sender,
    context: message.context,
    body: message.body,
    sentAt: formatMessageTime(message.sentAtIso),
    sentAtIso: message.sentAtIso,
    retentionMode: 'durable',
  };
}

export function usePersistentConversation({
  patientId,
  encounterId,
  sender,
  enabled = true,
}: {
  patientId: string;
  encounterId: string;
  sender: CareConversationSender;
  enabled?: boolean;
}) {
  const [messages, setMessages] = useState<CareConversationMessage[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/messages?patientId=${encodeURIComponent(patientId)}`, {
        cache: 'no-store',
      });
      const payload = (await response.json()) as { messages?: ApiMessage[]; error?: string };
      if (!response.ok || !payload.messages) {
        throw new Error(payload.error ?? 'Não foi possível atualizar a conversa.');
      }

      setMessages(payload.messages.map((message, index) => toCareMessage(message, index + 1)));
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível atualizar a conversa.');
    } finally {
      setLoading(false);
    }
  }, [enabled, patientId]);

  useEffect(() => {
    if (!enabled) return;

    const initialRefresh = window.setTimeout(() => void refresh(), 0);

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, 8_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled, refresh]);

  const sendMessage = useCallback(async (input: CareConversationMessageInput) => {
    if (!enabled) throw new Error('Esta conversa ainda não está vinculada a uma conta.');

    const trimmed = input.body.trim();
    if (trimmed.length < 2 || [...trimmed].length > 600) {
      throw new Error('Escreva uma mensagem entre 2 e 600 caracteres.');
    }

    const clientMessageId = crypto.randomUUID();
    const sentAtIso = new Date().toISOString();
    const optimistic: CareConversationMessage = {
      id: `pending-${clientMessageId}`,
      patientId,
      encounterId,
      version: messages.length + 1,
      sender,
      context: input.context,
      body: trimmed,
      sentAt: 'Agora',
      sentAtIso,
      retentionMode: 'durable',
    };

    setSending(true);
    setError('');
    setMessages((current) => [...current, optimistic]);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          context: input.context,
          message: trimmed,
          clientMessageId,
        }),
      });
      const payload = (await response.json()) as { message?: ApiMessage; error?: string };
      if (!response.ok || !payload.message) {
        throw new Error(payload.error ?? 'Não foi possível enviar a mensagem.');
      }

      setMessages((current) =>
        current.map((message, index) =>
          message.id === optimistic.id
            ? toCareMessage(payload.message!, index + 1)
            : message,
        ),
      );
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Não foi possível enviar a mensagem.';
      setMessages((current) => current.filter((item) => item.id !== optimistic.id));
      setError(message);
      throw new Error(message);
    } finally {
      setSending(false);
    }
  }, [enabled, encounterId, messages.length, patientId, sender]);

  return { messages, loading, sending, error, refresh, sendMessage };
}
