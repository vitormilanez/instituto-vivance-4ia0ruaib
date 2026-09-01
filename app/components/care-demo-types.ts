export interface PreConsultationAnswers {
  consentGiven: boolean;
  aiAssistanceAllowed: boolean;
  objective: string;
  changes: string;
  questions: string;
  additionalContext: string;
}

export interface PreConsultationSubmission extends PreConsultationAnswers {
  id: string;
  version: number;
  submittedAt: string;
  consentVersion: 'pre-consulta-texto-v1';
  structuredDraft: string | null;
}

export type PreConsultationReviewStatus = 'draft' | 'approved' | 'rejected';

export interface PreConsultationReview {
  id: string;
  submissionId: string;
  version: number;
  status: PreConsultationReviewStatus;
  content: string;
  sourceMode: 'assisted' | 'manual';
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
}
