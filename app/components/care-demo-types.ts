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
