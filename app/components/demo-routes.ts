export type DoctorView = 'Visão geral' | 'Agenda' | 'Pacientes' | 'Mensagens' | 'Relatórios';
export type PatientPrimaryView = 'Hoje' | 'Meu cuidado' | 'Conversas' | 'Evolução';
export type PatientView = PatientPrimaryView | 'Plano' | 'Diário' | 'Mensagens' | 'Consultas';
export type ClinicalRouteMode = 'workspace' | 'pre-consultation' | 'consultation';

export const DEFAULT_PATIENT_ID = 'pac-demo-001';
export const DEFAULT_ENCOUNTER_ID = 'enc-demo-002';

export const doctorNavigation: Array<{ label: DoctorView; href: string; section?: string }> = [
  { label: 'Visão geral', href: '/medico' },
  { label: 'Agenda', href: '/medico/agenda', section: 'agenda' },
  { label: 'Pacientes', href: '/medico/pacientes', section: 'pacientes' },
  { label: 'Mensagens', href: '/medico/mensagens', section: 'mensagens' },
  { label: 'Relatórios', href: '/medico/relatorios', section: 'relatorios' },
];

export const patientNavigation: Array<{ label: PatientPrimaryView; section: string }> = [
  { label: 'Hoje', section: '' },
  { label: 'Meu cuidado', section: 'cuidado' },
  { label: 'Conversas', section: 'conversas' },
  { label: 'Evolução', section: 'evolucao' },
];

const patientRoutes: Array<{ label: PatientView; section: string }> = [
  ...patientNavigation,
  { label: 'Plano', section: 'plano' },
  { label: 'Diário', section: 'diario' },
  { label: 'Mensagens', section: 'mensagens' },
  { label: 'Consultas', section: 'consultas' },
];

export const demoPatients = [
  { id: 'pac-demo-001', name: 'Marina Costa', defaultEncounterId: 'enc-demo-002' },
  { id: 'pac-demo-002', name: 'Ana Ribeiro', defaultEncounterId: 'enc-demo-004' },
  { id: 'pac-demo-003', name: 'Paulo Mendes', defaultEncounterId: 'enc-demo-005' },
  { id: 'pac-demo-004', name: 'Rafael Lima', defaultEncounterId: 'enc-demo-003' },
  { id: 'pac-demo-005', name: 'Lúcia Barbosa', defaultEncounterId: 'enc-demo-001' },
] as const;

export function getDemoPatient(patientId: string) {
  return demoPatients.find((patient) => patient.id === patientId) ?? null;
}

export function getDefaultEncounterId(patientId: string) {
  return getDemoPatient(patientId)?.defaultEncounterId ?? DEFAULT_ENCOUNTER_ID;
}

export function getDoctorView(section: string): DoctorView | null {
  return doctorNavigation.find((item) => item.section === section)?.label ?? null;
}

export function getPatientView(section: string): PatientView | null {
  return patientRoutes.find((item) => item.section === section)?.label ?? null;
}

export function getPatientSectionHref(patientId: string, view: PatientView) {
  const section = patientRoutes.find((item) => item.label === view)?.section ?? '';
  return section ? `/paciente/${patientId}/${section}` : `/paciente/${patientId}`;
}

export function getPatientPrimaryView(view: PatientView): PatientPrimaryView {
  if (view === 'Plano' || view === 'Diário' || view === 'Consultas') return 'Meu cuidado';
  if (view === 'Mensagens') return 'Conversas';
  return view;
}

export function getPatientDossierHref(patientId: string) {
  return `/medico/pacientes/${patientId}`;
}

export function getPatientMessagesHref(patientId: string) {
  return `/medico/pacientes/${patientId}/mensagens`;
}

export function getPreConsultationHref(patientId: string, encounterId: string) {
  return `/medico/pacientes/${patientId}/pre-consulta/${encounterId}`;
}

export function getConsultationHref(patientId: string, encounterId: string) {
  return `/medico/pacientes/${patientId}/consultas/${encounterId}`;
}

export function getPatientPreConsultationHref(patientId: string, encounterId: string) {
  return `/paciente/${patientId}/pre-consulta/${encounterId}`;
}

export function encounterBelongsToPatient(patientId: string, encounterId: string) {
  return getDemoPatient(patientId)?.defaultEncounterId === encounterId;
}
