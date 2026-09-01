'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_ENCOUNTER_ID, DEFAULT_PATIENT_ID } from './demo-routes';
import type {
  CareAuditEvent,
  CareCheckIn,
  CareCheckInInput,
  CareCheckInReview,
  CareConversationMessage,
  CareConversationMessageInput,
  CareConversationSender,
  CareDiaryEntry,
  CareDiaryEntryInput,
  CareFollowUpCadence,
  CareFollowUpConfiguration,
  CareFollowUpContact,
  CarePlanDraftContent,
  CarePlanActionConfirmation,
  CarePlanVersion,
  PreConsultationAnswers,
  PreConsultationReview,
  PreConsultationSubmission,
} from './care-demo-types';

export interface CareDemoState {
  draftsByEncounter: Record<string, PreConsultationAnswers>;
  submissions: PreConsultationSubmission[];
  reviews: PreConsultationReview[];
  carePlans: CarePlanVersion[];
  checkIns: CareCheckIn[];
  checkInReviews: CareCheckInReview[];
  followUpConfigurations: CareFollowUpConfiguration[];
  followUpContacts: CareFollowUpContact[];
  diaryEntries: CareDiaryEntry[];
  conversationMessages: CareConversationMessage[];
  actionConfirmations: CarePlanActionConfirmation[];
  auditEvents: CareAuditEvent[];
}

export interface CareDemoStoreValue extends CareDemoState {
  hydrated: boolean;
  savePreConsultationDraft: (
    patientId: string,
    encounterId: string,
    patch: Partial<PreConsultationAnswers>,
  ) => void;
  submitPreConsultation: (patientId: string, encounterId: string) => PreConsultationSubmission;
  submitCheckIn: (
    patientId: string,
    encounterId: string,
    input: CareCheckInInput,
  ) => CareCheckIn;
  reviewCheckIn: (
    patientId: string,
    encounterId: string,
    checkInId: string,
  ) => CareCheckInReview;
  configureFollowUp: (
    patientId: string,
    encounterId: string,
    planId: string,
    cadence: CareFollowUpCadence,
  ) => CareFollowUpConfiguration;
  recordFollowUpContact: (
    patientId: string,
    encounterId: string,
    configurationId: string,
  ) => CareFollowUpContact;
  submitDiaryEntry: (
    patientId: string,
    encounterId: string,
    input: CareDiaryEntryInput,
  ) => CareDiaryEntry;
  sendConversationMessage: (
    patientId: string,
    encounterId: string,
    sender: CareConversationSender,
    input: CareConversationMessageInput,
  ) => CareConversationMessage;
  startPreConsultationReview: (patientId: string, encounterId: string) => PreConsultationReview;
  savePreConsultationReview: (
    patientId: string,
    encounterId: string,
    content: string,
  ) => PreConsultationReview;
  approvePreConsultationReview: (
    patientId: string,
    encounterId: string,
    content: string,
  ) => PreConsultationReview;
  rejectPreConsultationReview: (
    patientId: string,
    encounterId: string,
    content: string,
    reason: string,
  ) => PreConsultationReview;
  startCarePlan: (
    patientId: string,
    encounterId: string,
    template?: Partial<CarePlanDraftContent>,
  ) => CarePlanVersion;
  createCarePlanRevision: (
    patientId: string,
    encounterId: string,
    template?: Partial<CarePlanDraftContent>,
  ) => CarePlanVersion;
  saveCarePlan: (
    patientId: string,
    encounterId: string,
    planId: string,
    patch: Partial<CarePlanDraftContent>,
  ) => CarePlanVersion;
  approveCarePlan: (
    patientId: string,
    encounterId: string,
    planId: string,
  ) => CarePlanVersion;
  publishCarePlan: (
    patientId: string,
    encounterId: string,
    planId: string,
  ) => CarePlanVersion;
  confirmCarePlanAction: (
    patientId: string,
    encounterId: string,
    planId: string,
    actionId: string,
    completed: boolean,
  ) => CarePlanActionConfirmation;
}

export interface CareDemoContextValue {
  hydrated: boolean;
  patientId: string;
  encounterId: string;
  draft: PreConsultationAnswers;
  latestSubmission: PreConsultationSubmission | null;
  submissions: PreConsultationSubmission[];
  reviews: PreConsultationReview[];
  activeReview: PreConsultationReview | null;
  reviewHistory: PreConsultationReview[];
  carePlans: CarePlanVersion[];
  checkIns: CareCheckIn[];
  latestCheckIn: CareCheckIn | null;
  checkInReviews: CareCheckInReview[];
  latestCheckInReview: CareCheckInReview | null;
  followUpConfigurations: CareFollowUpConfiguration[];
  activeFollowUpConfiguration: CareFollowUpConfiguration | null;
  followUpContacts: CareFollowUpContact[];
  latestFollowUpContact: CareFollowUpContact | null;
  diaryEntries: CareDiaryEntry[];
  conversationMessages: CareConversationMessage[];
  actionConfirmations: CarePlanActionConfirmation[];
  confirmedActionIds: string[];
  auditEvents: CareAuditEvent[];
  latestCarePlan: CarePlanVersion | null;
  activeCarePlan: CarePlanVersion | null;
  latestPublishedCarePlan: CarePlanVersion | null;
  savePreConsultationDraft: (patch: Partial<PreConsultationAnswers>) => void;
  submitPreConsultation: () => PreConsultationSubmission;
  submitCheckIn: (input: CareCheckInInput) => CareCheckIn;
  reviewCheckIn: (checkInId: string) => CareCheckInReview;
  configureFollowUp: (
    planId: string,
    cadence: CareFollowUpCadence,
  ) => CareFollowUpConfiguration;
  recordFollowUpContact: (configurationId: string) => CareFollowUpContact;
  submitDiaryEntry: (input: CareDiaryEntryInput) => CareDiaryEntry;
  sendConversationMessage: (
    sender: CareConversationSender,
    input: CareConversationMessageInput,
  ) => CareConversationMessage;
  startPreConsultationReview: () => PreConsultationReview;
  savePreConsultationReview: (content: string) => PreConsultationReview;
  approvePreConsultationReview: (content: string) => PreConsultationReview;
  rejectPreConsultationReview: (content: string, reason: string) => PreConsultationReview;
  startCarePlan: (template?: Partial<CarePlanDraftContent>) => CarePlanVersion;
  createCarePlanRevision: (template?: Partial<CarePlanDraftContent>) => CarePlanVersion;
  saveCarePlan: (planId: string, patch: Partial<CarePlanDraftContent>) => CarePlanVersion;
  approveCarePlan: (planId: string) => CarePlanVersion;
  publishCarePlan: (planId: string) => CarePlanVersion;
  confirmCarePlanAction: (
    planId: string,
    actionId: string,
    completed: boolean,
  ) => CarePlanActionConfirmation;
}

export const EMPTY_PRECONSULTATION_DRAFT: PreConsultationAnswers = {
  consentGiven: false,
  aiAssistanceAllowed: false,
  objective: '',
  changes: '',
  questions: '',
  additionalContext: '',
};

export function getCareDemoScopeKey(patientId: string, encounterId: string) {
  return `${patientId}::${encounterId}`;
}

export const CareDemoContext = createContext<CareDemoStoreValue | null>(null);

export function useCareDemo(
  patientId = DEFAULT_PATIENT_ID,
  encounterId = DEFAULT_ENCOUNTER_ID,
): CareDemoContextValue {
  const context = useContext(CareDemoContext);
  if (!context) {
    throw new Error('useCareDemo deve ser usado dentro de CareDemoProvider.');
  }

  const scopeKey = getCareDemoScopeKey(patientId, encounterId);
  const submissions = context.submissions.filter(
    (submission) => submission.patientId === patientId && submission.encounterId === encounterId,
  );
  const latestSubmission = submissions.at(-1) ?? null;
  const reviews = context.reviews.filter(
    (review) => review.patientId === patientId && review.encounterId === encounterId,
  );
  const reviewHistory = latestSubmission
    ? reviews.filter(
        (review) =>
          review.submissionId === latestSubmission.id,
      )
    : [];
  const carePlans = context.carePlans
    .filter((plan) => plan.patientId === patientId && plan.encounterId === encounterId)
    .toSorted((left, right) => left.version - right.version);
  const latestCarePlan = carePlans.at(-1) ?? null;
  const activeCarePlan = [...carePlans].reverse().find(
    (plan) => plan.status === 'draft' || plan.status === 'approved',
  ) ?? latestCarePlan;
  const latestPublishedCarePlan = [...carePlans].reverse().find(
    (plan) => plan.status === 'published',
  ) ?? null;
  const checkIns = (context.checkIns ?? [])
    .filter((checkIn) => checkIn.patientId === patientId && checkIn.encounterId === encounterId)
    .toSorted((left, right) => left.submittedAtIso.localeCompare(right.submittedAtIso));
  const latestCheckIn = checkIns.at(-1) ?? null;
  const checkInReviews = (context.checkInReviews ?? [])
    .filter((review) => review.patientId === patientId && review.encounterId === encounterId)
    .toSorted((left, right) => left.reviewedAtIso.localeCompare(right.reviewedAtIso));
  const latestCheckInReview = latestCheckIn
    ? [...checkInReviews].reverse().find((review) => review.checkInId === latestCheckIn.id) ?? null
    : null;
  const followUpConfigurations = (context.followUpConfigurations ?? [])
    .filter((configuration) => configuration.patientId === patientId && configuration.encounterId === encounterId)
    .toSorted((left, right) => left.configuredAtIso.localeCompare(right.configuredAtIso));
  const activeFollowUpConfiguration = followUpConfigurations.at(-1) ?? null;
  const followUpContacts = (context.followUpContacts ?? [])
    .filter((contact) => contact.patientId === patientId && contact.encounterId === encounterId)
    .toSorted((left, right) => left.recordedAtIso.localeCompare(right.recordedAtIso));
  const latestFollowUpContact = followUpContacts.at(-1) ?? null;
  const diaryEntries = (context.diaryEntries ?? [])
    .filter((entry) => entry.patientId === patientId && entry.encounterId === encounterId)
    .toSorted((left, right) => left.submittedAtIso.localeCompare(right.submittedAtIso));
  const conversationMessages = (context.conversationMessages ?? [])
    .filter((message) => message.patientId === patientId && message.encounterId === encounterId)
    .toSorted((left, right) => left.sentAtIso.localeCompare(right.sentAtIso));
  const actionConfirmations = (context.actionConfirmations ?? [])
    .filter((confirmation) => confirmation.patientId === patientId && confirmation.encounterId === encounterId)
    .toSorted((left, right) => left.recordedAtIso.localeCompare(right.recordedAtIso));
  const latestConfirmationByAction = new Map<string, CarePlanActionConfirmation>();
  for (const confirmation of actionConfirmations) {
    latestConfirmationByAction.set(confirmation.actionId, confirmation);
  }
  const confirmedActionIds = [...latestConfirmationByAction.values()]
    .filter((confirmation) => confirmation.completed)
    .map((confirmation) => confirmation.actionId);
  const auditEvents = context.auditEvents
    .filter((event) => event.patientId === patientId && event.encounterId === encounterId)
    .toSorted((left, right) => left.occurredAtIso.localeCompare(right.occurredAtIso));

  return {
    hydrated: context.hydrated,
    patientId,
    encounterId,
    draft: context.draftsByEncounter[scopeKey] ?? EMPTY_PRECONSULTATION_DRAFT,
    latestSubmission,
    submissions,
    reviews,
    activeReview: reviewHistory.at(-1) ?? null,
    reviewHistory,
    carePlans,
    latestCarePlan,
    activeCarePlan,
    latestPublishedCarePlan,
    checkIns,
    latestCheckIn,
    checkInReviews,
    latestCheckInReview,
    followUpConfigurations,
    activeFollowUpConfiguration,
    followUpContacts,
    latestFollowUpContact,
    diaryEntries,
    conversationMessages,
    actionConfirmations,
    confirmedActionIds,
    auditEvents,
    savePreConsultationDraft: (patch) =>
      context.savePreConsultationDraft(patientId, encounterId, patch),
    submitPreConsultation: () => context.submitPreConsultation(patientId, encounterId),
    submitCheckIn: (input) => context.submitCheckIn(patientId, encounterId, input),
    reviewCheckIn: (checkInId) => context.reviewCheckIn(patientId, encounterId, checkInId),
    configureFollowUp: (planId, cadence) =>
      context.configureFollowUp(patientId, encounterId, planId, cadence),
    recordFollowUpContact: (configurationId) =>
      context.recordFollowUpContact(patientId, encounterId, configurationId),
    submitDiaryEntry: (input) => context.submitDiaryEntry(patientId, encounterId, input),
    sendConversationMessage: (sender, input) =>
      context.sendConversationMessage(patientId, encounterId, sender, input),
    startPreConsultationReview: () =>
      context.startPreConsultationReview(patientId, encounterId),
    savePreConsultationReview: (content) =>
      context.savePreConsultationReview(patientId, encounterId, content),
    approvePreConsultationReview: (content) =>
      context.approvePreConsultationReview(patientId, encounterId, content),
    rejectPreConsultationReview: (content, reason) =>
      context.rejectPreConsultationReview(patientId, encounterId, content, reason),
    startCarePlan: (template) => context.startCarePlan(patientId, encounterId, template),
    createCarePlanRevision: (template) =>
      context.createCarePlanRevision(patientId, encounterId, template),
    saveCarePlan: (planId, patch) => context.saveCarePlan(patientId, encounterId, planId, patch),
    approveCarePlan: (planId) => context.approveCarePlan(patientId, encounterId, planId),
    publishCarePlan: (planId) => context.publishCarePlan(patientId, encounterId, planId),
    confirmCarePlanAction: (planId, actionId, completed) =>
      context.confirmCarePlanAction(patientId, encounterId, planId, actionId, completed),
  };
}
