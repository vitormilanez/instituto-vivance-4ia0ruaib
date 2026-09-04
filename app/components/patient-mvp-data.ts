import type { CareCheckIn } from './care-demo-types';

export type PatientMvpScenarioKind = 'filled' | 'pending';

export type PatientMvpPreparationStepId =
  | 'basics'
  | 'story'
  | 'measures'
  | 'medications'
  | 'photos';

export type PatientMvpAppointmentChoice = 'pending' | 'confirmed' | 'alternative';
export type PatientMvpMedicationChoice = 'pending' | 'uses' | 'none';
export type PatientMvpPhotoChoice = 'pending' | 'protocol' | 'alternative';
export type PatientMvpPlanExperience = 'unanswered' | 'easy' | 'partial' | 'difficult';

export interface PatientMvpSessionState {
  medicationRead: boolean;
  appointmentChoice: PatientMvpAppointmentChoice;
  completedPreparationSteps: PatientMvpPreparationStepId[];
  medicationChoice: PatientMvpMedicationChoice;
  medicationReport: string;
  measures: { weight: string; waist: string } | null;
  photoChoice: PatientMvpPhotoChoice;
  photoSlots: Array<'front' | 'side' | 'back'>;
  planExperience: PatientMvpPlanExperience;
}

export interface PatientMvpPreparationStep {
  id: PatientMvpPreparationStepId;
  title: string;
  description: string;
  duration: string;
  requirement: 'Essencial' | 'Solicitada pelo médico' | 'Condicional';
}

export interface PatientMvpMeasureRecord {
  date: string;
  weight: number;
  waist: number;
  source: 'Clínica' | 'Paciente';
}

export interface PatientMvpPhotoPose {
  id: 'front' | 'side' | 'back';
  label: string;
}

interface PatientMvpBaseData {
  patientId: string;
  encounterId: string;
  scenario: PatientMvpScenarioKind;
  name: string;
  firstName: string;
  age: number;
  doctorName: string;
  height: string;
  objective: string;
  conversation: Array<{
    id: string;
    sender: 'patient' | 'doctor';
    body: string;
    sentAt: string;
  }>;
}

export interface FilledPatientMvpData extends PatientMvpBaseData {
  scenario: 'filled';
  startedAt: string;
  latestConsultationAt: string;
  checkIn: {
    availableLabel: string;
    cadenceLabel: string;
    originalText: string;
    aiSummary: string[];
  };
  measures: PatientMvpMeasureRecord[];
  goal: {
    title: string;
    targetWeight: number;
    nextMilestoneWeight: number;
  };
  foodPlan: {
    title: string;
    version: string;
    approvedAt: string;
    approvedBy: string;
    priorities: string[];
  };
  medication: {
    name: string;
    previousOrientation: string;
    newOrientation: string;
    startsAt: string;
    approvedBy: string;
    prescriptionExpiresIn: string;
    history: string;
  };
  photos: {
    receivedAt: string;
    poses: PatientMvpPhotoPose[];
  };
  appointment: {
    date: string;
    time: string;
    purpose: string;
  };
}

export interface PendingPatientMvpData extends PatientMvpBaseData {
  scenario: 'pending';
  progressLabel: string;
  remainingTime: string;
  preparationSteps: PatientMvpPreparationStep[];
}

export type PatientMvpData = FilledPatientMvpData | PendingPatientMvpData;

const commonPhotoPoses: PatientMvpPhotoPose[] = [
  { id: 'front', label: 'Frente' },
  { id: 'side', label: 'Perfil' },
  { id: 'back', label: 'Costas' },
];

export const filledPatientMvpData: FilledPatientMvpData = {
  patientId: 'pac-demo-001',
  encounterId: 'enc-demo-002',
  scenario: 'filled',
  name: 'Marina Costa',
  firstName: 'Marina',
  age: 39,
  doctorName: 'Dr. Guilherme Martins',
  height: '1,64 m',
  objective: 'Perder peso com constância e ter mais disposição para brincar com meus filhos.',
  startedAt: '1 jul 2026',
  latestConsultationAt: '1 set 2026',
  checkIn: {
    availableLabel: 'Disponível hoje',
    cadenceLabel: 'A cada 3 dias',
    originalText:
      'Estou me sentindo bem. Minha fome diminuiu e consegui seguir melhor os horários. Senti um enjoo leve depois do almoço em dois dias. Dormi mais ou menos seis horas e meia. Não percebi outra mudança.',
    aiSummary: [
      'Bem-estar geral relatado como bom.',
      'Apetite menor e horários mais consistentes.',
      'Enjoo leve após o almoço em dois dias.',
      'Sono informado de cerca de 6h30.',
    ],
  },
  measures: [
    { date: '1 jul', weight: 94.8, waist: 109, source: 'Clínica' },
    { date: '1 ago', weight: 93.1, waist: 107, source: 'Paciente' },
    { date: '1 set', weight: 91.6, waist: 104.5, source: 'Paciente' },
  ],
  goal: {
    title: 'Meta da fase',
    targetWeight: 78.8,
    nextMilestoneWeight: 90,
  },
  foodPlan: {
    title: 'Plano alimentar desta fase',
    version: 'Versão 2',
    approvedAt: '1 set 2026',
    approvedBy: 'Dr. Guilherme Martins',
    priorities: [
      'Organizar três refeições principais nos horários combinados.',
      'Priorizar a fonte de proteína indicada em cada refeição principal.',
      'Deixar duas opções de lanche aprovadas disponíveis nos dias mais corridos.',
    ],
  },
  medication: {
    name: 'Medicamento Exemplo A',
    previousOrientation: 'Dose fictícia de 5 mg, semanal',
    newOrientation: 'Dose fictícia de 7,5 mg, semanal',
    startsAt: 'A partir da próxima aplicação',
    approvedBy: 'Dr. Guilherme Martins',
    prescriptionExpiresIn: '8 dias',
    history: 'Medicamento Exemplo B · uso encerrado em 15 ago 2026',
  },
  photos: {
    receivedAt: '1 set 2026',
    poses: commonPhotoPoses,
  },
  appointment: {
    date: '16 set 2026',
    time: '14h30',
    purpose: 'Retorno de acompanhamento',
  },
  conversation: [
    {
      id: 'filled-conversation-1',
      sender: 'doctor',
      body: 'Marina, publiquei a nova orientação fictícia e deixei uma proposta de retorno para você confirmar.',
      sentAt: 'Hoje · 09h12',
    },
    {
      id: 'filled-conversation-2',
      sender: 'patient',
      body: 'Obrigada. Vou revisar com calma por aqui.',
      sentAt: 'Hoje · 09h18',
    },
  ],
};

export const pendingPatientMvpData: PendingPatientMvpData = {
  patientId: 'pac-demo-006',
  encounterId: 'enc-demo-006',
  scenario: 'pending',
  name: 'Lucas Almeida',
  firstName: 'Lucas',
  age: 42,
  doctorName: 'Dr. Guilherme Martins',
  height: '1,78 m',
  objective: '',
  progressLabel: '1 de 5 etapas concluídas',
  remainingTime: 'cerca de 7 minutos restantes',
  preparationSteps: [
    {
      id: 'basics',
      title: 'Dados básicos e altura',
      description: 'Seu cadastro inicial já foi conferido.',
      duration: 'Concluído',
      requirement: 'Essencial',
    },
    {
      id: 'story',
      title: 'Objetivo e como você está',
      description: 'Conte do seu jeito, por voz ou texto. Seu relato original será preservado.',
      duration: '2 min',
      requirement: 'Essencial',
    },
    {
      id: 'measures',
      title: 'Peso e cintura iniciais',
      description: 'Essas medidas foram solicitadas para criar seu ponto de partida.',
      duration: '2 min',
      requirement: 'Solicitada pelo médico',
    },
    {
      id: 'medications',
      title: 'Medicamentos atuais ou não uso',
      description: 'Você pode informar o que usa ou marcar que não usa atualmente.',
      duration: '1 min',
      requirement: 'Essencial',
    },
    {
      id: 'photos',
      title: 'Fotos no protocolo combinado',
      description: 'Só entram no acompanhamento se você escolher seguir o protocolo solicitado.',
      duration: '2 min',
      requirement: 'Condicional',
    },
  ],
  conversation: [
    {
      id: 'pending-conversation-1',
      sender: 'doctor',
      body: 'Olá, Lucas. Comece pelo que for mais fácil. Você pode salvar e continuar a preparação depois.',
      sentAt: 'Ontem · 17h40',
    },
  ],
};

const initialFilledSessionState: PatientMvpSessionState = {
  medicationRead: false,
  appointmentChoice: 'pending',
  completedPreparationSteps: ['basics', 'story', 'measures', 'medications', 'photos'],
  medicationChoice: 'uses',
  medicationReport: 'Medicamento Exemplo A',
  measures: { weight: '91,6', waist: '104,5' },
  photoChoice: 'protocol',
  photoSlots: ['front', 'side', 'back'],
  planExperience: 'partial',
};

const initialPendingSessionState: PatientMvpSessionState = {
  medicationRead: false,
  appointmentChoice: 'pending',
  completedPreparationSteps: ['basics'],
  medicationChoice: 'pending',
  medicationReport: '',
  measures: null,
  photoChoice: 'pending',
  photoSlots: [],
  planExperience: 'unanswered',
};

export const patientMvpScenarioLinks = [
  { patientId: 'pac-demo-001', label: 'Acompanhamento preenchido' },
  { patientId: 'pac-demo-006', label: 'Preparação pendente' },
] as const;

export function getPatientMvpData(patientId: string): PatientMvpData {
  if (patientId === filledPatientMvpData.patientId) return filledPatientMvpData;
  if (patientId === pendingPatientMvpData.patientId) return pendingPatientMvpData;
  throw new Error(`Cenário de paciente não configurado: ${patientId}`);
}

export function getInitialPatientMvpSessionState(patientId: string): PatientMvpSessionState {
  if (patientId === filledPatientMvpData.patientId) return initialFilledSessionState;
  if (patientId === pendingPatientMvpData.patientId) return initialPendingSessionState;
  throw new Error(`Estado de paciente não configurado: ${patientId}`);
}

export function isPatientCheckInDue(
  latestCheckIn: Pick<CareCheckIn, 'submittedAtIso'> | null,
  now = Date.now(),
) {
  if (!latestCheckIn) return true;
  const submittedAt = Date.parse(latestCheckIn.submittedAtIso);
  if (!Number.isFinite(submittedAt)) return false;
  return now - submittedAt >= 3 * 24 * 60 * 60 * 1000;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const preparationStepIds: PatientMvpPreparationStepId[] = [
  'basics',
  'story',
  'measures',
  'medications',
  'photos',
];

export function normalizePatientMvpSessionState(
  value: unknown,
  fallback: PatientMvpSessionState,
): PatientMvpSessionState {
  if (!isRecord(value)) return fallback;

  const completedPreparationSteps = Array.isArray(value.completedPreparationSteps)
    ? value.completedPreparationSteps.filter(
        (step): step is PatientMvpPreparationStepId =>
          typeof step === 'string' && preparationStepIds.includes(step as PatientMvpPreparationStepId),
      )
    : fallback.completedPreparationSteps;
  const measures = isRecord(value.measures)
    && typeof value.measures.weight === 'string'
    && typeof value.measures.waist === 'string'
    ? { weight: value.measures.weight, waist: value.measures.waist }
    : fallback.measures;
  const photoSlots = Array.isArray(value.photoSlots)
    ? value.photoSlots.filter(
        (slot): slot is 'front' | 'side' | 'back' =>
          slot === 'front' || slot === 'side' || slot === 'back',
      )
    : fallback.photoSlots;

  return {
    medicationRead:
      typeof value.medicationRead === 'boolean' ? value.medicationRead : fallback.medicationRead,
    appointmentChoice:
      value.appointmentChoice === 'confirmed' || value.appointmentChoice === 'alternative'
        ? value.appointmentChoice
        : 'pending',
    completedPreparationSteps,
    medicationChoice:
      value.medicationChoice === 'uses' || value.medicationChoice === 'none'
        ? value.medicationChoice
        : 'pending',
    medicationReport:
      typeof value.medicationReport === 'string' ? value.medicationReport : fallback.medicationReport,
    measures,
    photoChoice:
      value.photoChoice === 'protocol' || value.photoChoice === 'alternative'
        ? value.photoChoice
        : 'pending',
    photoSlots,
    planExperience:
      value.planExperience === 'easy'
      || value.planExperience === 'partial'
      || value.planExperience === 'difficult'
        ? value.planExperience
        : 'unanswered',
  };
}
