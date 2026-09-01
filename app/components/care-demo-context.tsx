'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_ENCOUNTER_ID, DEFAULT_PATIENT_ID } from './demo-routes';
import {
  CareDemoContext,
  EMPTY_PRECONSULTATION_DRAFT,
  getCareDemoScopeKey,
  type CareDemoState,
  type CareDemoStoreValue,
} from './care-demo-store';
import type {
  CareDemoScope,
  PreConsultationAnswers,
  PreConsultationReview,
  PreConsultationSubmission,
} from './care-demo-types';

const STORAGE_KEY = 'instituto-vivans-demo-care-v2';
const LEGACY_STORAGE_KEY = 'instituto-vivans-demo-care-v1';
const DEFAULT_SCOPE: CareDemoScope = {
  patientId: DEFAULT_PATIENT_ID,
  encounterId: DEFAULT_ENCOUNTER_ID,
};

const emptyState: CareDemoState = {
  draftsByEncounter: {},
  submissions: [],
  reviews: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isoTimestampFromOpaqueId(id: string) {
  const timestamp = Number(id.match(/(\d{13})$/)?.[1]);
  return Number.isFinite(timestamp)
    ? new Date(timestamp).toISOString()
    : '2026-08-26T00:00:00-03:00';
}

function normalizeAnswers(value: unknown): PreConsultationAnswers | null {
  if (!isRecord(value)) return null;

  return {
    consentGiven: typeof value.consentGiven === 'boolean' ? value.consentGiven : false,
    aiAssistanceAllowed:
      typeof value.aiAssistanceAllowed === 'boolean' ? value.aiAssistanceAllowed : false,
    objective: typeof value.objective === 'string' ? value.objective : '',
    changes: typeof value.changes === 'string' ? value.changes : '',
    questions: typeof value.questions === 'string' ? value.questions : '',
    additionalContext:
      typeof value.additionalContext === 'string' ? value.additionalContext : '',
  };
}

function normalizeSubmission(
  value: unknown,
  fallbackScope?: CareDemoScope,
): PreConsultationSubmission | null {
  if (!isRecord(value)) return null;
  const answers = normalizeAnswers(value);
  const patientId = typeof value.patientId === 'string' ? value.patientId : fallbackScope?.patientId;
  const encounterId =
    typeof value.encounterId === 'string' ? value.encounterId : fallbackScope?.encounterId;

  if (
    !answers ||
    typeof value.id !== 'string' ||
    !patientId ||
    !encounterId ||
    typeof value.version !== 'number' ||
    typeof value.submittedAt !== 'string'
  ) {
    return null;
  }

  return {
    ...answers,
    id: value.id,
    patientId,
    encounterId,
    version: value.version,
    submittedAt: value.submittedAt,
    submittedAtIso:
      typeof value.submittedAtIso === 'string'
        ? value.submittedAtIso
        : isoTimestampFromOpaqueId(value.id),
    consentVersion: 'pre-consulta-texto-v1',
    structuredDraft: typeof value.structuredDraft === 'string' ? value.structuredDraft : null,
  };
}

function normalizeReview(
  value: unknown,
  fallbackScope?: CareDemoScope,
): PreConsultationReview | null {
  if (!isRecord(value)) return null;
  const patientId = typeof value.patientId === 'string' ? value.patientId : fallbackScope?.patientId;
  const encounterId =
    typeof value.encounterId === 'string' ? value.encounterId : fallbackScope?.encounterId;
  const status =
    value.status === 'draft' || value.status === 'approved' || value.status === 'rejected'
      ? value.status
      : null;
  const sourceMode =
    value.sourceMode === 'assisted' || value.sourceMode === 'manual' ? value.sourceMode : null;

  if (
    typeof value.id !== 'string' ||
    !patientId ||
    !encounterId ||
    typeof value.submissionId !== 'string' ||
    typeof value.version !== 'number' ||
    !status ||
    typeof value.content !== 'string' ||
    !sourceMode ||
    typeof value.createdAt !== 'string' ||
    typeof value.updatedAt !== 'string'
  ) {
    return null;
  }

  const createdAtIso =
    typeof value.createdAtIso === 'string'
      ? value.createdAtIso
      : isoTimestampFromOpaqueId(value.id);
  const updatedAtIso =
    typeof value.updatedAtIso === 'string' ? value.updatedAtIso : createdAtIso;

  return {
    id: value.id,
    patientId,
    encounterId,
    submissionId: value.submissionId,
    version: value.version,
    status,
    content: value.content,
    sourceMode,
    createdAt: value.createdAt,
    createdAtIso,
    updatedAt: value.updatedAt,
    updatedAtIso,
    reviewedAt: typeof value.reviewedAt === 'string' ? value.reviewedAt : null,
    reviewedAtIso:
      typeof value.reviewedAtIso === 'string'
        ? value.reviewedAtIso
        : typeof value.reviewedAt === 'string'
          ? updatedAtIso
          : null,
    reviewedBy: typeof value.reviewedBy === 'string' ? value.reviewedBy : null,
    rejectionReason: typeof value.rejectionReason === 'string' ? value.rejectionReason : null,
  };
}

function normalizeCurrentState(value: unknown): CareDemoState | null {
  if (!isRecord(value) || !isRecord(value.draftsByEncounter)) return null;

  const draftsByEncounter = Object.fromEntries(
    Object.entries(value.draftsByEncounter).flatMap(([key, draft]) => {
      const normalized = normalizeAnswers(draft);
      return normalized ? [[key, normalized]] : [];
    }),
  );
  const submissions = Array.isArray(value.submissions)
    ? value.submissions.flatMap((submission) => {
        const normalized = normalizeSubmission(submission);
        return normalized ? [normalized] : [];
      })
    : [];
  const reviews = Array.isArray(value.reviews)
    ? value.reviews.flatMap((review) => {
        const normalized = normalizeReview(review);
        return normalized ? [normalized] : [];
      })
    : [];

  return { draftsByEncounter, submissions, reviews };
}

function migrateLegacyState(value: unknown): CareDemoState | null {
  if (!isRecord(value)) return null;
  const draft = normalizeAnswers(value.draft) ?? { ...EMPTY_PRECONSULTATION_DRAFT };
  const submissions = Array.isArray(value.submissions)
    ? value.submissions.flatMap((submission) => {
        const normalized = normalizeSubmission(submission, DEFAULT_SCOPE);
        return normalized ? [normalized] : [];
      })
    : [];
  const reviews = Array.isArray(value.reviews)
    ? value.reviews.flatMap((review) => {
        const normalized = normalizeReview(review, DEFAULT_SCOPE);
        return normalized ? [normalized] : [];
      })
    : [];

  return {
    draftsByEncounter: {
      [getCareDemoScopeKey(DEFAULT_PATIENT_ID, DEFAULT_ENCOUNTER_ID)]: draft,
    },
    submissions,
    reviews,
  };
}

function buildStructuredDraft(answers: PreConsultationAnswers) {
  const sections = [
    `Objetivo declarado: ${answers.objective.trim()}`,
    `Mudanças relatadas: ${answers.changes.trim()}`,
    answers.questions.trim() ? `Dúvidas para a consulta: ${answers.questions.trim()}` : '',
    answers.additionalContext.trim() ? `Contexto adicional: ${answers.additionalContext.trim()}` : '',
  ].filter(Boolean);

  return sections.join('\n\n');
}

function formatSubmissionTime(date = new Date()) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function CareDemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CareDemoState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      let restored: CareDemoState | null = null;
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          restored = normalizeCurrentState(JSON.parse(stored));
        } catch {
          restored = null;
        }
        if (!restored) window.sessionStorage.removeItem(STORAGE_KEY);
      }

      if (!restored) {
        const legacy = window.sessionStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          try {
            restored = migrateLegacyState(JSON.parse(legacy));
          } catch {
            restored = null;
          }
        }
      }

      if (restored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hidrata ou migra a sessão sem apagar a origem v1 antes da gravação v2
        setState(restored);
      }
    } catch {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // sessionStorage pode estar indisponível; o protótipo continua em memória.
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Falhas de quota ou privacidade não devem interromper o fluxo demonstrativo.
      }
    }
  }, [hydrated, state]);

  const value = useMemo<CareDemoStoreValue>(() => {
    const submissionsFor = (patientId: string, encounterId: string) =>
      state.submissions.filter(
        (submission) =>
          submission.patientId === patientId && submission.encounterId === encounterId,
      );

    const latestSubmissionFor = (patientId: string, encounterId: string) =>
      submissionsFor(patientId, encounterId).at(-1) ?? null;

    const reviewHistoryFor = (patientId: string, encounterId: string) => {
      const latestSubmission = latestSubmissionFor(patientId, encounterId);
      return latestSubmission
        ? state.reviews.filter(
            (review) =>
              review.patientId === patientId &&
              review.encounterId === encounterId &&
              review.submissionId === latestSubmission.id,
          )
        : [];
    };

    const requireSubmission = (patientId: string, encounterId: string) => {
      const latestSubmission = latestSubmissionFor(patientId, encounterId);
      if (!latestSubmission) {
        throw new Error('Envie uma pré-consulta antes de iniciar a revisão médica.');
      }
      return latestSubmission;
    };

    const requireDraftReview = (patientId: string, encounterId: string) => {
      const activeReview = reviewHistoryFor(patientId, encounterId).at(-1) ?? null;
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
      hydrated,
      draftsByEncounter: state.draftsByEncounter,
      submissions: state.submissions,
      reviews: state.reviews,
      savePreConsultationDraft: (patientId, encounterId, patch) => {
        const scopeKey = getCareDemoScopeKey(patientId, encounterId);
        setState((current) => ({
          ...current,
          draftsByEncounter: {
            ...current.draftsByEncounter,
            [scopeKey]: {
              ...(current.draftsByEncounter[scopeKey] ?? EMPTY_PRECONSULTATION_DRAFT),
              ...patch,
            },
          },
        }));
      },
      submitPreConsultation: (patientId, encounterId) => {
        const scopeKey = getCareDemoScopeKey(patientId, encounterId);
        const draft = state.draftsByEncounter[scopeKey] ?? EMPTY_PRECONSULTATION_DRAFT;
        const scopedSubmissions = submissionsFor(patientId, encounterId);
        const now = new Date();
        const created: PreConsultationSubmission = {
          ...draft,
          id: `pre-consulta-${Date.now()}`,
          patientId,
          encounterId,
          version: scopedSubmissions.length + 1,
          submittedAt: formatSubmissionTime(now),
          submittedAtIso: now.toISOString(),
          consentVersion: 'pre-consulta-texto-v1',
          structuredDraft: draft.aiAssistanceAllowed ? buildStructuredDraft(draft) : null,
        };

        setState((current) => ({
          ...current,
          submissions: [...current.submissions, created],
        }));

        return created;
      },
      startPreConsultationReview: (patientId, encounterId) => {
        const submission = requireSubmission(patientId, encounterId);
        const reviewHistory = reviewHistoryFor(patientId, encounterId);
        const activeReview = reviewHistory.at(-1) ?? null;
        if (activeReview?.status === 'draft') return activeReview;

        const now = new Date();
        const timestamp = formatSubmissionTime(now);
        const timestampIso = now.toISOString();
        const created: PreConsultationReview = {
          id: `revisao-pre-consulta-${Date.now()}`,
          patientId,
          encounterId,
          submissionId: submission.id,
          version: reviewHistory.length + 1,
          status: 'draft',
          content: activeReview?.content ?? submission.structuredDraft ?? buildStructuredDraft(submission),
          sourceMode: submission.structuredDraft ? 'assisted' : 'manual',
          createdAt: timestamp,
          createdAtIso: timestampIso,
          updatedAt: timestamp,
          updatedAtIso: timestampIso,
          reviewedAt: null,
          reviewedAtIso: null,
          reviewedBy: null,
          rejectionReason: null,
        };

        setState((current) => ({
          ...current,
          reviews: [...current.reviews, created],
        }));
        return created;
      },
      savePreConsultationReview: (patientId, encounterId, content) => {
        const review = requireDraftReview(patientId, encounterId);
        const now = new Date();
        return replaceReview({
          ...review,
          content,
          updatedAt: formatSubmissionTime(now),
          updatedAtIso: now.toISOString(),
        });
      },
      approvePreConsultationReview: (patientId, encounterId, content) => {
        const review = requireDraftReview(patientId, encounterId);
        if (content.trim().length < 20) {
          throw new Error('O preparo precisa ter ao menos 20 caracteres antes da aprovação.');
        }
        const now = new Date();
        const timestamp = formatSubmissionTime(now);
        const timestampIso = now.toISOString();
        return replaceReview({
          ...review,
          content: content.trim(),
          status: 'approved',
          updatedAt: timestamp,
          updatedAtIso: timestampIso,
          reviewedAt: timestamp,
          reviewedAtIso: timestampIso,
          reviewedBy: 'Dr. Guilherme Martins',
          rejectionReason: null,
        });
      },
      rejectPreConsultationReview: (patientId, encounterId, content, reason) => {
        const review = requireDraftReview(patientId, encounterId);
        if (reason.trim().length < 10) {
          throw new Error('Explique em ao menos 10 caracteres por que o rascunho foi rejeitado.');
        }
        const now = new Date();
        const timestamp = formatSubmissionTime(now);
        const timestampIso = now.toISOString();
        return replaceReview({
          ...review,
          content,
          status: 'rejected',
          updatedAt: timestamp,
          updatedAtIso: timestampIso,
          reviewedAt: timestamp,
          reviewedAtIso: timestampIso,
          reviewedBy: 'Dr. Guilherme Martins',
          rejectionReason: reason.trim(),
        });
      },
    };
  }, [hydrated, state]);

  return <CareDemoContext.Provider value={value}>{children}</CareDemoContext.Provider>;
}
