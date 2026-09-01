'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CareDemoContext, type CareDemoContextValue } from './care-demo-store';
import type {
  PreConsultationAnswers,
  PreConsultationReview,
  PreConsultationSubmission,
} from './care-demo-types';

interface CareDemoState {
  draft: PreConsultationAnswers;
  submissions: PreConsultationSubmission[];
  reviews: PreConsultationReview[];
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
  reviews: [],
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
          setState({
            draft: { ...emptyDraft, ...parsed.draft },
            submissions: parsed.submissions,
            reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
          });
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
    const reviewHistory = latestSubmission
      ? state.reviews.filter((review) => review.submissionId === latestSubmission.id)
      : [];
    const activeReview = reviewHistory.at(-1) ?? null;

    const requireSubmission = () => {
      if (!latestSubmission) {
        throw new Error('Envie uma pré-consulta antes de iniciar a revisão médica.');
      }
      return latestSubmission;
    };

    const requireDraftReview = () => {
      if (!activeReview || activeReview.status !== 'draft') {
        throw new Error('Inicie uma nova versão de revisão antes de editar este preparo.');
      }
      return activeReview;
    };

    const replaceReview = (updated: PreConsultationReview) => {
      setState((current) => ({
        ...current,
        reviews: current.reviews.map((review) => review.id === updated.id ? updated : review),
      }));
      return updated;
    };

    return {
      draft: state.draft,
      latestSubmission,
      submissions: state.submissions,
      activeReview,
      reviewHistory,
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
          ...current,
          submissions: [...current.submissions, created],
        }));

        return created;
      },
      startPreConsultationReview: () => {
        const submission = requireSubmission();
        if (activeReview?.status === 'draft') return activeReview;

        const timestamp = formatSubmissionTime();
        const created: PreConsultationReview = {
          id: `revisao-pre-consulta-${Date.now()}`,
          submissionId: submission.id,
          version: reviewHistory.length + 1,
          status: 'draft',
          content: activeReview?.content ?? submission.structuredDraft ?? buildStructuredDraft(submission),
          sourceMode: submission.structuredDraft ? 'assisted' : 'manual',
          createdAt: timestamp,
          updatedAt: timestamp,
          reviewedAt: null,
          reviewedBy: null,
          rejectionReason: null,
        };

        setState((current) => ({
          ...current,
          reviews: [...current.reviews, created],
        }));
        return created;
      },
      savePreConsultationReview: (content) => {
        const review = requireDraftReview();
        return replaceReview({ ...review, content, updatedAt: formatSubmissionTime() });
      },
      approvePreConsultationReview: (content) => {
        const review = requireDraftReview();
        if (content.trim().length < 20) {
          throw new Error('O preparo precisa ter ao menos 20 caracteres antes da aprovação.');
        }
        const timestamp = formatSubmissionTime();
        return replaceReview({
          ...review,
          content: content.trim(),
          status: 'approved',
          updatedAt: timestamp,
          reviewedAt: timestamp,
          reviewedBy: 'Dr. Guilherme Martins',
          rejectionReason: null,
        });
      },
      rejectPreConsultationReview: (content, reason) => {
        const review = requireDraftReview();
        if (reason.trim().length < 10) {
          throw new Error('Explique em ao menos 10 caracteres por que o rascunho foi rejeitado.');
        }
        const timestamp = formatSubmissionTime();
        return replaceReview({
          ...review,
          content,
          status: 'rejected',
          updatedAt: timestamp,
          reviewedAt: timestamp,
          reviewedBy: 'Dr. Guilherme Martins',
          rejectionReason: reason.trim(),
        });
      },
    };
  }, [state]);

  return <CareDemoContext.Provider value={value}>{children}</CareDemoContext.Provider>;
}
