'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AiDraftBadge, ClinicalLayerBadge } from './clinical';
import { DoctorAiPreparationWorkspace } from './doctor-ai-preparation-workspace';
import { DoctorCareCycleSummary } from './doctor-care-cycle-summary';
import { DEFAULT_PATIENT_ID, getDefaultEncounterId } from './demo-routes';
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
    label: 'Peso', unit: 'kg', color: '#0b7b68', source: 'Pesagens confirmadas pela paciente', completeness: '5 de 6 registros esperados',
    points: [{ date: '28 jul', value: 80 }, { date: '4 ago', value: 79.6 }, { date: '11 ago', value: 79.1 }, { date: '18 ago', value: 78.7 }, { date: '25 ago', value: 78.2 }],
  },
  sleep: {
    label: 'Sono médio', unit: 'h', color: '#5578a9', source: 'Check-ins e registros de sono autorrelatados', completeness: '23 de 29 noites registradas',
    points: [{ date: '28 jul', value: 6.4 }, { date: '4 ago', value: 6.3 }, { date: '11 ago', value: 6.1 }, { date: '18 ago', value: 5.9 }, { date: '25 ago', value: 5.7 }],
  },
  activity: {
    label: 'Passos médios', unit: 'passos', color: '#825b0b', source: 'Dispositivo conectado · dados demonstrativos', completeness: '26 de 29 dias sincronizados',
    points: [{ date: '28 jul', value: 5400 }, { date: '4 ago', value: 5900 }, { date: '11 ago', value: 6200 }, { date: '18 ago', value: 6800 }, { date: '25 ago', value: 7200 }],
  },
  adherence: {
    label: 'Adesão autorrelatada', unit: '%', color: '#986415', source: 'Check-ins confirmados pela paciente', completeness: '11 de 14 check-ins respondidos',
    points: [{ date: '28 jul', value: 72 }, { date: '4 ago', value: 76 }, { date: '11 ago', value: 79 }, { date: '18 ago', value: 83 }, { date: '25 ago', value: 82 }],
  },
};

function ArrowLeftIcon() {
  return <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></svg>;
}

function VideoIcon() {
  return <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="6" width="13" height="12" rx="2.5" /><path d="m16 10 5-3v10l-5-3" /></svg>;
}

function MoreIcon() {
  return <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" /></svg>;
}

export function PatientCohort({ patients, onSelectPatient }: { patients: PatientWorkspaceProfile[]; onSelectPatient: (patientId: string) => void }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
  const filtered = patients.filter((patient) => `${patient.name} ${patient.focus}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery));

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#17372f]">Pacientes</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#60766f]">Abra uma pessoa para ver evolução, fontes, pendências e próximos passos em um único dossiê.</p>
        </div>
        <label className="flex min-h-11 items-center rounded-xl border border-[#d7e3df] bg-white px-4 text-sm text-[#526a62] focus-within:ring-2 focus-within:ring-[#0b7b68]">
          <span className="sr-only">Buscar paciente</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" className="w-full bg-transparent outline-none sm:w-56" placeholder="Buscar por nome ou foco" />
        </label>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#dfe8e3] bg-white">
        <div className="grid gap-px bg-[#e7eeea] sm:grid-cols-3">
          {[['Carteira ativa', '22'], ['Revisões humanas', '3'], ['Consultas hoje', '5']].map(([label, value]) => <div key={label} className="bg-white p-4 sm:p-5"><p className="text-xs font-semibold text-[#526a62]">{label}</p><p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#17372f]">{value}</p></div>)}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="mt-5 rounded-2xl border border-dashed border-[#bfd4cd] bg-white p-8 text-center"><h2 className="text-lg font-semibold text-[#17372f]">Nenhum paciente encontrado</h2><p className="mt-2 text-sm text-[#60766f]">Tente outro nome ou foco de acompanhamento.</p></section>
      ) : (
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((patient) => (
            <button key={patient.id} type="button" onClick={() => onSelectPatient(patient.id)} className="group min-h-[280px] rounded-2xl border border-[#dfe8e3] bg-white p-5 text-left transition-colors hover:border-[#8bbcaf] hover:bg-[#fbfdfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
              <span className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-full bg-[#d9eee8] text-sm font-bold text-[#0b6a5b]">{patient.initials}</span><Status tone={patient.tone}>{patient.attention}</Status></span>
              <strong className="mt-5 block text-lg text-[#17372f]">{patient.name}</strong>
              <span className="mt-1 block text-sm text-[#526a62]">{patient.focus}</span>
              <span className="mt-5 block text-2xl font-semibold tracking-[-0.04em] text-[#17372f]">{patient.progress}</span>
              <span className="mt-1 block text-xs text-[#526a62]">desde o último ciclo</span>
              <span className="mt-5 flex min-h-11 items-center justify-between border-t border-[#e7eeea] pt-4 text-sm font-bold text-[#0b6a5b]"><span>Abrir dossiê</span><span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
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

  return (
    <div id="patient-longitudinal-workspace" className="min-w-0">
      <section className="-mx-4 border-b border-[#dfe8e3] bg-[#f4f7f5]/95 px-4 pb-3 sm:-mx-5 sm:px-5 sm:pb-4 lg:-mx-9 lg:px-9 xl:sticky xl:top-[72px] xl:z-30 xl:backdrop-blur">
        <div className="mx-auto max-w-[1240px] pt-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/medico/pacientes" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-bold text-[#526a62] hover:bg-white hover:text-[#17372f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68]">
              <ArrowLeftIcon /> Voltar aos pacientes
            </Link>
            <label className="hidden min-h-11 items-center gap-2 rounded-xl border border-[#d7e3df] bg-white px-3 text-xs font-semibold text-[#60766f] focus-within:ring-2 focus-within:ring-[#0b7b68] focus-within:ring-offset-2 sm:flex">
              Paciente
              <select value={patient.id} onChange={(event) => onSelectPatient(event.target.value)} className="max-w-[180px] bg-transparent font-bold text-[#17372f] focus-visible:outline-none">
                {patients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:mt-3 sm:gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d9eee8] text-sm font-bold text-[#0b6a5b] ring-1 ring-[#bfd4cd]">{patient.initials}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-semibold tracking-[-0.035em] text-[#17372f] sm:text-3xl">{patient.name}</h1>
                  <Status tone={patient.tone}>{patient.attention} para revisar</Status>
                  <Status tone="gray">Dados fictícios</Status>
                </div>
                <p className="mt-1 text-xs leading-5 text-[#60766f] sm:text-sm">38 anos · {patient.focus} · {patient.cycle}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={runPrimaryAction} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#17372f] px-4 text-sm font-bold text-white hover:bg-[#24483e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2 sm:flex-none">
                <VideoIcon /> {primaryLabel}
              </button>
              <details className="relative">
                <summary aria-label="Abrir mais ações" className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-[#bfd4cd] bg-white text-[#0b6a5b] hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68]">
                  <MoreIcon />
                </summary>
                <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[#d7e3df] bg-white p-2 shadow-[0_18px_48px_rgba(23,55,47,0.16)]">
                  {[
                    ['Solicitar informação à paciente', () => onMessage(patient.id)],
                    ['Criar pedido de exame', () => onNotify('Novo pedido de exame aberto como rascunho demonstrativo.')],
                    ['Registrar observação', () => onNotify('Campo de observação médica aberto no mock.')],
                    ['Revisar síntese assistida', () => { window.location.hash = 'patient-overview'; setActiveTab('overview'); document.getElementById('doctor-ai-preparation-workspace')?.scrollIntoView({ block: 'start' }); }],
                  ].map(([label, action]) => (
                    <button key={label as string} type="button" onClick={action as () => void} className="min-h-11 w-full rounded-xl px-3 text-left text-sm font-semibold text-[#405d54] hover:bg-[#f4f7f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68]">{label as string}</button>
                  ))}
                  <div className="my-2 border-t border-[#e7eeea]" />
                  <label className="block px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#526a62]" htmlFor="demo-scenario">Cenário do protótipo</label>
                  <select id="demo-scenario" value={scenario} onChange={(event) => setScenario(event.target.value as DemoScenario)} className="min-h-11 w-full rounded-xl border border-[#d7e3df] bg-white px-3 text-sm text-[#405d54] outline-none focus:ring-2 focus:ring-[#0b7b68]">
                    {scenarioLabels.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </div>
              </details>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#60766f] sm:mt-3">
            <span><strong className="text-[#17372f]">Plano:</strong> v2 publicado</span>
            <span className="hidden sm:inline"><strong className="text-[#17372f]">Última consulta:</strong> 28 jul · 09:30</span>
            <span><strong className="text-[#17372f]">Próxima:</strong> {patient.nextConsultation}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px]">
        <div className="rounded-xl border border-[#d7e3df] bg-[#f8faf9] p-3 text-xs leading-5 text-[#526a62] sm:rounded-2xl sm:p-4 sm:text-sm sm:leading-6">
          <strong className="text-[#17372f]">Visão auxiliar.</strong> Não substitui o prontuário oficial.<span className="hidden sm:inline"> Originais, autoria, versões e revisão humana permanecem identificados.</span>
        </div>

        <nav aria-label="Áreas do dossiê longitudinal" className="mt-3 overflow-x-auto rounded-2xl border border-[#dfe8e3] bg-white p-1.5 sm:mt-4">
          <div className="flex min-w-max gap-1">
            {patientTabs.map((tab) => (
              <a
                key={tab.id}
                id={`patient-tab-${tab.id}`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                href={`#patient-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex min-h-12 min-w-[155px] flex-1 flex-col justify-center rounded-xl px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68]',
                  activeTab === tab.id ? 'bg-[#17372f] text-white' : 'text-[#405d54] hover:bg-[#f4f7f5]',
                )}
              >
                <span className="text-sm font-bold">{tab.label}</span>
                <span className={cn('mt-0.5 text-[11px]', activeTab === tab.id ? 'text-[#c7ddd6]' : 'text-[#526a62]')}>{tab.description}</span>
              </a>
            ))}
          </div>
        </nav>

        <section id={`patient-panel-${activeTab}`} aria-labelledby={`patient-tab-${activeTab}`} className="mt-3 min-w-0 scroll-mt-44 sm:mt-5">
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
  const metrics = patient.id === DEFAULT_PATIENT_ID
    ? [['Peso atual', '78,2 kg', '−1,8 kg no ciclo'], ['Sono médio', '5h42', '23 de 29 noites'], ['Atividade', '7.200', 'passos médios'], ['Adesão', patient.adherence, '11 de 14 check-ins']]
    : patient.report.metrics.map(([label, value]) => [label, value, 'fonte demonstrativa']);

  return (
    <div className="space-y-5">
      {scenario === 'incomplete' && <InlineState tone="amber" title="Dados incompletos" description="Seis dias não têm registros de sono e três check-ins ainda não foram respondidos. A síntese preserva essas lacunas." />}
      {scenario === 'error' && <InlineState tone="rose" title="Uma fonte não carregou" description="O exame mais recente está temporariamente indisponível. Os demais módulos e o acesso manual continuam funcionando." />}

      <section aria-labelledby="review-now-title" className="overflow-hidden rounded-2xl bg-[#17372f] text-white">
        <div className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center sm:gap-5 sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Status tone="amber">Requer revisão humana</Status>
              <span className="text-xs font-semibold text-[#b9d6cd]">Fonte: 23 noites + 11 check-ins</span>
            </div>
            <h2 id="review-now-title" className="mt-2 text-lg font-semibold tracking-[-0.02em] sm:mt-3 sm:text-2xl">O que revisar agora</h2>
            <p className="mt-1 max-w-3xl text-sm leading-5 text-[#d3e4df] sm:mt-2 sm:leading-6">{attentionDetail}</p>
            <p className="mt-2 text-[11px] leading-4 text-[#b9d6cd] sm:mt-3 sm:text-xs sm:leading-5">Associação temporal observada; não define causa, diagnóstico, urgência ou conduta.</p>
          </div>
          <button type="button" onClick={() => onNotify('Fontes do sono abertas para conferência no mock.')} className="min-h-11 rounded-xl bg-white px-4 text-sm font-bold text-[#17372f] hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#17372f]">Conferir fontes</button>
        </div>
      </section>

      <dl className="grid overflow-hidden rounded-2xl border border-[#dfe8e3] bg-[#e7eeea] sm:grid-cols-2 xl:grid-cols-4">
        {metrics.slice(0, 4).map(([label, value, detail]) => (
          <div key={label} className="bg-white p-4 sm:p-5">
            <dt className="text-xs font-semibold text-[#526a62]">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[#17372f]">{value}</dd>
            <p className="mt-1 text-xs text-[#60766f]">{detail}</p>
          </div>
        ))}
      </dl>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#dfe8e3] bg-white">
          <DoctorCareCycleSummary patientId={patient.id} encounterId={getDefaultEncounterId(patient.id)} />
        </div>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#17372f]">Situação do cuidado</h2>
            <dl className="mt-4 divide-y divide-[#e7eeea]">
              {[
                ['Objetivo atual', patient.focus],
                ['Plano vigente', 'v2 · publicado em 28 jul'],
                ['Último contato', patient.lastContact],
                ['Próxima consulta', patient.nextConsultation],
              ].map(([label, value]) => <div key={label} className="py-3 first:pt-0"><dt className="text-xs font-semibold text-[#526a62]">{label}</dt><dd className="mt-1 text-sm font-bold text-[#405d54]">{value}</dd></div>)}
            </dl>
          </section>
          <section className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#17372f]">Próximas ações</h2>
            <ol className="mt-4 space-y-3">
              {patient.nextSteps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-[#526a62]"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e8f4f0] text-xs font-bold text-[#0b6a5b]">{index + 1}</span><span>{step}</span></li>)}
            </ol>
            <button type="button" onClick={() => onMessage(patient.id)} className="mt-5 min-h-11 w-full rounded-xl border border-[#bfd4cd] px-4 text-sm font-bold text-[#0b6a5b] hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68]">Solicitar informação</button>
          </section>
          <details className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
            <summary className="min-h-11 cursor-pointer text-sm font-bold text-[#17372f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68]">Acesso e rastreabilidade</summary>
            <div className="mt-3 space-y-2 text-xs leading-5 text-[#60766f]"><p><strong className="text-[#17372f]">Perfil:</strong> médico responsável · simulação.</p><p><strong className="text-[#17372f]">Paciente:</strong> vê somente versões publicadas.</p><p><strong className="text-[#17372f]">IA:</strong> ferramenta de apoio, nunca autora clínica.</p><p>Autorização real e log legal dependem de backend e não são simulados como concluídos.</p></div>
          </details>
        </aside>
      </div>

      {scenario === 'ai-unavailable' ? (
        <section className="rounded-2xl border border-[#dfe8e3] bg-white p-6">
          <Status tone="gray">IA indisponível</Status>
          <h2 className="mt-3 text-xl font-semibold text-[#17372f]">Fluxo manual preservado</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#60766f]">O profissional continua com relatos originais, documentos e linha do tempo. Nenhum conteúdo assistido é necessário para atender ou registrar a consulta.</p>
          <button type="button" onClick={() => onNotify('Fontes originais abertas sem geração assistida.')} className="mt-5 min-h-11 rounded-xl border border-[#bfd4cd] px-4 text-sm font-bold text-[#0b6a5b]">Abrir fontes originais</button>
        </section>
      ) : (
        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#dce6f2] bg-white">
          <DoctorAiPreparationWorkspace key={`ai-${patient.id}-${scenario}`} patientId={patient.id} patientName={patient.name} encounterId={getDefaultEncounterId(patient.id)} conflictMode={scenario === 'conflict'} onNotify={onNotify} />
        </div>
      )}
    </div>
  );
}

function TimelinePanel({ patient }: { patient: PatientWorkspaceProfile }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dfe8e3] bg-white">
      <div className="border-b border-[#e7eeea] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#17372f]">Linha do tempo clínica</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#60766f]">Eventos de diferentes origens em ordem cronológica, com autoria, versão, estado de revisão e limitações visíveis.</p></div>
          <Status tone="gray">18 eventos demonstrativos</Status>
        </div>
        <p className="mt-4 text-xs leading-5 text-[#526a62]">Para grandes volumes, use os filtros abaixo; a tela mantém o recorte atual sem ocultar a existência de outros registros.</p>
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
      <section className="rounded-2xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#17372f]">Documentos e histórico clínico</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#60766f]">Originais preservados junto das versões, resumos assistidos e decisões humanas. Um resumo nunca substitui seu documento-fonte.</p></div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => onNotify('Pedido de exame criado como rascunho demonstrativo.')} className="min-h-11 rounded-xl bg-[#17372f] px-4 text-sm font-bold text-white">Criar pedido</button><button type="button" onClick={() => onNotify('Solicitação de documento aberta para a paciente.')} className="min-h-11 rounded-xl border border-[#bfd4cd] px-4 text-sm font-bold text-[#0b6a5b]">Solicitar documento</button></div>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar documentos">
          {documentFilters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={cn('min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold', filter === item.id ? 'bg-[#17372f] text-white' : 'border border-[#d7e3df] bg-white text-[#526a62] hover:bg-[#f4f7f5]')}>{item.label}</button>)}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#bfd4cd] bg-white p-8 text-center"><h3 className="text-lg font-semibold text-[#17372f]">Nenhum documento neste recorte</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#60766f]">O estado vazio não é preenchido por dados de outro paciente. Solicite um documento ou altere o filtro.</p></section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[#dfe8e3] bg-white">
          <div className="divide-y divide-[#e7eeea]">
            {filtered.map((document) => (
              <article key={document.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><Status tone={document.statusTone}>{document.status}</Status><Status tone="gray">{document.origin}</Status>{document.aiSummary && <AiDraftBadge>Resumo IA separado</AiDraftBadge>}</div>
                    <h3 className="mt-3 text-lg font-semibold text-[#17372f]">{document.title}</h3>
                    <p className="mt-1 text-sm text-[#60766f]">{document.date} · {document.author}</p>
                    <p className="mt-2 text-xs font-semibold text-[#526a62]">{document.version}</p>
                    {document.aiSummary && <div className="mt-4 rounded-xl border border-[#c9d8ec] bg-[#f8fbff] p-4"><ClinicalLayerBadge layer="sintese_ia" /><p className="mt-2 text-sm leading-6 text-[#526a62]">{document.aiSummary}</p></div>}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {document.values && <label className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d7e3df] px-3 text-sm font-bold text-[#405d54]"><input type="checkbox" checked={selected.includes(document.id)} onChange={() => toggleSelected(document.id)} className="size-4 accent-[#0b7b68]" />Comparar</label>}
                    {document.originalHref ? <a href={document.originalHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-[#bfd4cd] px-4 text-sm font-bold text-[#0b6a5b]">Abrir original</a> : <button type="button" onClick={() => onNotify('Documento interno aberto no mock.')} className="min-h-11 rounded-xl border border-[#bfd4cd] px-4 text-sm font-bold text-[#0b6a5b]">Abrir versão</button>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {selected.length > 0 && <section className="flex flex-col gap-3 rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-bold text-[#17372f]">{selected.length} exame(s) selecionado(s) · escolha entre 2 e 3 para comparar</p><button type="button" disabled={comparable.length < 2} onClick={() => setCompareOpen(true)} className="min-h-11 rounded-xl bg-[#17372f] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45">Comparar valores</button></section>}
      {compareOpen && comparable.length >= 2 && <ExamComparison documents={comparable} />}
    </div>
  );
}

function ExamComparison({ documents }: { documents: ClinicalDocument[] }) {
  const markers = documents[0].values ?? [];
  return (
    <section className="rounded-2xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold text-[#17372f]">Comparação objetiva de exames</h2><p className="mt-2 text-sm leading-6 text-[#60766f]">Mostra somente valores transcritos dos originais selecionados. Não classifica, diagnostica ou explica causalidade.</p></div><Status tone="amber">Requer conferência</Status></div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[620px] w-full border-collapse text-left text-sm">
          <thead><tr className="border-b border-[#dfe8e3]"><th className="p-3 text-xs text-[#526a62]">Marcador</th>{documents.map((document) => <th key={document.id} className="p-3 text-xs text-[#526a62]">{document.date}</th>)}<th className="p-3 text-xs text-[#526a62]">Diferença</th></tr></thead>
          <tbody>{markers.map((marker) => { const first = documents[0].values?.find((item) => item.marker === marker.marker); const last = documents.at(-1)?.values?.find((item) => item.marker === marker.marker); const difference = first && last ? last.value - first.value : null; return <tr key={marker.marker} className="border-b border-[#edf2ef] last:border-0"><th className="p-3 font-bold text-[#405d54]">{marker.marker}</th>{documents.map((document) => { const value = document.values?.find((item) => item.marker === marker.marker); return <td key={document.id} className="p-3 text-[#526a62]">{value ? `${value.value} ${value.unit}` : 'Não informado'}</td>; })}<td className="p-3 font-bold text-[#17372f]">{difference === null ? '—' : `${difference > 0 ? '+' : ''}${difference.toFixed(1)} ${marker.unit}`}</td></tr>; })}</tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-5 text-[#526a62]">Sempre confira unidades, método e documento original antes de usar a comparação em uma decisão clínica.</p>
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
    return <section className="rounded-2xl border border-[#efc7c3] bg-white p-8 text-center"><Status tone="rose">Erro localizado</Status><h2 className="mt-3 text-xl font-semibold text-[#17372f]">A evolução não pôde ser carregada</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#60766f]">Documentos e linha do tempo continuam acessíveis. Nenhum valor antigo foi apresentado como atual.</p><button type="button" onClick={() => onNotify('Nova tentativa de carregamento iniciada no mock.')} className="mt-5 min-h-11 rounded-xl bg-[#17372f] px-4 text-sm font-bold text-white">Tentar novamente</button></section>;
  }

  return (
    <div className="space-y-5">
      {incomplete && <InlineState tone="amber" title="Período incompleto" description="A linha interrompida não foi interpolada. A leitura considera apenas registros confirmados e mostra a cobertura de cada fonte." />}
      <section className="rounded-2xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#17372f]">Evolução longitudinal</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#60766f]">Compare períodos e observe coincidências com consultas, exames e versões do plano sem converter associação em causa.</p></div><div className="flex gap-2 overflow-x-auto" aria-label="Selecionar período">{['30 dias', '90 dias', '6 meses'].map((item) => <button key={item} type="button" aria-pressed={period === item} onClick={() => setPeriod(item)} className={cn('min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold', period === item ? 'bg-[#17372f] text-white' : 'border border-[#d7e3df] text-[#526a62]')}>{item}</button>)}</div></div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Selecionar indicador">{(Object.keys(evolutionMetrics) as EvolutionMetric[]).map((key) => <button key={key} type="button" aria-pressed={metricKey === key} onClick={() => setMetricKey(key)} className={cn('min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold', metricKey === key ? 'bg-[#e8f4f0] text-[#0b6a5b] ring-1 ring-[#b9d8cf]' : 'border border-[#d7e3df] text-[#526a62]')}>{evolutionMetrics[key].label}</button>)}</div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-2xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-semibold text-[#17372f]">{metric.label}</h3><p className="mt-1 text-sm text-[#60766f]">{metric.source}</p></div><Status tone="gray">{period}</Status></div>
          <EvolutionChart metricKey={metricKey} />
          <div className="mt-4 rounded-xl bg-[#f4f7f5] p-4"><p className="text-sm font-bold text-[#17372f]">Mudança observada: {formatMetricValue(first, metric.unit)} → {formatMetricValue(last, metric.unit)}</p><p className="mt-1 text-xs leading-5 text-[#60766f]">A consulta de 11 ago e a publicação do plano v2 em 18 ago coincidiram com este período. O produto não atribui causalidade.</p></div>
        </section>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#dfe8e3] bg-white p-5"><h3 className="text-lg font-semibold text-[#17372f]">Qualidade dos dados</h3><p className="mt-3 text-sm font-bold text-[#405d54]">{metric.completeness}</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7eeea]"><div className="h-full w-[82%] rounded-full bg-[#0b7b68]" /></div><p className="mt-3 text-xs leading-5 text-[#60766f]">Lacunas permanecem visíveis e não são preenchidas por estimativa.</p></section>
          <section className="rounded-2xl border border-[#dfe8e3] bg-white p-5"><h3 className="text-lg font-semibold text-[#17372f]">Outros domínios</h3><dl className="mt-4 divide-y divide-[#e7eeea]">{[['Alimentação', '9 refeições confirmadas'], ['Sintomas', '1 relato para revisar'], ['Bem-estar', '11 check-ins'], ['Adesão ao plano', '82% autorrelatada']].map(([label, value]) => <div key={label} className="py-3 first:pt-0"><dt className="text-xs text-[#526a62]">{label}</dt><dd className="mt-1 text-sm font-bold text-[#405d54]">{value}</dd></div>)}</dl></section>
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
        {[0, 1, 2, 3].map((index) => { const value = max - (index / 3) * (max - min); const position = top + (index / 3) * plotHeight; return <g key={index}><line x1={left} x2={width - right} y1={position} y2={position} stroke="#dfe8e3" strokeDasharray="4 5" /><text x={left - 10} y={position + 4} textAnchor="end" fill="#526a62" fontSize="11">{formatAxisValue(value, metric.unit)}</text></g>; })}
        {[2, 3].map((index) => <g key={index}><line x1={x(index)} x2={x(index)} y1={top} y2={height - bottom} stroke="#d9b16c" strokeDasharray="3 5" /><text x={x(index)} y={top - 9} textAnchor="middle" fill="#825b0b" fontSize="10">{index === 2 ? 'Consulta' : 'Plano v2'}</text></g>)}
        <polyline points={points} fill="none" stroke={metric.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {metric.points.map((point, index) => <g key={point.date}><circle cx={x(index)} cy={y(point.value)} r="5" fill="white" stroke={metric.color} strokeWidth="3" /><text x={x(index)} y={height - 20} textAnchor="middle" fill="#60766f" fontSize="11">{point.date}</text></g>)}
      </svg>
      <details className="mt-3 rounded-xl border border-[#dfe8e3] bg-[#fbfdfc] p-4"><summary className="min-h-11 cursor-pointer text-sm font-bold text-[#17372f]">Ver dados em tabela</summary><table className="mt-3 w-full text-left text-sm"><thead><tr className="border-b border-[#dfe8e3]"><th className="py-2 text-xs text-[#526a62]">Data</th><th className="py-2 text-xs text-[#526a62]">Valor</th><th className="py-2 text-xs text-[#526a62]">Fonte</th></tr></thead><tbody>{metric.points.map((point) => <tr key={point.date} className="border-b border-[#edf2ef] last:border-0"><td className="py-2 text-[#526a62]">{point.date}</td><td className="py-2 font-bold text-[#17372f]">{formatMetricValue(point.value, metric.unit)}</td><td className="py-2 text-xs text-[#60766f]">Confirmada no mock</td></tr>)}</tbody></table></details>
    </div>
  );
}

function LoadingState() {
  return <div aria-live="polite" aria-busy="true" className="space-y-4"><span className="sr-only">Carregando visão longitudinal</span>{[120, 260, 420].map((height) => <div key={height} style={{ minHeight: height }} className="animate-pulse rounded-2xl border border-[#dfe8e3] bg-gradient-to-r from-white via-[#f0f5f2] to-white motion-reduce:animate-none" />)}</div>;
}

function EmptyPatientState({ onNotify }: { onNotify: (text: string) => void }) {
  return <section className="rounded-2xl border border-dashed border-[#bfd4cd] bg-white p-8 text-center sm:p-12"><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e8f4f0] text-xl font-bold text-[#0b6a5b]">+</span><h2 className="mt-4 text-2xl font-semibold text-[#17372f]">Paciente novo, histórico ainda vazio</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#60766f]">Comece por dados essenciais, objetivo do cuidado e documentos originais. A IA não cria uma história para preencher a ausência de fontes.</p><button type="button" onClick={() => onNotify('Coleta inicial aberta no mock.')} className="mt-6 min-h-11 rounded-xl bg-[#17372f] px-5 text-sm font-bold text-white">Iniciar coleta manual</button></section>;
}

function RestrictedState({ onNotify }: { onNotify: (text: string) => void }) {
  return <section className="rounded-2xl border border-[#efc7c3] bg-white p-8 text-center sm:p-12"><Status tone="rose">Acesso restrito</Status><h2 className="mt-4 text-2xl font-semibold text-[#17372f]">Você não tem permissão para ver estes documentos</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#60766f]">O conteúdo permanece oculto. O protótipo não revela título, resumo ou valores quando o perfil não tem acesso clínico.</p><button type="button" onClick={() => onNotify('Solicitação de acesso registrada no mock.')} className="mt-6 min-h-11 rounded-xl border border-[#bfd4cd] px-5 text-sm font-bold text-[#0b6a5b]">Solicitar acesso</button></section>;
}

function InlineState({ tone, title, description }: { tone: 'amber' | 'rose'; title: string; description: string }) {
  return <div role="status" className={cn('rounded-2xl border p-4', tone === 'amber' ? 'border-[#ead8ad] bg-[#fffdf8]' : 'border-[#efc7c3] bg-[#fff8f7]')}><div className="flex flex-col gap-2 sm:flex-row sm:items-start"><Status tone={tone}>{title}</Status><p className="text-sm leading-6 text-[#526a62]">{description}</p></div></div>;
}

function formatMetricValue(value: number, unit: string) {
  if (unit === 'passos') return `${Math.round(value).toLocaleString('pt-BR')} passos`;
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${unit}`;
}

function formatAxisValue(value: number, unit: string) {
  if (unit === 'passos') return `${Math.round(value / 100) * 100}`;
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}
