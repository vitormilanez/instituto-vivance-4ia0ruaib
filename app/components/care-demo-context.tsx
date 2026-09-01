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
  CarePlanAction,
  CarePlanDraftContent,
  CarePlanSourceMode,
  CarePlanStatus,
  CarePlanVersion,
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

function getInitialCarePlans(): CarePlanVersion[] {
  return [
    {
      id: 'plan-demo-001',
      patientId: DEFAULT_PATIENT_ID,
      encounterId: DEFAULT_ENCOUNTER_ID,
      version: 1,
      status: 'published',
      title: 'Plano de cuidado compartilhado',
      objective: 'Cuidar da regularidade do sono e manter os registros que ajudam a conversa de acompanhamento.',
      introduction: 'Este é um plano demonstrativo publicado depois de revisão médica. Ele organiza o combinado em passos simples para a paciente.',
      actions: [
        { id: 'plan-demo-001-action-1', title: 'Registrar como foi o sono ao acordar', cadence: 'Diariamente, quando for possível', active: true },
        { id: 'plan-demo-001-action-2', title: 'Registrar uma foto ou relato do jantar', cadence: 'Em 3 dias desta semana', active: true },
        { id: 'plan-demo-001-action-3', title: 'Guardar uma dúvida para a próxima conversa', cadence: 'Até a próxima consulta', active: true },
      ],
      monitoring: 'Os registros ficam disponíveis para revisão na próxima conversa; eles não são interpretados automaticamente como decisão clínica.',
      supportNotice: 'Se algo mudar ou surgir uma dúvida, use o canal combinado com sua equipe. O protótipo não classifica urgência.',
      sourceDescription: 'Resumo demonstrativo da primeira consulta',
      sourceMode: 'manual',
      sourceReviewId: null,
      authoredBy: 'Dr. Guilherme Martins · médico responsável',
      createdAt: '12 ago · 11:14',
      createdAtIso: '2026-08-12T11:14:00-03:00',
      updatedAt: '12 ago · 11:14',
      updatedAtIso: '2026-08-12T11:14:00-03:00',
      approvedBy: 'Dr. Guilherme Martins · médico responsável',
      approvedAt: '12 ago · 11:14',
      approvedAtIso: '2026-08-12T11:14:00-03:00',
      publishedBy: 'Dr. Guilherme Martins · médico responsável',
      publishedAt: '12 ago · 11:16',
      publishedAtIso: '2026-08-12T11:16:00-03:00',
      supersededByVersion: null,
    },
  ];
}

const emptyState: CareDemoState = {
  draftsByEncounter: {},
  submissions: [],
  reviews: [],
  carePlans: getInitialCarePlans(),
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

function normalizeCarePlanAction(value: unknown): CarePlanAction | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.cadence !== 'string' ||
    typeof value.active !== 'boolean'
  ) {
    return null;
  }

  return {
    id: value.id,
    title: value.title,
    cadence: value.cadence,
    active: value.active,
  };
}

function normalizeCarePlan(value: unknown): CarePlanVersion | null {
  if (!isRecord(value)) return null;
  const status: CarePlanStatus | null =
    value.status === 'draft' ||
    value.status === 'approved' ||
    value.status === 'published' ||
    value.status === 'superseded'
      ? value.status
      : null;
  const sourceMode: CarePlanSourceMode | null =
    value.sourceMode === 'manual' || value.sourceMode === 'assisted' ? value.sourceMode : null;
  const actions = Array.isArray(value.actions)
    ? value.actions.flatMap((action) => {
        const normalized = normalizeCarePlanAction(action);
        return normalized ? [normalized] : [];
      })
    : [];

  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.version !== 'number' ||
    !status ||
    typeof value.title !== 'string' ||
    typeof value.objective !== 'string' ||
    typeof value.introduction !== 'string' ||
    actions.length === 0 ||
    !sourceMode ||
    typeof value.monitoring !== 'string' ||
    typeof value.supportNotice !== 'string' ||
    typeof value.sourceDescription !== 'string' ||
    typeof value.authoredBy !== 'string' ||
    typeof value.createdAt !== 'string' ||
    typeof value.updatedAt !== 'string'
  ) {
    return null;
  }

  const createdAtIso =
    typeof value.createdAtIso === 'string' ? value.createdAtIso : isoTimestampFromOpaqueId(value.id);
  const updatedAtIso = typeof value.updatedAtIso === 'string' ? value.updatedAtIso : createdAtIso;

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    version: value.version,
    status,
    title: value.title,
    objective: value.objective,
    introduction: value.introduction,
    actions,
    monitoring: value.monitoring,
    supportNotice: value.supportNotice,
    sourceDescription: value.sourceDescription,
    sourceMode,
    sourceReviewId: typeof value.sourceReviewId === 'string' ? value.sourceReviewId : null,
    authoredBy: value.authoredBy,
    createdAt: value.createdAt,
    createdAtIso,
    updatedAt: value.updatedAt,
    updatedAtIso,
    approvedBy: typeof value.approvedBy === 'string' ? value.approvedBy : null,
    approvedAt: typeof value.approvedAt === 'string' ? value.approvedAt : null,
    approvedAtIso:
      typeof value.approvedAtIso === 'string'
        ? value.approvedAtIso
        : typeof value.approvedAt === 'string'
          ? updatedAtIso
          : null,
    publishedBy: typeof value.publishedBy === 'string' ? value.publishedBy : null,
    publishedAt: typeof value.publishedAt === 'string' ? value.publishedAt : null,
    publishedAtIso:
      typeof value.publishedAtIso === 'string'
        ? value.publishedAtIso
        : typeof value.publishedAt === 'string'
          ? updatedAtIso
          : null,
    supersededByVersion:
      typeof value.supersededByVersion === 'number' ? value.supersededByVersion : null,
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
  const parsedCarePlans = Array.isArray(value.carePlans)
    ? value.carePlans.flatMap((plan) => {
        const normalized = normalizeCarePlan(plan);
        return normalized ? [normalized] : [];
      })
    : [];

  return {
    draftsByEncounter,
    submissions,
    reviews,
    carePlans: parsedCarePlans.length > 0 ? parsedCarePlans : getInitialCarePlans(),
  };
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
    carePlans: getInitialCarePlans(),
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

function getDefaultCarePlanContent(): CarePlanDraftContent {
  return {
    title: 'Plano de cuidado compartilhado',
    objective: 'Registrar o que ajuda a acompanhar a rotina e levar as dúvidas para a próxima conversa.',
    introduction: 'Rascunho demonstrativo para organização do cuidado. Edite o conteúdo antes de aprovar e publicar.',
    actions: [
      { id: 'plan-action-template-1', title: 'Registrar como foi o sono ao acordar', cadence: 'Diariamente, quando for possível', active: true },
      { id: 'plan-action-template-2', title: 'Registrar uma foto ou relato do jantar', cadence: 'Em 3 dias desta semana', active: true },
      { id: 'plan-action-template-3', title: 'Guardar uma dúvida para a próxima conversa', cadence: 'Até a próxima consulta', active: true },
    ],
    monitoring: 'Os registros ficam disponíveis para revisão na próxima conversa; o protótipo não conclui conduta a partir deles.',
    supportNotice: 'Se algo mudar ou surgir uma dúvida, use o canal combinado com sua equipe. O protótipo não classifica urgência.',
    sourceDescription: 'Notas da consulta demonstrativa',
    sourceMode: 'manual',
    sourceReviewId: null,
  };
}

function cloneCarePlanActions(actions: CarePlanAction[]) {
  const prefix = `plan-action-${Date.now()}`;
  return actions.map((action, index) => ({
    ...action,
    id: `${prefix}-${index + 1}`,
  }));
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

    const carePlansFor = (patientId: string, encounterId: string) =>
      state.carePlans
        .filter((plan) => plan.patientId === patientId && plan.encounterId === encounterId)
        .toSorted((left, right) => left.version - right.version);

    const createCarePlan = (
      patientId: string,
      encounterId: string,
      previous: CarePlanVersion | null,
      template?: Partial<CarePlanDraftContent>,
    ) => {
      const now = new Date();
      const base = previous ?? getDefaultCarePlanContent();
      const content: CarePlanDraftContent = {
        title: template?.title ?? base.title,
        objective: template?.objective ?? base.objective,
        introduction: template?.introduction ?? base.introduction,
        actions: cloneCarePlanActions(template?.actions ?? base.actions),
        monitoring: template?.monitoring ?? base.monitoring,
        supportNotice: template?.supportNotice ?? base.supportNotice,
        sourceDescription: template?.sourceDescription ?? base.sourceDescription,
        sourceMode: template?.sourceMode ?? base.sourceMode,
        sourceReviewId: template?.sourceReviewId ?? base.sourceReviewId,
      };

      return {
        id: `plan-care-${Date.now()}`,
        patientId,
        encounterId,
        version: (previous?.version ?? 0) + 1,
        status: 'draft' as const,
        ...content,
        authoredBy: 'Dr. Guilherme Martins · médico responsável',
        createdAt: formatSubmissionTime(now),
        createdAtIso: now.toISOString(),
        updatedAt: formatSubmissionTime(now),
        updatedAtIso: now.toISOString(),
        approvedBy: null,
        approvedAt: null,
        approvedAtIso: null,
        publishedBy: null,
        publishedAt: null,
        publishedAtIso: null,
        supersededByVersion: null,
      } satisfies CarePlanVersion;
    };

    const replaceCarePlan = (updated: CarePlanVersion) => {
      setState((current) => ({
        ...current,
        carePlans: current.carePlans.map((plan) => plan.id === updated.id ? updated : plan),
      }));
      return updated;
    };

    const requireCarePlan = (patientId: string, encounterId: string, planId: string) => {
      const plan = state.carePlans.find(
        (candidate) =>
          candidate.id === planId &&
          candidate.patientId === patientId &&
          candidate.encounterId === encounterId,
      );
      if (!plan) {
        throw new Error('Este plano não pertence ao contexto atual.');
      }
      return plan;
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
      carePlans: state.carePlans,
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
      startCarePlan: (patientId, encounterId, template) => {
        const plans = carePlansFor(patientId, encounterId);
        const activePlan = [...plans].reverse().find(
          (plan) => plan.status === 'draft' || plan.status === 'approved',
        );
        if (activePlan) return activePlan;

        const created = createCarePlan(patientId, encounterId, plans.at(-1) ?? null, template);
        setState((current) => ({
          ...current,
          carePlans: [...current.carePlans, created],
        }));
        return created;
      },
      createCarePlanRevision: (patientId, encounterId, template) => {
        const plans = carePlansFor(patientId, encounterId);
        const activeDraft = [...plans].reverse().find((plan) => plan.status === 'draft');
        if (activeDraft) return activeDraft;

        const created = createCarePlan(patientId, encounterId, plans.at(-1) ?? null, template);
        setState((current) => ({
          ...current,
          carePlans: [...current.carePlans, created],
        }));
        return created;
      },
      saveCarePlan: (patientId, encounterId, planId, patch) => {
        const plan = requireCarePlan(patientId, encounterId, planId);
        if (plan.status !== 'draft') {
          throw new Error('Somente uma versão em rascunho pode ser editada.');
        }
        const now = new Date();
        return replaceCarePlan({
          ...plan,
          ...patch,
          actions: patch.actions ?? plan.actions,
          updatedAt: formatSubmissionTime(now),
          updatedAtIso: now.toISOString(),
        });
      },
      approveCarePlan: (patientId, encounterId, planId) => {
        const plan = requireCarePlan(patientId, encounterId, planId);
        if (plan.status !== 'draft') {
          throw new Error('Apenas um rascunho pode seguir para aprovação médica.');
        }
        if (plan.title.trim().length < 5 || plan.objective.trim().length < 20) {
          throw new Error('Explique o objetivo do plano antes de aprovar esta versão.');
        }
        if (!plan.actions.some((action) => action.active && action.title.trim().length >= 3)) {
          throw new Error('Mantenha ao menos uma ação clara antes de aprovar esta versão.');
        }
        const now = new Date();
        const timestamp = formatSubmissionTime(now);
        const timestampIso = now.toISOString();
        return replaceCarePlan({
          ...plan,
          status: 'approved',
          updatedAt: timestamp,
          updatedAtIso: timestampIso,
          approvedBy: 'Dr. Guilherme Martins · médico responsável',
          approvedAt: timestamp,
          approvedAtIso: timestampIso,
        });
      },
      publishCarePlan: (patientId, encounterId, planId) => {
        const plan = requireCarePlan(patientId, encounterId, planId);
        if (plan.status !== 'approved') {
          throw new Error('A publicação exige uma versão aprovada pelo médico.');
        }
        const latest = carePlansFor(patientId, encounterId).at(-1) ?? null;
        if (latest && latest.id !== plan.id) {
          throw new Error('Publique ou resolva primeiro a versão mais recente deste plano.');
        }
        const now = new Date();
        const timestamp = formatSubmissionTime(now);
        const timestampIso = now.toISOString();
        const published: CarePlanVersion = {
          ...plan,
          status: 'published',
          updatedAt: timestamp,
          updatedAtIso: timestampIso,
          publishedBy: 'Dr. Guilherme Martins · médico responsável',
          publishedAt: timestamp,
          publishedAtIso: timestampIso,
        };
        setState((current) => ({
          ...current,
          carePlans: current.carePlans.map((candidate) => {
            if (candidate.id === published.id) return published;
            if (
              candidate.patientId === patientId &&
              candidate.encounterId === encounterId &&
              candidate.status === 'published'
            ) {
              return {
                ...candidate,
                status: 'superseded' as const,
                updatedAt: timestamp,
                updatedAtIso: timestampIso,
                supersededByVersion: published.version,
              };
            }
            return candidate;
          }),
        }));
        return published;
      },
    };
  }, [hydrated, state]);

  return <CareDemoContext.Provider value={value}>{children}</CareDemoContext.Provider>;
}
