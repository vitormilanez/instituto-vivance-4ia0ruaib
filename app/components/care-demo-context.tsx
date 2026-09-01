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
  CareAuditAction,
  CareAuditActor,
  CareAuditEvent,
  CareCheckIn,
  CareCheckInReview,
  CareCheckInSleepQuality,
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

function isCareCheckInSleepQuality(value: unknown): value is CareCheckInSleepQuality {
  return value === 'poor' || value === 'regular' || value === 'good';
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
  return value === 'daily' || value === 'three-times-week' || value === 'weekly';
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

function isCareAuditAction(value: unknown): value is CareAuditAction {
  return [
    'check-in-submitted',
    'check-in-reviewed',
    'follow-up-configured',
    'follow-up-contact-recorded',
    'diary-entry-submitted',
    'pre-consultation-submitted',
    'pre-consultation-review-started',
    'pre-consultation-review-approved',
    'pre-consultation-review-rejected',
    'care-plan-created',
    'care-plan-approved',
    'care-plan-published',
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
    consentVersion: value.consentVersion === 'pre-consulta-texto-v1'
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
  carePlans: initialCarePlans,
  checkIns: [],
  checkInReviews: [],
  followUpConfigurations: [],
  followUpContacts: [],
  diaryEntries: [],
  actionConfirmations: [],
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
  const actionConfirmations = Array.isArray(value.actionConfirmations)
    ? value.actionConfirmations.flatMap((confirmation) => {
        const normalized = normalizeActionConfirmation(confirmation);
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
    carePlans,
    checkIns,
    checkInReviews,
    followUpConfigurations,
    followUpContacts,
    diaryEntries,
    actionConfirmations,
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
    carePlans,
    checkIns: [],
    checkInReviews: [],
    followUpConfigurations: [],
    followUpContacts: [],
    diaryEntries: [],
    actionConfirmations: [],
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
      carePlans: state.carePlans,
      checkIns: state.checkIns ?? [],
      checkInReviews: state.checkInReviews ?? [],
      followUpConfigurations: state.followUpConfigurations ?? [],
      followUpContacts: state.followUpContacts ?? [],
      diaryEntries: state.diaryEntries ?? [],
      actionConfirmations: state.actionConfirmations ?? [],
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
          summary: 'Check-in de acompanhamento registrado.',
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
        if (!plan.actions.some((action) => action.active && action.title.trim().length >= 3)) {
          throw new Error('Mantenha ao menos uma ação clara antes de aprovar esta versão.');
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
    };
  }, [hydrated, state]);

  return <CareDemoContext.Provider value={value}>{children}</CareDemoContext.Provider>;
}
