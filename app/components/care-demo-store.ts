'use client';

import { createContext, useContext } from 'react';
import type {
  PreConsultationAnswers,
  PreConsultationReview,
  PreConsultationSubmission,
} from './care-demo-types';

export interface CareDemoContextValue {
  draft: PreConsultationAnswers;
  latestSubmission: PreConsultationSubmission | null;
  submissions: PreConsultationSubmission[];
  activeReview: PreConsultationReview | null;
  reviewHistory: PreConsultationReview[];
  savePreConsultationDraft: (patch: Partial<PreConsultationAnswers>) => void;
  submitPreConsultation: () => PreConsultationSubmission;
  startPreConsultationReview: () => PreConsultationReview;
  savePreConsultationReview: (content: string) => PreConsultationReview;
  approvePreConsultationReview: (content: string) => PreConsultationReview;
  rejectPreConsultationReview: (content: string, reason: string) => PreConsultationReview;
}

export const CareDemoContext = createContext<CareDemoContextValue | null>(null);

export function useCareDemo() {
  const context = useContext(CareDemoContext);
  if (!context) {
    throw new Error('useCareDemo deve ser usado dentro de CareDemoProvider.');
  }
  return context;
}
