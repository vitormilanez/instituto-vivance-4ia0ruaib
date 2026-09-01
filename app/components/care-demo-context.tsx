'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CareDemoContext, type CareDemoContextValue } from './care-demo-store';
import type { PreConsultationAnswers, PreConsultationSubmission } from './care-demo-types';

interface CareDemoState {
  draft: PreConsultationAnswers;
  submissions: PreConsultationSubmission[];
}

const STORAGE_KEY = 'instituto-vivans-demo-care-v1';

const emptyDraft: PreConsultationAnswers = {
  consentGiven: false,
  aiAssistanceAllowed: false,
  objective: '',
  changes: '',
  questions: '',
  additionalContext: '',
};

const emptyState: CareDemoState = {
  draft: emptyDraft,
  submissions: [],
};

function buildStructuredDraft(answers: PreConsultationAnswers) {
  const sections = [
    `Objetivo declarado: ${answers.objective.trim()}`,
    `Mudanças relatadas: ${answers.changes.trim()}`,
    answers.questions.trim() ? `Dúvidas para a consulta: ${answers.questions.trim()}` : '',
    answers.additionalContext.trim() ? `Contexto adicional: ${answers.additionalContext.trim()}` : '',
  ].filter(Boolean);

  return sections.join('\n\n');
}

function formatSubmissionTime() {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export function CareDemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CareDemoState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<CareDemoState>;
        if (parsed.draft && Array.isArray(parsed.submissions)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- hidrata o protótipo a partir da sessionStorage após o mount
          setState({ draft: { ...emptyDraft, ...parsed.draft }, submissions: parsed.submissions });
        }
      }
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const value = useMemo<CareDemoContextValue>(() => {
    const latestSubmission = state.submissions.at(-1) ?? null;

    return {
      draft: state.draft,
      latestSubmission,
      submissions: state.submissions,
      savePreConsultationDraft: (patch) => {
        setState((current) => ({
          ...current,
          draft: { ...current.draft, ...patch },
        }));
      },
      submitPreConsultation: () => {
        const created: PreConsultationSubmission = {
          ...state.draft,
          id: `pre-consulta-${Date.now()}`,
          version: state.submissions.length + 1,
          submittedAt: formatSubmissionTime(),
          consentVersion: 'pre-consulta-texto-v1',
          structuredDraft: state.draft.aiAssistanceAllowed
            ? buildStructuredDraft(state.draft)
            : null,
        };

        setState((current) => ({
          draft: current.draft,
          submissions: [...current.submissions, created],
        }));

        return created;
      },
    };
  }, [state]);

  return <CareDemoContext.Provider value={value}>{children}</CareDemoContext.Provider>;
}
