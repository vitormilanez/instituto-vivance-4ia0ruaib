'use client';

import { createContext, useContext } from 'react';
import type { PreConsultationAnswers, PreConsultationSubmission } from './care-demo-types';

export interface CareDemoContextValue {
  draft: PreConsultationAnswers;
  latestSubmission: PreConsultationSubmission | null;
  submissions: PreConsultationSubmission[];
  savePreConsultationDraft: (patch: Partial<PreConsultationAnswers>) => void;
  submitPreConsultation: () => PreConsultationSubmission;
}

export const CareDemoContext = createContext<CareDemoContextValue | null>(null);

export function useCareDemo() {
  const context = useContext(CareDemoContext);
  if (!context) {
    throw new Error('useCareDemo deve ser usado dentro de CareDemoProvider.');
  }
  return context;
}
