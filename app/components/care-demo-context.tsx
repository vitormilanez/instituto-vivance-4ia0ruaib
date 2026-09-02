'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_ENCOUNTER_ID, DEFAULT_PATIENT_ID, getDemoPatient } from './demo-routes';
import {
  CareDemoContext,
  EMPTY_PRECONSULTATION_DRAFT,
  getCareDemoScopeKey,
  type CareDemoState,
  type CareDemoStoreValue,
} from './care-demo-store';
import type {
  CareAiPreparationDismissalReason,
  CareAiPreparationReview,
  CareAiPreparationReviewItem,
  CareAiPreparationSourceRef,
  CareAuditAction,
  CareAuditActor,
  CareAuditEvent,
  CareCheckIn,
  CareCheckInReview,
  CareCheckInSleepQuality,
  CareConsultationClosure,
  CareConsultationClosureItem,
  CareConsultationClosureItemKind,
  CareConversationContext,
  CareConversationMessage,
  CareConversationSender,
  CareDiaryEntry,
  CareFollowUpCadence,
  CareFollowUpConfiguration,
  CareFollowUpContact,
  CareGuidedScore,
  CarePlanAction,
  CarePlanActionConfirmation,
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
        { id: 'plan-demo-001-action-1', title: 'Registrar como foi o sono ao acordar', cadence: 'Diariamente, quando for possível', active: true, sourceItemId: null },
        { id: 'plan-demo-001-action-2', title: 'Registrar uma foto ou relato do jantar', cadence: 'Em 3 dias desta semana', active: true, sourceItemId: null },
        { id: 'plan-demo-001-action-3', title: 'Guardar uma dúvida para a próxima conversa', cadence: 'Até a próxima consulta', active: true, sourceItemId: null },
      ],
      monitoring: 'Os registros ficam disponíveis para revisão na próxima conversa; eles não são interpretados automaticamente como decisão clínica.',
      supportNotice: 'Se algo mudar ou surgir uma dúvida, use o canal combinado com sua equipe. O protótipo não classifica urgência.',
      sourceDescription: 'Resumo demonstrativo da primeira consulta',
      sourceMode: 'manual',
      sourceReviewId: null,
      sourceClosureId: null,
      sourceClosureVersion: null,
      sourceItemIds: [],
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
    sourceItemId: typeof value.sourceItemId === 'string' ? value.sourceItemId : null,
  };
}

function isCareConsultationClosureItemKind(
  value: unknown,
): value is CareConsultationClosureItemKind {
  return value === 'patient-report' ||
    value === 'patient-priority' ||
    value === 'open-question' ||
    value === 'hypothesis';
}

function normalizeConsultationClosureItem(value: unknown): CareConsultationClosureItem | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    !isCareConsultationClosureItemKind(value.kind) ||
    typeof value.sourceExcerptId !== 'string' ||
    typeof value.sourceTime !== 'string' ||
    typeof value.sourceQuote !== 'string' ||
    (value.coverage !== 'direct' && value.coverage !== 'partial') ||
    typeof value.limitation !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    title: value.title,
    kind: value.kind,
    sourceExcerptId: value.sourceExcerptId,
    sourceTime: value.sourceTime,
    sourceQuote: value.sourceQuote,
    coverage: value.coverage,
    limitation: value.limitation,
  };
}

function normalizeConsultationClosure(value: unknown): CareConsultationClosure | null {
  if (!isRecord(value)) return null;
  const items = Array.isArray(value.items)
    ? value.items.flatMap((item) => {
        const normalized = normalizeConsultationClosureItem(item);
        return normalized ? [normalized] : [];
      })
    : [];

  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.version !== 'number' ||
    typeof value.sessionVersion !== 'number' ||
    typeof value.reviewVersion !== 'number' ||
    typeof value.content !== 'string' ||
    items.length === 0 ||
    value.consentVersion !== 'teleconsulta-transcricao-v1' ||
    value.serviceMode !== 'deterministic-mock' ||
    typeof value.approvedBy !== 'string' ||
    typeof value.approvedAt !== 'string' ||
    typeof value.approvedAtIso !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    version: value.version,
    sessionVersion: value.sessionVersion,
    reviewVersion: value.reviewVersion,
    content: value.content,
    items,
    consentVersion: 'teleconsulta-transcricao-v1',
    serviceMode: 'deterministic-mock',
    approvedBy: value.approvedBy,
    approvedAt: value.approvedAt,
    approvedAtIso: value.approvedAtIso,
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
    sourceClosureId: typeof value.sourceClosureId === 'string' ? value.sourceClosureId : null,
    sourceClosureVersion: typeof value.sourceClosureVersion === 'number' ? value.sourceClosureVersion : null,
    sourceItemIds: Array.isArray(value.sourceItemIds)
      ? value.sourceItemIds.filter((itemId): itemId is string => typeof itemId === 'string')
      : [],
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

function isCareCheckInSleepQuality(value: unknown): value is CareCheckInSleepQuality {
  return value === 'poor' || value === 'regular' || value === 'good';
}

function isCareCheckInInputMode(value: unknown): value is CareCheckIn['inputMode'] {
  return value === 'voice' || value === 'text';
}

function isCareCheckInPlanExperience(value: unknown): value is CareCheckIn['planExperience'] {
  return value === 'easy'
    || value === 'partial'
    || value === 'difficult'
    || value === 'not-applicable';
}

function normalizeCheckIn(value: unknown): CareCheckIn | null {
  if (!isRecord(value)) return null;
  const energy = typeof value.energy === 'number' && Number.isInteger(value.energy) && value.energy >= 1 && value.energy <= 5
    ? value.energy as CareCheckIn['energy']
    : null;

  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.version !== 'number' ||
    !energy ||
    !isCareCheckInSleepQuality(value.sleepQuality) ||
    typeof value.newSymptom !== 'boolean' ||
    typeof value.submittedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    version: value.version,
    energy,
    sleepQuality: value.sleepQuality,
    newSymptom: value.newSymptom,
    inputMode: isCareCheckInInputMode(value.inputMode) ? value.inputMode : 'text',
    originalText: typeof value.originalText === 'string' ? value.originalText : '',
    aiSummary: Array.isArray(value.aiSummary)
      ? value.aiSummary.filter((item): item is string => typeof item === 'string')
      : [],
    aiAssistanceAllowed: typeof value.aiAssistanceAllowed === 'boolean'
      ? value.aiAssistanceAllowed
      : false,
    planExperience: isCareCheckInPlanExperience(value.planExperience)
      ? value.planExperience
      : 'not-applicable',
    audioRef: typeof value.audioRef === 'string' ? value.audioRef : null,
    audioDurationSeconds: typeof value.audioDurationSeconds === 'number'
      && Number.isFinite(value.audioDurationSeconds)
      && value.audioDurationSeconds >= 0
      ? value.audioDurationSeconds
      : null,
    submittedAt: value.submittedAt,
    submittedAtIso: typeof value.submittedAtIso === 'string'
      ? value.submittedAtIso
      : isoTimestampFromOpaqueId(value.id),
  };
}

function normalizeActionConfirmation(value: unknown): CarePlanActionConfirmation | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.planId !== 'string' ||
    typeof value.planVersion !== 'number' ||
    typeof value.actionId !== 'string' ||
    typeof value.completed !== 'boolean' ||
    typeof value.recordedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    planId: value.planId,
    planVersion: value.planVersion,
    actionId: value.actionId,
    completed: value.completed,
    recordedAt: value.recordedAt,
    recordedAtIso: typeof value.recordedAtIso === 'string'
      ? value.recordedAtIso
      : isoTimestampFromOpaqueId(value.id),
  };
}

function normalizeCheckInReview(value: unknown): CareCheckInReview | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.checkInId !== 'string' ||
    typeof value.checkInVersion !== 'number' ||
    typeof value.reviewedBy !== 'string' ||
    typeof value.reviewedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    checkInId: value.checkInId,
    checkInVersion: value.checkInVersion,
    reviewedBy: value.reviewedBy,
    reviewedAt: value.reviewedAt,
    reviewedAtIso: typeof value.reviewedAtIso === 'string'
      ? value.reviewedAtIso
      : isoTimestampFromOpaqueId(value.id),
  };
}

function isFollowUpCadence(value: unknown): value is CareFollowUpCadence {
  return value === 'daily' || value === 'every-three-days' || value === 'three-times-week' || value === 'weekly';
}

function normalizeFollowUpConfiguration(value: unknown): CareFollowUpConfiguration | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.planId !== 'string' ||
    typeof value.planVersion !== 'number' ||
    typeof value.version !== 'number' ||
    !isFollowUpCadence(value.cadence) ||
    typeof value.configuredBy !== 'string' ||
    typeof value.configuredAt !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    planId: value.planId,
    planVersion: value.planVersion,
    version: value.version,
    cadence: value.cadence,
    configuredBy: value.configuredBy,
    configuredAt: value.configuredAt,
    configuredAtIso: typeof value.configuredAtIso === 'string'
      ? value.configuredAtIso
      : isoTimestampFromOpaqueId(value.id),
    retentionMode: 'session-only',
    contactMode: 'manual-only',
  };
}

function normalizeFollowUpContact(value: unknown): CareFollowUpContact | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.configurationId !== 'string' ||
    typeof value.configurationVersion !== 'number' ||
    value.reason !== 'check-in-not-recorded' ||
    typeof value.recordedBy !== 'string' ||
    typeof value.recordedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    configurationId: value.configurationId,
    configurationVersion: value.configurationVersion,
    reason: value.reason,
    recordedBy: value.recordedBy,
    recordedAt: value.recordedAt,
    recordedAtIso: typeof value.recordedAtIso === 'string'
      ? value.recordedAtIso
      : isoTimestampFromOpaqueId(value.id),
  };
}

function isGuidedScore(value: unknown): value is CareGuidedScore {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5;
}

function normalizeDiaryEntry(value: unknown): CareDiaryEntry | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.version !== 'number' ||
    value.mealType !== 'dinner' ||
    !isGuidedScore(value.satiety) ||
    !isGuidedScore(value.digestiveComfort) ||
    !isGuidedScore(value.planEase) ||
    typeof value.analysisViewed !== 'boolean' ||
    typeof value.submittedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    version: value.version,
    mealType: value.mealType,
    satiety: value.satiety,
    digestiveComfort: value.digestiveComfort,
    planEase: value.planEase,
    analysisViewed: value.analysisViewed,
    attachmentRef: '/meals/jantar-omelete.jpg',
    sharedWithCareTeam: true,
    sharingConsentVersion: 'diario-contexto-v1',
    submittedAt: value.submittedAt,
    submittedAtIso: typeof value.submittedAtIso === 'string'
      ? value.submittedAtIso
      : isoTimestampFromOpaqueId(value.id),
  };
}

function isConversationContext(value: unknown): value is CareConversationContext {
  return value === 'care-plan' || value === 'check-in' || value === 'diary' || value === 'general';
}

function isConversationSender(value: unknown): value is CareConversationSender {
  return value === 'patient' || value === 'doctor';
}

function getConversationContextLabel(context: CareConversationContext) {
  if (context === 'care-plan') return 'plano de cuidado';
  if (context === 'check-in') return 'check-in';
  if (context === 'diary') return 'diário';
  return 'outro assunto';
}

function normalizeConversationMessage(value: unknown): CareConversationMessage | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.version !== 'number' ||
    !isConversationSender(value.sender) ||
    !isConversationContext(value.context) ||
    typeof value.body !== 'string' ||
    !value.body.trim() ||
    typeof value.sentAt !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    version: value.version,
    sender: value.sender,
    context: value.context,
    body: value.body.trim(),
    sentAt: value.sentAt,
    sentAtIso: typeof value.sentAtIso === 'string'
      ? value.sentAtIso
      : isoTimestampFromOpaqueId(value.id),
    retentionMode: 'session-only',
  };
}

function isAiPreparationDismissalReason(
  value: unknown,
): value is CareAiPreparationDismissalReason {
  return value === 'duplicate' ||
    value === 'already-reviewed' ||
    value === 'insufficient-source' ||
    value === 'not-useful';
}

function normalizeAiPreparationSourceRef(value: unknown): CareAiPreparationSourceRef | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    !value.id.trim() ||
    typeof value.version !== 'number' ||
    typeof value.label !== 'string' ||
    !value.label.trim()
  ) {
    return null;
  }

  return {
    id: value.id,
    version: value.version,
    label: value.label,
  };
}

function normalizeAiPreparationReviewItem(value: unknown): CareAiPreparationReviewItem | null {
  if (!isRecord(value)) return null;
  const decision = value.decision === 'included' || value.decision === 'dismissed'
    ? value.decision
    : null;
  const sourceIds = Array.isArray(value.sourceIds)
    ? value.sourceIds.filter((sourceId): sourceId is string => typeof sourceId === 'string' && Boolean(sourceId.trim()))
    : [];
  const dismissalReason = value.dismissalReason === null || value.dismissalReason === undefined
    ? null
    : isAiPreparationDismissalReason(value.dismissalReason)
      ? value.dismissalReason
      : undefined;

  if (
    typeof value.id !== 'string' ||
    !value.id.trim() ||
    typeof value.label !== 'string' ||
    !value.label.trim() ||
    !decision ||
    sourceIds.length === 0 ||
    dismissalReason === undefined ||
    (decision === 'dismissed' && dismissalReason === null) ||
    (decision === 'included' && dismissalReason !== null)
  ) {
    return null;
  }

  return {
    id: value.id,
    label: value.label,
    decision,
    sourceIds,
    dismissalReason,
  };
}

function normalizeAiPreparationReview(value: unknown): CareAiPreparationReview | null {
  if (!isRecord(value)) return null;
  const authorizationMode = value.authorizationMode === 'mock-scenario' || value.authorizationMode === 'patient-consent'
    ? value.authorizationMode
    : null;
  const sourceRefs = Array.isArray(value.sourceRefs)
    ? value.sourceRefs.flatMap((sourceRef) => {
        const normalized = normalizeAiPreparationSourceRef(sourceRef);
        return normalized ? [normalized] : [];
      })
    : [];
  const items = Array.isArray(value.items)
    ? value.items.flatMap((item) => {
        const normalized = normalizeAiPreparationReviewItem(item);
        return normalized ? [normalized] : [];
      })
    : [];

  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    typeof value.version !== 'number' ||
    !authorizationMode ||
    value.templateVersion !== 'preparo-consulta-v1' ||
    value.serviceMode !== 'deterministic-mock' ||
    sourceRefs.length === 0 ||
    items.length === 0 ||
    typeof value.sourceFingerprint !== 'string' ||
    typeof value.reviewedBy !== 'string' ||
    typeof value.reviewedAt !== 'string' ||
    typeof value.reviewedAtIso !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    version: value.version,
    authorizationMode,
    templateVersion: 'preparo-consulta-v1',
    serviceMode: 'deterministic-mock',
    sourceRefs,
    items,
    sourceFingerprint: value.sourceFingerprint,
    reviewedBy: value.reviewedBy,
    reviewedAt: value.reviewedAt,
    reviewedAtIso: value.reviewedAtIso,
  };
}

function isCareAuditAction(value: unknown): value is CareAuditAction {
  return [
    'check-in-submitted',
    'check-in-reviewed',
    'follow-up-configured',
    'follow-up-contact-recorded',
    'diary-entry-submitted',
    'conversation-message-sent',
    'pre-consultation-submitted',
    'pre-consultation-review-started',
    'pre-consultation-review-approved',
    'pre-consultation-review-rejected',
    'consultation-closure-approved',
    'care-plan-created',
    'care-plan-approved',
    'care-plan-published',
    'ai-preparation-reviewed',
  ].includes(value as CareAuditAction);
}

function isCareAuditActor(value: unknown): value is CareAuditActor {
  return value === 'patient' || value === 'doctor' || value === 'system';
}

function normalizeAuditEvent(value: unknown): CareAuditEvent | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.patientId !== 'string' ||
    typeof value.encounterId !== 'string' ||
    !isCareAuditAction(value.action) ||
    !isCareAuditActor(value.actor) ||
    typeof value.actorLabel !== 'string' ||
    typeof value.occurredAt !== 'string' ||
    typeof value.occurredAtIso !== 'string' ||
    typeof value.relatedId !== 'string' ||
    typeof value.relatedVersion !== 'number' ||
    typeof value.summary !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    patientId: value.patientId,
    encounterId: value.encounterId,
    action: value.action,
    actor: value.actor,
    actorLabel: value.actorLabel,
    occurredAt: value.occurredAt,
    occurredAtIso: value.occurredAtIso,
    relatedId: value.relatedId,
    relatedVersion: value.relatedVersion,
    summary: value.summary,
    consentVersion: value.consentVersion === 'pre-consulta-texto-v1' ||
      value.consentVersion === 'teleconsulta-transcricao-v1'
      ? value.consentVersion
      : null,
    aiAssistanceAllowed: typeof value.aiAssistanceAllowed === 'boolean'
      ? value.aiAssistanceAllowed
      : null,
  };
}

function getPatientAuditLabel(patientId: string) {
  return `${getDemoPatient(patientId)?.name ?? 'Paciente demonstrativo'} · paciente`;
}

function getAuditEventsFromHistory(
  submissions: PreConsultationSubmission[],
  reviews: PreConsultationReview[],
  carePlans: CarePlanVersion[],
  checkIns: CareCheckIn[],
  checkInReviews: CareCheckInReview[] = [],
  followUpConfigurations: CareFollowUpConfiguration[] = [],
  followUpContacts: CareFollowUpContact[] = [],
  diaryEntries: CareDiaryEntry[] = [],
  conversationMessages: CareConversationMessage[] = [],
  aiPreparationReviews: CareAiPreparationReview[] = [],
  consultationClosures: CareConsultationClosure[] = [],
): CareAuditEvent[] {
  const checkInEvents = checkIns.map<CareAuditEvent>((checkIn) => ({
    id: `audit-derived-${checkIn.id}-submitted`,
    patientId: checkIn.patientId,
    encounterId: checkIn.encounterId,
    action: 'check-in-submitted',
    actor: 'patient',
    actorLabel: getPatientAuditLabel(checkIn.patientId),
    occurredAt: checkIn.submittedAt,
    occurredAtIso: checkIn.submittedAtIso,
    relatedId: checkIn.id,
    relatedVersion: checkIn.version,
    summary: 'Check-in de acompanhamento registrado.',
    consentVersion: null,
    aiAssistanceAllowed: null,
  }));

  const checkInReviewEvents = checkInReviews.map<CareAuditEvent>((review) => ({
    id: `audit-derived-${review.id}-reviewed`,
    patientId: review.patientId,
    encounterId: review.encounterId,
    action: 'check-in-reviewed',
    actor: 'doctor',
    actorLabel: review.reviewedBy,
    occurredAt: review.reviewedAt,
    occurredAtIso: review.reviewedAtIso,
    relatedId: review.checkInId,
    relatedVersion: review.checkInVersion,
    summary: 'Leitura humana da fonte do check-in registrada.',
    consentVersion: null,
    aiAssistanceAllowed: null,
  }));

  const followUpConfigurationEvents = followUpConfigurations.map<CareAuditEvent>((configuration) => ({
    id: `audit-derived-${configuration.id}-configured`,
    patientId: configuration.patientId,
    encounterId: configuration.encounterId,
    action: 'follow-up-configured',
    actor: 'doctor',
    actorLabel: configuration.configuredBy,
    occurredAt: configuration.configuredAt,
    occurredAtIso: configuration.configuredAtIso,
    relatedId: configuration.id,
    relatedVersion: configuration.version,
    summary: 'Cadência demonstrativa de acompanhamento configurada.',
    consentVersion: null,
    aiAssistanceAllowed: null,
  }));

  const followUpContactEvents = followUpContacts.map<CareAuditEvent>((contact) => ({
    id: `audit-derived-${contact.id}-contact`,
    patientId: contact.patientId,
    encounterId: contact.encounterId,
    action: 'follow-up-contact-recorded',
    actor: 'doctor',
    actorLabel: contact.recordedBy,
    occurredAt: contact.recordedAt,
    occurredAtIso: contact.recordedAtIso,
    relatedId: contact.configurationId,
    relatedVersion: contact.configurationVersion,
    summary: 'Contato humano demonstrativo registrado; nenhuma notificação real foi enviada.',
    consentVersion: null,
    aiAssistanceAllowed: null,
  }));

  const diaryEvents = diaryEntries.map<CareAuditEvent>((entry) => ({
    id: `audit-derived-${entry.id}-submitted`,
    patientId: entry.patientId,
    encounterId: entry.encounterId,
    action: 'diary-entry-submitted',
    actor: 'patient',
    actorLabel: getPatientAuditLabel(entry.patientId),
    occurredAt: entry.submittedAt,
    occurredAtIso: entry.submittedAtIso,
    relatedId: entry.id,
    relatedVersion: entry.version,
    summary: 'Contexto guiado do diário compartilhado com a equipe.',
    consentVersion: null,
    aiAssistanceAllowed: null,
  }));

  const conversationEvents = conversationMessages.map<CareAuditEvent>((message) => ({
    id: `audit-derived-${message.id}-sent`,
    patientId: message.patientId,
    encounterId: message.encounterId,
    action: 'conversation-message-sent',
    actor: message.sender,
    actorLabel: message.sender === 'patient'
      ? getPatientAuditLabel(message.patientId)
      : 'Dr. Guilherme Martins · médico responsável',
    occurredAt: message.sentAt,
    occurredAtIso: message.sentAtIso,
    relatedId: message.id,
    relatedVersion: message.version,
    summary: `Mensagem contextualizada em “${getConversationContextLabel(message.context)}” registrada sem copiar seu conteúdo para a auditoria.`,
    consentVersion: null,
    aiAssistanceAllowed: null,
  }));

  const aiPreparationEvents = aiPreparationReviews.map<CareAuditEvent>((review) => {
    const includedCount = review.items.filter((item) => item.decision === 'included').length;
    const dismissedCount = review.items.length - includedCount;
    return {
      id: `audit-derived-${review.id}-reviewed`,
      patientId: review.patientId,
      encounterId: review.encounterId,
      action: 'ai-preparation-reviewed',
      actor: 'doctor',
      actorLabel: review.reviewedBy,
      occurredAt: review.reviewedAt,
      occurredAtIso: review.reviewedAtIso,
      relatedId: review.id,
      relatedVersion: review.version,
      summary: `Pauta assistida revisada: ${includedCount} ${includedCount === 1 ? 'item incluído' : 'itens incluídos'} e ${dismissedCount} ${dismissedCount === 1 ? 'descartado' : 'descartados'}.`,
      consentVersion: null,
      aiAssistanceAllowed: true,
    };
  });

  const consultationClosureEvents = consultationClosures.map<CareAuditEvent>((closure) => ({
    id: `audit-derived-${closure.id}-approved`,
    patientId: closure.patientId,
    encounterId: closure.encounterId,
    action: 'consultation-closure-approved',
    actor: 'doctor',
    actorLabel: closure.approvedBy,
    occurredAt: closure.approvedAt,
    occurredAtIso: closure.approvedAtIso,
    relatedId: closure.id,
    relatedVersion: closure.version,
    summary: `Fechamento da teleconsulta aprovado com ${closure.items.length} ${closure.items.length === 1 ? 'item rastreável' : 'itens rastreáveis'}.`,
    consentVersion: closure.consentVersion,
    aiAssistanceAllowed: true,
  }));

  const submissionEvents = submissions.map<CareAuditEvent>((submission) => ({
    id: `audit-derived-${submission.id}-submitted`,
    patientId: submission.patientId,
    encounterId: submission.encounterId,
    action: 'pre-consultation-submitted',
    actor: 'patient',
    actorLabel: getPatientAuditLabel(submission.patientId),
    occurredAt: submission.submittedAt,
    occurredAtIso: submission.submittedAtIso,
    relatedId: submission.id,
    relatedVersion: submission.version,
    summary: 'Pré-consulta enviada com ciência registrada.',
    consentVersion: submission.consentVersion,
    aiAssistanceAllowed: submission.aiAssistanceAllowed,
  }));

  const reviewEvents = reviews.flatMap<CareAuditEvent>((review) => {
    const events: CareAuditEvent[] = [{
      id: `audit-derived-${review.id}-started`,
      patientId: review.patientId,
      encounterId: review.encounterId,
      action: 'pre-consultation-review-started',
      actor: 'doctor',
      actorLabel: 'Dr. Guilherme Martins · médico responsável',
      occurredAt: review.createdAt,
      occurredAtIso: review.createdAtIso,
      relatedId: review.id,
      relatedVersion: review.version,
      summary: 'Uma nova versão do preparo médico foi aberta para revisão.',
      consentVersion: null,
      aiAssistanceAllowed: null,
    }];

    if (review.status === 'draft') return events;

    const occurredAt = review.reviewedAt ?? review.updatedAt;
    const occurredAtIso = review.reviewedAtIso ?? review.updatedAtIso;
    events.push({
      id: `audit-derived-${review.id}-${review.status}`,
      patientId: review.patientId,
      encounterId: review.encounterId,
      action: review.status === 'approved'
        ? 'pre-consultation-review-approved'
        : 'pre-consultation-review-rejected',
      actor: 'doctor',
      actorLabel: 'Dr. Guilherme Martins · médico responsável',
      occurredAt,
      occurredAtIso,
      relatedId: review.id,
      relatedVersion: review.version,
      summary: review.status === 'approved'
        ? 'Preparo revisado e aprovado para apoiar a consulta.'
        : 'Preparo rejeitado; a versão original foi preservada.',
      consentVersion: null,
      aiAssistanceAllowed: null,
    });
    return events;
  });

  const planEvents = carePlans.flatMap<CareAuditEvent>((plan) => {
    const events: CareAuditEvent[] = [{
      id: `audit-derived-${plan.id}-created`,
      patientId: plan.patientId,
      encounterId: plan.encounterId,
      action: 'care-plan-created',
      actor: 'doctor',
      actorLabel: plan.authoredBy,
      occurredAt: plan.createdAt,
      occurredAtIso: plan.createdAtIso,
      relatedId: plan.id,
      relatedVersion: plan.version,
      summary: `Rascunho da versão ${plan.version} do plano criado.`,
      consentVersion: null,
      aiAssistanceAllowed: null,
    }];

    if (plan.approvedAt && plan.approvedAtIso) {
      events.push({
        id: `audit-derived-${plan.id}-approved`,
        patientId: plan.patientId,
        encounterId: plan.encounterId,
        action: 'care-plan-approved',
        actor: 'doctor',
        actorLabel: plan.approvedBy ?? plan.authoredBy,
        occurredAt: plan.approvedAt,
        occurredAtIso: plan.approvedAtIso,
        relatedId: plan.id,
        relatedVersion: plan.version,
        summary: `Versão ${plan.version} do plano aprovada pelo médico.`,
        consentVersion: null,
        aiAssistanceAllowed: null,
      });
    }

    if (plan.publishedAt && plan.publishedAtIso) {
      events.push({
        id: `audit-derived-${plan.id}-published`,
        patientId: plan.patientId,
        encounterId: plan.encounterId,
        action: 'care-plan-published',
        actor: 'doctor',
        actorLabel: plan.publishedBy ?? plan.authoredBy,
        occurredAt: plan.publishedAt,
        occurredAtIso: plan.publishedAtIso,
        relatedId: plan.id,
        relatedVersion: plan.version,
        summary: `Versão ${plan.version} do plano publicada para a paciente.`,
        consentVersion: null,
        aiAssistanceAllowed: null,
      });
    }

    return events;
  });

  return [
    ...checkInEvents,
    ...checkInReviewEvents,
    ...followUpConfigurationEvents,
    ...followUpContactEvents,
    ...diaryEvents,
    ...conversationEvents,
    ...aiPreparationEvents,
    ...consultationClosureEvents,
    ...submissionEvents,
    ...reviewEvents,
    ...planEvents,
  ]
    .toSorted((left, right) => left.occurredAtIso.localeCompare(right.occurredAtIso));
}

const initialCarePlans = getInitialCarePlans();
const emptyState: CareDemoState = {
  draftsByEncounter: {},
  submissions: [],
  reviews: [],
  consultationClosures: [],
  carePlans: initialCarePlans,
  checkIns: [],
  checkInReviews: [],
  followUpConfigurations: [],
  followUpContacts: [],
  diaryEntries: [],
  conversationMessages: [],
  actionConfirmations: [],
  aiPreparationReviews: [],
  auditEvents: getAuditEventsFromHistory([], [], initialCarePlans, []),
};

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
  const consultationClosures = Array.isArray(value.consultationClosures)
    ? value.consultationClosures.flatMap((closure) => {
        const normalized = normalizeConsultationClosure(closure);
        return normalized ? [normalized] : [];
      })
    : [];
  const parsedCarePlans = Array.isArray(value.carePlans)
    ? value.carePlans.flatMap((plan) => {
        const normalized = normalizeCarePlan(plan);
        return normalized ? [normalized] : [];
      })
    : [];
  const carePlans = parsedCarePlans.length > 0 ? parsedCarePlans : getInitialCarePlans();
  const checkIns = Array.isArray(value.checkIns)
    ? value.checkIns.flatMap((checkIn) => {
        const normalized = normalizeCheckIn(checkIn);
        return normalized ? [normalized] : [];
      })
    : [];
  const checkInReviews = Array.isArray(value.checkInReviews)
    ? value.checkInReviews.flatMap((review) => {
        const normalized = normalizeCheckInReview(review);
        return normalized ? [normalized] : [];
      })
    : [];
  const followUpConfigurations = Array.isArray(value.followUpConfigurations)
    ? value.followUpConfigurations.flatMap((configuration) => {
        const normalized = normalizeFollowUpConfiguration(configuration);
        return normalized ? [normalized] : [];
      })
    : [];
  const followUpContacts = Array.isArray(value.followUpContacts)
    ? value.followUpContacts.flatMap((contact) => {
        const normalized = normalizeFollowUpContact(contact);
        return normalized ? [normalized] : [];
      })
    : [];
  const diaryEntries = Array.isArray(value.diaryEntries)
    ? value.diaryEntries.flatMap((entry) => {
        const normalized = normalizeDiaryEntry(entry);
        return normalized ? [normalized] : [];
      })
    : [];
  const conversationMessages = Array.isArray(value.conversationMessages)
    ? value.conversationMessages.flatMap((message) => {
        const normalized = normalizeConversationMessage(message);
        return normalized ? [normalized] : [];
      })
    : [];
  const actionConfirmations = Array.isArray(value.actionConfirmations)
    ? value.actionConfirmations.flatMap((confirmation) => {
        const normalized = normalizeActionConfirmation(confirmation);
        return normalized ? [normalized] : [];
      })
    : [];
  const aiPreparationReviews = Array.isArray(value.aiPreparationReviews)
    ? value.aiPreparationReviews.flatMap((review) => {
        const normalized = normalizeAiPreparationReview(review);
        return normalized ? [normalized] : [];
      })
    : [];
  const parsedAuditEvents = Array.isArray(value.auditEvents)
    ? value.auditEvents.flatMap((event) => {
        const normalized = normalizeAuditEvent(event);
        return normalized ? [normalized] : [];
      })
    : [];

  return {
    draftsByEncounter,
    submissions,
    reviews,
    consultationClosures,
    carePlans,
    checkIns,
    checkInReviews,
    followUpConfigurations,
    followUpContacts,
    diaryEntries,
    conversationMessages,
    actionConfirmations,
    aiPreparationReviews,
    auditEvents: parsedAuditEvents.length > 0
      ? parsedAuditEvents
      : getAuditEventsFromHistory(
          submissions,
          reviews,
          carePlans,
          checkIns,
          checkInReviews,
          followUpConfigurations,
          followUpContacts,
          diaryEntries,
          conversationMessages,
          aiPreparationReviews,
          consultationClosures,
        ),
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

  const carePlans = getInitialCarePlans();

  return {
    draftsByEncounter: {
      [getCareDemoScopeKey(DEFAULT_PATIENT_ID, DEFAULT_ENCOUNTER_ID)]: draft,
    },
    submissions,
    reviews,
    consultationClosures: [],
    carePlans,
    checkIns: [],
    checkInReviews: [],
    followUpConfigurations: [],
    followUpContacts: [],
    diaryEntries: [],
    conversationMessages: [],
    actionConfirmations: [],
    aiPreparationReviews: [],
    auditEvents: getAuditEventsFromHistory(submissions, reviews, carePlans, []),
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

function getAuditActorLabel(actor: CareAuditActor, patientId: string) {
  if (actor === 'patient') return getPatientAuditLabel(patientId);
  if (actor === 'doctor') return 'Dr. Guilherme Martins · médico responsável';
  return 'Sistema demonstrativo';
}

type AuditEventInput = Omit<
  CareAuditEvent,
  'id' | 'actorLabel' | 'consentVersion' | 'aiAssistanceAllowed'
> & {
  consentVersion?: CareAuditEvent['consentVersion'];
  aiAssistanceAllowed?: CareAuditEvent['aiAssistanceAllowed'];
};

function createAuditEvent({
  action,
  actor,
  patientId,
  encounterId,
  occurredAt,
  occurredAtIso,
  relatedId,
  relatedVersion,
  summary,
  consentVersion = null,
  aiAssistanceAllowed = null,
}: AuditEventInput): CareAuditEvent {
  return {
    id: `audit-${action}-${Date.now()}-${relatedId}`,
    patientId,
    encounterId,
    action,
    actor,
    actorLabel: getAuditActorLabel(actor, patientId),
    occurredAt,
    occurredAtIso,
    relatedId,
    relatedVersion,
    summary,
    consentVersion,
    aiAssistanceAllowed,
  };
}

function getDefaultCarePlanContent(): CarePlanDraftContent {
  return {
    title: 'Plano de cuidado compartilhado',
    objective: 'Registrar o que ajuda a acompanhar a rotina e levar as dúvidas para a próxima conversa.',
    introduction: 'Rascunho demonstrativo para organização do cuidado. Edite o conteúdo antes de aprovar e publicar.',
    actions: [
      { id: 'plan-action-template-1', title: 'Registrar como foi o sono ao acordar', cadence: 'Diariamente, quando for possível', active: true, sourceItemId: null },
      { id: 'plan-action-template-2', title: 'Registrar uma foto ou relato do jantar', cadence: 'Em 3 dias desta semana', active: true, sourceItemId: null },
      { id: 'plan-action-template-3', title: 'Guardar uma dúvida para a próxima conversa', cadence: 'Até a próxima consulta', active: true, sourceItemId: null },
    ],
    monitoring: 'Os registros ficam disponíveis para revisão na próxima conversa; o protótipo não conclui conduta a partir deles.',
    supportNotice: 'Se algo mudar ou surgir uma dúvida, use o canal combinado com sua equipe. O protótipo não classifica urgência.',
    sourceDescription: 'Notas da consulta demonstrativa',
    sourceMode: 'manual',
    sourceReviewId: null,
    sourceClosureId: null,
    sourceClosureVersion: null,
    sourceItemIds: [],
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

    const checkInsFor = (patientId: string, encounterId: string) =>
      (state.checkIns ?? []).filter(
        (checkIn) => checkIn.patientId === patientId && checkIn.encounterId === encounterId,
      );

    const checkInReviewsFor = (patientId: string, encounterId: string) =>
      (state.checkInReviews ?? []).filter(
        (review) => review.patientId === patientId && review.encounterId === encounterId,
      );

    const followUpConfigurationsFor = (patientId: string, encounterId: string) =>
      (state.followUpConfigurations ?? []).filter(
        (configuration) =>
          configuration.patientId === patientId && configuration.encounterId === encounterId,
      );

    const followUpContactsFor = (patientId: string, encounterId: string) =>
      (state.followUpContacts ?? []).filter(
        (contact) => contact.patientId === patientId && contact.encounterId === encounterId,
      );

    const diaryEntriesFor = (patientId: string, encounterId: string) =>
      (state.diaryEntries ?? []).filter(
        (entry) => entry.patientId === patientId && entry.encounterId === encounterId,
      );

    const conversationMessagesFor = (patientId: string, encounterId: string) =>
      (state.conversationMessages ?? []).filter(
        (message) => message.patientId === patientId && message.encounterId === encounterId,
      );

    const aiPreparationReviewsFor = (patientId: string, encounterId: string) =>
      (state.aiPreparationReviews ?? []).filter(
        (review) => review.patientId === patientId && review.encounterId === encounterId,
      );

    const consultationClosuresFor = (patientId: string, encounterId: string) =>
      (state.consultationClosures ?? [])
        .filter(
          (closure) => closure.patientId === patientId && closure.encounterId === encounterId,
        )
        .toSorted((left, right) => left.version - right.version);

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
      const sourceChanged = template?.sourceClosureId !== undefined &&
        template.sourceClosureId !== base.sourceClosureId;
      const actions = cloneCarePlanActions(template?.actions ?? base.actions).map((action) => ({
        ...action,
        sourceItemId: sourceChanged && !template?.actions ? null : action.sourceItemId,
      }));
      const content: CarePlanDraftContent = {
        title: template?.title ?? base.title,
        objective: template?.objective ?? base.objective,
        introduction: template?.introduction ?? base.introduction,
        actions,
        monitoring: template?.monitoring ?? base.monitoring,
        supportNotice: template?.supportNotice ?? base.supportNotice,
        sourceDescription: template?.sourceDescription ?? base.sourceDescription,
        sourceMode: template?.sourceMode ?? base.sourceMode,
        sourceReviewId: template?.sourceReviewId ?? base.sourceReviewId,
        sourceClosureId: template?.sourceClosureId ?? base.sourceClosureId,
        sourceClosureVersion: template?.sourceClosureVersion ?? base.sourceClosureVersion,
        sourceItemIds: [...(template?.sourceItemIds ?? base.sourceItemIds)],
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

    const replaceCarePlan = (updated: CarePlanVersion, auditEvent?: CareAuditEvent) => {
      setState((current) => ({
        ...current,
        carePlans: current.carePlans.map((plan) => plan.id === updated.id ? updated : plan),
        auditEvents: auditEvent ? [...current.auditEvents, auditEvent] : current.auditEvents,
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

    const replaceReview = (updated: PreConsultationReview, auditEvent?: CareAuditEvent) => {
      setState((current) => ({
        ...current,
        reviews: current.reviews.map((review) => review.id === updated.id ? updated : review),
        auditEvents: auditEvent ? [...current.auditEvents, auditEvent] : current.auditEvents,
      }));
      return updated;
    };

    return {
      hydrated,
      draftsByEncounter: state.draftsByEncounter,
      submissions: state.submissions,
      reviews: state.reviews,
      consultationClosures: state.consultationClosures ?? [],
      carePlans: state.carePlans,
      checkIns: state.checkIns ?? [],
      checkInReviews: state.checkInReviews ?? [],
      followUpConfigurations: state.followUpConfigurations ?? [],
      followUpContacts: state.followUpContacts ?? [],
      diaryEntries: state.diaryEntries ?? [],
      conversationMessages: state.conversationMessages ?? [],
      actionConfirmations: state.actionConfirmations ?? [],
      aiPreparationReviews: state.aiPreparationReviews ?? [],
      auditEvents: state.auditEvents,
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
        const auditEvent = createAuditEvent({
          action: 'pre-consultation-submitted',
          actor: 'patient',
          patientId,
          encounterId,
          occurredAt: created.submittedAt,
          occurredAtIso: created.submittedAtIso,
          relatedId: created.id,
          relatedVersion: created.version,
          summary: 'Pré-consulta enviada com ciência registrada.',
          consentVersion: created.consentVersion,
          aiAssistanceAllowed: created.aiAssistanceAllowed,
        });

        setState((current) => ({
          ...current,
          submissions: [...current.submissions, created],
          auditEvents: [...current.auditEvents, auditEvent],
        }));

        return created;
      },
      submitCheckIn: (patientId, encounterId, input) => {
        if (
          !Number.isInteger(input.energy) ||
          input.energy < 1 ||
          input.energy > 5 ||
          !isCareCheckInSleepQuality(input.sleepQuality)
        ) {
          throw new Error('Revise as respostas do check-in antes de registrar.');
        }

        const now = new Date();
        const created: CareCheckIn = {
          id: `check-in-${Date.now()}`,
          patientId,
          encounterId,
          version: checkInsFor(patientId, encounterId).length + 1,
          energy: input.energy,
          sleepQuality: input.sleepQuality,
          newSymptom: input.newSymptom,
          inputMode: input.inputMode === 'voice' ? 'voice' : 'text',
          originalText: input.originalText?.trim() ?? '',
          aiSummary: input.aiAssistanceAllowed === false
            ? []
            : (input.aiSummary ?? []).map((item) => item.trim()).filter(Boolean),
          aiAssistanceAllowed: input.aiAssistanceAllowed !== false,
          planExperience: input.planExperience === 'easy'
            || input.planExperience === 'partial'
            || input.planExperience === 'difficult'
            ? input.planExperience
            : 'not-applicable',
          audioRef: input.inputMode === 'voice' && typeof input.audioRef === 'string'
            ? input.audioRef
            : null,
          audioDurationSeconds: input.inputMode === 'voice'
            && typeof input.audioDurationSeconds === 'number'
            && Number.isFinite(input.audioDurationSeconds)
            ? Math.max(0, input.audioDurationSeconds)
            : null,
          submittedAt: formatSubmissionTime(now),
          submittedAtIso: now.toISOString(),
        };
        const auditEvent = createAuditEvent({
          action: 'check-in-submitted',
          actor: 'patient',
          patientId,
          encounterId,
          occurredAt: created.submittedAt,
          occurredAtIso: created.submittedAtIso,
          relatedId: created.id,
          relatedVersion: created.version,
          summary: `Check-in de acompanhamento registrado por ${created.inputMode === 'voice' ? 'voz simulada' : 'texto'}.`,
        });

        setState((current) => ({
          ...current,
          checkIns: [...(current.checkIns ?? []), created],
          auditEvents: [...current.auditEvents, auditEvent],
        }));
        return created;
      },
      reviewCheckIn: (patientId, encounterId, checkInId) => {
        const checkIn = checkInsFor(patientId, encounterId).find(
          (candidate) => candidate.id === checkInId,
        );
        if (!checkIn) {
          throw new Error('Este check-in não pertence ao contexto atual.');
        }
        const existing = checkInReviewsFor(patientId, encounterId).find(
          (review) => review.checkInId === checkIn.id,
        );
        if (existing) return existing;

        const now = new Date();
        const created: CareCheckInReview = {
          id: `leitura-check-in-${Date.now()}`,
          patientId,
          encounterId,
          checkInId: checkIn.id,
          checkInVersion: checkIn.version,
          reviewedBy: 'Dr. Guilherme Martins · médico responsável',
          reviewedAt: formatSubmissionTime(now),
          reviewedAtIso: now.toISOString(),
        };
        const auditEvent = createAuditEvent({
          action: 'check-in-reviewed',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: created.reviewedAt,
          occurredAtIso: created.reviewedAtIso,
          relatedId: checkIn.id,
          relatedVersion: checkIn.version,
          summary: 'Leitura humana da fonte do check-in registrada.',
        });

        setState((current) => ({
          ...current,
          checkInReviews: [...(current.checkInReviews ?? []), created],
          auditEvents: [...current.auditEvents, auditEvent],
        }));
        return created;
      },
      configureFollowUp: (patientId, encounterId, planId, cadence) => {
        if (!isFollowUpCadence(cadence)) {
          throw new Error('Escolha uma cadência válida para o acompanhamento.');
        }
        const plan = requireCarePlan(patientId, encounterId, planId);
        const latestPublishedPlan = [...carePlansFor(patientId, encounterId)].reverse().find(
          (candidate) => candidate.status === 'published',
        ) ?? null;
        if (plan.status !== 'published' || latestPublishedPlan?.id !== plan.id) {
          throw new Error('A cadência só pode ser vinculada à versão publicada mais recente do plano.');
        }
        const configurations = followUpConfigurationsFor(patientId, encounterId);
        const latest = configurations.at(-1) ?? null;
        if (latest?.planId === plan.id && latest.planVersion === plan.version && latest.cadence === cadence) {
          return latest;
        }

        const now = new Date();
        const created: CareFollowUpConfiguration = {
          id: `cadencia-acompanhamento-${Date.now()}`,
          patientId,
          encounterId,
          planId: plan.id,
          planVersion: plan.version,
          version: configurations.length + 1,
          cadence,
          configuredBy: 'Dr. Guilherme Martins · médico responsável',
          configuredAt: formatSubmissionTime(now),
          configuredAtIso: now.toISOString(),
          retentionMode: 'session-only',
          contactMode: 'manual-only',
        };
        const auditEvent = createAuditEvent({
          action: 'follow-up-configured',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: created.configuredAt,
          occurredAtIso: created.configuredAtIso,
          relatedId: created.id,
          relatedVersion: created.version,
          summary: 'Cadência demonstrativa de acompanhamento configurada.',
        });

        setState((current) => ({
          ...current,
          followUpConfigurations: [...(current.followUpConfigurations ?? []), created],
          auditEvents: [...current.auditEvents, auditEvent],
        }));
        return created;
      },
      recordFollowUpContact: (patientId, encounterId, configurationId) => {
        const configuration = followUpConfigurationsFor(patientId, encounterId).find(
          (candidate) => candidate.id === configurationId,
        );
        if (!configuration) {
          throw new Error('Esta configuração de acompanhamento não pertence ao contexto atual.');
        }
        const checkInAfterConfiguration = checkInsFor(patientId, encounterId).some(
          (checkIn) => checkIn.submittedAtIso >= configuration.configuredAtIso,
        );
        if (checkInAfterConfiguration) {
          throw new Error('Já existe um check-in depois desta configuração; o contato não é necessário.');
        }
        const existing = followUpContactsFor(patientId, encounterId).find(
          (contact) => contact.configurationId === configuration.id,
        );
        if (existing) return existing;

        const now = new Date();
        const created: CareFollowUpContact = {
          id: `contato-acompanhamento-${Date.now()}`,
          patientId,
          encounterId,
          configurationId: configuration.id,
          configurationVersion: configuration.version,
          reason: 'check-in-not-recorded',
          recordedBy: 'Dr. Guilherme Martins · médico responsável',
          recordedAt: formatSubmissionTime(now),
          recordedAtIso: now.toISOString(),
        };
        const auditEvent = createAuditEvent({
          action: 'follow-up-contact-recorded',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: created.recordedAt,
          occurredAtIso: created.recordedAtIso,
          relatedId: configuration.id,
          relatedVersion: configuration.version,
          summary: 'Contato humano demonstrativo registrado; nenhuma notificação real foi enviada.',
        });

        setState((current) => ({
          ...current,
          followUpContacts: [...(current.followUpContacts ?? []), created],
          auditEvents: [...current.auditEvents, auditEvent],
        }));
        return created;
      },
      submitDiaryEntry: (patientId, encounterId, input) => {
        if (
          !isGuidedScore(input.satiety) ||
          !isGuidedScore(input.digestiveComfort) ||
          !isGuidedScore(input.planEase) ||
          input.mealType !== 'dinner'
        ) {
          throw new Error('Responda as três perguntas guiadas antes de compartilhar o diário.');
        }
        const entries = diaryEntriesFor(patientId, encounterId);
        const now = new Date();
        const created: CareDiaryEntry = {
          id: `diario-refeicao-${Date.now()}`,
          patientId,
          encounterId,
          version: entries.length + 1,
          mealType: input.mealType,
          satiety: input.satiety,
          digestiveComfort: input.digestiveComfort,
          planEase: input.planEase,
          analysisViewed: input.analysisViewed,
          attachmentRef: '/meals/jantar-omelete.jpg',
          sharedWithCareTeam: true,
          sharingConsentVersion: 'diario-contexto-v1',
          submittedAt: formatSubmissionTime(now),
          submittedAtIso: now.toISOString(),
        };
        const auditEvent = createAuditEvent({
          action: 'diary-entry-submitted',
          actor: 'patient',
          patientId,
          encounterId,
          occurredAt: created.submittedAt,
          occurredAtIso: created.submittedAtIso,
          relatedId: created.id,
          relatedVersion: created.version,
          summary: 'Contexto guiado do diário compartilhado com a equipe.',
        });

        setState((current) => ({
          ...current,
          diaryEntries: [...(current.diaryEntries ?? []), created],
          auditEvents: [...current.auditEvents, auditEvent],
        }));
        return created;
      },
      sendConversationMessage: (patientId, encounterId, sender, input) => {
        const body = input.body.trim();
        if (!isConversationSender(sender) || !isConversationContext(input.context)) {
          throw new Error('Escolha um contexto válido para esta conversa.');
        }
        if (body.length < 2 || body.length > 600) {
          throw new Error('Escreva uma mensagem entre 2 e 600 caracteres.');
        }

        const messages = conversationMessagesFor(patientId, encounterId);
        const now = new Date();
        const created: CareConversationMessage = {
          id: `mensagem-cuidado-${Date.now()}`,
          patientId,
          encounterId,
          version: messages.length + 1,
          sender,
          context: input.context,
          body,
          sentAt: formatSubmissionTime(now),
          sentAtIso: now.toISOString(),
          retentionMode: 'session-only',
        };
        const auditEvent = createAuditEvent({
          action: 'conversation-message-sent',
          actor: sender,
          patientId,
          encounterId,
          occurredAt: created.sentAt,
          occurredAtIso: created.sentAtIso,
          relatedId: created.id,
          relatedVersion: created.version,
          summary: `Mensagem contextualizada em “${getConversationContextLabel(created.context)}” registrada sem copiar seu conteúdo para a auditoria.`,
        });

        setState((current) => ({
          ...current,
          conversationMessages: [...(current.conversationMessages ?? []), created],
          auditEvents: [...current.auditEvents, auditEvent],
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
        const auditEvent = createAuditEvent({
          action: 'pre-consultation-review-started',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: created.createdAt,
          occurredAtIso: created.createdAtIso,
          relatedId: created.id,
          relatedVersion: created.version,
          summary: 'Uma nova versão do preparo médico foi aberta para revisão.',
        });

        setState((current) => ({
          ...current,
          reviews: [...current.reviews, created],
          auditEvents: [...current.auditEvents, auditEvent],
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
        const updated: PreConsultationReview = {
          ...review,
          content: content.trim(),
          status: 'approved',
          updatedAt: timestamp,
          updatedAtIso: timestampIso,
          reviewedAt: timestamp,
          reviewedAtIso: timestampIso,
          reviewedBy: 'Dr. Guilherme Martins',
          rejectionReason: null,
        };
        return replaceReview(updated, createAuditEvent({
          action: 'pre-consultation-review-approved',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: timestamp,
          occurredAtIso: timestampIso,
          relatedId: updated.id,
          relatedVersion: updated.version,
          summary: 'Preparo revisado e aprovado para apoiar a consulta.',
        }));
      },
      rejectPreConsultationReview: (patientId, encounterId, content, reason) => {
        const review = requireDraftReview(patientId, encounterId);
        if (reason.trim().length < 10) {
          throw new Error('Explique em ao menos 10 caracteres por que o rascunho foi rejeitado.');
        }
        const now = new Date();
        const timestamp = formatSubmissionTime(now);
        const timestampIso = now.toISOString();
        const updated: PreConsultationReview = {
          ...review,
          content,
          status: 'rejected',
          updatedAt: timestamp,
          updatedAtIso: timestampIso,
          reviewedAt: timestamp,
          reviewedAtIso: timestampIso,
          reviewedBy: 'Dr. Guilherme Martins',
          rejectionReason: reason.trim(),
        };
        return replaceReview(updated, createAuditEvent({
          action: 'pre-consultation-review-rejected',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: timestamp,
          occurredAtIso: timestampIso,
          relatedId: updated.id,
          relatedVersion: updated.version,
          summary: 'Preparo rejeitado; a versão e o relato original foram preservados.',
        }));
      },
      recordConsultationClosure: (patientId, encounterId, input) => {
        if (input.content.trim().length < 20) {
          throw new Error('O fechamento precisa estar completo antes de ser registrado.');
        }
        if (input.sessionVersion < 1 || input.reviewVersion < 1 || input.items.length === 0) {
          throw new Error('Aprovação sem sessão, versão ou item rastreável não pode seguir ao plano.');
        }

        const closures = consultationClosuresFor(patientId, encounterId);
        const existing = closures.find(
          (closure) =>
            closure.sessionVersion === input.sessionVersion &&
            closure.reviewVersion === input.reviewVersion,
        );
        if (existing) return existing;

        const now = new Date();
        const timestamp = formatSubmissionTime(now);
        const timestampIso = now.toISOString();
        const closure: CareConsultationClosure = {
          id: `consultation-closure-${Date.now()}`,
          patientId,
          encounterId,
          version: (closures.at(-1)?.version ?? 0) + 1,
          sessionVersion: input.sessionVersion,
          reviewVersion: input.reviewVersion,
          content: input.content.trim(),
          items: input.items.map((item) => ({ ...item })),
          consentVersion: 'teleconsulta-transcricao-v1',
          serviceMode: 'deterministic-mock',
          approvedBy: 'Dr. Guilherme Martins · médico responsável',
          approvedAt: timestamp,
          approvedAtIso: timestampIso,
        };
        const auditEvent = createAuditEvent({
          action: 'consultation-closure-approved',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: timestamp,
          occurredAtIso: timestampIso,
          relatedId: closure.id,
          relatedVersion: closure.version,
          summary: `Fechamento da teleconsulta aprovado com ${closure.items.length} ${closure.items.length === 1 ? 'item rastreável' : 'itens rastreáveis'}.`,
          consentVersion: closure.consentVersion,
          aiAssistanceAllowed: true,
        });
        setState((current) => ({
          ...current,
          consultationClosures: [...current.consultationClosures, closure],
          auditEvents: [...current.auditEvents, auditEvent],
        }));
        return closure;
      },
      startCarePlan: (patientId, encounterId, template) => {
        const plans = carePlansFor(patientId, encounterId);
        const activePlan = [...plans].reverse().find(
          (plan) => plan.status === 'draft' || plan.status === 'approved',
        );
        if (activePlan) return activePlan;

        const created = createCarePlan(patientId, encounterId, plans.at(-1) ?? null, template);
        const auditEvent = createAuditEvent({
          action: 'care-plan-created',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: created.createdAt,
          occurredAtIso: created.createdAtIso,
          relatedId: created.id,
          relatedVersion: created.version,
          summary: `Rascunho da versão ${created.version} do plano criado.`,
        });
        setState((current) => ({
          ...current,
          carePlans: [...current.carePlans, created],
          auditEvents: [...current.auditEvents, auditEvent],
        }));
        return created;
      },
      createCarePlanRevision: (patientId, encounterId, template) => {
        const plans = carePlansFor(patientId, encounterId);
        const activeDraft = [...plans].reverse().find((plan) => plan.status === 'draft');
        if (activeDraft) return activeDraft;

        const created = createCarePlan(patientId, encounterId, plans.at(-1) ?? null, template);
        const auditEvent = createAuditEvent({
          action: 'care-plan-created',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: created.createdAt,
          occurredAtIso: created.createdAtIso,
          relatedId: created.id,
          relatedVersion: created.version,
          summary: `Rascunho da versão ${created.version} do plano criado.`,
        });
        setState((current) => ({
          ...current,
          carePlans: [...current.carePlans, created],
          auditEvents: [...current.auditEvents, auditEvent],
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
        const activeActions = plan.actions.filter((action) => action.active);
        if (activeActions.length === 0) {
          throw new Error('Mantenha ao menos uma ação clara antes de aprovar esta versão.');
        }
        if (activeActions.some((action) => action.title.trim().length < 3)) {
          throw new Error('Complete a redação de cada ação ativa antes de aprovar.');
        }
        if (activeActions.some((action) => action.cadence.trim().length < 3)) {
          throw new Error('Defina a frequência ou o momento de cada ação ativa.');
        }
        if (plan.sourceClosureId) {
          const sourceClosure = consultationClosuresFor(patientId, encounterId).find(
            (closure) => closure.id === plan.sourceClosureId,
          );
          if (!sourceClosure || sourceClosure.version !== plan.sourceClosureVersion) {
            throw new Error('A fonte aprovada deste plano não está disponível no contexto atual.');
          }
          const eligibleIds = new Set(
            sourceClosure.items
              .filter((item) => item.kind === 'patient-report' || item.kind === 'patient-priority')
              .map((item) => item.id),
          );
          if (!plan.sourceItemIds.some((itemId) => eligibleIds.has(itemId))) {
            throw new Error('Vincule ao menos um relato ou prioridade aprovada antes de aprovar o plano.');
          }
          if (plan.sourceItemIds.some((itemId) => !eligibleIds.has(itemId))) {
            throw new Error('Lacunas e hipóteses não podem ser convertidas em conteúdo do plano.');
          }
          if (plan.actions.some(
            (action) => action.sourceItemId &&
              (!eligibleIds.has(action.sourceItemId) || !plan.sourceItemIds.includes(action.sourceItemId)),
          )) {
            throw new Error('Uma ação perdeu o vínculo com sua fonte aprovada. Revise o rascunho.');
          }
        }
        const now = new Date();
        const timestamp = formatSubmissionTime(now);
        const timestampIso = now.toISOString();
        const updated: CarePlanVersion = {
          ...plan,
          status: 'approved',
          updatedAt: timestamp,
          updatedAtIso: timestampIso,
          approvedBy: 'Dr. Guilherme Martins · médico responsável',
          approvedAt: timestamp,
          approvedAtIso: timestampIso,
        };
        return replaceCarePlan(updated, createAuditEvent({
          action: 'care-plan-approved',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: timestamp,
          occurredAtIso: timestampIso,
          relatedId: updated.id,
          relatedVersion: updated.version,
          summary: `Versão ${updated.version} do plano aprovada pelo médico.`,
        }));
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
        const auditEvent = createAuditEvent({
          action: 'care-plan-published',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: timestamp,
          occurredAtIso: timestampIso,
          relatedId: published.id,
          relatedVersion: published.version,
          summary: `Versão ${published.version} do plano publicada para a paciente.`,
        });
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
          auditEvents: [...current.auditEvents, auditEvent],
        }));
        return published;
      },
      confirmCarePlanAction: (patientId, encounterId, planId, actionId, completed) => {
        const plan = requireCarePlan(patientId, encounterId, planId);
        if (plan.status !== 'published') {
          throw new Error('A paciente só pode confirmar ações de uma versão publicada do plano.');
        }
        const action = plan.actions.find((candidate) => candidate.id === actionId && candidate.active);
        if (!action) {
          throw new Error('Esta ação não está disponível na versão publicada do plano.');
        }

        const now = new Date();
        const created: CarePlanActionConfirmation = {
          id: `confirmacao-acao-${Date.now()}-${actionId}`,
          patientId,
          encounterId,
          planId: plan.id,
          planVersion: plan.version,
          actionId: action.id,
          completed,
          recordedAt: formatSubmissionTime(now),
          recordedAtIso: now.toISOString(),
        };
        setState((current) => ({
          ...current,
          actionConfirmations: [...(current.actionConfirmations ?? []), created],
        }));
        return created;
      },
      reviewAiPreparation: (patientId, encounterId, input) => {
        const sourceRefs = input.sourceRefs.flatMap((sourceRef) => {
          const normalized = normalizeAiPreparationSourceRef(sourceRef);
          return normalized ? [normalized] : [];
        });
        const items = input.items.flatMap((item) => {
          const normalized = normalizeAiPreparationReviewItem(item);
          return normalized ? [normalized] : [];
        });

        if (
          input.templateVersion !== 'preparo-consulta-v1' ||
          input.serviceMode !== 'deterministic-mock' ||
          (input.authorizationMode !== 'mock-scenario' && input.authorizationMode !== 'patient-consent') ||
          sourceRefs.length !== input.sourceRefs.length ||
          items.length !== input.items.length ||
          sourceRefs.length === 0 ||
          items.length === 0
        ) {
          throw new Error('Revise as fontes e as decisões antes de salvar a pauta assistida.');
        }

        const availableSourceIds = new Set(sourceRefs.map((sourceRef) => sourceRef.id));
        if (items.some((item) => item.sourceIds.some((sourceId) => !availableSourceIds.has(sourceId)))) {
          throw new Error('Um item da pauta perdeu a referência de origem. Refaça a preparação.');
        }

        const now = new Date();
        const scopedReviews = aiPreparationReviewsFor(patientId, encounterId);
        const created: CareAiPreparationReview = {
          id: `preparo-ia-${Date.now()}`,
          patientId,
          encounterId,
          version: scopedReviews.length + 1,
          authorizationMode: input.authorizationMode,
          templateVersion: input.templateVersion,
          serviceMode: input.serviceMode,
          sourceRefs,
          items,
          sourceFingerprint: sourceRefs
            .map((sourceRef) => `${sourceRef.id}@${sourceRef.version}`)
            .toSorted()
            .join('|'),
          reviewedBy: 'Dr. Guilherme Martins · médico responsável',
          reviewedAt: formatSubmissionTime(now),
          reviewedAtIso: now.toISOString(),
        };
        const includedCount = items.filter((item) => item.decision === 'included').length;
        const dismissedCount = items.length - includedCount;
        const auditEvent = createAuditEvent({
          action: 'ai-preparation-reviewed',
          actor: 'doctor',
          patientId,
          encounterId,
          occurredAt: created.reviewedAt,
          occurredAtIso: created.reviewedAtIso,
          relatedId: created.id,
          relatedVersion: created.version,
          summary: `Pauta assistida revisada: ${includedCount} ${includedCount === 1 ? 'item incluído' : 'itens incluídos'} e ${dismissedCount} ${dismissedCount === 1 ? 'descartado' : 'descartados'}.`,
          aiAssistanceAllowed: true,
        });

        setState((current) => ({
          ...current,
          aiPreparationReviews: [...(current.aiPreparationReviews ?? []), created],
          auditEvents: [...current.auditEvents, auditEvent],
        }));
        return created;
      },
    };
  }, [hydrated, state]);

  return <CareDemoContext.Provider value={value}>{children}</CareDemoContext.Provider>;
}
