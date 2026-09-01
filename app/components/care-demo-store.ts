'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_ENCOUNTER_ID, DEFAULT_PATIENT_ID } from './demo-routes';
import type {
  CarePlanDraftContent,
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
}

export interface CareDemoStoreValue extends CareDemoState {
  hydrated: boolean;
  savePreConsultationDraft: (
    patientId: string,
    encounterId: string,
    patch: Partial<PreConsultationAnswers>,
  ) => void;
  submitPreConsultation: (patientId: string, encounterId: string) => PreConsultationSubmission;
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
  latestCarePlan: CarePlanVersion | null;
  activeCarePlan: CarePlanVersion | null;
  latestPublishedCarePlan: CarePlanVersion | null;
  savePreConsultationDraft: (patch: Partial<PreConsultationAnswers>) => void;
  submitPreConsultation: () => PreConsultationSubmission;
  startPreConsultationReview: () => PreConsultationReview;
  savePreConsultationReview: (content: string) => PreConsultationReview;
  approvePreConsultationReview: (content: string) => PreConsultationReview;
  rejectPreConsultationReview: (content: string, reason: string) => PreConsultationReview;
  startCarePlan: (template?: Partial<CarePlanDraftContent>) => CarePlanVersion;
  createCarePlanRevision: (template?: Partial<CarePlanDraftContent>) => CarePlanVersion;
  saveCarePlan: (planId: string, patch: Partial<CarePlanDraftContent>) => CarePlanVersion;
  approveCarePlan: (planId: string) => CarePlanVersion;
  publishCarePlan: (planId: string) => CarePlanVersion;
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
    savePreConsultationDraft: (patch) =>
      context.savePreConsultationDraft(patientId, encounterId, patch),
    submitPreConsultation: () => context.submitPreConsultation(patientId, encounterId),
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
  };
}
