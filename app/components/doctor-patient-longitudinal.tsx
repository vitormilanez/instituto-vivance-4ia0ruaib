'use client';

import {
  ArrowLeft,
  ChartLineDown,
  CheckCircle,
  DotsThree,
  FileText,
  Footprints,
  Info,
  Moon,
  ShieldCheck,
  VideoCamera,
  WarningCircle,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AiDraftBadge, ClinicalLayerBadge } from './clinical';
import { DoctorAiPreparationWorkspace } from './doctor-ai-preparation-workspace';
import { DoctorCareCycleSummary } from './doctor-care-cycle-summary';
import { DEFAULT_PATIENT_ID, doctorDemoCohortSummary, getDefaultEncounterId } from './demo-routes';
import { LongitudinalDossier } from './longitudinal-dossier';
import { cn, Status } from './shared';

type Tone = 'green' | 'amber' | 'rose' | 'blue' | 'gray';

export type PatientWorkspaceProfile = {
  id: string;
  nextEncounterId: string;
  initials: string;
  name: string;
  focus: string;
  progress: string;
  attention: string;
  tone: Tone;
  reportCount: string;
  prescriptionCount: string;
  cycle: string;
  lastContact: string;
  nextConsultation: string;
  adherence: string;
  report: {
    title: string;
    period: string;
    status: string;
    summary: string;
    metrics: Array<[string, string]>;
  };
  prescription: {
    title: string;
    status: string;
    detail: string;
    note: string;
  };
  insight: {
    title: string;
    detail: string;
    basis: string;
  };
  activity: Array<[string, string]>;
  nextSteps: string[];
};

type PatientTab = 'overview' | 'timeline' | 'documents' | 'evolution';
type DemoScenario = 'content' | 'loading' | 'empty' | 'error' | 'incomplete' | 'permission' | 'ai-unavailable' | 'conflict';
type DocumentKind = 'all' | 'exam' | 'order' | 'report' | 'plan';
type EvolutionMetric = 'weight' | 'sleep' | 'activity' | 'adherence';

const patientTabs: Array<{ id: PatientTab; label: string; description: string }> = [
  { id: 'overview', label: 'Visão geral', description: 'Decisão e pendências' },
  { id: 'timeline', label: 'Linha do tempo', description: 'Histórico rastreável' },
  { id: 'documents', label: 'Documentos', description: 'Originais e versões' },
  { id: 'evolution', label: 'Evolução', description: 'Tendências por período' },
];

const scenarioLabels: Array<{ id: DemoScenario; label: string }> = [
  { id: 'content', label: 'Conteúdo completo' },
  { id: 'loading', label: 'Carregando' },
  { id: 'empty', label: 'Paciente novo' },
  { id: 'error', label: 'Erro localizado' },
  { id: 'incomplete', label: 'Dados incompletos' },
  { id: 'permission', label: 'Sem permissão' },
  { id: 'ai-unavailable', label: 'IA indisponível' },
  { id: 'conflict', label: 'Fonte conflitante' },
];

const documentFilters: Array<{ id: DocumentKind; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'exam', label: 'Exames recebidos' },
  { id: 'order', label: 'Pedidos' },
  { id: 'report', label: 'Relatórios' },
  { id: 'plan', label: 'Planos e orientações' },
];

type ClinicalDocument = {
  id: string;
  kind: Exclude<DocumentKind, 'all'>;
  title: string;
  date: string;
  author: string;
  origin: string;
  status: string;
  statusTone: Tone;
  version: string;
  originalHref?: string;
  aiSummary?: string;
  values?: Array<{ marker: string; value: number; unit: string }>;
};

const marinaDocuments: ClinicalDocument[] = [
  {
    id: 'exam-aug',
    kind: 'exam',
    title: 'Painel laboratorial · agosto',
    date: '14 ago 2026',
    author: 'Laboratório Horizonte · arquivo enviado por Marina Costa',
    origin: 'Enviado pela paciente',
    status: 'Revisão médica pendente',
    statusTone: 'amber',
    version: 'Original · v1',
    originalHref: '/docs/doc-demo-001.pdf',
    aiSummary: 'O rascunho apenas extraiu nomes e valores legíveis; não interpretou normalidade, risco ou conduta.',
    values: [
      { marker: 'Glicemia em jejum', value: 96, unit: 'mg/dL' },
      { marker: 'Hemoglobina glicada', value: 5.5, unit: '%' },
      { marker: 'Triglicerídeos', value: 118, unit: 'mg/dL' },
    ],
  },
  {
    id: 'exam-jul',
    kind: 'exam',
    title: 'Painel laboratorial · julho',
    date: '18 jul 2026',
    author: 'Laboratório Horizonte · arquivo enviado por Marina Costa',
    origin: 'Enviado pela paciente',
    status: 'Revisado',
    statusTone: 'green',
    version: 'Original · v1',
    originalHref: '/docs/doc-demo-002.pdf',
    aiSummary: 'Valores foram transcritos para comparação objetiva. O documento original permanece como fonte principal.',
    values: [
      { marker: 'Glicemia em jejum', value: 101, unit: 'mg/dL' },
      { marker: 'Hemoglobina glicada', value: 5.8, unit: '%' },
      { marker: 'Triglicerídeos', value: 132, unit: 'mg/dL' },
    ],
  },
  {
    id: 'order-aug',
    kind: 'order',
    title: 'Pedido de exames · acompanhamento 30 dias',
    date: '12 ago 2026',
    author: 'Dr. Guilherme Martins · CRM/SP 184.920',
    origin: 'Registrado pelo profissional',
    status: 'Aprovado',
    statusTone: 'green',
    version: 'v2 · substitui v1',
    originalHref: '/docs/doc-demo-003.pdf',
  },
  {
    id: 'report-aug',
    kind: 'report',
    title: 'Relatório quinzenal de acompanhamento',
    date: '24 ago 2026',
    author: 'Dr. Guilherme Martins · revisão do rascunho assistido',
    origin: 'Revisado pelo profissional',
    status: 'Aprovado · não publicado',
    statusTone: 'blue',
    version: 'v3',
    aiSummary: 'Versão aprovada internamente. Aprovação não significa publicação ou exportação para outro sistema.',
  },
  {
    id: 'plan-aug',
    kind: 'plan',
    title: 'Plano de cuidado · ciclo 90 dias',
    date: '28 jul 2026',
    author: 'Dr. Guilherme Martins · CRM/SP 184.920',
    origin: 'Registrado pelo profissional',
    status: 'Publicado para a paciente',
    statusTone: 'green',
    version: 'v2 · publicado',
  },
];

const evolutionMetrics: Record<EvolutionMetric, {
  label: string;
  unit: string;
  color: string;
  source: string;
  completeness: string;
  points: Array<{ date: string; value: number }>;
}> = {
  weight: {
    label: 'Peso', unit: 'kg', color: '#124da0', source: 'Pesagens confirmadas pela paciente', completeness: '5 de 6 registros esperados',
    points: [{ date: '28 jul', value: 80 }, { date: '4 ago', value: 79.6 }, { date: '11 ago', value: 79.1 }, { date: '18 ago', value: 78.7 }, { date: '25 ago', value: 78.2 }],
  },
  sleep: {
    label: 'Sono médio', unit: 'h', color: '#124da0', source: 'Check-ins e registros de sono autorrelatados', completeness: '23 de 29 noites registradas',
    points: [{ date: '28 jul', value: 6.4 }, { date: '4 ago', value: 6.3 }, { date: '11 ago', value: 6.1 }, { date: '18 ago', value: 5.9 }, { date: '25 ago', value: 5.7 }],
  },
  activity: {
    label: 'Passos médios', unit: 'passos', color: '#77500a', source: 'Dispositivo conectado · dados demonstrativos', completeness: '26 de 29 dias sincronizados',
    points: [{ date: '28 jul', value: 5400 }, { date: '4 ago', value: 5900 }, { date: '11 ago', value: 6200 }, { date: '18 ago', value: 6800 }, { date: '25 ago', value: 7200 }],
  },
  adherence: {
    label: 'Adesão autorrelatada', unit: '%', color: '#77500a', source: 'Check-ins confirmados pela paciente', completeness: '11 de 14 check-ins respondidos',
    points: [{ date: '28 jul', value: 72 }, { date: '4 ago', value: 76 }, { date: '11 ago', value: 79 }, { date: '18 ago', value: 83 }, { date: '25 ago', value: 82 }],
  },
};

export function PatientCohort({ patients, onSelectPatient }: { patients: PatientWorkspaceProfile[]; onSelectPatient: (patientId: string) => void }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
  const filtered = patients.filter((patient) => `${patient.name} ${patient.focus}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery));

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#071a3a]">Pacientes</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#61718a]">Abra uma pessoa para ver evolução, fontes, pendências e próximos passos em uma única tela.</p>
        </div>
        <label className="flex min-h-11 items-center rounded-xl border border-[#dbe4f0] bg-white px-4 text-sm text-[#50627f] focus-within:ring-2 focus-within:ring-[#124da0]">
          <span className="sr-only">Buscar paciente</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" className="w-full bg-transparent outline-none sm:w-56" placeholder="Buscar por nome ou foco" />
        </label>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#dbe4f0] bg-white">
        <div className="grid gap-px bg-[#e7edf5] sm:grid-cols-3">
          {[
            ['Em acompanhamento', doctorDemoCohortSummary.activePatients],
            ['Check-ins em dia', doctorDemoCohortSummary.checkInsOnTime],
            ['Para revisar', doctorDemoCohortSummary.checkInsToReview],
          ].map(([label, value]) => <div key={label} className="bg-white p-4 sm:p-5"><p className="text-xs font-semibold text-[#50627f]">{label}</p><p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#071a3a]">{value}</p></div>)}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="mt-5 rounded-2xl border border-dashed border-[#c7d5e7] bg-white p-8 text-center"><h2 className="text-lg font-semibold text-[#071a3a]">Nenhum paciente encontrado</h2><p className="mt-2 text-sm text-[#61718a]">Tente outro nome ou foco de acompanhamento.</p></section>
      ) : (
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((patient) => (
            <button key={patient.id} type="button" onClick={() => onSelectPatient(patient.id)} className="group min-h-[280px] rounded-2xl border border-[#dbe4f0] bg-white p-5 text-left transition-colors hover:border-[#8fb0d9] hover:bg-[#fbfdff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2">
              <span className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-full bg-[#e5edf8] text-sm font-bold text-[#124da0]">{patient.initials}</span><Status tone={patient.tone}>{patient.attention}</Status></span>
              <strong className="mt-5 block text-lg text-[#071a3a]">{patient.name}</strong>
              <span className="mt-1 block text-sm text-[#50627f]">{patient.focus}</span>
              <span className="mt-5 block text-2xl font-semibold tracking-[-0.04em] text-[#071a3a]">{patient.progress}</span>
              <span className="mt-1 block text-xs text-[#50627f]">desde o último ciclo</span>
              <span className="mt-5 flex min-h-11 items-center justify-between border-t border-[#e7edf5] pt-4 text-sm font-bold text-[#124da0]"><span>Abrir histórico</span><span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}

export function PatientLongitudinalWorkspace({
  patient,
  patients,
  onSelectPatient,
  onStartConsultation,
  onOpenPreparation,
  onMessage,
  onNotify,
}: {
  patient: PatientWorkspaceProfile;
  patients: PatientWorkspaceProfile[];
  onSelectPatient: (patientId: string) => void;
  onStartConsultation: (patientId: string, encounterId: string) => void;
  onOpenPreparation: (patientId: string, encounterId: string) => void;
  onMessage: (patientId: string) => void;
  onNotify: (text: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<PatientTab>('overview');
  const [scenario, setScenario] = useState<DemoScenario>('content');

  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash.replace('#patient-', '') as PatientTab;
      setActiveTab(patientTabs.some((tab) => tab.id === hash) ? hash : 'overview');
    };
    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  const isDefaultPatient = patient.id === DEFAULT_PATIENT_ID;
  const primaryLabel = isDefaultPatient ? 'Iniciar consulta online' : 'Preparar próxima consulta';
  const attentionDetail = isDefaultPatient
    ? 'Sono médio caiu para 5h42, com despertares relatados às 3h em quatro noites.'
    : patient.insight.detail;

  const runPrimaryAction = () => {
    if (isDefaultPatient) onStartConsultation(patient.id, patient.nextEncounterId);
    else onOpenPreparation(patient.id, patient.nextEncounterId);
  };

  const activateTab = (tab: PatientTab) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `#patient-${tab}`);
  };

  return (
    <div id="patient-longitudinal-workspace" className="min-w-0">
      <section className="doctor-sticky-offset -mx-4 border-b border-[#dbe4f0] bg-[#f6f9fe]/92 px-4 pb-4 backdrop-blur-xl sm:-mx-5 sm:px-5 lg:-mx-9 lg:px-9 xl:sticky xl:top-[var(--doctor-chrome-current-height)] xl:z-30">
        <div className="mx-auto max-w-[1240px] pt-2">
          <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
            <Link href="/medico/pacientes" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-bold text-[#50627f] transition-colors hover:bg-white hover:text-[#071a3a] focus-visible:outline-none">
              <ArrowLeft aria-hidden="true" size={17} /> Voltar aos pacientes
            </Link>
            <label className="hidden min-h-11 items-center gap-2 rounded-xl border border-[#dbe4f0] bg-white/90 px-3 text-xs font-semibold text-[#61718a] focus-within:ring-2 focus-within:ring-[#124da0] focus-within:ring-offset-2 sm:flex">
              Paciente
              <select value={patient.id} onChange={(event) => onSelectPatient(event.target.value)} className="max-w-[180px] bg-transparent font-bold text-[#071a3a] focus-visible:outline-none">
                {patients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e5edf8] text-sm font-extrabold text-[#082553] ring-1 ring-[#c7d5e7]">{patient.initials}</span>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <h1 className="truncate text-2xl font-semibold tracking-[-0.03em] text-[#071a3a] sm:text-[2rem]">{patient.name}</h1>
                </div>
                <p className="mt-1 text-xs leading-5 text-[#61718a] sm:text-sm">38 anos · {patient.focus} · {patient.cycle}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Status tone={patient.tone}>{patient.attention} para revisar</Status>
                  <Status tone="gray">Dados fictícios</Status>
                </div>
              </div>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <button type="button" onClick={runPrimaryAction} className="vivanse-primary-action inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition-colors focus-visible:outline-none sm:flex-none">
                <VideoCamera aria-hidden="true" size={20} /> {primaryLabel}
              </button>
              <details className="relative">
                <summary aria-label="Abrir mais ações" className="grid size-12 cursor-pointer list-none place-items-center rounded-xl border border-[#c7d5e7] bg-white text-[#082553] transition-colors hover:bg-[#edf3fb] focus-visible:outline-none">
                  <DotsThree aria-hidden="true" size={22} weight="bold" />
                </summary>
                <div className="vivanse-glass-menu absolute right-0 top-14 z-50 w-[min(18rem,calc(100vw-2rem))] rounded-xl p-2 text-white shadow-[0_20px_48px_rgba(3,19,45,0.32)]">
                  {[
                    ['Solicitar informação à paciente', () => onMessage(patient.id)],
                    ['Criar pedido de exame', () => onNotify('Novo pedido de exame aberto como rascunho demonstrativo.')],
                    ['Registrar observação', () => onNotify('Campo de observação médica aberto no mock.')],
                    ['Revisar resumo assistido', () => {
                      activateTab('overview');
                      const details = document.getElementById('ai-support-details') as HTMLDetailsElement | null;
                      if (details) details.open = true;
                      window.requestAnimationFrame(() => details?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
                    }],
                  ].map(([label, action]) => (
                    <button key={label as string} type="button" onClick={action as () => void} className="min-h-11 w-full rounded-lg px-3 text-left text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none">{label as string}</button>
                  ))}
                  <div className="my-2 border-t border-white/15" />
                  <label className="block px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white/60" htmlFor="demo-scenario">Cenário do protótipo</label>
                  <select id="demo-scenario" value={scenario} onChange={(event) => setScenario(event.target.value as DemoScenario)} className="min-h-11 w-full rounded-lg border border-white/15 bg-[#071a3a] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#79a8df]">
                    {scenarioLabels.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </div>
              </details>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[#dbe4f0] pt-3 text-xs text-[#61718a]">
            <span><strong className="text-[#071a3a]">Plano:</strong> v2 publicado</span>
            <span className="hidden sm:inline"><strong className="text-[#071a3a]">Última consulta:</strong> 28 jul · 09:30</span>
            <span><strong className="text-[#071a3a]">Próxima:</strong> {patient.nextConsultation}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] pt-4 sm:pt-5">
        <div className="flex items-start gap-2.5 px-1 text-xs leading-5 text-[#61718a] sm:text-sm sm:leading-6">
          <Info aria-hidden="true" className="mt-0.5 shrink-0 text-[#124da0]" size={17} />
          <p><strong className="text-[#071a3a]">Área de apoio ao cuidado.</strong> Não substitui o prontuário oficial.<span className="hidden sm:inline"> Originais, autoria, versões e revisão humana continuam identificados.</span></p>
        </div>

        <nav aria-label="Áreas do histórico do paciente" className="vivanse-panel mt-4 overflow-x-auto rounded-2xl p-1.5">
          <div role="tablist" aria-label="Conteúdo do paciente" className="flex min-w-max gap-1 md:min-w-0">
            {patientTabs.map((tab) => (
              <button
                key={tab.id}
                id={`patient-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`patient-panel-${tab.id}`}
                onClick={() => activateTab(tab.id)}
                className={cn(
                  'flex min-h-12 min-w-[132px] flex-1 cursor-pointer flex-col justify-center rounded-xl px-4 text-left transition-colors focus-visible:outline-none md:min-w-0',
                  activeTab === tab.id ? 'bg-[#03132d] text-white shadow-[0_8px_18px_rgba(3,19,45,0.16)]' : 'text-[#405675] hover:bg-[#edf3fb]',
                )}
              >
                <span className="text-sm font-bold">{tab.label}</span>
                <span className={cn('mt-0.5 hidden text-[11px] sm:block', activeTab === tab.id ? 'text-[#c9d7ea]' : 'text-[#61718a]')}>{tab.description}</span>
              </button>
            ))}
          </div>
        </nav>

        <section id={`patient-panel-${activeTab}`} role="tabpanel" aria-labelledby={`patient-tab-${activeTab}`} className="mt-4 min-w-0 scroll-mt-44 sm:mt-5">
          {scenario === 'loading' ? (
            <LoadingState />
          ) : scenario === 'empty' ? (
            <EmptyPatientState onNotify={onNotify} />
          ) : activeTab === 'overview' ? (
            <OverviewPanel patient={patient} scenario={scenario} attentionDetail={attentionDetail} onMessage={onMessage} onNotify={onNotify} />
          ) : activeTab === 'timeline' ? (
            <TimelinePanel patient={patient} />
          ) : activeTab === 'documents' ? (
            <DocumentsPanel patient={patient} permissionDenied={scenario === 'permission'} onNotify={onNotify} />
          ) : (
            <EvolutionPanel error={scenario === 'error'} incomplete={scenario === 'incomplete'} onNotify={onNotify} />
          )}
        </section>
      </div>
    </div>
  );
}

function OverviewPanel({
  patient,
  scenario,
  attentionDetail,
  onMessage,
  onNotify,
}: {
  patient: PatientWorkspaceProfile;
  scenario: DemoScenario;
  attentionDetail: string;
  onMessage: (patientId: string) => void;
  onNotify: (text: string) => void;
}) {
  const [careDetailsOpen, setCareDetailsOpen] = useState(false);
  const [aiDetailsOpen, setAiDetailsOpen] = useState(false);
  const metrics = patient.id === DEFAULT_PATIENT_ID
    ? [['Peso atual', '78,2 kg', '−1,8 kg no ciclo'], ['Sono médio', '5h42', '23 de 29 noites'], ['Atividade', '7.200', 'passos médios'], ['Adesão', patient.adherence, '11 de 14 check-ins']]
    : patient.report.metrics.map(([label, value]) => [label, value, 'fonte demonstrativa']);
  const metricIcons = [ChartLineDown, Moon, Footprints, CheckCircle];

  return (
    <div className="space-y-4 sm:space-y-5">
      {scenario === 'incomplete' && <InlineState tone="amber" title="Dados incompletos" description="Seis dias não têm registros de sono e três check-ins ainda não foram respondidos. A síntese preserva essas lacunas." />}
      {scenario === 'error' && <InlineState tone="rose" title="Uma fonte não carregou" description="O exame mais recente está temporariamente indisponível. Os demais módulos e o acesso manual continuam funcionando." />}

      <section aria-labelledby="review-now-title" className="vivanse-panel overflow-hidden rounded-2xl">
        <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center sm:p-6">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div className="flex items-center gap-3 sm:hidden">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff0ca] text-[#77500a]">
                <WarningCircle aria-hidden="true" size={20} weight="fill" />
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Status tone="amber">Revisar na consulta</Status>
                <span className="text-xs font-semibold text-[#61718a]">23 noites · 11 check-ins</span>
              </div>
            </div>
            <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-[#fff0ca] text-[#77500a] sm:grid">
              <WarningCircle aria-hidden="true" size={22} weight="fill" />
            </span>
            <div className="min-w-0">
              <div className="hidden flex-wrap items-center gap-2 sm:flex">
                <Status tone="amber">Revisar na consulta</Status>
                <span className="text-xs font-semibold text-[#61718a]">23 noites · 11 check-ins</span>
              </div>
              <h2 id="review-now-title" className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[#071a3a] sm:text-2xl">O que merece atenção agora</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#405675]">{attentionDetail}</p>
              <p className="mt-2 text-xs leading-5 text-[#61718a]">É uma mudança observada no período. Não define causa, diagnóstico, urgência ou conduta.</p>
            </div>
          </div>
          <button type="button" onClick={() => onNotify('Fontes do sono abertas para conferência no mock.')} className="min-h-11 rounded-xl border border-[#9bb5d4] bg-white px-4 text-sm font-bold text-[#124da0] transition-colors hover:bg-[#edf3fb] focus-visible:outline-none">Conferir fontes</button>
        </div>
      </section>

      <dl className="vivanse-panel grid overflow-hidden rounded-2xl divide-y divide-[#e7edf5] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
        {metrics.slice(0, 4).map(([label, value, detail], index) => {
          const MetricIcon = metricIcons[index] ?? FileText;
          return (
            <div key={label} className={cn('bg-white/78 p-4 sm:p-5', index === 2 && 'sm:border-t sm:border-[#e7edf5] xl:border-t-0')}>
              <dt className="flex items-center gap-2 text-xs font-semibold text-[#61718a]"><MetricIcon aria-hidden="true" size={17} className="text-[#124da0]" />{label}</dt>
              <dd className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#071a3a]">{value}</dd>
              <p className="mt-1 text-xs text-[#61718a]">{detail}</p>
            </div>
          );
        })}
      </dl>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px] xl:gap-5">
        <section className="vivanse-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#edf3fb] text-[#124da0]"><ShieldCheck aria-hidden="true" size={20} /></span>
            <div>
              <h2 className="text-lg font-semibold text-[#071a3a]">Situação do acompanhamento</h2>
              <p className="mt-1 text-sm leading-6 text-[#61718a]">O contexto principal para preparar a próxima conversa.</p>
            </div>
          </div>
          <dl className="mt-5 grid gap-x-6 sm:grid-cols-2">
              {[
                ['Objetivo atual', patient.focus],
                ['Plano vigente', 'v2 · publicado em 28 jul'],
                ['Último contato', patient.lastContact],
                ['Próxima consulta', patient.nextConsultation],
              ].map(([label, value]) => <div key={label} className="border-t border-[#e7edf5] py-3"><dt className="text-xs font-semibold text-[#61718a]">{label}</dt><dd className="mt-1 text-sm font-bold text-[#405675]">{value}</dd></div>)}
          </dl>
        </section>
        <aside className="vivanse-panel rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-[#071a3a]">Próximas ações</h2>
            <ol className="mt-4 space-y-3">
              {patient.nextSteps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-[#50627f]"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#edf3fb] text-xs font-bold text-[#124da0]">{index + 1}</span><span>{step}</span></li>)}
            </ol>
            <button type="button" onClick={() => onMessage(patient.id)} className="mt-5 min-h-11 w-full rounded-xl border border-[#9bb5d4] px-4 text-sm font-bold text-[#124da0] transition-colors hover:bg-[#edf3fb] focus-visible:outline-none">Solicitar informação</button>
        </aside>
      </div>

      <details className="vivanse-panel overflow-hidden rounded-2xl" onToggle={(event) => setCareDetailsOpen(event.currentTarget.open)}>
        <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-5 py-4 text-sm font-bold text-[#071a3a] focus-visible:outline-none sm:px-6">
          <ChartLineDown aria-hidden="true" size={20} className="text-[#124da0]" />
          Ver resumo completo do acompanhamento
        </summary>
        {careDetailsOpen ? <DoctorCareCycleSummary patientId={patient.id} encounterId={getDefaultEncounterId(patient.id)} /> : null}
      </details>

      {scenario === 'ai-unavailable' ? (
        <section className="vivanse-panel rounded-2xl p-6">
          <Status tone="gray">IA indisponível</Status>
          <h2 className="mt-3 text-xl font-semibold text-[#071a3a]">Fluxo manual preservado</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">O profissional continua com relatos originais, documentos e linha do tempo. Nenhum conteúdo assistido é necessário para atender ou registrar a consulta.</p>
          <button type="button" onClick={() => onNotify('Fontes originais abertas sem geração assistida.')} className="mt-5 min-h-11 rounded-xl border border-[#9bb5d4] px-4 text-sm font-bold text-[#124da0]">Abrir fontes originais</button>
        </section>
      ) : (
        <details id="ai-support-details" className="vivanse-panel overflow-hidden rounded-2xl" onToggle={(event) => setAiDetailsOpen(event.currentTarget.open)}>
          <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-5 py-4 text-sm font-bold text-[#071a3a] focus-visible:outline-none sm:px-6">
            <FileText aria-hidden="true" size={20} className="text-[#124da0]" />
            Abrir apoio para preparar a consulta
          </summary>
          {aiDetailsOpen ? (
            <div className="min-w-0 border-t border-[#dbe4f0] bg-white">
              <DoctorAiPreparationWorkspace key={`ai-${patient.id}-${scenario}`} patientId={patient.id} patientName={patient.name} encounterId={getDefaultEncounterId(patient.id)} conflictMode={scenario === 'conflict'} onNotify={onNotify} />
            </div>
          ) : null}
        </details>
      )}

      <details className="rounded-2xl border border-[#dbe4f0] bg-white/70 px-5 py-3">
        <summary className="min-h-11 cursor-pointer text-sm font-bold text-[#405675] focus-visible:outline-none">Acesso, autoria e versões</summary>
        <div className="mt-2 space-y-2 pb-2 text-xs leading-5 text-[#61718a]"><p><strong className="text-[#071a3a]">Perfil:</strong> médico responsável · simulação.</p><p><strong className="text-[#071a3a]">Paciente:</strong> vê somente versões publicadas.</p><p><strong className="text-[#071a3a]">Apoio assistido:</strong> organiza fontes, mas nunca é autor da decisão clínica.</p><p>Autorização real e registro legal dependem de infraestrutura própria e não são simulados como concluídos.</p></div>
      </details>
    </div>
  );
}

function TimelinePanel({ patient }: { patient: PatientWorkspaceProfile }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dbe4f0] bg-white">
      <div className="border-b border-[#e7edf5] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#071a3a]">Linha do tempo clínica</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">Eventos de diferentes origens em ordem cronológica, com autoria, versão, estado de revisão e limitações visíveis.</p></div>
          <Status tone="gray">18 eventos demonstrativos</Status>
        </div>
        <p className="mt-4 text-xs leading-5 text-[#50627f]">Para grandes volumes, use os filtros abaixo; a tela mantém o recorte atual sem ocultar a existência de outros registros.</p>
      </div>
      <LongitudinalDossier patientId={patient.id} patientName={patient.name} />
    </div>
  );
}

function DocumentsPanel({ patient, permissionDenied, onNotify }: { patient: PatientWorkspaceProfile; permissionDenied: boolean; onNotify: (text: string) => void }) {
  const [filter, setFilter] = useState<DocumentKind>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const documents = patient.id === DEFAULT_PATIENT_ID ? marinaDocuments : [];
  const filtered = filter === 'all' ? documents : documents.filter((document) => document.kind === filter);
  const comparable = documents.filter((document) => selected.includes(document.id) && document.values);

  const toggleSelected = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
    setCompareOpen(false);
  };

  if (permissionDenied) {
    return <RestrictedState onNotify={onNotify} />;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe4f0] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#071a3a]">Documentos e histórico clínico</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">Originais preservados junto das versões, resumos assistidos e decisões humanas. Um resumo nunca substitui seu documento-fonte.</p></div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => onNotify('Pedido de exame criado como rascunho demonstrativo.')} className="min-h-11 rounded-xl bg-[#071a3a] px-4 text-sm font-bold text-white">Criar pedido</button><button type="button" onClick={() => onNotify('Solicitação de documento aberta para a paciente.')} className="min-h-11 rounded-xl border border-[#c7d5e7] px-4 text-sm font-bold text-[#124da0]">Solicitar documento</button></div>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar documentos">
          {documentFilters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={cn('min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold', filter === item.id ? 'bg-[#071a3a] text-white' : 'border border-[#dbe4f0] bg-white text-[#50627f] hover:bg-[#f6f9fe]')}>{item.label}</button>)}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#c7d5e7] bg-white p-8 text-center"><h3 className="text-lg font-semibold text-[#071a3a]">Nenhum documento neste recorte</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#61718a]">O estado vazio não é preenchido por dados de outro paciente. Solicite um documento ou altere o filtro.</p></section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[#dbe4f0] bg-white">
          <div className="divide-y divide-[#e7edf5]">
            {filtered.map((document) => (
              <article key={document.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><Status tone={document.statusTone}>{document.status}</Status><Status tone="gray">{document.origin}</Status>{document.aiSummary && <AiDraftBadge>Resumo IA separado</AiDraftBadge>}</div>
                    <h3 className="mt-3 text-lg font-semibold text-[#071a3a]">{document.title}</h3>
                    <p className="mt-1 text-sm text-[#61718a]">{document.date} · {document.author}</p>
                    <p className="mt-2 text-xs font-semibold text-[#50627f]">{document.version}</p>
                    {document.aiSummary && <div className="mt-4 rounded-xl border border-[#c9d8ec] bg-[#f8fbff] p-4"><ClinicalLayerBadge layer="sintese_ia" /><p className="mt-2 text-sm leading-6 text-[#50627f]">{document.aiSummary}</p></div>}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {document.values && <label className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#dbe4f0] px-3 text-sm font-bold text-[#405675]"><input type="checkbox" checked={selected.includes(document.id)} onChange={() => toggleSelected(document.id)} className="size-4 accent-[#124da0]" />Comparar</label>}
                    {document.originalHref ? <a href={document.originalHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-[#c7d5e7] px-4 text-sm font-bold text-[#124da0]">Abrir original</a> : <button type="button" onClick={() => onNotify('Documento interno aberto no mock.')} className="min-h-11 rounded-xl border border-[#c7d5e7] px-4 text-sm font-bold text-[#124da0]">Abrir versão</button>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {selected.length > 0 && <section className="flex flex-col gap-3 rounded-2xl border border-[#c8d8eb] bg-[#edf3fb] p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-bold text-[#071a3a]">{selected.length} exame(s) selecionado(s) · escolha entre 2 e 3 para comparar</p><button type="button" disabled={comparable.length < 2} onClick={() => setCompareOpen(true)} className="min-h-11 rounded-xl bg-[#071a3a] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45">Comparar valores</button></section>}
      {compareOpen && comparable.length >= 2 && <ExamComparison documents={comparable} />}
    </div>
  );
}

function ExamComparison({ documents }: { documents: ClinicalDocument[] }) {
  const markers = documents[0].values ?? [];
  return (
    <section className="rounded-2xl border border-[#dbe4f0] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold text-[#071a3a]">Comparação objetiva de exames</h2><p className="mt-2 text-sm leading-6 text-[#61718a]">Mostra somente valores transcritos dos originais selecionados. Não classifica, diagnostica ou explica causalidade.</p></div><Status tone="amber">Requer conferência</Status></div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[620px] w-full border-collapse text-left text-sm">
          <thead><tr className="border-b border-[#dbe4f0]"><th className="p-3 text-xs text-[#50627f]">Marcador</th>{documents.map((document) => <th key={document.id} className="p-3 text-xs text-[#50627f]">{document.date}</th>)}<th className="p-3 text-xs text-[#50627f]">Diferença</th></tr></thead>
          <tbody>{markers.map((marker) => { const first = documents[0].values?.find((item) => item.marker === marker.marker); const last = documents.at(-1)?.values?.find((item) => item.marker === marker.marker); const difference = first && last ? last.value - first.value : null; return <tr key={marker.marker} className="border-b border-[#eef3f9] last:border-0"><th className="p-3 font-bold text-[#405675]">{marker.marker}</th>{documents.map((document) => { const value = document.values?.find((item) => item.marker === marker.marker); return <td key={document.id} className="p-3 text-[#50627f]">{value ? `${value.value} ${value.unit}` : 'Não informado'}</td>; })}<td className="p-3 font-bold text-[#071a3a]">{difference === null ? '—' : `${difference > 0 ? '+' : ''}${difference.toFixed(1)} ${marker.unit}`}</td></tr>; })}</tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-5 text-[#50627f]">Sempre confira unidades, método e documento original antes de usar a comparação em uma decisão clínica.</p>
    </section>
  );
}

function EvolutionPanel({ error, incomplete, onNotify }: { error: boolean; incomplete: boolean; onNotify: (text: string) => void }) {
  const [metricKey, setMetricKey] = useState<EvolutionMetric>('weight');
  const [period, setPeriod] = useState('30 dias');
  const metric = evolutionMetrics[metricKey];
  const first = metric.points[0].value;
  const last = metric.points.at(-1)?.value ?? first;

  if (error) {
    return <section className="rounded-2xl border border-[#efc7c3] bg-white p-8 text-center"><Status tone="rose">Erro localizado</Status><h2 className="mt-3 text-xl font-semibold text-[#071a3a]">A evolução não pôde ser carregada</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#61718a]">Documentos e linha do tempo continuam acessíveis. Nenhum valor antigo foi apresentado como atual.</p><button type="button" onClick={() => onNotify('Nova tentativa de carregamento iniciada no mock.')} className="mt-5 min-h-11 rounded-xl bg-[#071a3a] px-4 text-sm font-bold text-white">Tentar novamente</button></section>;
  }

  return (
    <div className="space-y-5">
      {incomplete && <InlineState tone="amber" title="Período incompleto" description="A linha interrompida não foi interpolada. A leitura considera apenas registros confirmados e mostra a cobertura de cada fonte." />}
      <section className="rounded-2xl border border-[#dbe4f0] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#071a3a]">Histórico e evolução</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">Compare períodos e veja o que aconteceu perto de consultas, exames e mudanças no plano, sem afirmar que um evento causou o outro.</p></div><div className="flex gap-2 overflow-x-auto" aria-label="Selecionar período">{['30 dias', '90 dias', '6 meses'].map((item) => <button key={item} type="button" aria-pressed={period === item} onClick={() => setPeriod(item)} className={cn('min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold', period === item ? 'bg-[#071a3a] text-white' : 'border border-[#dbe4f0] text-[#50627f]')}>{item}</button>)}</div></div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Selecionar indicador">{(Object.keys(evolutionMetrics) as EvolutionMetric[]).map((key) => <button key={key} type="button" aria-pressed={metricKey === key} onClick={() => setMetricKey(key)} className={cn('min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold', metricKey === key ? 'bg-[#edf3fb] text-[#124da0] ring-1 ring-[#c8d8eb]' : 'border border-[#dbe4f0] text-[#50627f]')}>{evolutionMetrics[key].label}</button>)}</div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-2xl border border-[#dbe4f0] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-semibold text-[#071a3a]">{metric.label}</h3><p className="mt-1 text-sm text-[#61718a]">{metric.source}</p></div><Status tone="gray">{period}</Status></div>
          <EvolutionChart metricKey={metricKey} />
          <div className="mt-4 rounded-xl bg-[#f6f9fe] p-4"><p className="text-sm font-bold text-[#071a3a]">Mudança observada: {formatMetricValue(first, metric.unit)} → {formatMetricValue(last, metric.unit)}</p><p className="mt-1 text-xs leading-5 text-[#61718a]">A consulta de 11 ago e a publicação do plano v2 em 18 ago coincidiram com este período. O produto não atribui causalidade.</p></div>
        </section>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#dbe4f0] bg-white p-5"><h3 className="text-lg font-semibold text-[#071a3a]">Qualidade dos dados</h3><p className="mt-3 text-sm font-bold text-[#405675]">{metric.completeness}</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7edf5]"><div className="h-full w-[82%] rounded-full bg-[#124da0]" /></div><p className="mt-3 text-xs leading-5 text-[#61718a]">Lacunas permanecem visíveis e não são preenchidas por estimativa.</p></section>
          <section className="rounded-2xl border border-[#dbe4f0] bg-white p-5"><h3 className="text-lg font-semibold text-[#071a3a]">Outros domínios</h3><dl className="mt-4 divide-y divide-[#e7edf5]">{[['Alimentação', '9 refeições confirmadas'], ['Sintomas', '1 relato para revisar'], ['Bem-estar', '11 check-ins'], ['Adesão ao plano', '82% autorrelatada']].map(([label, value]) => <div key={label} className="py-3 first:pt-0"><dt className="text-xs text-[#50627f]">{label}</dt><dd className="mt-1 text-sm font-bold text-[#405675]">{value}</dd></div>)}</dl></section>
        </aside>
      </div>
    </div>
  );
}

function EvolutionChart({ metricKey }: { metricKey: EvolutionMetric }) {
  const metric = evolutionMetrics[metricKey];
  const values = metric.points.map((point) => point.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = Math.max((rawMax - rawMin) * 0.18, rawMax * 0.02, 0.5);
  const min = rawMin - padding;
  const max = rawMax + padding;
  const width = 720;
  const height = 280;
  const left = 62;
  const right = 24;
  const top = 28;
  const bottom = 48;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const x = (index: number) => left + (index / (metric.points.length - 1)) * plotWidth;
  const y = (value: number) => top + ((max - value) / (max - min)) * plotHeight;
  const points = metric.points.map((point, index) => `${x(index)},${y(point.value)}`).join(' ');
  const chartId = `evolution-chart-${metricKey}`;

  return (
    <div className="mt-5">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-labelledby={`${chartId}-title ${chartId}-desc`}>
        <title id={`${chartId}-title`}>{metric.label} nos últimos 30 dias</title>
        <desc id={`${chartId}-desc`}>Gráfico de linha com cinco registros. Há marcadores de consulta em 11 de agosto e publicação do plano em 18 de agosto.</desc>
        {[0, 1, 2, 3].map((index) => { const value = max - (index / 3) * (max - min); const position = top + (index / 3) * plotHeight; return <g key={index}><line x1={left} x2={width - right} y1={position} y2={position} stroke="#dbe4f0" strokeDasharray="4 5" /><text x={left - 10} y={position + 4} textAnchor="end" fill="#50627f" fontSize="11">{formatAxisValue(value, metric.unit)}</text></g>; })}
        {[2, 3].map((index) => <g key={index}><line x1={x(index)} x2={x(index)} y1={top} y2={height - bottom} stroke="#9bb5d4" strokeDasharray="3 5" /><text x={x(index)} y={top - 9} textAnchor="middle" fill="#124da0" fontSize="12">{index === 2 ? 'Consulta' : 'Plano v2'}</text></g>)}
        <polyline points={points} fill="none" stroke={metric.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {metric.points.map((point, index) => <g key={point.date}><circle cx={x(index)} cy={y(point.value)} r="5" fill="white" stroke={metric.color} strokeWidth="3" /><text x={x(index)} y={height - 20} textAnchor="middle" fill="#61718a" fontSize="11">{point.date}</text></g>)}
      </svg>
      <details className="mt-3 rounded-xl border border-[#dbe4f0] bg-[#fbfdff] p-4"><summary className="min-h-11 cursor-pointer text-sm font-bold text-[#071a3a]">Ver dados em tabela</summary><table className="mt-3 w-full text-left text-sm"><thead><tr className="border-b border-[#dbe4f0]"><th className="py-2 text-xs text-[#50627f]">Data</th><th className="py-2 text-xs text-[#50627f]">Valor</th><th className="py-2 text-xs text-[#50627f]">Fonte</th></tr></thead><tbody>{metric.points.map((point) => <tr key={point.date} className="border-b border-[#eef3f9] last:border-0"><td className="py-2 text-[#50627f]">{point.date}</td><td className="py-2 font-bold text-[#071a3a]">{formatMetricValue(point.value, metric.unit)}</td><td className="py-2 text-xs text-[#61718a]">Confirmada no mock</td></tr>)}</tbody></table></details>
    </div>
  );
}

function LoadingState() {
  return <div aria-live="polite" aria-busy="true" className="space-y-4"><span className="sr-only">Carregando histórico do paciente</span>{[120, 260, 420].map((height) => <div key={height} style={{ minHeight: height }} className="animate-pulse rounded-2xl border border-[#dbe4f0] bg-gradient-to-r from-white via-[#edf3fb] to-white motion-reduce:animate-none" />)}</div>;
}

function EmptyPatientState({ onNotify }: { onNotify: (text: string) => void }) {
  return <section className="rounded-2xl border border-dashed border-[#c7d5e7] bg-white p-8 text-center sm:p-12"><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#edf3fb] text-xl font-bold text-[#124da0]">+</span><h2 className="mt-4 text-2xl font-semibold text-[#071a3a]">Paciente novo, histórico ainda vazio</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#61718a]">Comece por dados essenciais, objetivo do cuidado e documentos originais. A IA não cria uma história para preencher a ausência de fontes.</p><button type="button" onClick={() => onNotify('Coleta inicial aberta no mock.')} className="mt-6 min-h-11 rounded-xl bg-[#071a3a] px-5 text-sm font-bold text-white">Iniciar coleta manual</button></section>;
}

function RestrictedState({ onNotify }: { onNotify: (text: string) => void }) {
  return <section className="rounded-2xl border border-[#efc7c3] bg-white p-8 text-center sm:p-12"><Status tone="rose">Acesso restrito</Status><h2 className="mt-4 text-2xl font-semibold text-[#071a3a]">Você não tem permissão para ver estes documentos</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#61718a]">O conteúdo permanece oculto. O protótipo não revela título, resumo ou valores quando o perfil não tem acesso clínico.</p><button type="button" onClick={() => onNotify('Solicitação de acesso registrada no mock.')} className="mt-6 min-h-11 rounded-xl border border-[#c7d5e7] px-5 text-sm font-bold text-[#124da0]">Solicitar acesso</button></section>;
}

function InlineState({ tone, title, description }: { tone: 'amber' | 'rose'; title: string; description: string }) {
  return <div role="status" className={cn('rounded-2xl border p-4', tone === 'amber' ? 'border-[#ead8ad] bg-[#fffdf8]' : 'border-[#efc7c3] bg-[#fff8f7]')}><div className="flex flex-col gap-2 sm:flex-row sm:items-start"><Status tone={tone}>{title}</Status><p className="text-sm leading-6 text-[#50627f]">{description}</p></div></div>;
}

function formatMetricValue(value: number, unit: string) {
  if (unit === 'passos') return `${Math.round(value).toLocaleString('pt-BR')} passos`;
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${unit}`;
}

function formatAxisValue(value: number, unit: string) {
  if (unit === 'passos') return `${Math.round(value / 100) * 100}`;
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}
