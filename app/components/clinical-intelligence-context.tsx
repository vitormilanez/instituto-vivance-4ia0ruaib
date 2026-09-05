'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_PATIENT_ID,
  demoPatients,
  getDefaultEncounterId,
  getDemoPatient,
} from './demo-routes';

export type ExamReviewStatus = 'awaiting_review' | 'approved';
export type ExamFieldStatus = 'pending' | 'confirmed' | 'corrected' | 'not_found';
export type ExtractionConfidence = 'high' | 'medium' | 'low';

export interface ClinicalExamField {
  id: string;
  code: 'fasting_glucose' | 'hba1c' | 'total_cholesterol' | 'hdl' | 'fasting_insulin';
  label: string;
  rawValue: string;
  value: string;
  rawUnit: string;
  unit: string;
  referenceRange: string;
  sourcePage: number;
  extractionConfidence: ExtractionConfidence;
  status: ExamFieldStatus;
  included: boolean;
}

export interface ClinicalExamDocument {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  title: string;
  fileName: string;
  laboratory: string;
  examDate: string;
  receivedAt: string;
  receivedAtIso: string;
  submittedBy: 'patient' | 'doctor';
  submittedByLabel: string;
  note: string;
  originalAvailable: true;
  extractionVersion: number;
  reviewStatus: ExamReviewStatus;
  reviewVersion: number;
  reviewedAt: string | null;
  reviewedAtIso: string | null;
  reviewedBy: string | null;
  governance: ClinicalGovernanceSnapshot[];
  fields: ClinicalExamField[];
}

export type KnowledgeSourceKind = 'official' | 'guideline' | 'review' | 'primary_study' | 'institutional_protocol';
export type KnowledgeSourceStatus = 'active' | 'paused' | 'awaiting_review';
export type EvidenceQuality = 'REGULATORY' | 'HIGH' | 'MODERATE' | 'EXPERT_CONSENSUS' | 'UNKNOWN';

export interface ClinicalKnowledgeSource {
  id: string;
  title: string;
  organization: string;
  kind: KnowledgeSourceKind;
  version: string;
  publicationDate: string;
  accessedAt: string;
  reference: string;
  scope: string;
  relevantClaims: string;
  limitations: string;
  studyDesign?: string;
  population?: string;
  sampleSize?: string;
  followUp?: string;
  conflicts?: string;
  evidenceQuality: EvidenceQuality;
  applicableModuleIds: ClinicalAiModuleId[];
  status: KnowledgeSourceStatus;
  addedBy: string;
  updatedAt: string;
  updatedAtIso: string;
}

export type ClinicalDataConnectionId = 'approved_exams' | 'checkins' | 'care_plans' | 'messages';

export interface ClinicalDataConnection {
  id: ClinicalDataConnectionId;
  label: string;
  description: string;
  enabled: boolean;
}

export type AiCapabilityId = 'organize_context' | 'compare_confirmed_data' | 'suggest_questions' | 'draft_summary';

export interface AiCapability {
  id: AiCapabilityId;
  label: string;
  description: string;
  enabled: boolean;
}

export type ClinicalAiModuleId =
  | 'exam_ingestion'
  | 'exam_analysis'
  | 'longitudinal_analysis'
  | 'visit_preparation'
  | 'clinical_synthesis';

export interface ClinicalAiModulePolicy {
  id: ClinicalAiModuleId;
  label: string;
  description: string;
  feedbackGoal: string;
  primaryKnowledgeSourceId: string;
  requiredDataConnectionIds: ClinicalDataConnectionId[];
  allowedCapabilityIds: AiCapabilityId[];
  enabled: boolean;
  requiresMedicalReview: true;
  blockingConditions: string[];
}

export interface ClinicalAiConfigurationVersion {
  id: string;
  version: number;
  status: 'active' | 'superseded';
  dataConnections: ClinicalDataConnection[];
  capabilities: AiCapability[];
  modules: ClinicalAiModulePolicy[];
  publishedAt: string;
  publishedAtIso: string;
  publishedBy: string;
}

export interface ClinicalAiConfigurationDraft {
  baseVersion: number;
  dirty: boolean;
  dataConnections: ClinicalDataConnection[];
  capabilities: AiCapability[];
  modules: ClinicalAiModulePolicy[];
}

export interface ClinicalGovernanceSnapshot {
  moduleId: ClinicalAiModuleId;
  moduleLabel: string;
  configurationVersion: number;
  knowledgeSourceId: string;
  knowledgeReference: string;
  knowledgeVersion: string;
  sourceFingerprint: string;
  governedAt: string;
  governedAtIso: string;
}

export interface ClinicalGovernedArtifact {
  id: string;
  patientId: string;
  moduleId: ClinicalAiModuleId;
  version: number;
  status: 'generated' | 'reviewed';
  governance: ClinicalGovernanceSnapshot;
  sourceIds: string[];
  contentFingerprint: string;
  createdAt: string;
  createdAtIso: string;
  createdBy: string;
}

export type PatientAiContextStatus =
  | 'ready'
  | 'review_required'
  | 'insufficient_data'
  | 'not_authorized'
  | 'paused';

export type AiAuthorizationStatus = 'authorized' | 'pending' | 'revoked';

export interface CareRelationship {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  encounterId: string;
  status: 'active' | 'paused';
  connectedAt: string;
}

export interface PatientAiContext {
  patientId: string;
  relationshipId: string;
  status: PatientAiContextStatus;
  authorizationStatus: AiAuthorizationStatus;
  reason: string;
  lastProcessedAt: string | null;
  lastProcessedAtIso: string | null;
  appliedConfigurationVersion: number | null;
  statusBeforePause?: Exclude<PatientAiContextStatus, 'paused'>;
  reasonBeforePause?: string;
}

export interface ClinicalIntelligenceAuditEvent {
  id: string;
  action:
    | 'exam-received'
    | 'exam-field-updated'
    | 'exam-approved'
    | 'knowledge-added'
    | 'knowledge-activated'
    | 'knowledge-paused'
    | 'module-policy-updated'
    | 'patient-context-updated'
    | 'governed-output-recorded'
    | 'configuration-saved';
  actor: string;
  occurredAt: string;
  occurredAtIso: string;
  summary: string;
  relatedId: string;
  patientId?: string;
  moduleId?: ClinicalAiModuleId;
  configurationVersion?: number;
}

interface ClinicalIntelligenceState {
  schemaVersion: 2;
  clinicId: string;
  exams: ClinicalExamDocument[];
  knowledgeSources: ClinicalKnowledgeSource[];
  careRelationships: CareRelationship[];
  patientContexts: PatientAiContext[];
  governedArtifacts: ClinicalGovernedArtifact[];
  activeConfiguration: ClinicalAiConfigurationVersion;
  configurationDraft: ClinicalAiConfigurationDraft;
  configurationHistory: ClinicalAiConfigurationVersion[];
  auditEvents: ClinicalIntelligenceAuditEvent[];
}

export interface SharePatientExamInput {
  patientId: string;
  examDate: string;
  note: string;
}

export interface AddKnowledgeSourceInput {
  title: string;
  organization: string;
  kind: KnowledgeSourceKind;
  version: string;
  publicationDate: string;
  reference: string;
  relevantClaims: string;
  limitations: string;
  studyDesign: string;
  population: string;
  sampleSize: string;
  followUp: string;
  conflicts: string;
  evidenceQuality: EvidenceQuality;
  applicableModuleIds: ClinicalAiModuleId[];
}

export interface RecordGovernedArtifactInput {
  patientId: string;
  moduleId: ClinicalAiModuleId;
  status: ClinicalGovernedArtifact['status'];
  sourceIds: string[];
  content: string;
}

interface ClinicalIntelligenceContextValue extends ClinicalIntelligenceState {
  hydrated: boolean;
  dataConnections: ClinicalDataConnection[];
  capabilities: AiCapability[];
  modulePolicies: ClinicalAiModulePolicy[];
  configurationVersion: number;
  configurationUpdatedAt: string;
  hasUnpublishedChanges: boolean;
  sharePatientExam: (input: SharePatientExamInput) => ClinicalExamDocument;
  updateExamField: (
    examId: string,
    fieldId: string,
    patch: Partial<Pick<ClinicalExamField, 'value' | 'unit' | 'referenceRange' | 'included'>>,
  ) => void;
  approveExam: (examId: string) => void;
  addKnowledgeSource: (input: AddKnowledgeSourceInput) => ClinicalKnowledgeSource;
  activateKnowledgeSource: (sourceId: string) => void;
  toggleKnowledgeSource: (sourceId: string) => boolean;
  toggleDataConnection: (connectionId: ClinicalDataConnectionId) => void;
  toggleCapability: (capabilityId: AiCapabilityId) => void;
  updateModulePolicy: (
    moduleId: ClinicalAiModuleId,
    patch: Partial<Pick<ClinicalAiModulePolicy, 'enabled' | 'primaryKnowledgeSourceId'>>,
  ) => void;
  togglePatientAi: (patientId: string) => void;
  recordGovernedArtifact: (input: RecordGovernedArtifactInput) => ClinicalGovernedArtifact | null;
  saveConfiguration: () => number | null;
}

const STORAGE_KEY = 'vivance-clinical-intelligence-v1';
const CLINIC_ID = 'clinic-vivance-demo';
const DOCTOR_ID = 'doctor-guilherme-demo';
const DOCTOR_NAME = 'Dr. Guilherme Martins';

function createFields(values: {
  glucose: string;
  hba1c: string;
  cholesterol: string;
  hdl: string;
  insulin?: string;
}, status: ExamFieldStatus): ClinicalExamField[] {
  const field = (
    id: string,
    code: ClinicalExamField['code'],
    label: string,
    value: string,
    unit: string,
    referenceRange: string,
    confidence: ExtractionConfidence,
    included = true,
  ): ClinicalExamField => ({
    id,
    code,
    label,
    rawValue: value,
    value,
    rawUnit: unit,
    unit,
    referenceRange,
    sourcePage: 1,
    extractionConfidence: confidence,
    status: included ? status : 'not_found',
    included,
  });

  return [
    field(`${idPrefix(values)}-glucose`, 'fasting_glucose', 'Glicemia em jejum', values.glucose, 'mg/dL', '70–99 mg/dL', 'high'),
    field(`${idPrefix(values)}-hba1c`, 'hba1c', 'Hemoglobina glicada', values.hba1c, '%', '4,0–5,6%', 'high'),
    field(`${idPrefix(values)}-cholesterol`, 'total_cholesterol', 'Colesterol total', values.cholesterol, 'mg/dL', 'Menor que 190 mg/dL', 'medium'),
    field(`${idPrefix(values)}-hdl`, 'hdl', 'HDL', values.hdl, 'mg/dL', 'Maior que 40 mg/dL', 'medium'),
    field(
      `${idPrefix(values)}-insulin`,
      'fasting_insulin',
      'Insulina em jejum',
      values.insulin ?? '',
      'µUI/mL',
      'Não informado no documento',
      values.insulin ? 'medium' : 'low',
      Boolean(values.insulin),
    ),
  ];
}

function idPrefix(values: { glucose: string; hba1c: string }) {
  return `field-${values.glucose.replace(/\D/g, '')}-${values.hba1c.replace(/\D/g, '')}`;
}

const initialKnowledgeSources: ClinicalKnowledgeSource[] = [
  {
    id: 'knowledge-viv-clin-03',
    title: 'Protocolo institucional de acompanhamento longitudinal',
    organization: 'Comitê clínico VIVANCE',
    kind: 'institutional_protocol',
    version: '3.2',
    publicationDate: '2026-06-15',
    accessedAt: '4 set 2026',
    reference: 'VIV-CLIN-03',
    scope: 'Organização de consultas, check-ins, documentos e planos revisados.',
    relevantClaims: 'Define o ciclo coleta → síntese → revisão médica → orientação → acompanhamento.',
    limitations: 'Protocolo operacional interno; não substitui diretriz clínica ou julgamento médico.',
    evidenceQuality: 'EXPERT_CONSENSUS',
    applicableModuleIds: ['longitudinal_analysis', 'visit_preparation', 'clinical_synthesis'],
    status: 'active',
    addedBy: DOCTOR_NAME,
    updatedAt: '20 jun 2026 · 14:10',
    updatedAtIso: '2026-06-20T14:10:00-03:00',
  },
  {
    id: 'knowledge-viv-med-02',
    title: 'Critérios de qualidade para medidas antropométricas',
    organization: 'Comitê clínico VIVANCE',
    kind: 'institutional_protocol',
    version: '2.1',
    publicationDate: '2026-06-18',
    accessedAt: '4 set 2026',
    reference: 'VIV-MED-02',
    scope: 'Peso, altura, cintura, condições de medida e comparabilidade.',
    relevantClaims: 'Exige origem, data, método, unidade e limitação antes de comparar medidas.',
    limitations: 'Padroniza qualidade do dado; não cria classificação ou conduta clínica.',
    evidenceQuality: 'EXPERT_CONSENSUS',
    applicableModuleIds: ['longitudinal_analysis'],
    status: 'active',
    addedBy: DOCTOR_NAME,
    updatedAt: '21 jun 2026 · 09:35',
    updatedAtIso: '2026-06-21T09:35:00-03:00',
  },
  {
    id: 'knowledge-viv-lab-01',
    title: 'Protocolo de leitura e validação de exames laboratoriais',
    organization: 'Comitê clínico VIVANCE',
    kind: 'institutional_protocol',
    version: '1.0',
    publicationDate: '2026-06-20',
    accessedAt: '4 set 2026',
    reference: 'VIV-LAB-01',
    scope: 'Extração, normalização, conferência e comparação de dados laboratoriais.',
    relevantClaims: 'Exige documento original, unidade, intervalo impresso, estado de revisão e exclusão explícita de campos ausentes.',
    limitations: 'Protocolo operacional fictício; não interpreta diagnóstico, risco ou conduta.',
    evidenceQuality: 'EXPERT_CONSENSUS',
    applicableModuleIds: ['exam_ingestion', 'exam_analysis'],
    status: 'active',
    addedBy: DOCTOR_NAME,
    updatedAt: '25 jun 2026 · 11:20',
    updatedAtIso: '2026-06-25T11:20:00-03:00',
  },
  {
    id: 'knowledge-viv-evi-07',
    title: 'Revisão de evidências sobre sono e acompanhamento',
    organization: 'Biblioteca clínica VIVANCE',
    kind: 'review',
    version: '1.4',
    publicationDate: '2026-07-30',
    accessedAt: '4 set 2026',
    reference: 'VIV-EVI-07',
    scope: 'Apoio à formulação de perguntas sobre sono e rotina.',
    relevantClaims: 'Resume achados para apoiar investigação clínica, sem inferir causalidade no paciente.',
    limitations: 'Síntese interna aguardando revisão da nova versão; não deve sustentar mensagem clínica final.',
    evidenceQuality: 'MODERATE',
    applicableModuleIds: ['longitudinal_analysis', 'visit_preparation', 'clinical_synthesis'],
    status: 'awaiting_review',
    addedBy: DOCTOR_NAME,
    updatedAt: '3 set 2026 · 17:20',
    updatedAtIso: '2026-09-03T17:20:00-03:00',
  },
];

const initialDataConnections: ClinicalDataConnection[] = [
  { id: 'approved_exams', label: 'Exames aprovados', description: 'Somente campos confirmados ou corrigidos pelo médico.', enabled: true },
  { id: 'checkins', label: 'Check-ins dos pacientes', description: 'Relato original e organização assistida permanecem separados.', enabled: true },
  { id: 'care_plans', label: 'Planos publicados', description: 'Apenas versões publicadas no acompanhamento.', enabled: true },
  { id: 'messages', label: 'Conversas', description: 'Desativado por padrão para reduzir o uso de texto livre.', enabled: false },
];

const initialCapabilities: AiCapability[] = [
  { id: 'organize_context', label: 'Organizar contexto longitudinal', description: 'Ordenar fontes por data, tipo e estado de revisão.', enabled: true },
  { id: 'compare_confirmed_data', label: 'Comparar dados confirmados', description: 'Calcular mudanças reproduzíveis entre dados aprovados.', enabled: true },
  { id: 'suggest_questions', label: 'Sugerir perguntas', description: 'Propor perguntas para investigação, nunca uma conduta.', enabled: true },
  { id: 'draft_summary', label: 'Preparar resumo', description: 'Criar rascunho rastreável para revisão médica.', enabled: true },
];

const initialModulePolicies: ClinicalAiModulePolicy[] = [
  {
    id: 'exam_ingestion',
    label: 'Leitura de exames',
    description: 'Extrai e normaliza campos mantendo o documento original ao lado.',
    feedbackGoal: 'Entregar ao médico dados conferíveis, sem preencher lacunas nem interpretar clinicamente.',
    primaryKnowledgeSourceId: 'knowledge-viv-lab-01',
    requiredDataConnectionIds: ['approved_exams'],
    allowedCapabilityIds: ['organize_context'],
    enabled: true,
    requiresMedicalReview: true,
    blockingConditions: ['Documento original indisponível', 'Campo sem unidade ou origem'],
  },
  {
    id: 'exam_analysis',
    label: 'Análise de exames',
    description: 'Compara somente dados aprovados e cálculos reproduzíveis.',
    feedbackGoal: 'Destacar mudanças, flags do laudo, lacunas e conflitos para decisão médica.',
    primaryKnowledgeSourceId: 'knowledge-viv-lab-01',
    requiredDataConnectionIds: ['approved_exams'],
    allowedCapabilityIds: ['compare_confirmed_data', 'suggest_questions'],
    enabled: true,
    requiresMedicalReview: true,
    blockingConditions: ['Exame ainda não revisado', 'Unidades incompatíveis', 'Diretriz inativa'],
  },
  {
    id: 'longitudinal_analysis',
    label: 'Análise longitudinal',
    description: 'Organiza tendências comparáveis entre períodos e tipos de dado.',
    feedbackGoal: 'Separar mudança objetiva, hipótese, lacuna e conflito sem declarar causalidade.',
    primaryKnowledgeSourceId: 'knowledge-viv-clin-03',
    requiredDataConnectionIds: ['approved_exams', 'checkins'],
    allowedCapabilityIds: ['organize_context', 'compare_confirmed_data'],
    enabled: true,
    requiresMedicalReview: true,
    blockingConditions: ['Origem de medida incompatível', 'Período insuficiente', 'Diretriz inativa'],
  },
  {
    id: 'visit_preparation',
    label: 'Preparação da consulta',
    description: 'Prioriza fatos confirmados, pendências e perguntas para a conversa.',
    feedbackGoal: 'Reduzir tempo de preparação sem decidir prioridade clínica ou conduta.',
    primaryKnowledgeSourceId: 'knowledge-viv-clin-03',
    requiredDataConnectionIds: ['approved_exams', 'checkins', 'care_plans'],
    allowedCapabilityIds: ['organize_context', 'suggest_questions'],
    enabled: true,
    requiresMedicalReview: true,
    blockingConditions: ['Paciente sem autorização', 'Fontes ainda não revisadas'],
  },
  {
    id: 'clinical_synthesis',
    label: 'Síntese clínica',
    description: 'Prepara um rascunho rastreável a partir de fatos já revisados.',
    feedbackGoal: 'Produzir uma síntese editável, com fontes, limites e lacunas explícitos.',
    primaryKnowledgeSourceId: 'knowledge-viv-clin-03',
    requiredDataConnectionIds: ['approved_exams', 'checkins', 'care_plans'],
    allowedCapabilityIds: ['organize_context', 'draft_summary'],
    enabled: true,
    requiresMedicalReview: true,
    blockingConditions: ['Dado crítico pendente', 'Conflito não resolvido', 'Diretriz inativa'],
  },
];

function cloneConnections(connections: ClinicalDataConnection[]) {
  return connections.map((connection) => ({ ...connection }));
}

function cloneCapabilities(capabilities: AiCapability[]) {
  return capabilities.map((capability) => ({ ...capability }));
}

function cloneModules(modules: ClinicalAiModulePolicy[]) {
  return modules.map((module) => ({
    ...module,
    requiredDataConnectionIds: [...module.requiredDataConnectionIds],
    allowedCapabilityIds: [...module.allowedCapabilityIds],
    blockingConditions: [...module.blockingConditions],
  }));
}

function getClinicalModuleBlockers(
  modulePolicy: ClinicalAiModulePolicy,
  dataConnections: ClinicalDataConnection[],
  capabilities: AiCapability[],
  knowledgeSources: ClinicalKnowledgeSource[],
) {
  if (!modulePolicy.enabled) return [];

  const blockers: string[] = [];
  const source = knowledgeSources.find((item) => item.id === modulePolicy.primaryKnowledgeSourceId);
  if (!source || source.status !== 'active' || !source.applicableModuleIds.includes(modulePolicy.id)) {
    blockers.push('diretriz principal ausente, inativa ou incompatível');
  }

  for (const connectionId of modulePolicy.requiredDataConnectionIds) {
    const connection = dataConnections.find((item) => item.id === connectionId);
    if (!connection?.enabled) blockers.push(`dado obrigatório desligado: ${connection?.label ?? connectionId}`);
  }

  for (const capabilityId of modulePolicy.allowedCapabilityIds) {
    const capability = capabilities.find((item) => item.id === capabilityId);
    if (!capability?.enabled) blockers.push(`capacidade obrigatória desligada: ${capability?.label ?? capabilityId}`);
  }

  return blockers;
}

const initialActiveConfiguration: ClinicalAiConfigurationVersion = {
  id: 'ai-policy-v3',
  version: 3,
  status: 'active',
  dataConnections: cloneConnections(initialDataConnections),
  capabilities: cloneCapabilities(initialCapabilities),
  modules: cloneModules(initialModulePolicies),
  publishedAt: '1 jul 2026 · 09:12',
  publishedAtIso: '2026-07-01T09:12:00-03:00',
  publishedBy: DOCTOR_NAME,
};

function seedGovernance(moduleId: ClinicalAiModuleId, governedAt: string, governedAtIso: string): ClinicalGovernanceSnapshot {
  const modulePolicy = initialModulePolicies.find((item) => item.id === moduleId);
  const source = initialKnowledgeSources.find((item) => item.id === modulePolicy?.primaryKnowledgeSourceId);
  if (!modulePolicy || !source) throw new Error(`Configuração inicial incompleta para ${moduleId}.`);
  return {
    moduleId,
    moduleLabel: modulePolicy.label,
    configurationVersion: initialActiveConfiguration.version,
    knowledgeSourceId: source.id,
    knowledgeReference: source.reference,
    knowledgeVersion: source.version,
    sourceFingerprint: `${source.id}:${source.version}`,
    governedAt,
    governedAtIso,
  };
}

function createSeedExam(input: {
  id: string;
  patientId: string;
  title: string;
  fileName: string;
  examDate: string;
  receivedAt: string;
  receivedAtIso: string;
  note: string;
  reviewStatus: ExamReviewStatus;
  reviewedAt?: string;
  reviewedAtIso?: string;
  values: { glucose: string; hba1c: string; cholesterol: string; hdl: string; insulin?: string };
}): ClinicalExamDocument {
  const patientName = getDemoPatient(input.patientId)?.name ?? 'Paciente';
  const reviewed = input.reviewStatus === 'approved';
  const governance = [seedGovernance('exam_ingestion', input.receivedAt, input.receivedAtIso)];
  if (reviewed) {
    governance.push(seedGovernance(
      'exam_analysis',
      input.reviewedAt ?? input.receivedAt,
      input.reviewedAtIso ?? input.receivedAtIso,
    ));
  }
  return {
    id: input.id,
    patientId: input.patientId,
    patientName,
    doctorName: DOCTOR_NAME,
    title: input.title,
    fileName: input.fileName,
    laboratory: 'Laboratório Campo Azul',
    examDate: input.examDate,
    receivedAt: input.receivedAt,
    receivedAtIso: input.receivedAtIso,
    submittedBy: 'patient',
    submittedByLabel: patientName,
    note: input.note,
    originalAvailable: true,
    extractionVersion: 1,
    reviewStatus: input.reviewStatus,
    reviewVersion: reviewed ? 1 : 0,
    reviewedAt: reviewed ? input.reviewedAt ?? input.receivedAt : null,
    reviewedAtIso: reviewed ? input.reviewedAtIso ?? input.receivedAtIso : null,
    reviewedBy: reviewed ? DOCTOR_NAME : null,
    governance,
    fields: createFields(input.values, reviewed ? 'confirmed' : 'pending')
      .map((field) => ({ ...field, id: `${input.id}-${field.code}` })),
  };
}

const initialExams: ClinicalExamDocument[] = [
  createSeedExam({ id: 'exam-marina-2026-07-18', patientId: DEFAULT_PATIENT_ID, title: 'Painel laboratorial · julho', fileName: 'laboratorio-campo-azul-18-07-2026.pdf', examDate: '2026-07-18', receivedAt: '18 jul 2026 · 16:42', receivedAtIso: '2026-07-18T16:42:00-03:00', reviewedAt: '19 jul 2026 · 09:18', reviewedAtIso: '2026-07-19T09:18:00-03:00', note: 'Exame solicitado no início do acompanhamento.', reviewStatus: 'approved', values: { glucose: '101', hba1c: '5,8', cholesterol: '208', hdl: '47' } }),
  createSeedExam({ id: 'exam-marina-2026-08-14', patientId: DEFAULT_PATIENT_ID, title: 'Painel laboratorial · agosto', fileName: 'laboratorio-campo-azul-14-08-2026.pdf', examDate: '2026-08-14', receivedAt: '14 ago 2026 · 18:07', receivedAtIso: '2026-08-14T18:07:00-03:00', reviewedAt: '15 ago 2026 · 08:54', reviewedAtIso: '2026-08-15T08:54:00-03:00', note: 'Controle laboratorial combinado no retorno.', reviewStatus: 'approved', values: { glucose: '96', hba1c: '5,5', cholesterol: '196', hdl: '49' } }),
  createSeedExam({ id: 'exam-marina-2026-09-01', patientId: DEFAULT_PATIENT_ID, title: 'Painel laboratorial · setembro', fileName: 'laboratorio-campo-azul-01-09-2026.pdf', examDate: '2026-09-01', receivedAt: '1 set 2026 · 18:26', receivedAtIso: '2026-09-01T18:26:00-03:00', note: 'Exame enviado pela paciente antes da consulta.', reviewStatus: 'awaiting_review', values: { glucose: '94', hba1c: '5,4', cholesterol: '190', hdl: '50' } }),
  createSeedExam({ id: 'exam-ana-2026-08-25', patientId: 'pac-demo-002', title: 'Painel laboratorial · agosto', fileName: 'laboratorio-campo-azul-25-08-2026.pdf', examDate: '2026-08-25', receivedAt: '25 ago 2026 · 12:14', receivedAtIso: '2026-08-25T12:14:00-03:00', reviewedAt: '26 ago 2026 · 08:40', reviewedAtIso: '2026-08-26T08:40:00-03:00', note: 'Exame compartilhado para o retorno de acompanhamento.', reviewStatus: 'approved', values: { glucose: '89', hba1c: '5,2', cholesterol: '178', hdl: '56', insulin: '8,6' } }),
  createSeedExam({ id: 'exam-paulo-2026-09-03', patientId: 'pac-demo-003', title: 'Painel laboratorial · setembro', fileName: 'laboratorio-campo-azul-03-09-2026.pdf', examDate: '2026-09-03', receivedAt: '3 set 2026 · 19:05', receivedAtIso: '2026-09-03T19:05:00-03:00', note: 'Documento recebido e ainda não revisado.', reviewStatus: 'awaiting_review', values: { glucose: '106', hba1c: '5,9', cholesterol: '214', hdl: '42' } }),
  createSeedExam({ id: 'exam-lucia-2026-08-22', patientId: 'pac-demo-005', title: 'Painel laboratorial · agosto', fileName: 'laboratorio-campo-azul-22-08-2026.pdf', examDate: '2026-08-22', receivedAt: '22 ago 2026 · 10:30', receivedAtIso: '2026-08-22T10:30:00-03:00', reviewedAt: '22 ago 2026 · 16:15', reviewedAtIso: '2026-08-22T16:15:00-03:00', note: 'Controle registrado durante o acompanhamento.', reviewStatus: 'approved', values: { glucose: '92', hba1c: '5,3', cholesterol: '184', hdl: '53' } }),
];

const initialCareRelationships: CareRelationship[] = demoPatients.map((patient) => ({
  id: `relationship-${patient.id}-${DOCTOR_ID}`,
  clinicId: CLINIC_ID,
  patientId: patient.id,
  patientName: patient.name,
  doctorId: DOCTOR_ID,
  doctorName: DOCTOR_NAME,
  encounterId: getDefaultEncounterId(patient.id),
  status: 'active',
  connectedAt: '1 jul 2026',
}));

const contextSeed: Record<string, Omit<PatientAiContext, 'patientId' | 'relationshipId'>> = {
  'pac-demo-001': { status: 'review_required', authorizationStatus: 'authorized', reason: 'Novo exame aguarda revisão médica.', lastProcessedAt: '1 set 2026 · 18:27', lastProcessedAtIso: '2026-09-01T18:27:00-03:00', appliedConfigurationVersion: 3 },
  'pac-demo-002': { status: 'ready', authorizationStatus: 'authorized', reason: 'Dados aprovados e contexto disponível.', lastProcessedAt: '26 ago 2026 · 08:42', lastProcessedAtIso: '2026-08-26T08:42:00-03:00', appliedConfigurationVersion: 3 },
  'pac-demo-003': { status: 'review_required', authorizationStatus: 'authorized', reason: 'Exame recebido e ainda fora das análises.', lastProcessedAt: null, lastProcessedAtIso: null, appliedConfigurationVersion: null },
  'pac-demo-004': { status: 'insufficient_data', authorizationStatus: 'authorized', reason: 'Cadastro inicial sem dados aprovados suficientes.', lastProcessedAt: null, lastProcessedAtIso: null, appliedConfigurationVersion: null },
  'pac-demo-005': { status: 'ready', authorizationStatus: 'authorized', reason: 'Contexto atualizado com dados revisados.', lastProcessedAt: '22 ago 2026 · 16:18', lastProcessedAtIso: '2026-08-22T16:18:00-03:00', appliedConfigurationVersion: 3 },
  'pac-demo-006': { status: 'not_authorized', authorizationStatus: 'pending', reason: 'A autorização específica para uso da IA ainda não foi registrada.', lastProcessedAt: null, lastProcessedAtIso: null, appliedConfigurationVersion: null },
  'pac-demo-007': { status: 'ready', authorizationStatus: 'authorized', reason: 'Check-ins e plano publicado disponíveis para preparação.', lastProcessedAt: '2 set 2026 · 09:10', lastProcessedAtIso: '2026-09-02T09:10:00-03:00', appliedConfigurationVersion: 3 },
  'pac-demo-008': { status: 'paused', authorizationStatus: 'authorized', reason: 'Uso da IA pausado neste acompanhamento pelo médico.', lastProcessedAt: '28 ago 2026 · 15:20', lastProcessedAtIso: '2026-08-28T15:20:00-03:00', appliedConfigurationVersion: 3, statusBeforePause: 'ready', reasonBeforePause: 'Contexto atualizado com dados revisados.' },
  'pac-demo-009': { status: 'insufficient_data', authorizationStatus: 'authorized', reason: 'Há vínculo, mas ainda não existem dados revisados.', lastProcessedAt: null, lastProcessedAtIso: null, appliedConfigurationVersion: null },
  'pac-demo-010': { status: 'ready', authorizationStatus: 'authorized', reason: 'Contexto longitudinal disponível para o médico.', lastProcessedAt: '3 set 2026 · 10:05', lastProcessedAtIso: '2026-09-03T10:05:00-03:00', appliedConfigurationVersion: 3 },
};

const initialPatientContexts: PatientAiContext[] = demoPatients.map((patient) => ({
  patientId: patient.id,
  relationshipId: `relationship-${patient.id}-${DOCTOR_ID}`,
  ...contextSeed[patient.id],
}));

const initialGovernedArtifacts: ClinicalGovernedArtifact[] = [
  {
    id: 'artifact-marina-longitudinal-v1',
    patientId: DEFAULT_PATIENT_ID,
    moduleId: 'longitudinal_analysis',
    version: 1,
    status: 'generated',
    governance: seedGovernance('longitudinal_analysis', '15 ago 2026 · 09:02', '2026-08-15T09:02:00-03:00'),
    sourceIds: ['exam-marina-2026-07-18', 'exam-marina-2026-08-14', 'src-demo-checkin-013'],
    contentFingerprint: fingerprintClinicalContent('marina-longitudinal-jul-ago-v1'),
    createdAt: '15 ago 2026 · 09:02',
    createdAtIso: '2026-08-15T09:02:00-03:00',
    createdBy: 'Motor clínico demonstrativo',
  },
];

const initialState: ClinicalIntelligenceState = {
  schemaVersion: 2,
  clinicId: CLINIC_ID,
  exams: initialExams,
  knowledgeSources: initialKnowledgeSources,
  careRelationships: initialCareRelationships,
  patientContexts: initialPatientContexts,
  governedArtifacts: initialGovernedArtifacts,
  activeConfiguration: initialActiveConfiguration,
  configurationDraft: {
    baseVersion: initialActiveConfiguration.version,
    dirty: false,
    dataConnections: cloneConnections(initialActiveConfiguration.dataConnections),
    capabilities: cloneCapabilities(initialActiveConfiguration.capabilities),
    modules: cloneModules(initialActiveConfiguration.modules),
  },
  configurationHistory: [initialActiveConfiguration],
  auditEvents: [
    {
      id: 'audit-marina-longitudinal-generated',
      action: 'governed-output-recorded',
      actor: 'Motor clínico demonstrativo',
      occurredAt: '15 ago 2026 · 09:02',
      occurredAtIso: '2026-08-15T09:02:00-03:00',
      summary: 'Análise longitudinal demonstrativa registrada sob configuração v3.',
      relatedId: 'artifact-marina-longitudinal-v1',
      patientId: DEFAULT_PATIENT_ID,
      moduleId: 'longitudinal_analysis',
      configurationVersion: 3,
    },
    {
      id: 'audit-exam-september-received',
      action: 'exam-received',
      actor: getDemoPatient(DEFAULT_PATIENT_ID)?.name ?? 'Marina Costa',
      occurredAt: '1 set 2026 · 18:26',
      occurredAtIso: '2026-09-01T18:26:00-03:00',
      summary: 'Painel laboratorial de setembro compartilhado com a equipe.',
      relatedId: 'exam-marina-2026-09-01',
      patientId: DEFAULT_PATIENT_ID,
      moduleId: 'exam_ingestion',
      configurationVersion: 3,
    },
    {
      id: 'audit-knowledge-review-added',
      action: 'knowledge-added',
      actor: DOCTOR_NAME,
      occurredAt: '3 set 2026 · 17:20',
      occurredAtIso: '2026-09-03T17:20:00-03:00',
      summary: 'Nova versão da revisão sobre sono adicionada e mantida fora do contexto até revisão.',
      relatedId: 'knowledge-viv-evi-07',
    },
  ],
};

const ClinicalIntelligenceContext = createContext<ClinicalIntelligenceContextValue | null>(null);

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date).replace(',', ' ·');
}

function fingerprintClinicalContent(content: string) {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function createAuditEvent(
  action: ClinicalIntelligenceAuditEvent['action'],
  actor: ClinicalIntelligenceAuditEvent['actor'],
  summary: string,
  relatedId: string,
  metadata: Partial<Pick<ClinicalIntelligenceAuditEvent, 'patientId' | 'moduleId' | 'configurationVersion'>> = {},
): ClinicalIntelligenceAuditEvent {
  const now = new Date();
  return {
    id: `clinical-audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    actor,
    occurredAt: formatDateTime(now),
    occurredAtIso: now.toISOString(),
    summary,
    relatedId,
    ...metadata,
  };
}

function defaultApplicableModulesForSource(source: Pick<ClinicalKnowledgeSource, 'kind'>): ClinicalAiModuleId[] {
  if (source.kind === 'institutional_protocol') {
    return ['longitudinal_analysis', 'visit_preparation', 'clinical_synthesis'];
  }
  return ['longitudinal_analysis', 'visit_preparation', 'clinical_synthesis'];
}

function normalizeKnowledgeSources(sources: ClinicalKnowledgeSource[]) {
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const normalize = (source: ClinicalKnowledgeSource, seed?: ClinicalKnowledgeSource): ClinicalKnowledgeSource => seed
    ? {
        ...source,
        ...seed,
        status: source.status,
        updatedAt: source.updatedAt,
        updatedAtIso: source.updatedAtIso,
        applicableModuleIds: [...seed.applicableModuleIds],
      }
    : {
        ...source,
        applicableModuleIds: Array.isArray(source.applicableModuleIds) && source.applicableModuleIds.length > 0
          ? [...source.applicableModuleIds]
          : defaultApplicableModulesForSource(source),
      };
  return [
    ...initialKnowledgeSources.map((seed) => {
      const current = sourceById.get(seed.id);
      return current ? normalize(current, seed) : seed;
    }),
    ...sources
      .filter((source) => !initialKnowledgeSources.some((seed) => seed.id === source.id))
      .map((source) => normalize(source)),
  ];
}

function mergeExamSeeds(exams: ClinicalExamDocument[]) {
  const examById = new Map(exams.map((exam) => [exam.id, exam]));
  return [
    ...initialExams.map((seed) => examById.get(seed.id) ?? seed),
    ...exams.filter((exam) => !initialExams.some((seed) => seed.id === exam.id)),
  ].map((exam) => ({
    ...exam,
    patientName: getDemoPatient(exam.patientId)?.name ?? exam.patientName,
    governance: Array.isArray(exam.governance) ? exam.governance : [],
  }));
}

function mergeArtifactSeeds(artifacts: ClinicalGovernedArtifact[]) {
  const artifactById = new Map(artifacts.map((artifact) => [artifact.id, artifact]));
  return [
    ...initialGovernedArtifacts.map((seed) => artifactById.get(seed.id) ?? seed),
    ...artifacts.filter((artifact) => !initialGovernedArtifacts.some((seed) => seed.id === artifact.id)),
  ];
}

function normalizePatientContexts(contexts: PatientAiContext[], exams: ClinicalExamDocument[]) {
  const contextByPatientId = new Map(contexts.map((context) => [context.patientId, context]));
  return initialPatientContexts.map((seed) => {
    const current = contextByPatientId.get(seed.patientId) ?? seed;
    if (current.authorizationStatus !== 'authorized') {
      return {
        ...current,
        status: 'not_authorized' as const,
        reason: 'A autorização específica para uso da IA ainda não foi registrada.',
      };
    }
    if (current.status === 'paused') return current;
    const patientExams = exams.filter((exam) => exam.patientId === current.patientId);
    const hasPending = patientExams.some((exam) => exam.reviewStatus === 'awaiting_review');
    if (hasPending) {
      return {
        ...current,
        status: 'review_required' as const,
        reason: 'Há exame aguardando revisão médica e ainda fora das análises.',
      };
    }
    const latestGovernedExam = patientExams
      .flatMap((exam) => exam.governance.filter((snapshot) => snapshot.moduleId === 'exam_analysis'))
      .toSorted((left, right) => right.governedAtIso.localeCompare(left.governedAtIso))[0];
    if (patientExams.some((exam) => exam.reviewStatus === 'approved') && latestGovernedExam) {
      return {
        ...current,
        status: 'ready' as const,
        reason: 'Dados aprovados e contexto atualizado sob a diretriz registrada.',
        lastProcessedAt: latestGovernedExam.governedAt,
        lastProcessedAtIso: latestGovernedExam.governedAtIso,
        appliedConfigurationVersion: latestGovernedExam.configurationVersion,
      };
    }
    return current;
  });
}

function isPersistedStateV2(value: unknown): value is ClinicalIntelligenceState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<ClinicalIntelligenceState>;
  return state.schemaVersion === 2
    && Array.isArray(state.exams)
    && Array.isArray(state.knowledgeSources)
    && Array.isArray(state.careRelationships)
    && Array.isArray(state.patientContexts)
    && Boolean(state.activeConfiguration)
    && Boolean(state.configurationDraft)
    && Array.isArray(state.activeConfiguration?.dataConnections)
    && Array.isArray(state.activeConfiguration?.capabilities)
    && Array.isArray(state.activeConfiguration?.modules)
    && Array.isArray(state.configurationDraft?.dataConnections)
    && Array.isArray(state.configurationDraft?.capabilities)
    && Array.isArray(state.configurationDraft?.modules)
    && Array.isArray(state.configurationHistory)
    && Array.isArray(state.auditEvents)
    && typeof state.activeConfiguration?.version === 'number';
}

function migratePersistedState(value: unknown): ClinicalIntelligenceState | null {
  if (isPersistedStateV2(value)) {
    const exams = mergeExamSeeds(value.exams);
    return {
      ...value,
      exams,
      knowledgeSources: normalizeKnowledgeSources(value.knowledgeSources),
      patientContexts: normalizePatientContexts(value.patientContexts, exams),
      governedArtifacts: mergeArtifactSeeds(Array.isArray(value.governedArtifacts) ? value.governedArtifacts : []),
    };
  }
  if (!value || typeof value !== 'object') return null;
  const legacy = value as {
    schemaVersion?: number;
    exams?: Array<ClinicalExamDocument & { governance?: ClinicalGovernanceSnapshot[] }>;
    knowledgeSources?: ClinicalKnowledgeSource[];
    dataConnections?: ClinicalDataConnection[];
    capabilities?: AiCapability[];
    configurationVersion?: number;
    configurationUpdatedAt?: string;
    auditEvents?: ClinicalIntelligenceAuditEvent[];
  };
  if (
    legacy.schemaVersion !== 1
    || !Array.isArray(legacy.exams)
    || !Array.isArray(legacy.knowledgeSources)
    || !Array.isArray(legacy.dataConnections)
    || !Array.isArray(legacy.capabilities)
    || !Array.isArray(legacy.auditEvents)
  ) return null;

  const mergedKnowledge = normalizeKnowledgeSources(legacy.knowledgeSources);
  const activeConfiguration: ClinicalAiConfigurationVersion = {
    ...initialActiveConfiguration,
    id: `ai-policy-v${legacy.configurationVersion ?? 3}`,
    version: legacy.configurationVersion ?? 3,
    dataConnections: cloneConnections(legacy.dataConnections),
    capabilities: cloneCapabilities(legacy.capabilities),
    modules: cloneModules(initialModulePolicies),
    publishedAt: legacy.configurationUpdatedAt ?? initialActiveConfiguration.publishedAt,
  };
  const migratedExams = mergeExamSeeds(legacy.exams.map((exam) => ({
    ...exam,
    patientName: getDemoPatient(exam.patientId)?.name ?? exam.patientName,
    governance: Array.isArray(exam.governance) && exam.governance.length > 0
      ? exam.governance
      : [],
  })));

  return {
    ...initialState,
    exams: migratedExams,
    knowledgeSources: mergedKnowledge,
    activeConfiguration,
    configurationDraft: {
      baseVersion: activeConfiguration.version,
      dirty: false,
      dataConnections: cloneConnections(activeConfiguration.dataConnections),
      capabilities: cloneCapabilities(activeConfiguration.capabilities),
      modules: cloneModules(activeConfiguration.modules),
    },
    configurationHistory: [activeConfiguration],
    governedArtifacts: mergeArtifactSeeds([]),
    patientContexts: normalizePatientContexts(initialPatientContexts, migratedExams),
    auditEvents: legacy.auditEvents,
  };
}

function createGovernanceSnapshot(
  state: ClinicalIntelligenceState,
  moduleId: ClinicalAiModuleId,
  date = new Date(),
): ClinicalGovernanceSnapshot | null {
  const modulePolicy = state.activeConfiguration.modules.find((item) => item.id === moduleId && item.enabled);
  if (!modulePolicy) return null;
  const source = state.knowledgeSources.find(
    (item) => item.id === modulePolicy.primaryKnowledgeSourceId
      && item.status === 'active'
      && item.applicableModuleIds.includes(moduleId),
  );
  const blockers = getClinicalModuleBlockers(
    modulePolicy,
    state.activeConfiguration.dataConnections,
    state.activeConfiguration.capabilities,
    state.knowledgeSources,
  );
  if (!source || blockers.length > 0) return null;
  return {
    moduleId,
    moduleLabel: modulePolicy.label,
    configurationVersion: state.activeConfiguration.version,
    knowledgeSourceId: source.id,
    knowledgeReference: source.reference,
    knowledgeVersion: source.version,
    sourceFingerprint: `${source.id}:${source.version}`,
    governedAt: formatDateTime(date),
    governedAtIso: date.toISOString(),
  };
}

function createPatientGovernanceSnapshot(
  state: ClinicalIntelligenceState,
  patientId: string,
  moduleId: ClinicalAiModuleId,
  date = new Date(),
) {
  const patientContext = state.patientContexts.find((item) => item.patientId === patientId);
  const careRelationship = state.careRelationships.find((item) => (
    item.id === patientContext?.relationshipId
    && item.patientId === patientId
    && item.clinicId === state.clinicId
    && item.status === 'active'
  ));
  const canUseAssistance = patientContext?.authorizationStatus === 'authorized'
    && Boolean(careRelationship)
    && patientContext.status !== 'not_authorized'
    && patientContext.status !== 'paused'
    && (
      moduleId === 'exam_ingestion'
      || moduleId === 'exam_analysis'
      || patientContext.status === 'ready'
      || patientContext.status === 'review_required'
    );
  return canUseAssistance ? createGovernanceSnapshot(state, moduleId, date) : null;
}

function getSyntheticExamValues(patientId: string) {
  const patientNumber = Number(patientId.match(/(\d+)$/)?.[1] ?? 1);
  return {
    glucose: String(88 + ((patientNumber * 3) % 19)),
    hba1c: `5,${2 + (patientNumber % 6)}`,
    cholesterol: String(174 + (patientNumber * 4)),
    hdl: String(45 + (patientNumber % 11)),
  };
}

function createPatientExam(input: SharePatientExamInput, state: ClinicalIntelligenceState): ClinicalExamDocument {
  const now = new Date();
  const id = `exam-${input.patientId}-${Date.now()}`;
  const relationship = state.careRelationships.find((item) => item.patientId === input.patientId && item.status === 'active');
  const patientName = getDemoPatient(input.patientId)?.name ?? relationship?.patientName ?? 'Paciente';
  const doctorName = relationship?.doctorName ?? DOCTOR_NAME;
  const governance = createPatientGovernanceSnapshot(state, input.patientId, 'exam_ingestion', now);
  return {
    id,
    patientId: input.patientId,
    patientName,
    doctorName,
    title: 'Painel laboratorial recebido',
    fileName: `painel-laboratorial-${input.examDate}.pdf`,
    laboratory: 'Laboratório Campo Azul',
    examDate: input.examDate,
    receivedAt: formatDateTime(now),
    receivedAtIso: now.toISOString(),
    submittedBy: 'patient',
    submittedByLabel: patientName,
    note: input.note,
    originalAvailable: true,
    extractionVersion: governance ? 1 : 0,
    reviewStatus: 'awaiting_review',
    reviewVersion: 0,
    reviewedAt: null,
    reviewedAtIso: null,
    reviewedBy: null,
    governance: governance ? [governance] : [],
    fields: governance
      ? createFields(getSyntheticExamValues(input.patientId), 'pending')
        .map((field) => ({ ...field, id: `${id}-${field.code}` }))
      : [],
  };
}

export function ClinicalIntelligenceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ClinicalIntelligenceState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        const restored = migratePersistedState(parsed);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hidrata o estado compartilhado persistido no navegador
        if (restored) setState(restored);
      }
    } catch {
      // O protótipo continua com os dados iniciais quando o armazenamento local não está disponível.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // A experiência permanece funcional em memória.
    }
  }, [hydrated, state]);

  const value = useMemo<ClinicalIntelligenceContextValue>(() => ({
    ...state,
    hydrated,
    dataConnections: state.configurationDraft.dataConnections,
    capabilities: state.configurationDraft.capabilities,
    modulePolicies: state.configurationDraft.modules,
    configurationVersion: state.activeConfiguration.version,
    configurationUpdatedAt: state.activeConfiguration.publishedAt,
    hasUnpublishedChanges: state.configurationDraft.dirty,
    sharePatientExam: (input) => {
      const created = createPatientExam(input, state);
      const auditEvent = createAuditEvent(
        'exam-received',
        created.patientName,
        `${created.title} compartilhado com ${created.doctorName}.`,
        created.id,
        {
          patientId: created.patientId,
          moduleId: 'exam_ingestion',
          configurationVersion: created.governance[0]?.configurationVersion,
        },
      );
      setState((current) => ({
        ...current,
        exams: [...current.exams, created],
        patientContexts: current.patientContexts.map((context) => (
          context.patientId === created.patientId
          && context.authorizationStatus === 'authorized'
          && context.status !== 'paused'
            ? {
                ...context,
                status: 'review_required',
                reason: 'Novo exame aguarda revisão médica e ainda está fora das análises.',
              }
            : context
        )),
        auditEvents: [...current.auditEvents, auditEvent],
      }));
      return created;
    },
    updateExamField: (examId, fieldId, patch) => {
      setState((current) => {
        const exam = current.exams.find((item) => item.id === examId);
        if (!exam || exam.reviewStatus === 'approved') return current;
        const nextExams = current.exams.map((item) => {
          if (item.id !== examId) return item;
          return {
            ...item,
            fields: item.fields.map((field) => {
              if (field.id !== fieldId) return field;
              const next: ClinicalExamField = { ...field, ...patch };
              const changed = next.value !== field.rawValue || next.unit !== field.rawUnit;
              const nextStatus: ExamFieldStatus = !next.included
                ? 'not_found'
                : changed
                  ? 'corrected'
                  : 'pending';
              return {
                ...next,
                status: nextStatus,
              };
            }),
          };
        });
        return { ...current, exams: nextExams };
      });
    },
    approveExam: (examId) => {
      const currentExam = state.exams.find((item) => item.id === examId);
      if (!currentExam || currentExam.reviewStatus === 'approved') return;
      const fieldsToApprove = currentExam.fields.filter((field) => field.included);
      const isManualDocumentReview = currentExam.extractionVersion === 0 && currentExam.fields.length === 0;
      if (
        !isManualDocumentReview
        && (
          fieldsToApprove.length === 0
          || fieldsToApprove.some((field) => !field.value.trim() || !field.unit.trim() || field.sourcePage < 1)
        )
      ) {
        throw new Error('Revise valor, unidade e página dos campos incluídos antes de aprovar.');
      }
      setState((current) => {
        const exam = current.exams.find((item) => item.id === examId);
        if (!exam || exam.reviewStatus === 'approved') return current;
        const includedFields = exam.fields.filter((field) => field.included);
        const now = new Date();
        const isManualDocumentReview = exam.extractionVersion === 0 && exam.fields.length === 0;
        const governance = isManualDocumentReview
          ? null
          : createPatientGovernanceSnapshot(current, exam.patientId, 'exam_analysis', now);
        const hasOtherPendingExam = current.exams.some((item) => (
          item.patientId === exam.patientId
          && item.id !== exam.id
          && item.reviewStatus === 'awaiting_review'
        ));
        const nextExam: ClinicalExamDocument = {
          ...exam,
          reviewStatus: 'approved',
          reviewVersion: exam.reviewVersion + 1,
          reviewedAt: formatDateTime(now),
          reviewedAtIso: now.toISOString(),
          reviewedBy: DOCTOR_NAME,
          governance: [
            ...exam.governance.filter((snapshot) => snapshot.moduleId !== 'exam_analysis'),
            ...(governance ? [governance] : []),
          ],
          fields: exam.fields.map((field) => ({
            ...field,
            status: !field.included
              ? 'not_found'
              : field.value !== field.rawValue || field.unit !== field.rawUnit
                ? 'corrected'
                : 'confirmed',
          })),
        };
        const correctedCount = includedFields.filter(
          (field) => field.value !== field.rawValue || field.unit !== field.rawUnit,
        ).length;
        const auditEvent = createAuditEvent(
          'exam-approved',
          DOCTOR_NAME,
          `${includedFields.length} campos aprovados para o histórico de ${exam.patientName}${correctedCount ? `, com ${correctedCount} correção médica` : ''}; campos ausentes permaneceram fora.`,
          examId,
          {
            patientId: exam.patientId,
            moduleId: 'exam_analysis',
            configurationVersion: governance?.configurationVersion,
          },
        );
        return {
          ...current,
          exams: current.exams.map((item) => item.id === examId ? nextExam : item),
          patientContexts: current.patientContexts.map((context) => (
            context.patientId === exam.patientId
            && context.authorizationStatus === 'authorized'
            && context.status !== 'paused'
              ? {
                  ...context,
                  status: governance && !hasOtherPendingExam ? 'ready' : 'review_required',
                  reason: !governance
                    ? 'Dados aprovados manualmente; análise assistida bloqueada até existir autorização e diretriz ativa.'
                    : hasOtherPendingExam
                      ? 'Há outro exame aguardando revisão médica e ainda fora das análises.'
                      : 'Dados aprovados e contexto atualizado sob a diretriz vigente.',
                  lastProcessedAt: governance?.governedAt ?? context.lastProcessedAt,
                  lastProcessedAtIso: governance?.governedAtIso ?? context.lastProcessedAtIso,
                  appliedConfigurationVersion: governance?.configurationVersion ?? context.appliedConfigurationVersion,
                }
              : context
          )),
          auditEvents: [...current.auditEvents, auditEvent],
        };
      });
    },
    addKnowledgeSource: (input) => {
      const now = new Date();
      const created: ClinicalKnowledgeSource = {
        id: `knowledge-${Date.now()}`,
        title: input.title.trim(),
        organization: input.organization.trim(),
        kind: input.kind,
        version: input.version.trim(),
        publicationDate: input.publicationDate,
        accessedAt: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(now),
        reference: input.reference.trim(),
        scope: 'Fonte adicionada pelo médico para avaliação antes de entrar no contexto da IA.',
        relevantClaims: input.relevantClaims.trim(),
        limitations: input.limitations.trim(),
        studyDesign: input.studyDesign.trim() || undefined,
        population: input.population.trim() || undefined,
        sampleSize: input.sampleSize.trim() || undefined,
        followUp: input.followUp.trim() || undefined,
        conflicts: input.conflicts.trim() || undefined,
        evidenceQuality: input.evidenceQuality,
        applicableModuleIds: [...input.applicableModuleIds],
        status: 'awaiting_review',
        addedBy: DOCTOR_NAME,
        updatedAt: formatDateTime(now),
        updatedAtIso: now.toISOString(),
      };
      const auditEvent = createAuditEvent(
        'knowledge-added',
        DOCTOR_NAME,
        `Fonte “${created.title}” adicionada fora do contexto da IA até revisão.`,
        created.id,
      );
      setState((current) => ({
        ...current,
        knowledgeSources: [...current.knowledgeSources, created],
        auditEvents: [...current.auditEvents, auditEvent],
      }));
      return created;
    },
    activateKnowledgeSource: (sourceId) => {
      setState((current) => {
        const source = current.knowledgeSources.find((item) => item.id === sourceId);
        if (!source || source.status !== 'awaiting_review') return current;
        const auditEvent = createAuditEvent(
          'knowledge-activated',
          DOCTOR_NAME,
          'Fonte revisada e disponibilizada para atribuição em um módulo da IA.',
          sourceId,
        );
        return {
          ...current,
          knowledgeSources: current.knowledgeSources.map((item) => item.id === sourceId
            ? { ...item, status: 'active', updatedAt: auditEvent.occurredAt, updatedAtIso: auditEvent.occurredAtIso }
            : item),
          auditEvents: [...current.auditEvents, auditEvent],
        };
      });
    },
    toggleKnowledgeSource: (sourceId) => {
      const source = state.knowledgeSources.find((item) => item.id === sourceId);
      const isUsedByActiveModule = state.activeConfiguration.modules.some((modulePolicy) => (
        modulePolicy.enabled && modulePolicy.primaryKnowledgeSourceId === sourceId
      ));
      if (!source || source.status === 'awaiting_review' || isUsedByActiveModule) return false;
      setState((current) => {
        const currentSource = current.knowledgeSources.find((item) => item.id === sourceId);
        const isStillUsed = current.activeConfiguration.modules.some((modulePolicy) => (
          modulePolicy.enabled && modulePolicy.primaryKnowledgeSourceId === sourceId
        ));
        if (!currentSource || currentSource.status === 'awaiting_review' || isStillUsed) return current;
        const nextStatus: KnowledgeSourceStatus = currentSource.status === 'active' ? 'paused' : 'active';
        const auditEvent = createAuditEvent(
          nextStatus === 'active' ? 'knowledge-activated' : 'knowledge-paused',
          DOCTOR_NAME,
          nextStatus === 'active' ? 'Fonte reativada no contexto da IA.' : 'Fonte pausada e retirada do contexto da IA.',
          sourceId,
        );
        return {
          ...current,
          knowledgeSources: current.knowledgeSources.map((item) => item.id === sourceId
            ? { ...item, status: nextStatus, updatedAt: auditEvent.occurredAt, updatedAtIso: auditEvent.occurredAtIso }
            : item),
          auditEvents: [...current.auditEvents, auditEvent],
        };
      });
      return true;
    },
    toggleDataConnection: (connectionId) => {
      setState((current) => ({
        ...current,
        configurationDraft: {
          ...current.configurationDraft,
          dirty: true,
          dataConnections: current.configurationDraft.dataConnections.map((connection) => connection.id === connectionId
            ? { ...connection, enabled: !connection.enabled }
            : connection),
        },
      }));
    },
    toggleCapability: (capabilityId) => {
      setState((current) => ({
        ...current,
        configurationDraft: {
          ...current.configurationDraft,
          dirty: true,
          capabilities: current.configurationDraft.capabilities.map((capability) => capability.id === capabilityId
            ? { ...capability, enabled: !capability.enabled }
            : capability),
        },
      }));
    },
    updateModulePolicy: (moduleId, patch) => {
      setState((current) => ({
        ...current,
        configurationDraft: {
          ...current.configurationDraft,
          dirty: true,
          modules: current.configurationDraft.modules.map((module) => module.id === moduleId
            ? { ...module, ...patch }
            : module),
        },
      }));
    },
    togglePatientAi: (patientId) => {
      setState((current) => {
        const context = current.patientContexts.find((item) => item.patientId === patientId);
        if (!context || context.authorizationStatus !== 'authorized') return current;
        const isResuming = context.status === 'paused';
        const inferredStatus: Exclude<PatientAiContextStatus, 'paused'> = current.exams.some((exam) => (
          exam.patientId === patientId && exam.reviewStatus === 'awaiting_review'
        ))
          ? 'review_required'
          : current.exams.some((exam) => exam.patientId === patientId && exam.reviewStatus === 'approved')
            ? 'ready'
            : 'insufficient_data';
        const nextStatus: PatientAiContextStatus = isResuming
          ? context.statusBeforePause ?? inferredStatus
          : 'paused';
        const nextReason = isResuming
          ? context.reasonBeforePause
            ?? (nextStatus === 'review_required'
              ? 'Há dados aguardando revisão médica.'
              : nextStatus === 'ready'
                ? 'Dados revisados e contexto disponível.'
                : 'Ainda não existem dados revisados suficientes.')
          : 'Uso da IA pausado neste acompanhamento pelo médico.';
        const auditEvent = createAuditEvent(
          'patient-context-updated',
          DOCTOR_NAME,
          nextStatus === 'paused'
            ? `Uso da IA pausado para ${getDemoPatient(patientId)?.name ?? 'o paciente'}.`
            : `Uso da IA retomado para ${getDemoPatient(patientId)?.name ?? 'o paciente'}.`,
          context.relationshipId,
          { patientId, configurationVersion: current.activeConfiguration.version },
        );
        return {
          ...current,
          patientContexts: current.patientContexts.map((item) => item.patientId === patientId
            ? {
                ...item,
                status: nextStatus,
                reason: nextReason,
                statusBeforePause: nextStatus === 'paused'
                  ? context.status as Exclude<PatientAiContextStatus, 'paused'>
                  : context.statusBeforePause,
                reasonBeforePause: nextStatus === 'paused' ? context.reason : context.reasonBeforePause,
              }
            : item),
          auditEvents: [...current.auditEvents, auditEvent],
        };
      });
    },
    recordGovernedArtifact: (input) => {
      const now = new Date();
      const governance = createPatientGovernanceSnapshot(state, input.patientId, input.moduleId, now);
      if (!governance) return null;
      const version = state.governedArtifacts.filter((artifact) => (
        artifact.patientId === input.patientId && artifact.moduleId === input.moduleId
      )).length + 1;
      const created: ClinicalGovernedArtifact = {
        id: `clinical-artifact-${input.patientId}-${input.moduleId}-${Date.now()}`,
        patientId: input.patientId,
        moduleId: input.moduleId,
        version,
        status: input.status,
        governance,
        sourceIds: [...new Set(input.sourceIds)],
        contentFingerprint: fingerprintClinicalContent(input.content),
        createdAt: governance.governedAt,
        createdAtIso: governance.governedAtIso,
        createdBy: input.status === 'reviewed' ? DOCTOR_NAME : 'Motor clínico demonstrativo',
      };
      const auditEvent = createAuditEvent(
        'governed-output-recorded',
        created.createdBy,
        `${governance.moduleLabel} registrada como artefato v${created.version} sob configuração v${governance.configurationVersion}.`,
        created.id,
        {
          patientId: input.patientId,
          moduleId: input.moduleId,
          configurationVersion: governance.configurationVersion,
        },
      );
      setState((current) => ({
        ...current,
        governedArtifacts: [...current.governedArtifacts, created],
        patientContexts: current.patientContexts.map((context) => context.patientId === input.patientId
          ? {
              ...context,
              lastProcessedAt: governance.governedAt,
              lastProcessedAtIso: governance.governedAtIso,
              appliedConfigurationVersion: governance.configurationVersion,
            }
          : context),
        auditEvents: [...current.auditEvents, auditEvent],
      }));
      return created;
    },
    saveConfiguration: () => {
      const hasBlockedModules = state.configurationDraft.modules.some((module) => (
        getClinicalModuleBlockers(
          module,
          state.configurationDraft.dataConnections,
          state.configurationDraft.capabilities,
          state.knowledgeSources,
        ).length > 0
      ));
      if (!state.configurationDraft.dirty || hasBlockedModules) return null;
      const nextVersion = state.activeConfiguration.version + 1;
      setState((current) => {
        if (!current.configurationDraft.dirty) return current;
        const currentHasBlockedModules = current.configurationDraft.modules.some((module) => (
          getClinicalModuleBlockers(
            module,
            current.configurationDraft.dataConnections,
            current.configurationDraft.capabilities,
            current.knowledgeSources,
          ).length > 0
        ));
        if (currentHasBlockedModules) return current;
        const publishedVersion = current.activeConfiguration.version + 1;
        const auditEvent = createAuditEvent(
          'configuration-saved',
          DOCTOR_NAME,
          `Configuração global da IA publicada como versão ${publishedVersion}.`,
          `ai-configuration-v${publishedVersion}`,
          { configurationVersion: publishedVersion },
        );
        const activeConfiguration: ClinicalAiConfigurationVersion = {
          id: `ai-policy-v${publishedVersion}`,
          version: publishedVersion,
          status: 'active',
          dataConnections: cloneConnections(current.configurationDraft.dataConnections),
          capabilities: cloneCapabilities(current.configurationDraft.capabilities),
          modules: cloneModules(current.configurationDraft.modules),
          publishedAt: auditEvent.occurredAt,
          publishedAtIso: auditEvent.occurredAtIso,
          publishedBy: DOCTOR_NAME,
        };
        return {
          ...current,
          activeConfiguration,
          configurationDraft: {
            baseVersion: publishedVersion,
            dirty: false,
            dataConnections: cloneConnections(activeConfiguration.dataConnections),
            capabilities: cloneCapabilities(activeConfiguration.capabilities),
            modules: cloneModules(activeConfiguration.modules),
          },
          configurationHistory: [
            ...current.configurationHistory.map((version) => ({ ...version, status: 'superseded' as const })),
            activeConfiguration,
          ],
          auditEvents: [...current.auditEvents, auditEvent],
        };
      });
      return nextVersion;
    },
  }), [hydrated, state]);

  return (
    <ClinicalIntelligenceContext.Provider value={value}>
      {children}
    </ClinicalIntelligenceContext.Provider>
  );
}

export function useClinicalIntelligence() {
  const context = useContext(ClinicalIntelligenceContext);
  if (!context) {
    throw new Error('useClinicalIntelligence deve ser usado dentro de ClinicalIntelligenceProvider.');
  }
  return context;
}
