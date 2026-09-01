'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useCareDemo } from './care-demo-store';
import { AiDraftBadge, ClinicalLayerBadge, SimulationDisclaimer } from './clinical';
import {
  DEFAULT_ENCOUNTER_ID,
  DEFAULT_PATIENT_ID,
  doctorNavigation,
  getConsultationHref,
  getDefaultEncounterId,
  getPatientDossierHref,
  getPatientMessagesHref,
  getPreConsultationHref,
  type ClinicalRouteMode,
  type DoctorView,
} from './demo-routes';
import { PreConsultationReviewWorkspace } from './doctor-preconsultation-review';
import { DoctorCarePlanWorkspace } from './doctor-care-plan-workspace';
import { LongitudinalDossier } from './longitudinal-dossier';
import { cn, Heading, Status, Toast } from './shared';
import { useSessionDemoState } from './use-session-demo-state';

type AppointmentTone = 'green' | 'amber' | 'rose' | 'blue' | 'gray';
type Appointment = {
  patientId: string;
  encounterId: string;
  time: string;
  patient: string;
  initials: string;
  type: string;
  status: string;
  statusTone: AppointmentTone;
  preVisit: string;
  preVisitTone: AppointmentTone;
  objective: string;
  reported: string;
  aiFocus: string;
  metrics: Array<[string, string, string]>;
  attentionTitle: string;
  attentionDetail: string;
  checklist: string[];
};

interface DoctorDemoUiState {
  reportApproved: boolean;
  overdueReminderSent: boolean;
}

const initialDoctorDemoUiState: DoctorDemoUiState = {
  reportApproved: false,
  overdueReminderSent: false,
};

function normalizeDoctorDemoUiState(value: unknown): DoctorDemoUiState {
  const stored = typeof value === 'object' && value !== null ? value as Partial<DoctorDemoUiState> : {};
  return {
    reportApproved: typeof stored.reportApproved === 'boolean' ? stored.reportApproved : false,
    overdueReminderSent: typeof stored.overdueReminderSent === 'boolean' ? stored.overdueReminderSent : false,
  };
}

const alerts = [
  {
    patient: 'Marina Costa',
    detail: 'Sono abaixo do padrão pessoal por 4 dias',
    context: 'Média de 5h42, 18% abaixo do padrão das últimas quatro semanas.',
    tag: 'Revisar hoje',
    tone: 'amber' as const,
  },
  {
    patient: 'Paulo Mendes',
    detail: 'Relatou enjoo após atualização do plano',
    context: 'Novo sintoma informado no check-in das 08:12. Ainda sem resposta.',
    tag: 'Nova mensagem',
    tone: 'rose' as const,
  },
  {
    patient: 'Ana Ribeiro',
    detail: 'Relatório quinzenal pronto para aprovação',
    context: 'A IA reuniu adesão, peso, sono e observações. Requer revisão médica.',
    tag: 'Relatório',
    tone: 'blue' as const,
  },
];

const appointments: Appointment[] = [
  {
    patientId: 'pac-demo-005',
    encounterId: 'enc-demo-001',
    time: '09:00',
    patient: 'Lúcia Barbosa',
    initials: 'LB',
    type: 'Retorno longevidade · 30 min',
    status: 'Concluída',
    statusTone: 'gray',
    preVisit: 'Pré-consulta revisada',
    preVisitTone: 'green',
    objective: '“Quero manter minha energia ao longo do dia e recuperar segurança nos exercícios.”',
    reported: 'Boa disposição pela manhã, uma queda de energia à tarde e nenhum sintoma novo.',
    aiFocus: 'Revisar distribuição das atividades e percepção de esforço, sem ampliar metas automaticamente.',
    metrics: [['Energia', '4 de 5', '+1 ponto'], ['Passos', '7.280', '+6%'], ['Sono', '7h04', 'regular']],
    attentionTitle: 'Sem alerta clínico novo',
    attentionDetail: 'A variação de energia foi registrada para contextualização médica, sem inferência diagnóstica.',
    checklist: ['Validar energia à tarde', 'Revisar percepção de esforço', 'Definir próximo acompanhamento'],
  },
  {
    patientId: DEFAULT_PATIENT_ID,
    encounterId: DEFAULT_ENCOUNTER_ID,
    time: '10:30',
    patient: 'Marina Costa',
    initials: 'MC',
    type: 'Retorno · 30 min',
    status: 'Próxima',
    statusTone: 'green',
    preVisit: 'Texto concluído · resumo pronto',
    preVisitTone: 'green',
    objective: '“Quero continuar perdendo peso sem ficar cansada e voltar a dormir melhor.”',
    reported: 'Mais saciedade, sono pior nesta semana e nenhum sintoma novo.',
    aiFocus: 'Priorizar sono e energia antes de ampliar metas.',
    metrics: [['Peso', '78,2 kg', '−1,8 kg'], ['Adesão', '82%', '+6 p.p.'], ['Sono', '5h42', 'abaixo do padrão']],
    attentionTitle: 'Sono fora do padrão pessoal',
    attentionDetail: 'Quatro noites abaixo de seis horas. Dados do relógio são demonstrativos e não equivalem a diagnóstico.',
    checklist: ['Validar sono', 'Confirmar tolerância', 'Decidir próximo passo'],
  },
  {
    patientId: 'pac-demo-004',
    encounterId: 'enc-demo-003',
    time: '11:30',
    patient: 'Rafael Lima',
    initials: 'RL',
    type: 'Primeira consulta · 50 min',
    status: 'Confirmada',
    statusTone: 'green',
    preVisit: 'Anamnese 68% concluída',
    preVisitTone: 'amber',
    objective: '“Quero entender por que estou cansado e começar uma rotina que eu consiga manter.”',
    reported: 'Cansaço ao fim do dia, rotina irregular e dois exames anexados para revisão.',
    aiFocus: 'Completar lacunas da anamnese e organizar perguntas para a avaliação inicial.',
    metrics: [['Anamnese', '68%', '3 lacunas'], ['Exames', '2', 'anexados'], ['Sono', '6h18', 'relatado']],
    attentionTitle: 'Anamnese ainda incompleta',
    attentionDetail: 'Faltam histórico familiar, uso atual de suplementos e contexto do cansaço relatado.',
    checklist: ['Completar histórico', 'Revisar exames anexados', 'Definir objetivo inicial'],
  },
  {
    patientId: 'pac-demo-002',
    encounterId: 'enc-demo-004',
    time: '14:00',
    patient: 'Ana Ribeiro',
    initials: 'AR',
    type: 'Retorno força · 30 min',
    status: 'Confirmada',
    statusTone: 'green',
    preVisit: 'Texto concluído · relatório pronto',
    preVisitTone: 'blue',
    objective: '“Quero continuar ganhando força sem perder energia para o restante da semana.”',
    reported: 'Treinos pela manhã facilitaram a rotina e a energia permaneceu estável.',
    aiFocus: 'Validar progressão de força e revisar o relatório mensal antes de qualquer ajuste.',
    metrics: [['Adesão', '88%', '+8 p.p.'], ['Força', '+12%', '4 semanas'], ['Passos', '7.140', 'estável']],
    attentionTitle: 'Relatório mensal aguarda aprovação',
    attentionDetail: 'A síntese foi organizada pela IA e ainda requer interpretação e aprovação médica.',
    checklist: ['Aprovar relatório', 'Revisar progressão de força', 'Confirmar energia semanal'],
  },
  {
    patientId: 'pac-demo-003',
    encounterId: 'enc-demo-005',
    time: '16:30',
    patient: 'Paulo Mendes',
    initials: 'PM',
    type: 'Acompanhamento · 25 min',
    status: 'A confirmar',
    statusTone: 'amber',
    preVisit: 'Novo sintoma no check-in',
    preVisitTone: 'rose',
    objective: '“Quero ajustar minha rotina sem continuar sentindo enjoo.”',
    reported: 'Enjoo após atualização do plano e redução dos registros desde ontem.',
    aiFocus: 'Levar o novo relato ao médico antes de manter ou alterar qualquer orientação.',
    metrics: [['Sintoma', 'Enjoo', 'novo relato'], ['Adesão', '72%', '−8 p.p.'], ['Check-ins', '5 de 7', '2 ausentes']],
    attentionTitle: 'Novo sintoma requer avaliação médica',
    attentionDetail: 'O app apenas destacou o relato. Nenhum diagnóstico ou ajuste de conduta foi realizado.',
    checklist: ['Ouvir relato do enjoo', 'Revisar receita vigente', 'Decidir continuidade do plano'],
  },
];

const patients = [
  {
    id: DEFAULT_PATIENT_ID,
    nextEncounterId: DEFAULT_ENCOUNTER_ID,
    initials: 'MC',
    name: 'Marina Costa',
    focus: 'Emagrecimento · sono',
    progress: '−1,8 kg',
    attention: 'Sono',
    tone: 'amber' as const,
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 29 de 90',
    lastContact: 'Hoje · 09:18',
    nextConsultation: 'Hoje · 10:30',
    adherence: '82%',
    report: {
      title: 'Relatório quinzenal',
      period: '11–25 de agosto',
      status: 'Revisado em 24 ago',
      summary: 'Evolução consistente de peso e boa adesão. O sono permaneceu abaixo do padrão pessoal em quatro noites.',
      metrics: [['Peso', '−1,8 kg'], ['Adesão', '82%'], ['Sono médio', '6h12']],
    },
    prescription: {
      title: 'Receita digital #RX-1042',
      status: 'Ativa',
      detail: '1 item prescrito · validade até 26 de setembro',
      note: 'Emitida na última consulta e disponibilizada à paciente.',
    },
    insight: {
      title: 'Priorizar sono antes de ampliar metas',
      detail: 'Quatro noites abaixo de seis horas coincidem com menor energia nos check-ins.',
      basis: 'Baseado em 14 dias de dados demonstrativos.',
    },
    activity: [
      ['Hoje · 09:18', 'Pré-consulta por texto concluída'],
      ['Ontem · 20:08', 'Jantar e saciedade registrados'],
      ['24 ago · 16:42', 'Relatório quinzenal revisado'],
    ],
    nextSteps: ['Investigar despertares noturnos', 'Confirmar tolerância ao plano atual', 'Definir meta da próxima quinzena'],
  },
  {
    id: 'pac-demo-002',
    nextEncounterId: 'enc-demo-004',
    initials: 'AR',
    name: 'Ana Ribeiro',
    focus: 'Longevidade · força',
    progress: '+8% adesão',
    attention: 'Relatório',
    tone: 'blue' as const,
    reportCount: '3',
    prescriptionCount: 'Nenhuma',
    cycle: 'Dia 61 de 90',
    lastContact: 'Ontem · 18:40',
    nextConsultation: '28 ago · 14:00',
    adherence: '88%',
    report: {
      title: 'Relatório mensal',
      period: '25 jul–25 ago',
      status: 'Pronto para aprovação',
      summary: 'Aumento de consistência nos exercícios de força, com melhora de energia e manutenção do peso.',
      metrics: [['Adesão', '88%'], ['Força', '+12%'], ['Passos', '7.140']],
    },
    prescription: {
      title: 'Nenhuma receita ativa',
      status: 'Sem pendências',
      detail: 'Não há documentos de prescrição vigentes neste ciclo.',
      note: 'O histórico permanece disponível no prontuário demonstrativo.',
    },
    insight: {
      title: 'Boa resposta à rotina de força',
      detail: 'A adesão aumentou após a troca dos treinos para o período da manhã.',
      basis: 'Padrão observado em quatro semanas demonstrativas.',
    },
    activity: [
      ['Ontem · 18:40', 'Check-in semanal concluído'],
      ['23 ago · 07:32', 'Meta de força registrada'],
      ['20 ago · 15:10', 'Relatório mensal preparado'],
    ],
    nextSteps: ['Aprovar relatório mensal', 'Revisar progressão de força', 'Manter acompanhamento de energia'],
  },
  {
    id: 'pac-demo-003',
    nextEncounterId: 'enc-demo-005',
    initials: 'PM',
    name: 'Paulo Mendes',
    focus: 'Emagrecimento · rotina',
    progress: '72% plano',
    attention: 'Sintoma',
    tone: 'rose' as const,
    reportCount: '1',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 18 de 60',
    lastContact: 'Hoje · 08:12',
    nextConsultation: 'Hoje · 16:30',
    adherence: '72%',
    report: {
      title: 'Relatório semanal',
      period: '18–25 de agosto',
      status: 'Processando',
      summary: 'Adesão moderada, com queda nos registros após relato de enjoo no check-in de hoje.',
      metrics: [['Adesão', '72%'], ['Peso', '−0,6 kg'], ['Check-ins', '5 de 7']],
    },
    prescription: {
      title: 'Receita digital #RX-1051',
      status: 'Requer revisão',
      detail: '1 item prescrito · emitida em 18 de agosto',
      note: 'Novo sintoma relatado após a emissão; documento sinalizado ao médico.',
    },
    insight: {
      title: 'Revisar enjoo antes de manter o plano',
      detail: 'O relato de hoje deve ser avaliado pelo médico antes de qualquer ajuste.',
      basis: 'Alerta criado a partir do relato do paciente, sem diagnóstico.',
    },
    activity: [
      ['Hoje · 08:12', 'Novo sintoma relatado'],
      ['Ontem · 19:26', 'Check-in não concluído'],
      ['22 ago · 12:18', 'Receita acessada pelo paciente'],
    ],
    nextSteps: ['Responder ao relato de enjoo', 'Revisar receita vigente', 'Decidir continuidade do plano'],
  },
  {
    id: 'pac-demo-004',
    nextEncounterId: 'enc-demo-003',
    initials: 'RL',
    name: 'Rafael Lima',
    focus: 'Avaliação inicial',
    progress: 'Novo',
    attention: 'Anamnese',
    tone: 'gray' as const,
    reportCount: '0',
    prescriptionCount: 'Nenhuma',
    cycle: 'Pré-cuidado',
    lastContact: 'Ontem · 11:05',
    nextConsultation: 'Hoje · 11:30',
    adherence: 'Ainda não',
    report: {
      title: 'Sem relatório disponível',
      period: 'Primeira consulta',
      status: 'Aguardando dados',
      summary: 'Os primeiros relatórios serão criados após a avaliação inicial e a definição do plano.',
      metrics: [['Anamnese', '68%'], ['Exames', '2 anexos'], ['Check-ins', 'Ainda não']],
    },
    prescription: {
      title: 'Nenhuma receita emitida',
      status: 'Avaliação inicial',
      detail: 'Prescrições somente poderão ser registradas após avaliação médica.',
      note: 'Nenhuma ação necessária neste momento.',
    },
    insight: {
      title: 'Dados insuficientes para gerar insight',
      detail: 'Concluir anamnese e consulta inicial antes de identificar padrões.',
      basis: 'A IA não deve inferir recomendações sem contexto suficiente.',
    },
    activity: [
      ['Ontem · 11:05', 'Link de anamnese aberto'],
      ['24 ago · 17:20', 'Consulta inicial confirmada'],
      ['24 ago · 17:18', 'Cadastro demonstrativo criado'],
    ],
    nextSteps: ['Concluir anamnese', 'Revisar exames anexados', 'Realizar avaliação inicial'],
  },
];

const marinaDocuments = [
  {
    title: 'Síntese da primeira consulta',
    category: 'Primeira consulta',
    meta: 'PDF · 1 página · 12 ago',
    status: 'Revisão pendente',
    tone: 'amber' as const,
    href: '/docs/doc-demo-001.pdf',
  },
  {
    title: 'Relatório de evolução quinzenal',
    category: 'Evolução',
    meta: 'PDF · 1 página · atualizado hoje',
    status: 'Revisado',
    tone: 'green' as const,
    href: '/docs/doc-demo-002.pdf',
  },
  {
    title: 'Plano de cuidado compartilhado',
    category: 'Plano de cuidado',
    meta: 'PDF · 1 página · versão 1.2',
    status: 'Aprovação médica',
    tone: 'amber' as const,
    href: '/docs/doc-demo-003.pdf',
  },
];

const intelligenceTabs = ['Resumo IA', 'Conversas sintetizadas', 'Fotos e análise'] as const;
type IntelligenceTab = (typeof intelligenceTabs)[number];

const marinaConversations = [
  {
    when: 'Hoje · 09:18',
    channel: 'Pré-consulta por texto · 4 min',
    title: 'Sono melhorou, mas ainda há despertares',
    summary: 'Marina relata duas noites melhores, mantém cansaço ao acordar e quer entender se o horário do jantar interfere no sono.',
    topics: ['Sono', 'Energia', 'Jantar'],
    openItem: 'Perguntar quantas vezes desperta e se volta a dormir rapidamente.',
  },
  {
    when: 'Ontem · 20:08',
    channel: 'Chat · 8 mensagens',
    title: 'Boa saciedade após o jantar',
    summary: 'Registrou o jantar completo e disse que não sentiu necessidade de beliscar mais tarde. A foto da refeição ainda aguarda confirmação.',
    topics: ['Saciedade', 'Foto do prato'],
    openItem: 'Confirmar preparo, porção aproximada e bebida consumida.',
  },
  {
    when: '23 ago · 18:42',
    channel: 'Check-in · 4 respostas',
    title: 'Energia mais baixa em dia de pouco sono',
    summary: 'Relatou energia 2 de 5 após uma noite curta. Não informou novo sintoma e manteve o plano demonstrativo sem alterações.',
    topics: ['Energia', 'Sono', 'Adesão'],
    openItem: 'Validar se houve mudança de rotina, estresse ou consumo de cafeína.',
  },
];

const marinaMeals = [
  {
    image: '/meals/almoco-equilibrado.jpg',
    alt: 'Prato demonstrativo com frango grelhado, arroz integral, feijão preto, salada e abóbora assada.',
    meal: 'Almoço',
    when: 'Ontem · 12:34',
    status: 'Confirmada pela paciente',
    tone: 'green' as const,
    recognized: 'Frango, arroz integral, feijão, folhas, tomate e abóbora.',
    analysis: 'Boa variedade visual de grupos alimentares. A IA não estima adequação clínica sem confirmar porção, preparo, molho e bebida.',
    confidence: 'Alta confiança no reconhecimento visual',
    questions: ['A porção exibida foi consumida inteira?', 'Houve óleo, molho ou bebida fora da foto?'],
  },
  {
    image: '/meals/jantar-omelete.jpg',
    alt: 'Prato demonstrativo com omelete de legumes, batata-doce, brócolis e salada verde.',
    meal: 'Jantar',
    when: 'Ontem · 19:46',
    status: 'Aguardando confirmação',
    tone: 'amber' as const,
    recognized: 'Omelete com vegetais, batata-doce, brócolis e salada.',
    analysis: 'A composição aparente se aproxima do combinado, mas ingredientes, quantidade de ovos e método de preparo precisam ser confirmados.',
    confidence: 'Confiança moderada no preparo',
    questions: ['Quantos ovos foram usados?', 'A batata-doce foi assada com óleo?'],
  },
  {
    image: '/meals/cafe-da-manha.jpg',
    alt: 'Café da manhã demonstrativo com iogurte, mamão, aveia, chia e café preto.',
    meal: 'Café da manhã',
    when: '24 ago · 07:52',
    status: 'Aguardando confirmação',
    tone: 'amber' as const,
    recognized: 'Iogurte, mamão, aveia, chia e café preto.',
    analysis: 'Os itens foram reconhecidos com boa confiança. Tipo de iogurte, quantidades e adições não visíveis mudam qualquer interpretação.',
    confidence: 'Alta confiança nos itens visíveis',
    questions: ['Qual era o tipo de iogurte?', 'Houve açúcar ou outro ingrediente não visível?'],
  },
];

export default function DoctorWorkspace({
  initialView = 'Visão geral',
  patientId = DEFAULT_PATIENT_ID,
  encounterId,
  routeMode = 'workspace',
}: {
  initialView?: DoctorView;
  patientId?: string;
  encounterId?: string;
  routeMode?: ClinicalRouteMode;
}) {
  const router = useRouter();
  const view = initialView;
  const { hydrated } = useCareDemo(patientId, encounterId ?? getDefaultEncounterId(patientId));
  const [selectedAlert, setSelectedAlert] = useState<(typeof alerts)[number] | null>(null);
  const [demoUi, setDemoUi, demoUiHydrated] = useSessionDemoState(
    'instituto-vivans-demo-ui-v1:doctor',
    initialDoctorDemoUiState,
    normalizeDoctorDemoUiState,
  );
  const [toast, setToast] = useState('');
  const approved = demoUi.reportApproved;
  const nudged = demoUi.overdueReminderSent;
  const activeAppointment = routeMode === 'workspace'
    ? null
    : appointments.find((appointment) => appointment.patientId === patientId && appointment.encounterId === encounterId) ?? null;

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3200);
  };

  const openPreparation = (appointment: Appointment) => {
    router.push(getPreConsultationHref(appointment.patientId, appointment.encounterId));
  };

  const openConsultation = (appointment: Appointment) => {
    router.push(getConsultationHref(appointment.patientId, appointment.encounterId));
  };

  const closeClinicalWorkspace = (appointment: Appointment) => {
    router.replace(getPatientDossierHref(appointment.patientId));
  };

  if (!hydrated || !demoUiHydrated) {
    return (
      <main id="main-content" className="mx-auto max-w-[1540px] px-4 py-10 sm:px-6 lg:px-9">
        <div className="rounded-3xl border border-[#dfe8e3] bg-white p-6 text-sm text-[#60766f]">Carregando o contexto demonstrativo com segurança...</div>
      </main>
    );
  }

  return (
    <>
      <div id="doctor-workspace-content" className="mx-auto grid max-w-[1540px] lg:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-72px)] border-r border-[#dfe8e3] bg-white px-4 py-6 lg:block">
          <nav aria-label="Navegação do médico" className="space-y-1">
            {doctorNavigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={view === item.label ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors',
                  view === item.label
                    ? 'bg-[#e8f4f0] text-[#075f52]'
                    : 'text-[#60766f] hover:bg-[#f4f7f5] hover:text-[#17372f]'
                )}
              >
                <span aria-hidden="true" className={cn('size-2 rounded-full', view === item.label ? 'bg-[#0b7b68]' : 'bg-[#b7c7c1]')} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10 rounded-2xl bg-[#17372f] p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9cc7ba]">Pacientes ativos</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-white/8 px-3 py-2.5"><span className="text-xs text-[#c7ddd6]">Total</span><strong className="text-lg">22</strong></div>
              <div className="flex items-center justify-between rounded-xl bg-white/8 px-3 py-2.5"><span className="text-xs text-[#c7ddd6]">Regulares</span><strong className="text-lg text-[#9fe0ce]">17</strong></div>
              <div className="flex items-center justify-between rounded-xl bg-[#fff3df] px-3 py-2.5 text-[#70480e]"><span className="text-xs font-bold">Check-in atrasado</span><strong className="text-lg">5</strong></div>
            </div>
            <button type="button" disabled={nudged} onClick={() => { setDemoUi((current) => ({ ...current, overdueReminderSent: true })); notify('Cutucão enviado para 5 pacientes com check-in atrasado.'); }} className="mt-3 min-h-11 w-full cursor-pointer rounded-xl bg-white px-3 text-xs font-bold text-[#17372f] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fd3c0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17372f] disabled:cursor-default disabled:bg-[#b9d0c9]">
              {nudged ? 'Lembrete enviado' : 'Dar um cutucão nos 5'}
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-[#dfe8e3] bg-[#f8faf9] p-4">
            <p className="text-xs font-bold text-[#45655c]">IA com revisão médica</p>
            <p className="mt-2 text-xs leading-5 text-[#698078]">Sugestões nunca são enviadas ao paciente sem sua aprovação.</p>
          </div>
        </aside>

        <main id="main-content" className="min-w-0 px-4 pb-12 pt-6 sm:px-5 lg:px-9 lg:pt-9">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Navegação do médico">
            {doctorNavigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={view === item.label ? 'page' : undefined}
                className={cn(
                  'flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold',
                  view === item.label ? 'bg-[#17372f] text-white' : 'border border-[#dfe8e3] bg-white text-[#60766f]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {view === 'Visão geral' && (
            <Overview
              onOpenAppointment={openConsultation}
              onOpenPreparation={openPreparation}
              onPatient={(selectedPatientId) => router.push(getPatientDossierHref(selectedPatientId))}
              onAlert={setSelectedAlert}
              onReports={() => router.push('/medico/relatorios')}
            />
          )}
          {view === 'Agenda' && <Agenda onOpenAppointment={openPreparation} onNotify={notify} />}
          {view === 'Pacientes' && (
            <Patients
              patientId={patientId}
              onSelectPatient={(selectedPatientId) => router.push(getPatientDossierHref(selectedPatientId))}
              onStartConsultation={(selectedPatientId, selectedEncounterId) => router.push(getConsultationHref(selectedPatientId, selectedEncounterId))}
              onOpenPreparation={(selectedPatientId, selectedEncounterId) => router.push(getPreConsultationHref(selectedPatientId, selectedEncounterId))}
              onMessage={(selectedPatientId) => router.push(getPatientMessagesHref(selectedPatientId))}
              onNotify={notify}
            />
          )}
          {view === 'Mensagens' && <Messages patientId={patientId} onNotify={notify} />}
          {view === 'Relatórios' && (
            <Reports
              approved={approved}
              onApprove={() => {
                setDemoUi((current) => ({ ...current, reportApproved: true }));
                notify('Relatório aprovado e disponibilizado para Marina.');
              }}
            />
          )}
        </main>
      </div>

      {activeAppointment && (
        <Consultation
          key={`${activeAppointment.encounterId}-${routeMode}`}
          appointment={activeAppointment}
          initialStep={routeMode === 'consultation' ? 'consulta' : 'preparo'}
          onNotify={notify}
          onClose={() => closeClinicalWorkspace(activeAppointment)}
          onComplete={() => {
            const patientName = activeAppointment.patient;
            notify(`Consulta de ${patientName} concluída. O plano só chega à paciente se uma versão for publicada.`);
            closeClinicalWorkspace(activeAppointment);
          }}
        />
      )}
      {selectedAlert && (
        <AlertDrawer
          item={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onResolve={() => {
            setSelectedAlert(null);
            notify('Item marcado como revisado.');
          }}
        />
      )}
      <Toast text={toast} />
    </>
  );
}

function Overview({
  onOpenAppointment,
  onOpenPreparation,
  onPatient,
  onAlert,
  onReports,
}: {
  onOpenAppointment: (appointment: Appointment) => void;
  onOpenPreparation: (appointment: Appointment) => void;
  onPatient: (patientId: string) => void;
  onAlert: (item: (typeof alerts)[number]) => void;
  onReports: () => void;
}) {
  const { latestSubmission, activeReview } = useCareDemo();
  const reviewLabel = !latestSubmission
    ? 'Pré-consulta pendente'
    : activeReview?.status === 'approved'
      ? `Preparo aprovado · v${activeReview.version}`
      : activeReview?.status === 'rejected'
        ? `Rascunho rejeitado · v${activeReview.version}`
        : activeReview?.status === 'draft'
          ? `Revisão em andamento · v${activeReview.version}`
          : 'Aguardando revisão médica';
  const reviewTone = !latestSubmission || activeReview?.status === 'draft'
    ? 'amber'
    : activeReview?.status === 'approved'
      ? 'green'
      : activeReview?.status === 'rejected'
        ? 'rose'
        : 'blue';
  const reviewAction = !latestSubmission
    ? 'Pré-consulta ainda pendente'
    : activeReview?.status === 'approved'
      ? 'Ver preparo aprovado'
      : activeReview?.status === 'draft'
        ? 'Continuar revisão médica'
        : activeReview?.status === 'rejected'
          ? 'Criar nova versão'
          : 'Iniciar revisão médica';
  const preparationChecklist = !latestSubmission
    ? ['Aguardar a pré-consulta', 'Confirmar o objetivo durante a consulta', 'Registrar o contexto manualmente']
    : activeReview?.status === 'approved'
      ? ['Ler o preparo aprovado', 'Confirmar o contexto com a paciente', 'Registrar decisões da consulta']
      : activeReview?.status === 'rejected'
        ? ['Preservar o relato original', 'Criar uma preparação manual', 'Registrar decisões da consulta']
        : ['Ler o relato original da paciente', 'Revisar ou rejeitar o rascunho', 'Registrar dúvidas para a consulta'];
  const summaryCards = [
    { label: 'Consultas hoje', value: '5', detail: 'Próxima às 10:30', action: 'Ver agenda do dia', target: 'agenda-do-dia', dot: 'bg-[#3da58f]' },
    { label: 'Precisam de atenção', value: '3', detail: '1 novo sintoma relatado', action: 'Ver prioridades', target: 'atencao-do-dia', dot: 'bg-[#e49d45]' },
    { label: 'Relatórios pendentes', value: '4', detail: '2 prontos para revisar', action: 'Ver fila de revisão', target: 'relatorios-do-dia', dot: 'bg-[#6997d4]' },
  ];
  const reportQueue = [
    ['Ana Ribeiro', 'Relatório mensal', 'Pronto para aprovação', 'blue'] as const,
    ['Marina Costa', 'Relatório quinzenal', '2 observações para revisar', 'amber'] as const,
    ['Paulo Mendes', 'Relatório semanal', 'Aguardando decisão sobre sintoma', 'rose'] as const,
    ['Lúcia Barbosa', 'Resumo pós-consulta', 'Rascunho criado hoje', 'gray'] as const,
  ];
  const scrollTo = (target: string) => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#c9ddd6] bg-white px-3 py-1 text-xs font-semibold text-[#45655c]">
              Terça-feira, 25 de agosto
            </span>
            <Status tone="amber">Dados demonstrativos</Status>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#15342c] sm:text-4xl">Bom dia, Dr. Guilherme</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-[#60766f]">
            Sua agenda está organizada. Três pacientes merecem uma revisão antes do próximo contato.
          </p>
        </div>
        <button type="button" onClick={() => onOpenAppointment(appointments[1])} className="min-h-12 cursor-pointer rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(11,123,104,0.22)] transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
          Iniciar próxima consulta
        </button>
      </section>

      <section aria-label="Resumo do dia" className="mt-8 grid gap-4 sm:grid-cols-3">
        {summaryCards.map((item) => (
          <button type="button" key={item.label} aria-controls={item.target} onClick={() => scrollTo(item.target)} className="group cursor-pointer rounded-2xl border border-[#dfe8e3] bg-white p-5 text-left shadow-[0_8px_28px_rgba(28,55,47,0.04)] transition-colors hover:border-[#9fc9be] hover:bg-[#fbfdfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#60766f]">{item.label}</p>
              <span aria-hidden="true" className={cn('size-2.5 rounded-full', item.dot)} />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{item.value}</p>
            <p className="mt-1 text-xs font-medium text-[#789087]">{item.detail}</p>
            <p className="mt-4 text-xs font-bold text-[#0b6a5b] group-hover:underline group-hover:underline-offset-4">{item.action} →</p>
          </button>
        ))}
      </section>

      <DayAgendaTimeline onOpenAppointment={onOpenPreparation} />

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <article className="overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white shadow-[0_10px_35px_rgba(28,55,47,0.05)]">
          <div className="flex items-center justify-between border-b border-[#e7eeea] px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Próxima consulta</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Marina Costa</h2>
            </div>
            <Status>10:30</Status>
          </div>
          <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1fr_220px]">
            <div>
              <div className="flex flex-wrap gap-2">
                {['Emagrecimento', 'Saúde do sono', 'Retorno 30 dias'].map((tag) => <Status key={tag} tone="gray">{tag}</Status>)}
                <Status tone={reviewTone}>{reviewLabel}</Status>
              </div>
              <div className="mt-6 rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4">
                <ClinicalLayerBadge layer="relato" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#0b6a5b]">Objetivo nas palavras da paciente</p>
                <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#17372f]">{latestSubmission ? `“${latestSubmission.objective}”` : 'Nenhuma pré-consulta foi enviada nesta sessão demonstrativa.'}</p>
                <p className="mt-2 text-xs text-[#698078]">{latestSubmission ? `Versão ${latestSubmission.version} · enviada em ${latestSubmission.submittedAt} · ciência registrada` : 'O atendimento pode continuar manualmente, sem bloquear a consulta.'}</p>
              </div>
              <h3 className="mt-5 text-sm font-bold">Organização para revisão médica</h3>
              {activeReview ? (
                <div className={cn('mt-3 rounded-2xl border p-4', activeReview.status === 'approved' ? 'border-[#b9d8cf] bg-[#edf7f4]' : activeReview.status === 'rejected' ? 'border-[#e4beb9] bg-[#fdf0ef]' : 'border-[#c9d8ec] bg-[#f7f9fc]')}>
                  <Status tone={activeReview.status === 'approved' ? 'green' : activeReview.status === 'rejected' ? 'rose' : 'amber'}>
                    {activeReview.status === 'approved' ? 'Aprovado para a consulta' : activeReview.status === 'rejected' ? 'Rascunho rejeitado' : 'Rascunho em revisão'}
                  </Status>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#526a62]">{activeReview.content}</p>
                  <p className="mt-3 text-xs text-[#698078]">Versão de revisão {activeReview.version} · atualizada em {activeReview.updatedAt}</p>
                </div>
              ) : latestSubmission?.structuredDraft ? (
                <div className="mt-3 rounded-2xl border border-[#c9d8ec] bg-[#f7f9fc] p-4">
                  <AiDraftBadge />
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#526a62]">{latestSubmission.structuredDraft}</p>
                </div>
              ) : (
                <div className="mt-3"><SimulationDisclaimer>{latestSubmission ? 'A paciente não autorizou a organização assistida. Revise o relato original e prepare a consulta manualmente.' : 'Envie ou aguarde a pré-consulta. Nenhum rascunho será criado sem fonte original.'}</SimulationDisclaimer></div>
              )}
              {latestSubmission && (
                <details className="mt-4 rounded-2xl border border-[#dfe8e3] bg-white p-4">
                  <summary className="cursor-pointer text-sm font-bold text-[#0b6a5b]">Ver todas as respostas originais</summary>
                  <dl className="mt-4 space-y-4 text-sm leading-6 text-[#526a62]">
                    <div><dt className="font-bold text-[#17372f]">Mudanças recentes</dt><dd className="mt-1 whitespace-pre-wrap">{latestSubmission.changes}</dd></div>
                    <div><dt className="font-bold text-[#17372f]">Dúvidas</dt><dd className="mt-1 whitespace-pre-wrap">{latestSubmission.questions || 'Não informado.'}</dd></div>
                    <div><dt className="font-bold text-[#17372f]">Contexto adicional</dt><dd className="mt-1 whitespace-pre-wrap">{latestSubmission.additionalContext || 'Não informado.'}</dd></div>
                  </dl>
                </details>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" disabled={!latestSubmission} onClick={() => onOpenPreparation(appointments[1])} className="min-h-11 cursor-pointer rounded-xl bg-[#17372f] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0f2d26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#91a59f]">{reviewAction}</button>
                <button type="button" onClick={() => onPatient(DEFAULT_PATIENT_ID)} className="min-h-11 cursor-pointer px-2 text-sm font-bold text-[#0b7b68] underline decoration-[#9ccdc2] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68]">Ver prontuário completo</button>
              </div>
            </div>
            <div className="rounded-2xl bg-[#f4f7f5] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#698078]">Antes da consulta</p>
              <ol className="mt-4 space-y-3 text-sm text-[#405d54]">
                {preparationChecklist.map((item, index) => <li key={item}><strong className="mr-2 text-[#0b7b68]">{String(index + 1).padStart(2, '0')}</strong>{item}</li>)}
              </ol>
            </div>
          </div>
        </article>

        <article id="atencao-do-dia" className="scroll-mt-24 rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-[0_10px_35px_rgba(28,55,47,0.05)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b46a15]">Caixa por exceção</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Quem precisa de você</h2>
            </div>
            <span className="grid size-8 place-items-center rounded-full bg-[#fff0dc] text-sm font-bold text-[#9b5e16]">3</span>
          </div>
          <div className="mt-5 divide-y divide-[#e7eeea]">
            {alerts.map((item) => (
              <button type="button" key={item.patient} onClick={() => onAlert(item)} className="group min-h-20 w-full cursor-pointer py-4 text-left first:pt-0 last:pb-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
                <span className="flex items-start gap-3">
                  <span aria-hidden="true" className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', item.tone === 'amber' ? 'bg-[#e49d45]' : item.tone === 'rose' ? 'bg-[#db766f]' : 'bg-[#6997d4]')} />
                  <span className="min-w-0">
                    <strong className="block text-sm group-hover:text-[#0b7b68]">{item.patient}</strong>
                    <span className="mt-1 block text-xs leading-5 text-[#698078]">{item.detail}</span>
                    <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a9c96]">{item.tag}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section id="relatorios-do-dia" className="mt-6 scroll-mt-24 overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white shadow-[0_10px_35px_rgba(28,55,47,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#e7eeea] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5578a9]">Fila de revisão</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">4 relatórios pendentes</h2></div>
          <button type="button" onClick={onReports} className="min-h-11 cursor-pointer rounded-xl border border-[#bfd4cd] bg-white px-4 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Abrir central de relatórios</button>
        </div>
        <div className="divide-y divide-[#e7eeea]">
          {reportQueue.map((report) => (
            <button type="button" key={report[0]} onClick={onReports} className="grid min-h-20 w-full cursor-pointer gap-2 px-5 py-4 text-left transition-colors hover:bg-[#f8faf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0b7b68] sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:px-6">
              <div><strong className="text-sm text-[#17372f]">{report[0]}</strong><p className="mt-1 text-xs text-[#698078]">{report[1]}</p></div>
              <Status tone={report[3]}>{report[2]}</Status>
              <span className="text-xs font-bold text-[#0b6a5b]">Revisar →</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function DayAgendaTimeline({ onOpenAppointment }: { onOpenAppointment: (appointment: Appointment) => void }) {
  return (
    <section id="agenda-do-dia" className="mt-6 scroll-mt-24 overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white shadow-[0_10px_35px_rgba(28,55,47,0.05)]">
      <div className="flex flex-col gap-3 border-b border-[#e7eeea] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Agenda aberta</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Hoje, consulta por consulta</h2><p className="mt-1 text-xs text-[#698078]">Clique em um nome para abrir a pré-consulta daquele paciente.</p></div>
        <Status>5 consultas</Status>
      </div>
      <div className="px-4 py-3 sm:px-6">
        {appointments.map((appointment, index) => {
          const isNext = appointment.status === 'Próxima';
          return (
            <button type="button" key={`${appointment.time}-${appointment.patient}`} onClick={() => onOpenAppointment(appointment)} aria-label={`Abrir pré-consulta de ${appointment.patient}, às ${appointment.time}`} className={cn('group grid min-h-20 w-full cursor-pointer grid-cols-[58px_22px_minmax(0,1fr)] items-stretch gap-2 rounded-2xl px-2 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2 sm:grid-cols-[70px_24px_minmax(0,1fr)_auto] sm:gap-3 sm:px-3', isNext ? 'bg-[#edf7f4]' : 'hover:bg-[#f8faf9]')}>
              <time className={cn('pt-1 text-sm font-bold', isNext ? 'text-[#0b6a5b]' : 'text-[#526a62]')}>{appointment.time}</time>
              <span aria-hidden="true" className="relative flex justify-center">
                {index < appointments.length - 1 && <span className="absolute bottom-[-28px] top-4 w-px bg-[#d9e4e0]" />}
                <span className={cn('relative mt-1 size-3 rounded-full border-2', isNext ? 'border-[#0b7b68] bg-[#8fd3c0]' : appointment.status === 'Concluída' ? 'border-[#8fa59e] bg-[#d9e4e0]' : 'border-[#9fc9be] bg-white')} />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2"><strong className="text-sm text-[#17372f] group-hover:text-[#0b6a5b]">{appointment.patient}</strong>{isNext && <span className="rounded-full bg-[#0b7b68] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">Próxima</span>}</span>
                <span className="mt-1 block text-xs text-[#698078]">{appointment.type}</span>
                <span className={cn('mt-2 block text-[11px] font-bold', appointment.preVisitTone === 'rose' ? 'text-[#9c453f]' : appointment.preVisitTone === 'amber' ? 'text-[#986415]' : appointment.preVisitTone === 'blue' ? 'text-[#5578a9]' : 'text-[#0b6a5b]')}>{appointment.preVisit}</span>
              </span>
              <span className="hidden items-center gap-3 sm:flex"><Status tone={appointment.statusTone}>{appointment.status}</Status><span className="text-xs font-bold text-[#0b6a5b]">Abrir preparo →</span></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Agenda({ onOpenAppointment, onNotify }: { onOpenAppointment: (appointment: Appointment) => void; onNotify: (text: string) => void }) {
  return (
    <>
      <Heading
        eyebrow="Agenda integrada"
        title="Consultas de hoje"
        description="Encontros, contexto clínico e sala de vídeo reunidos em um único fluxo."
        action={<button type="button" onClick={() => onNotify('Novo agendamento demonstrativo iniciado.')} className="min-h-11 cursor-pointer rounded-xl border border-[#bfd4cd] bg-white px-4 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Novo agendamento</button>}
      />
      <DayAgendaTimeline onOpenAppointment={onOpenAppointment} />
    </>
  );
}

function Patients({
  patientId,
  onSelectPatient,
  onStartConsultation,
  onOpenPreparation,
  onMessage,
  onNotify,
}: {
  patientId: string;
  onSelectPatient: (patientId: string) => void;
  onStartConsultation: (patientId: string, encounterId: string) => void;
  onOpenPreparation: (patientId: string, encounterId: string) => void;
  onMessage: (patientId: string) => void;
  onNotify: (text: string) => void;
}) {
  const [intelligenceTab, setIntelligenceTab] = useState<IntelligenceTab>('Resumo IA');
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);
  const selectedIndex = patients.findIndex((patient) => patient.id === patientId);
  const selected = selectedIndex >= 0 ? patients[selectedIndex] : null;
  const selectedMeal = selectedMealIndex === null ? null : marinaMeals[selectedMealIndex];

  if (!selected) {
    return (
      <>
        <Heading eyebrow="Carteira ativa" title="Dossiê não disponível" description="Este atendimento demonstrativo existe na agenda, mas ainda não possui um dossiê longitudinal preenchido." />
        <section className="mt-7 rounded-3xl border border-[#dfe8e3] bg-white p-6">
          <Status tone="gray">Dados demonstrativos</Status>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#60766f]">Nenhum dado de outra pessoa foi usado como alternativa. Volte à agenda para escolher um atendimento disponível.</p>
          <Link href="/medico/agenda" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#17372f] px-5 text-sm font-bold text-white">Voltar à agenda</Link>
        </section>
      </>
    );
  }

  const openConsultation = () => {
    if (selected.id === DEFAULT_PATIENT_ID) {
      onStartConsultation(selected.id, selected.nextEncounterId);
      return;
    }

    onOpenPreparation(selected.id, selected.nextEncounterId);
  };

  return (
    <>
      <Heading
        eyebrow="Carteira ativa"
        title="Pacientes"
        description="Evolução, próximos passos e sinais fora do padrão individual."
        action={
          <label className="flex min-h-11 items-center rounded-xl border border-[#d7e3df] bg-white px-4 text-sm text-[#698078]">
            <span className="sr-only">Buscar paciente</span>
            <input type="search" className="w-44 bg-transparent outline-none" placeholder="Buscar paciente" />
          </label>
        }
      />
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {patients.map((patient, index) => (
          <button
            type="button"
            key={patient.id}
            aria-pressed={selectedIndex === index}
            onClick={() => {
              setIntelligenceTab('Resumo IA');
              setSelectedMealIndex(null);
              onSelectPatient(patient.id);
            }}
            className={cn(
              'cursor-pointer rounded-3xl border bg-white p-5 text-left shadow-[0_8px_28px_rgba(28,55,47,0.04)] transition-colors hover:border-[#9fc8bd] hover:bg-[#fbfdfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2',
              selectedIndex === index ? 'border-[#8bbcaf] ring-2 ring-[#dceee9]' : 'border-[#dfe8e3]',
            )}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#d9eee8] text-sm font-bold text-[#0b6a5b]">{patient.initials}</span>
              <Status tone={patient.tone}>{patient.attention}</Status>
            </span>
            <strong className="mt-5 block text-base">{patient.name}</strong>
            <span className="mt-1 block text-sm text-[#698078]">{patient.focus}</span>
            <span className="mt-5 block text-2xl font-semibold tracking-[-0.04em]">{patient.progress}</span>
            <span className="mt-1 block text-xs text-[#8a9c96]">desde o último ciclo</span>
            <span className="mt-5 grid grid-cols-2 gap-2 border-t border-[#e7eeea] pt-4">
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a9c96]">Relatórios</span>
                <span className="mt-1 block text-sm font-bold text-[#405d54]">{patient.reportCount}</span>
              </span>
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a9c96]">Receitas</span>
                <span className="mt-1 block text-sm font-bold text-[#405d54]">{patient.prescriptionCount}</span>
              </span>
            </span>
            <span className="mt-4 block min-h-11 rounded-xl border border-[#c9ddd6] px-4 py-3 text-center text-sm font-bold text-[#0b6a5b]">
              {selectedIndex === index ? 'Paciente selecionado' : 'Ver detalhes'}
            </span>
          </button>
        ))}
      </section>

      <section aria-labelledby="selected-patient-title" className="mt-6 overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white shadow-[0_10px_35px_rgba(28,55,47,0.05)]">
        <div className="flex flex-col gap-5 border-b border-[#e7eeea] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#d9eee8] text-base font-bold text-[#0b6a5b]">{selected.initials}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="selected-patient-title" className="text-2xl font-semibold tracking-[-0.03em]">{selected.name}</h2>
                <Status tone="gray">Dados demonstrativos</Status>
              </div>
              <p className="mt-1 text-sm text-[#698078]">{selected.focus} · {selected.cycle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => onMessage(selected.id)} className="min-h-11 cursor-pointer rounded-xl border border-[#bfd4cd] bg-white px-5 text-sm font-bold text-[#0b6a5b] hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
              Enviar mensagem
            </button>
            <button type="button" onClick={openConsultation} className="min-h-11 cursor-pointer rounded-xl bg-[#17372f] px-5 text-sm font-bold text-white hover:bg-[#24483e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
              {selected.id === DEFAULT_PATIENT_ID ? 'Abrir consulta' : 'Ver preparo'}
            </button>
          </div>
        </div>

        <div className="grid gap-px bg-[#e7eeea] sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Ciclo de cuidado', selected.cycle],
            ['Último contato', selected.lastContact],
            ['Próxima consulta', selected.nextConsultation],
            ['Adesão atual', selected.adherence],
          ].map((item) => (
            <div key={item[0]} className="bg-[#f8faf9] px-5 py-4 sm:px-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#789087]">{item[0]}</p>
              <p className="mt-1.5 text-sm font-bold text-[#2d4d44]">{item[1]}</p>
            </div>
          ))}
        </div>

        <LongitudinalDossier key={selected.id} patientId={selected.id} patientName={selected.name} />

        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)_minmax(280px,0.9fr)]">
          <article className="rounded-2xl border border-[#dfe8e3] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#0b7b68]">Relatório mais recente</p>
                <h3 className="mt-2 text-lg font-semibold">{selected.report.title}</h3>
                <p className="mt-1 text-xs text-[#789087]">{selected.report.period}</p>
              </div>
              <Status tone={selected.report.status.includes('aprovação') ? 'amber' : selected.report.status === 'Processando' ? 'blue' : selected.report.status === 'Aguardando dados' ? 'gray' : 'green'}>
                {selected.report.status}
              </Status>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#526a62]">{selected.report.summary}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {selected.report.metrics.map((metric) => (
                <div key={metric[0]} className="rounded-xl bg-[#f4f7f5] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#789087]">{metric[0]}</p>
                  <p className="mt-1 text-sm font-bold text-[#2d4d44]">{metric[1]}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => onNotify(`Relatório demonstrativo de ${selected.name} aberto para revisão.`)} className="mt-5 min-h-11 w-full cursor-pointer rounded-xl border border-[#bfd4cd] text-sm font-bold text-[#0b6a5b] hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
              Abrir relatório completo
            </button>
          </article>

          <article className="rounded-2xl border border-[#dfe8e3] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#0b7b68]">Receitas</p>
              <Status tone={selected.prescription.status === 'Ativa' ? 'green' : selected.prescription.status === 'Requer revisão' ? 'rose' : 'gray'}>
                {selected.prescription.status}
              </Status>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{selected.prescription.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#526a62]">{selected.prescription.detail}</p>
            <div className="mt-4 rounded-xl bg-[#f4f7f5] p-4">
              <p className="text-xs leading-5 text-[#60766f]">{selected.prescription.note}</p>
            </div>
            <button type="button" onClick={() => onNotify(`Histórico demonstrativo de receitas de ${selected.name} aberto.`)} className="mt-5 min-h-11 w-full cursor-pointer rounded-xl border border-[#bfd4cd] text-sm font-bold text-[#0b6a5b] hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
              Ver receitas e histórico
            </button>
          </article>

          <article className="rounded-2xl bg-[#17372f] p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#9fd6c8]">Insight assistido por IA</p>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#d9eee8]">Revisão médica</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold leading-6">{selected.insight.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#d3e4df]">{selected.insight.detail}</p>
            <p className="mt-4 border-t border-white/15 pt-4 text-xs leading-5 text-[#a9c6be]">{selected.insight.basis}</p>
            <button type="button" onClick={() => onNotify('Insight marcado para discutir na próxima consulta.')} className="mt-5 min-h-11 w-full cursor-pointer rounded-xl bg-white px-4 text-sm font-bold text-[#17372f] hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#17372f]">
              Marcar para próxima consulta
            </button>
          </article>
        </div>

        <section aria-labelledby="smart-dossier-title" className="border-t border-[#e7eeea] bg-[#f8faf9] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#0b7b68]">Documentos demonstrativos</p>
              <h3 id="smart-dossier-title" className="mt-2 text-xl font-semibold tracking-[-0.02em]">Documentos do ciclo</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#60766f]">Arquivos fictícios organizados por etapa do acompanhamento. Eles não representam documentos de prontuário nem integrações ativas.</p>
            </div>
            <Status tone={selected.id === DEFAULT_PATIENT_ID ? 'green' : 'gray'}>{selected.id === DEFAULT_PATIENT_ID ? '3 PDFs do mock' : 'Sem arquivos disponíveis'}</Status>
          </div>

          {selected.id === DEFAULT_PATIENT_ID ? (
            <>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {marinaDocuments.map((document) => (
                  <article key={document.href} className="flex min-h-52 flex-col rounded-2xl border border-[#d7e3df] bg-white p-5 shadow-[0_8px_22px_rgba(28,55,47,0.035)]">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e8f4f0] text-xs font-black tracking-[0.08em] text-[#0b6a5b]">PDF</span>
                      <Status tone={document.tone}>{document.status}</Status>
                    </div>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.09em] text-[#789087]">{document.category}</p>
                    <h4 className="mt-1 text-base font-bold leading-6 text-[#17372f]">{document.title}</h4>
                    <p className="mt-2 text-xs text-[#789087]">{document.meta}</p>
                    <a href={document.href} target="_blank" rel="noreferrer" className="mt-auto flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-[#bfd4cd] px-4 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
                      Abrir PDF demonstrativo
                    </a>
                  </article>
                ))}
              </div>
              <article className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#d7e3df] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#17372f] text-[10px] font-black tracking-[0.08em] text-white">RX</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[#17372f]">Receita digital #RX-1042</h4>
                      <Status>Ativa</Status>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-[#698078]">Emitida na última consulta · validade até 26 set · trilha de envio disponível</p>
                  </div>
                </div>
                <button type="button" onClick={() => onNotify('Receita demonstrativa e histórico de acessos abertos.')} className="min-h-11 cursor-pointer rounded-xl border border-[#bfd4cd] px-5 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
                  Ver receita e histórico
                </button>
              </article>
            </>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-[#bfd4cd] bg-white p-6 text-center">
              <p className="text-sm font-bold text-[#405d54]">Nenhum documento demonstrativo disponível para {selected.name}.</p>
              <p className="mt-1 text-xs text-[#789087]">O histórico longitudinal acima continua separado dos PDFs deste ciclo.</p>
            </div>
          )}
        </section>

        <section aria-labelledby="clinical-copilot-title" className="border-t border-[#e7eeea] bg-[#fbfdfc] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#0b7b68]">Copiloto longitudinal</p>
              <h3 id="clinical-copilot-title" className="mt-2 text-xl font-semibold tracking-[-0.02em]">Contexto que se atualiza entre consultas</h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[#60766f]">A IA conecta conversa, documentos, imagens e rotina para reduzir leitura manual e destacar o que merece validação.</p>
            </div>
            <span className="rounded-full border border-[#c9ddd6] bg-white px-3 py-2 text-xs font-bold text-[#526a62]">{selected.id === DEFAULT_PATIENT_ID ? '6 fontes demonstrativas · mock' : 'Sem fontes suficientes'}</span>
          </div>

          <div role="tablist" aria-label="Visões do copiloto clínico" className="mt-5 flex gap-2 overflow-x-auto rounded-2xl border border-[#d7e3df] bg-white p-2">
            {intelligenceTabs.map((tab) => (
              <button
                type="button"
                role="tab"
                key={tab}
                aria-selected={intelligenceTab === tab}
                aria-controls="patient-intelligence-panel"
                onClick={() => setIntelligenceTab(tab)}
                className={cn(
                  'min-h-11 shrink-0 cursor-pointer rounded-xl px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2',
                  intelligenceTab === tab ? 'bg-[#17372f] text-white' : 'text-[#60766f] hover:bg-[#edf7f4] hover:text-[#0b6a5b]',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div id="patient-intelligence-panel" role="tabpanel" className="mt-5">
            {selected.id !== DEFAULT_PATIENT_ID ? (
              <div className="rounded-2xl border border-dashed border-[#bfd4cd] bg-white p-8 text-center">
                <p className="text-sm font-bold text-[#405d54]">Ainda não há contexto suficiente para compor esta visão de {selected.name}.</p>
                <p className="mt-2 text-xs leading-5 text-[#789087]">O copiloto só organiza dados disponíveis e não preenche lacunas com inferências.</p>
              </div>
            ) : (
              <>
                {intelligenceTab === 'Resumo IA' && (
                  <div className="space-y-5">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,1fr)_minmax(260px,0.9fr)]">
                      <article className="rounded-2xl bg-[#17372f] p-5 text-white">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#9fd6c8]">Briefing da próxima consulta</p>
                            <h4 className="mt-2 text-lg font-semibold">Agenda clínica preparada em 42 segundos</h4>
                          </div>
                          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#d9eee8]">Revisar hoje</span>
                        </div>
                        <ol className="mt-5 space-y-3">
                          {['Entender despertares e energia ao acordar', 'Revisar duas refeições ainda não confirmadas', 'Validar exame anexado e meta da quinzena'].map((item, index) => (
                            <li key={item} className="flex items-start gap-3 text-sm leading-5 text-[#d3e4df]">
                              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold text-white">{index + 1}</span>
                              <span className="pt-1">{item}</span>
                            </li>
                          ))}
                        </ol>
                        <button type="button" onClick={() => onNotify('Agenda sugerida adicionada ao preparo da consulta.')} className="mt-5 min-h-11 w-full cursor-pointer rounded-xl bg-white px-4 text-sm font-bold text-[#17372f] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#17372f]">
                          Adicionar ao preparo
                        </button>
                      </article>

                      <article className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0b7b68]">Padrões multimodais explicáveis</p>
                        <div className="mt-4 divide-y divide-[#e7eeea]">
                          <div className="pb-4">
                            <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-bold">Sono curto e energia</h4><Status tone="amber">Hipótese</Status></div>
                            <p className="mt-2 text-sm leading-6 text-[#526a62]">Energia menor apareceu em 3 de 4 dias após noites abaixo de seis horas.</p>
                            <p className="mt-2 text-[11px] font-semibold text-[#8a9c96]">Base: 14 noites + 11 check-ins</p>
                          </div>
                          <div className="pt-4">
                            <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-bold">Registro do jantar e saciedade</h4><Status tone="blue">Observação</Status></div>
                            <p className="mt-2 text-sm leading-6 text-[#526a62]">Dias com refeição confirmada tiveram relatos mais completos de saciedade.</p>
                            <p className="mt-2 text-[11px] font-semibold text-[#8a9c96]">Base: 7 registros demonstrativos</p>
                          </div>
                        </div>
                        <p className="mt-4 rounded-xl bg-[#fff4d8] p-3 text-xs leading-5 text-[#825b0b]">Associação não significa causa. O médico decide se vale investigar.</p>
                      </article>

                      <article className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
                        <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0b7b68]">Lacunas detectadas</p><Status tone="rose">3 itens</Status></div>
                        <div className="mt-4 space-y-3">
                          {[
                            ['Exame anexado', 'Ainda sem revisão médica'],
                            ['2 refeições', 'Aguardam confirmação da paciente'],
                            ['Receita ativa', 'Vence em 31 dias'],
                          ].map((item) => (
                            <div key={item[0]} className="rounded-xl bg-[#f4f7f5] p-3">
                              <p className="text-sm font-bold text-[#405d54]">{item[0]}</p>
                              <p className="mt-1 text-xs text-[#789087]">{item[1]}</p>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => onNotify('Pendências adicionadas à caixa de revisão médica.')} className="mt-4 min-h-11 w-full cursor-pointer rounded-xl border border-[#bfd4cd] text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
                          Revisar pendências
                        </button>
                      </article>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <article className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0b7b68]">Narrativa da paciente</p>
                        <blockquote className="mt-4 border-l-2 border-[#8bc6b9] pl-4 text-base font-semibold leading-7 text-[#2d4d44]">“Estou conseguindo seguir sem sentir que vivo de dieta. Quero dormir a noite inteira e acordar com mais energia.”</blockquote>
                        <p className="mt-3 text-xs leading-5 text-[#789087]">Síntese de 7 conversas · palavras reorganizadas pela IA · trechos originais preservados.</p>
                      </article>
                      <article className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0b7b68]">Capacidades de IA no cuidado</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {[
                            ['Rastreabilidade', 'Cada insight mostra de onde veio.'],
                            ['Linguagem simples', 'Uma versão médica e outra para a paciente.'],
                            ['Contradições', 'Sinaliza divergências entre relato e registros.'],
                            ['Pós-consulta', 'Gera resumo, tarefas e lembretes após aprovação.'],
                          ].map((item) => (
                            <div key={item[0]} className="rounded-xl bg-[#f4f7f5] p-3">
                              <p className="text-sm font-bold text-[#405d54]">{item[0]}</p>
                              <p className="mt-1 text-xs leading-5 text-[#789087]">{item[1]}</p>
                            </div>
                          ))}
                        </div>
                      </article>
                    </div>
                  </div>
                )}

                {intelligenceTab === 'Conversas sintetizadas' && (
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[['Conversas lidas', '7'], ['Mensagens', '18'], ['Questões abertas', '3']].map((item) => (
                          <div key={item[0]} className="rounded-xl border border-[#dfe8e3] bg-white p-4">
                            <p className="text-xs font-semibold text-[#789087]">{item[0]}</p>
                            <p className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#17372f]">{item[1]}</p>
                          </div>
                        ))}
                      </div>
                      {marinaConversations.map((conversation) => (
                        <article key={conversation.when} className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div><p className="text-xs font-bold uppercase tracking-[0.08em] text-[#0b7b68]">{conversation.when}</p><h4 className="mt-1 text-base font-bold text-[#17372f]">{conversation.title}</h4></div>
                            <span className="text-xs font-semibold text-[#789087]">{conversation.channel}</span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[#526a62]">{conversation.summary}</p>
                          <div className="mt-3 flex flex-wrap gap-2">{conversation.topics.map((topic) => <Status key={topic} tone="gray">{topic}</Status>)}</div>
                          <div className="mt-4 rounded-xl bg-[#fff4d8] p-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#825b0b]">Pergunta que ficou aberta</p>
                            <p className="mt-1 text-xs leading-5 text-[#704f10]">{conversation.openItem}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                    <aside className="h-fit rounded-2xl bg-[#17372f] p-5 text-white xl:sticky xl:top-24">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#9fd6c8]">Síntese das últimas conversas</p>
                      <h4 className="mt-3 text-lg font-semibold">O foco espontâneo mudou de peso para energia e sono.</h4>
                      <p className="mt-3 text-sm leading-6 text-[#d3e4df]">A paciente mantém boa adesão percebida e busca entender os despertares, sem pedir alteração de conduta.</p>
                      <div className="mt-5 border-t border-white/15 pt-4">
                        <p className="text-xs font-bold text-white">Próxima melhor pergunta</p>
                        <p className="mt-2 text-sm leading-6 text-[#d3e4df]">“O que acontece antes, durante e depois de cada despertar?”</p>
                      </div>
                      <button type="button" onClick={() => onNotify('Trechos originais e horários usados na síntese abertos.')} className="mt-5 min-h-11 w-full cursor-pointer rounded-xl bg-white px-4 text-sm font-bold text-[#17372f] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#17372f]">
                        Ver trechos usados
                      </button>
                    </aside>
                  </div>
                )}

                {intelligenceTab === 'Fotos e análise' && (
                  <div>
                    <div className="flex flex-col gap-3 rounded-2xl border border-[#c9ddd6] bg-[#edf7f4] p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div><h4 className="text-sm font-bold text-[#17372f]">3 refeições analisadas · 2 aguardam confirmação</h4><p className="mt-1 text-xs leading-5 text-[#60766f]">A IA reconhece itens visíveis e formula perguntas; não calcula adequação clínica como fato.</p></div>
                      <Status tone="amber">Revisão humana</Status>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {marinaMeals.map((meal, index) => (
                        <article key={meal.image} className="overflow-hidden rounded-2xl border border-[#dfe8e3] bg-white">
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#e8eeeb]">
                            <img src={meal.image} alt={meal.alt} loading="lazy" className="h-full w-full object-cover" />
                            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#17372f] shadow-sm">{meal.meal}</span>
                          </div>
                          <div className="p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-[#789087]">{meal.when}</p><Status tone={meal.tone}>{meal.status}</Status></div>
                            <h4 className="mt-3 text-sm font-bold text-[#17372f]">Itens reconhecidos</h4>
                            <p className="mt-1 text-sm leading-6 text-[#526a62]">{meal.recognized}</p>
                            <p className="mt-3 text-[11px] font-semibold text-[#789087]">{meal.confidence}</p>
                            <button type="button" onClick={() => setSelectedMealIndex(index)} className="mt-4 min-h-11 w-full cursor-pointer rounded-xl border border-[#bfd4cd] text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
                              Abrir foto e análise
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                    <p className="mt-4 text-xs leading-5 text-[#789087]">Estimativa visual demonstrativa. Itens ocultos, porções e preparo podem estar incorretos; paciente e médico confirmam antes de qualquer uso.</p>
                  </div>
                )}

              </>
            )}
          </div>
        </section>

        <p className="border-t border-[#e7eeea] bg-[#f4f7f5] px-5 py-4 text-xs leading-5 text-[#789087] sm:px-6">
          Conteúdo demonstrativo. Relatórios, receitas e insights exigem revisão médica e não representam prontuário real.
        </p>
      </section>

      {selectedMeal && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#102a24]/55 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="meal-analysis-title" onClick={() => setSelectedMealIndex(null)}>
          <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dfe8e3] bg-white px-5 py-4 sm:px-6">
              <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0b7b68]">Análise visual demonstrativa</p><h3 id="meal-analysis-title" className="mt-1 text-xl font-semibold">{selectedMeal.meal} · {selectedMeal.when}</h3></div>
              <button type="button" onClick={() => setSelectedMealIndex(null)} aria-label="Fechar análise da refeição" className="grid size-11 cursor-pointer place-items-center rounded-full border border-[#d7e3df] text-xl transition-colors hover:bg-[#f4f7f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">×</button>
            </div>
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <div className="bg-[#edf2ef] p-4 sm:p-6"><img src={selectedMeal.image} alt={selectedMeal.alt} className="h-full max-h-[620px] w-full rounded-2xl object-cover" /></div>
              <div className="p-5 sm:p-6">
                <Status tone={selectedMeal.tone}>{selectedMeal.status}</Status>
                <h4 className="mt-5 text-sm font-bold text-[#17372f]">Itens reconhecidos</h4>
                <p className="mt-2 text-sm leading-6 text-[#526a62]">{selectedMeal.recognized}</p>
                <h4 className="mt-5 text-sm font-bold text-[#17372f]">Leitura assistida</h4>
                <p className="mt-2 text-sm leading-6 text-[#526a62]">{selectedMeal.analysis}</p>
                <p className="mt-3 text-xs font-semibold text-[#789087]">{selectedMeal.confidence}</p>
                <div className="mt-5 rounded-2xl bg-[#fff4d8] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#825b0b]">Perguntas para confirmar</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-[#704f10]">{selectedMeal.questions.map((question) => <li key={question}>{question}</li>)}</ul>
                </div>
                <button type="button" onClick={() => { setSelectedMealIndex(null); onNotify('Itens visíveis confirmados no mock da refeição.'); }} className="mt-5 min-h-11 w-full cursor-pointer rounded-xl bg-[#0b7b68] px-4 text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
                  Confirmar itens visíveis
                </button>
                <p className="mt-4 text-xs leading-5 text-[#789087]">A foto não revela quantidades exatas, ingredientes ocultos ou preparo. Nenhuma decisão clínica é automática.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const messageThreads = [
  {
    patientId: DEFAULT_PATIENT_ID,
    initials: 'MC',
    name: 'Marina Costa',
    preview: 'Consegui registrar o jantar.',
    time: '09:18',
    context: 'Plano iniciado há 29 dias',
    incoming: 'Consegui registrar o jantar. Também dormi melhor esta noite.',
    outgoing: 'Ótimo, Marina. Vou revisar seus registros antes da nossa consulta.',
  },
  {
    patientId: 'pac-demo-003',
    initials: 'PM',
    name: 'Paulo Mendes',
    preview: 'Estou sentindo enjoo hoje.',
    time: '08:12',
    context: 'Acompanhamento · dia 18',
    incoming: 'Estou sentindo enjoo hoje e preferi registrar antes de seguir com a rotina.',
    outgoing: 'Obrigado por avisar, Paulo. Vou revisar seu relato antes de qualquer orientação.',
  },
  {
    patientId: 'pac-demo-002',
    initials: 'AR',
    name: 'Ana Ribeiro',
    preview: 'Obrigada, doutor.',
    time: 'Ontem',
    context: 'Ciclo de força · dia 61',
    incoming: 'Obrigada, doutor. A rotina pela manhã ficou mais fácil de manter.',
    outgoing: 'Ótimo, Ana. Vamos revisar essa evolução na próxima consulta.',
  },
  {
    patientId: 'pac-demo-004',
    initials: 'RL',
    name: 'Rafael Lima',
    preview: 'Vou concluir a anamnese.',
    time: 'Ontem',
    context: 'Avaliação inicial',
    incoming: 'Vou concluir a anamnese e conferir os exames antes da consulta.',
    outgoing: 'Perfeito, Rafael. Se algum campo gerar dúvida, deixe registrado para conversarmos.',
  },
] as const;

function Messages({ patientId, onNotify }: { patientId: string; onNotify: (text: string) => void }) {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const selected = messageThreads.find((thread) => thread.patientId === patientId) ?? null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || !value.trim()) return;
    setValue('');
    setSent(true);
    onNotify(`Mensagem demonstrativa adicionada à conversa de ${selected.name}.`);
  };

  return (
    <>
      <Heading eyebrow="Comunicação segura" title="Mensagens" description="Conversas contextualizadas, sem perder orientações entre canais." />
      <section className="mt-7 grid min-h-[590px] overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white lg:grid-cols-[290px_1fr]">
        <div className="border-b border-[#e7eeea] lg:border-b-0 lg:border-r">
          <div className="p-4"><input aria-label="Buscar conversa" placeholder="Buscar conversa" className="min-h-11 w-full rounded-xl bg-[#f4f7f5] px-4 text-sm outline-none focus:ring-2 focus:ring-[#8bc6b9]" /></div>
          {messageThreads.map((item) => (
            <Link href={getPatientMessagesHref(item.patientId)} key={item.patientId} aria-current={selected?.patientId === item.patientId ? 'page' : undefined} className={cn('flex min-h-20 w-full gap-3 border-t border-[#edf2ef] p-4 text-left', selected?.patientId === item.patientId ? 'bg-[#edf7f4]' : 'hover:bg-[#f8faf9]')}>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#d9eee8] text-xs font-bold text-[#0b6a5b]">{item.initials}</span>
              <span className="min-w-0 flex-1">
                <span className="flex justify-between gap-3"><strong className="text-sm">{item.name}</strong><small className="text-[#8a9c96]">{item.time}</small></span>
                <span className="mt-1 block truncate text-xs text-[#698078]">{item.preview}</span>
              </span>
            </Link>
          ))}
        </div>
        {selected ? (
          <div className="flex min-h-[470px] flex-col">
            <div className="flex items-center gap-3 border-b border-[#e7eeea] p-4 sm:px-6">
              <span className="grid size-10 place-items-center rounded-full bg-[#d9eee8] text-xs font-bold text-[#0b6a5b]">{selected.initials}</span>
              <div><p className="text-sm font-bold">{selected.name}</p><p className="text-xs text-[#698078]">{selected.context}</p></div>
            </div>
            <div className="flex-1 space-y-4 bg-[#f8faf9] p-4 sm:p-6">
              <div className="max-w-[78%] rounded-2xl rounded-tl-md bg-white p-4 text-sm leading-6 shadow-sm">{selected.incoming}<p className="mt-2 text-[11px] text-[#8a9c96]">{selected.time}</p></div>
              <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-[#17372f] p-4 text-sm leading-6 text-white">{selected.outgoing}<p className="mt-2 text-[11px] text-[#b8d3cb]">Dr. Guilherme</p></div>
              {sent && <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-[#0b7b68] p-4 text-sm text-white">Mensagem demonstrativa enviada agora.</div>}
            </div>
            <form onSubmit={submit} className="flex gap-2 border-t border-[#e7eeea] p-4">
              <label className="sr-only" htmlFor="doctor-message">Escrever mensagem para {selected.name}</label>
              <input id="doctor-message" value={value} onChange={(event) => setValue(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#d7e3df] px-4 text-sm outline-none focus:ring-2 focus:ring-[#8bc6b9]" placeholder="Escreva uma mensagem..." />
              <button type="submit" className="min-h-11 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white">Enviar</button>
            </form>
          </div>
        ) : (
          <div className="grid min-h-[470px] place-items-center bg-[#f8faf9] p-6 text-center">
            <div className="max-w-md"><Status tone="gray">Sem conversa demonstrativa</Status><h2 className="mt-4 text-xl font-semibold">Nenhuma conversa foi criada para este contexto.</h2><p className="mt-2 text-sm leading-6 text-[#60766f]">O protótipo não substitui a conversa ausente por mensagens de outra pessoa.</p></div>
          </div>
        )}
      </section>
    </>
  );
}

function Reports({ approved, onApprove }: { approved: boolean; onApprove: () => void }) {
  return (
    <>
      <Heading eyebrow="Evolução longitudinal" title="Relatórios" description="Rascunhos gerados a partir de dados demonstrativos, sempre revisados pelo médico." />
      <section className="mt-7 grid gap-6 xl:grid-cols-[300px_1fr]">
        <div className="space-y-3">
          {[
            ['Marina Costa', 'Quinzenal · pronto'],
            ['Ana Ribeiro', 'Quinzenal · pronto'],
            ['Paulo Mendes', 'Semanal · processando'],
          ].map((item, index) => (
            <button type="button" key={item[0]} className={cn('w-full rounded-2xl border p-4 text-left', index === 0 ? 'border-[#8bbcaf] bg-[#edf7f4]' : 'border-[#dfe8e3] bg-white')}>
              <strong className="block text-sm">{item[0]}</strong><span className="mt-1 block text-xs text-[#698078]">{item[1]}</span>
            </button>
          ))}
        </div>
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-[#e7eeea] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Rascunho assistido por IA</p><h2 className="mt-2 text-2xl font-semibold">Evolução quinzenal · Marina Costa</h2><p className="mt-1 text-sm text-[#698078]">11–25 de agosto de 2026</p></div>
            <Status tone={approved ? 'green' : 'amber'}>{approved ? 'Aprovado' : 'Requer revisão'}</Status>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ['Peso', '−1,8 kg'],
              ['Adesão', '82%'],
              ['Sono médio', '6h12'],
            ].map((item) => <div key={item[0]} className="rounded-2xl bg-[#f4f7f5] p-4"><p className="text-xs font-semibold text-[#698078]">{item[0]}</p><p className="mt-2 text-xl font-bold">{item[1]}</p></div>)}
          </div>
          <div className="mt-6 space-y-5 text-sm leading-6 text-[#526a62]">
            <section><h3 className="font-bold text-[#17372f]">Síntese do período</h3><p className="mt-1">Evolução consistente de peso e boa adesão. A principal oportunidade é recuperar regularidade de sono antes de ampliar metas.</p></section>
            <section><h3 className="font-bold text-[#17372f]">Pontos para próxima consulta</h3><ul className="mt-1 list-disc space-y-1 pl-5"><li>Investigar despertares noturnos.</li><li>Revisar tolerância e rotina do jantar.</li><li>Manter meta de passos nesta semana.</li></ul></section>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" className="min-h-11 rounded-xl border border-[#bfd4cd] bg-white px-5 text-sm font-bold text-[#0b6a5b]">Editar texto</button>
            <button type="button" disabled={approved} onClick={onApprove} className="min-h-11 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white disabled:bg-[#779a91]">{approved ? 'Relatório aprovado' : 'Aprovar e disponibilizar'}</button>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#8a9c96]">A IA organiza informações; a interpretação e a decisão permanecem com o médico.</p>
        </article>
      </section>
    </>
  );
}

type ConsultationStep = 'preparo' | 'consulta' | 'plano' | 'fechamento';

function Consultation({
  appointment,
  initialStep,
  onClose,
  onComplete,
  onNotify,
}: {
  appointment: Appointment;
  initialStep: ConsultationStep;
  onClose: () => void;
  onComplete: () => void;
  onNotify: (message: string) => void;
}) {
  const { latestSubmission, latestCarePlan, latestPublishedCarePlan } = useCareDemo(appointment.patientId, appointment.encounterId);
  const [step, setStep] = useState<ConsultationStep>(initialStep);
  const [meetOpen, setMeetOpen] = useState(false);
  const [notes, setNotes] = useState(`${appointment.patient}: ${appointment.reported}`);
  const [summary, setSummary] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const usesSharedPreConsultation = appointment.patientId === DEFAULT_PATIENT_ID && Boolean(latestSubmission);
  const steps: Array<[ConsultationStep, string]> = [
    ['preparo', '1. Preparo'],
    ['consulta', '2. Consulta'],
    ['plano', '3. Plano'],
    ['fechamento', '4. Fechamento'],
  ];

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const backgroundRegions = [
      document.querySelector<HTMLElement>('header'),
      document.getElementById('doctor-workspace-content'),
    ].filter((region): region is HTMLElement => Boolean(region));
    const backgroundState = backgroundRegions.map((region) => ({
      region,
      hadInert: region.hasAttribute('inert'),
      ariaHidden: region.getAttribute('aria-hidden'),
    }));

    backgroundRegions.forEach((region) => {
      region.setAttribute('inert', '');
      region.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      backgroundState.forEach(({ region, hadInert, ariaHidden }) => {
        if (!hadInert) region.removeAttribute('inert');
        if (ariaHidden === null) region.removeAttribute('aria-hidden');
        else region.setAttribute('aria-hidden', ariaHidden);
      });
      previousFocus?.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#102a24]/55 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
      <div ref={dialogRef} className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-t-3xl bg-[#f4f7f5] shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dfe8e3] bg-white px-5 py-4 sm:px-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Pré-consulta · {appointment.time}</p><h2 id="consultation-title" className="mt-1 text-xl font-semibold">{appointment.patient}</h2></div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Fechar pré-consulta" className="grid size-11 cursor-pointer place-items-center rounded-full border border-[#d7e3df] text-xl transition-colors hover:bg-[#f4f7f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">×</button>
        </div>
        <div className="border-b border-[#dfe8e3] bg-white px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {steps.map((item) => <button type="button" key={item[0]} onClick={() => setStep(item[0])} className={cn('min-h-12 shrink-0 border-b-2 px-3 text-sm font-bold', step === item[0] ? 'border-[#0b7b68] text-[#0b6a5b]' : 'border-transparent text-[#698078]')}>{item[1]}</button>)}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {step === 'preparo' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Briefing longitudinal</p><h3 className="mt-2 text-2xl font-semibold">O que mudou desde a última consulta</h3></div>
                  <Status tone={usesSharedPreConsultation ? 'blue' : appointment.preVisitTone}>{usesSharedPreConsultation ? 'Fonte compartilhada nesta sessão' : appointment.preVisit}</Status>
                </div>
                {usesSharedPreConsultation ? (
                  <div className="mt-6">
                    <PreConsultationReviewWorkspace patientId={appointment.patientId} encounterId={appointment.encounterId} onNotify={onNotify} />
                  </div>
                ) : (
                  <div className="mt-6 rounded-3xl bg-[#17372f] p-5 text-white">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Síntese da pré-consulta</p>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-[#d6e8e2]">Dados demonstrativos</span>
                  </div>
                  <p className="mt-4 text-lg font-semibold leading-7">{appointment.objective}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/10 p-4"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9cc7ba]">Relato recebido</p><p className="mt-2 text-sm leading-6 text-[#e0eee9]">{appointment.reported}</p></div>
                    <div className="rounded-2xl bg-white/10 p-4"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9cc7ba]">Organizado pela IA</p><p className="mt-2 text-sm leading-6 text-[#e0eee9]">{appointment.aiFocus}</p></div>
                  </div>
                  <details className="mt-4 rounded-2xl border border-white/15 p-3"><summary className="cursor-pointer text-xs font-bold text-[#c9e4dd]">Abrir respostas de origem</summary><p className="mt-3 text-sm leading-6 text-[#d6e8e2]">As respostas demonstrativas foram organizadas em um resumo revisável. Nenhum conteúdo é tratado como diagnóstico ou decisão clínica automática.</p></details>
                  </div>
                )}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {appointment.metrics.map((item) => <div key={item[0]} className="rounded-2xl bg-[#f4f7f5] p-4"><p className="text-xs text-[#698078]">{item[0]}</p><p className="mt-2 text-xl font-bold">{item[1]}</p><p className={cn('mt-1 text-xs font-semibold', item[0] === 'Sintoma' ? 'text-[#9c453f]' : item[0] === 'Anamnese' || (item[0] === 'Sono' && item[2].includes('abaixo')) ? 'text-[#a06117]' : 'text-[#0b7b68]')}>{item[2]}</p></div>)}
                </div>
                <div className={cn('mt-6 rounded-2xl border-l-4 p-4', appointment.preVisitTone === 'rose' ? 'border-[#d36c64] bg-[#fdf0ef]' : appointment.preVisitTone === 'green' ? 'border-[#55aa96] bg-[#edf7f4]' : 'border-[#e49d45] bg-[#fff8e9]')}><p className={cn('text-sm font-bold', appointment.preVisitTone === 'rose' ? 'text-[#8d3f39]' : appointment.preVisitTone === 'green' ? 'text-[#0b6a5b]' : 'text-[#6f4b0d]')}>{appointment.attentionTitle}</p><p className={cn('mt-1 text-sm leading-6', appointment.preVisitTone === 'rose' ? 'text-[#7e504c]' : appointment.preVisitTone === 'green' ? 'text-[#45655c]' : 'text-[#805f24]')}>{appointment.attentionDetail}</p></div>
              </section>
              <aside className="rounded-3xl bg-[#17372f] p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Preparar em 30 segundos</p>
                <ol className="mt-5 space-y-4 text-sm text-[#e0eee9]">{appointment.checklist.map((item, index) => <li key={item}><strong className="mr-2 text-[#76c5b3]">{String(index + 1).padStart(2, '0')}</strong>{item}</li>)}</ol>
                <button type="button" onClick={() => setStep('consulta')} className="mt-7 min-h-11 w-full cursor-pointer rounded-xl bg-white px-4 text-sm font-bold text-[#17372f] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fd3c0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17372f]">Começar consulta</button>
              </aside>
            </div>
          )}

          {step === 'consulta' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
              <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Registro estruturado</p><h3 className="mt-1 text-xl font-semibold">Notas da consulta</h3></div>
                  <button type="button" onClick={() => setMeetOpen(!meetOpen)} className={cn('min-h-11 rounded-xl px-4 text-sm font-bold', meetOpen ? 'bg-[#e8f4f0] text-[#0b6a5b]' : 'bg-[#17372f] text-white')}>{meetOpen ? 'Sala de vídeo aberta' : 'Abrir sala de vídeo'}</button>
                </div>
                {meetOpen && <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-sm text-[#0b6a5b]"><span className="size-2.5 rounded-full bg-[#1f9d79]" />Sala demonstrativa ativa · link pronto</div>}
                <label htmlFor="notes" className="mt-6 block text-sm font-bold">Observações</label>
                <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 min-h-56 w-full rounded-2xl border border-[#d7e3df] p-4 text-sm leading-6 outline-none focus:ring-2 focus:ring-[#8bc6b9]" />
                <p className="mt-2 text-xs text-[#8a9c96]">Gravação ou transcrição exigiria consentimento explícito.</p>
              </section>
              <aside className="space-y-4">
                <div className="rounded-3xl border border-[#dfe8e3] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Copiloto clínico</p><p className="mt-3 text-sm leading-6 text-[#526a62]">Organiza as notas e destaca lacunas. Não diagnostica nem decide conduta.</p><button type="button" onClick={() => setSummary(true)} className="mt-4 min-h-11 w-full rounded-xl border border-[#9ccdc2] text-sm font-bold text-[#0b6a5b]">Organizar notas com IA</button></div>
                {summary && <div className="rounded-3xl bg-[#17372f] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Síntese sugerida</p><p className="mt-3 text-sm leading-6 text-[#e0eee9]">{appointment.aiFocus}</p></div>}
                <button type="button" onClick={() => setStep('plano')} className="min-h-11 w-full rounded-xl bg-[#0b7b68] text-sm font-bold text-white">Construir próximo plano</button>
              </aside>
            </div>
          )}

          {step === 'plano' && (
            <DoctorCarePlanWorkspace
              patientId={appointment.patientId}
              encounterId={appointment.encounterId}
              notesPresent={notes.trim().length > 0}
              onNotify={onNotify}
              onContinue={() => setStep('fechamento')}
            />
          )}

          {step === 'fechamento' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
              <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Fechamento revisável</p>
                <h3 className="mt-2 text-2xl font-semibold">Tudo pronto para conferir</h3>
                <div className="mt-6 space-y-3">
                  {[
                    ['Resumo da consulta', summary ? 'Organizado e revisável' : 'Usará as notas atuais'],
                    ['Plano de cuidado', latestPublishedCarePlan ? `Versão ${latestPublishedCarePlan.version} publicada para a paciente` : latestCarePlan?.status === 'approved' ? `Versão ${latestCarePlan.version} aprovada, aguardando publicação` : latestCarePlan?.status === 'draft' ? `Versão ${latestCarePlan.version} em rascunho` : 'Nenhum plano iniciado'],
                    ['Relatório', 'Será salvo como rascunho'],
                    ['Próximo contato', 'Check-in amanhã às 20h'],
                  ].map((item) => <div key={item[0]} className="flex flex-col justify-between gap-1 rounded-2xl bg-[#f4f7f5] p-4 sm:flex-row"><strong className="text-sm">{item[0]}</strong><span className="text-sm text-[#60766f]">{item[1]}</span></div>)}
                </div>
                <p className="mt-5 text-xs leading-5 text-[#8a9c96]">Nenhuma sugestão será tratada como prescrição automática.</p>
              </section>
              <aside className="rounded-3xl bg-[#17372f] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Próximo passo</p><h3 className="mt-3 text-xl font-semibold">Manter o cuidado vivo</h3><p className="mt-3 text-sm leading-6 text-[#d6e8e2]">O app transforma o plano em pequenos compromissos e traz de volta somente o que merece atenção.</p><button type="button" onClick={onComplete} className="mt-7 min-h-12 w-full rounded-xl bg-white px-4 text-sm font-bold text-[#17372f]">Concluir consulta</button><button type="button" onClick={onClose} className="mt-2 min-h-11 w-full text-sm font-semibold text-[#b8d3cb]">Salvar e sair</button></aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertDrawer({
  item,
  onClose,
  onResolve,
}: {
  item: (typeof alerts)[number];
  onClose: () => void;
  onResolve: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-[#102a24]/45" role="dialog" aria-modal="true" aria-labelledby="alert-title">
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between">
          <div><Status tone={item.tone}>{item.tag}</Status><h2 id="alert-title" className="mt-4 text-2xl font-semibold">{item.patient}</h2></div>
          <button type="button" onClick={onClose} aria-label="Fechar alerta" className="grid size-11 place-items-center rounded-full border border-[#d7e3df] text-xl">×</button>
        </div>
        <div className="mt-8 rounded-3xl bg-[#f4f7f5] p-5"><p className="text-sm font-bold">{item.detail}</p><p className="mt-2 text-sm leading-6 text-[#60766f]">{item.context}</p></div>
        <section className="mt-7">
          <h3 className="text-sm font-bold">Contexto relevante</h3>
          {[
            ['Plano atual', 'Regularizar sono e manter adesão'],
            ['Último contato', 'Ontem, 20:14'],
            ['Próxima consulta', 'Hoje, 10:30'],
          ].map((row) => <div key={row[0]} className="flex justify-between gap-4 border-b border-[#e7eeea] py-3 text-sm"><span className="text-[#698078]">{row[0]}</span><strong className="text-right">{row[1]}</strong></div>)}
        </section>
        <div className="mt-8 space-y-3"><button type="button" onClick={onResolve} className="min-h-12 w-full rounded-xl bg-[#0b7b68] text-sm font-bold text-white">Marcar como revisado</button><button type="button" className="min-h-12 w-full rounded-xl border border-[#bfd4cd] text-sm font-bold text-[#0b6a5b]">Enviar mensagem</button></div>
        <p className="mt-5 text-xs leading-5 text-[#8a9c96]">Este alerta organiza prioridade; não representa diagnóstico ou emergência.</p>
      </div>
    </div>
  );
}
