export type PatientDocumentKind = 'all' | 'exam' | 'order' | 'report' | 'plan';
export type PatientMockTone = 'green' | 'amber' | 'rose' | 'blue' | 'gray';
export type PatientEvolutionMetricKey = 'weight' | 'sleep' | 'activity' | 'adherence';

export type PatientDocument = {
  id: string;
  kind: Exclude<PatientDocumentKind, 'all'>;
  title: string;
  date: string;
  author: string;
  origin: string;
  status: string;
  statusTone: PatientMockTone;
  version: string;
  originalHref?: string;
  aiSummary?: string;
  values?: Array<{ marker: string; value: number; unit: string }>;
};

export type PatientEvolutionMetric = {
  label: string;
  unit: string;
  color: string;
  source: string;
  completeness: string;
  target?: number;
  targetLabel?: string;
  points: Array<{ date: string; value: number; source: string }>;
};

export type PatientCareDemo = {
  goal: { label: string; target: string; progress: string; source: string };
  overviewMetrics: Array<{ label: string; value: string; detail: string }>;
  domains: Array<[string, string]>;
  documents: PatientDocument[];
  evolution: Record<PatientEvolutionMetricKey, PatientEvolutionMetric>;
};

export type PatientAvatarIdentity = {
  name: string;
  avatarSeed: string;
  programSignal: 'expected' | 'monitor' | 'review';
};

const avatarIdentityByPatientId: Record<string, Omit<PatientAvatarIdentity, 'name'>> = {
  'pac-demo-001': { avatarSeed: 'marina', programSignal: 'monitor' },
  'pac-demo-002': { avatarSeed: 'ana', programSignal: 'expected' },
  'pac-demo-003': { avatarSeed: 'paulo', programSignal: 'review' },
  'pac-demo-004': { avatarSeed: 'rafael', programSignal: 'monitor' },
  'pac-demo-005': { avatarSeed: 'lucia', programSignal: 'review' },
  'pac-demo-006': { avatarSeed: 'lucas', programSignal: 'expected' },
  'pac-demo-007': { avatarSeed: 'fernanda', programSignal: 'monitor' },
  'pac-demo-008': { avatarSeed: 'diego', programSignal: 'review' },
  'pac-demo-009': { avatarSeed: 'camila', programSignal: 'expected' },
  'pac-demo-010': { avatarSeed: 'bruno', programSignal: 'monitor' },
};

export function getPatientAvatarIdentity(patientId: string, name: string): PatientAvatarIdentity {
  return {
    name,
    ...(avatarIdentityByPatientId[patientId] ?? { avatarSeed: 'marina', programSignal: 'monitor' }),
  };
}

type MetricSeed = {
  label: string;
  unit: string;
  start: number;
  end: number;
  source: string;
  completeness: string;
  target?: number;
  targetLabel?: string;
  color?: string;
};

type ExamMarker = { marker: string; previous: number; current: number; unit: string };

type PatientCareSeed = Omit<PatientCareDemo, 'documents' | 'evolution'> & {
  exam?: {
    title: string;
    currentDate: string;
    previousDate: string;
    markers: ExamMarker[];
  };
  metricSeeds: Record<PatientEvolutionMetricKey, MetricSeed>;
};

const dates = ['28 jul', '4 ago', '11 ago', '18 ago', '25 ago'];
const progressSteps = [0, 0.24, 0.51, 0.74, 1];

function createMetric(seed: MetricSeed): PatientEvolutionMetric {
  const precision = seed.unit === 'passos' ? 0 : 1;
  const scale = 10 ** precision;
  const round = (value: number) => Math.round(value * scale) / scale;
  const delta = seed.end - seed.start;

  return {
    label: seed.label,
    unit: seed.unit,
    color: seed.color ?? '#124da0',
    source: seed.source,
    completeness: seed.completeness,
    target: seed.target,
    targetLabel: seed.targetLabel,
    points: dates.map((date, index) => ({
      date,
      value: round(seed.start + delta * progressSteps[index]),
      source: seed.source,
    })),
  };
}

function createDocuments(patientId: string, patientName: string, seed: PatientCareSeed): PatientDocument[] {
  const firstName = patientName.split(' ')[0];
  const sourcePdfAvailable = patientId === 'pac-demo-001';
  const commonDocuments: PatientDocument[] = [
    {
      id: `${patientId}-order`,
      kind: 'order',
      title: `Pedido de exames · ciclo demonstrativo de ${firstName}`,
      date: '12 ago 2026',
      author: 'Dr. Guilherme Martins · perfil demonstrativo',
      origin: 'Registrado pelo profissional',
      status: 'Revisado no mock',
      statusTone: 'green',
      version: 'v1 · documento demonstrativo',
    },
    {
      id: `${patientId}-report`,
      kind: 'report',
      title: `Relatório de acompanhamento · ${firstName}`,
      date: '25 ago 2026',
      author: 'Dr. Guilherme Martins · revisão demonstrativa',
      origin: 'Revisado pelo profissional',
      status: 'Rascunho para revisão',
      statusTone: 'blue',
      version: 'v1 · fonte e autoria preservadas',
      aiSummary: 'A IA pode organizar o conteúdo demonstrativo, mas este rascunho não substitui os registros originais nem representa decisão clínica.',
    },
    {
      id: `${patientId}-plan`,
      kind: 'plan',
      title: `Meta do ciclo · ${seed.goal.label}`,
      date: '28 jul 2026',
      author: 'Dr. Guilherme Martins · perfil demonstrativo',
      origin: 'Registrado pelo profissional',
      status: 'Publicado no mock',
      statusTone: 'green',
      version: 'v2 · meta demonstrativa',
    },
  ];

  if (!seed.exam) {
    return [
      {
        id: `${patientId}-exam-pending`,
        kind: 'exam',
        title: 'Exames iniciais · envio ainda pendente',
        date: '26 ago 2026',
        author: `${firstName} · paciente demonstrativo`,
        origin: 'Aguardando envio da paciente',
        status: 'Sem arquivo recebido',
        statusTone: 'amber',
        version: 'Estado demonstrativo',
      },
      ...commonDocuments,
    ];
  }

  return [
    {
      id: `${patientId}-exam-current`,
      kind: 'exam',
      title: `${seed.exam.title} · agosto`,
      date: seed.exam.currentDate,
      author: 'Laboratório Campo Azul · arquivo demonstrativo',
      origin: 'Enviado pela paciente',
      status: 'Aguardando conferência médica',
      statusTone: 'amber',
      version: 'Original fictício · v1',
      originalHref: sourcePdfAvailable ? '/docs/doc-demo-001.pdf' : undefined,
      aiSummary: 'A demonstração extrai apenas nomes e valores legíveis. Não classifica resultados, risco ou conduta.',
      values: seed.exam.markers.map(({ marker, current, unit }) => ({ marker, value: current, unit })),
    },
    {
      id: `${patientId}-exam-previous`,
      kind: 'exam',
      title: `${seed.exam.title} · julho`,
      date: seed.exam.previousDate,
      author: 'Laboratório Campo Azul · arquivo demonstrativo',
      origin: 'Enviado pela paciente',
      status: 'Original disponível',
      statusTone: 'green',
      version: 'Original fictício · v1',
      originalHref: sourcePdfAvailable ? '/docs/doc-demo-002.pdf' : undefined,
      aiSummary: 'Os valores permanecem vinculados ao documento-fonte para comparação objetiva pelo profissional.',
      values: seed.exam.markers.map(({ marker, previous, unit }) => ({ marker, value: previous, unit })),
    },
    ...commonDocuments,
  ];
}

const seeds: Record<string, PatientCareSeed> = {
  'pac-demo-001': {
    goal: { label: 'Regularidade de sono', target: 'Registrar 5 noites por semana', progress: '4 de 5 noites no recorte', source: 'Plano v2 e autorrelatos demonstrativos' },
    overviewMetrics: [
      { label: 'Peso registrado', value: '78,2 kg', detail: '−1,8 kg no ciclo fictício' },
      { label: 'Sono médio', value: '5h42', detail: '23 de 29 noites registradas' },
      { label: 'Passos médios', value: '7.200', detail: 'fonte simulada de dispositivo' },
      { label: 'Check-ins', value: '11 de 14', detail: 'respostas preservadas' },
    ],
    domains: [['Alimentação', '9 refeições confirmadas'], ['Sintomas', '1 relato para revisar'], ['Bem-estar', '11 check-ins'], ['Adesão ao plano', '82% autorrelatada']],
    exam: { title: 'Painel laboratorial de acompanhamento', currentDate: '14 ago 2026', previousDate: '18 jul 2026', markers: [{ marker: 'Glicemia em jejum', previous: 101, current: 96, unit: 'mg/dL' }, { marker: 'Hemoglobina glicada', previous: 5.8, current: 5.5, unit: '%' }, { marker: 'Triglicerídeos', previous: 132, current: 118, unit: 'mg/dL' }] },
    metricSeeds: {
      weight: { label: 'Peso', unit: 'kg', start: 80, end: 78.2, target: 77.5, targetLabel: 'Meta demonstrativa', source: 'Pesagens confirmadas pela paciente', completeness: '5 de 6 registros esperados' },
      sleep: { label: 'Sono médio', unit: 'h', start: 6.4, end: 5.7, target: 7, targetLabel: 'Referência definida no plano', source: 'Check-ins e registros de sono autorrelatados', completeness: '23 de 29 noites registradas' },
      activity: { label: 'Passos médios', unit: 'passos', start: 5400, end: 7200, target: 7000, targetLabel: 'Meta demonstrativa', source: 'Dispositivo simulado e registros confirmados', completeness: '26 de 29 dias sincronizados', color: '#77500a' },
      adherence: { label: 'Adesão autorrelatada', unit: '%', start: 72, end: 82, target: 80, targetLabel: 'Meta demonstrativa', source: 'Check-ins confirmados pela paciente', completeness: '11 de 14 check-ins respondidos', color: '#77500a' },
    },
  },
  'pac-demo-002': {
    goal: { label: 'Constância de força', target: 'Manter 3 sessões por semana', progress: '3 sessões registradas na semana', source: 'Plano demonstrativo e check-ins' },
    overviewMetrics: [
      { label: 'Sessões', value: '3 de 3', detail: 'semana demonstrativa' },
      { label: 'Energia', value: '4 de 5', detail: 'autorrelato mais recente' },
      { label: 'Passos médios', value: '6.400', detail: 'fonte simulada' },
      { label: 'Check-ins', value: '12 de 14', detail: 'respostas preservadas' },
    ],
    domains: [['Alimentação', '8 registros confirmados'], ['Treino', '3 sessões registradas'], ['Bem-estar', '4 de 5 no último check-in'], ['Adesão ao plano', '88% autorrelatada']],
    exam: { title: 'Painel de acompanhamento físico', currentDate: '15 ago 2026', previousDate: '19 jul 2026', markers: [{ marker: 'Glicemia em jejum', previous: 94, current: 92, unit: 'mg/dL' }, { marker: 'Vitamina D', previous: 28, current: 31, unit: 'ng/mL' }, { marker: 'Ferritina', previous: 58, current: 61, unit: 'ng/mL' }] },
    metricSeeds: {
      weight: { label: 'Sessões de força', unit: 'sessões', start: 1, end: 3, target: 3, targetLabel: 'Meta demonstrativa', source: 'Registros de treino da paciente', completeness: '6 de 7 dias com registro' },
      sleep: { label: 'Energia autorrelatada', unit: 'pontos', start: 3, end: 4, target: 4, targetLabel: 'Meta demonstrativa', source: 'Check-ins respondidos pela paciente', completeness: '12 de 14 check-ins respondidos' },
      activity: { label: 'Passos médios', unit: 'passos', start: 5100, end: 6400, target: 6000, targetLabel: 'Meta demonstrativa', source: 'Dispositivo simulado', completeness: '24 de 29 dias sincronizados', color: '#2d8a67' },
      adherence: { label: 'Adesão autorrelatada', unit: '%', start: 80, end: 88, target: 85, targetLabel: 'Meta demonstrativa', source: 'Check-ins confirmados pela paciente', completeness: '12 de 14 check-ins respondidos', color: '#2d8a67' },
    },
  },
  'pac-demo-003': {
    goal: { label: 'Retomar registros da rotina', target: 'Responder 2 check-ins por semana', progress: '1 resposta no último período', source: 'Plano demonstrativo e fonte original' },
    overviewMetrics: [
      { label: 'Adesão', value: '72%', detail: 'registro autorrelatado' },
      { label: 'Check-ins', value: '4 de 7', detail: 'período demonstrativo' },
      { label: 'Peso registrado', value: '91,4 kg', detail: 'última medida enviada' },
      { label: 'Relato', value: '1 pendente', detail: 'aguarda leitura humana' },
    ],
    domains: [['Alimentação', '4 refeições confirmadas'], ['Sintomas', '1 mensagem para revisar'], ['Bem-estar', '4 check-ins'], ['Adesão ao plano', '72% autorrelatada']],
    exam: { title: 'Painel laboratorial do ciclo', currentDate: '13 ago 2026', previousDate: '16 jul 2026', markers: [{ marker: 'Glicemia em jejum', previous: 105, current: 103, unit: 'mg/dL' }, { marker: 'Triglicerídeos', previous: 168, current: 161, unit: 'mg/dL' }, { marker: 'ALT', previous: 31, current: 29, unit: 'U/L' }] },
    metricSeeds: {
      weight: { label: 'Peso', unit: 'kg', start: 92.1, end: 91.4, target: 90.5, targetLabel: 'Meta demonstrativa', source: 'Medidas enviadas pela paciente', completeness: '3 de 5 pesagens esperadas' },
      sleep: { label: 'Sono médio', unit: 'h', start: 6.1, end: 6, target: 6.5, targetLabel: 'Meta demonstrativa', source: 'Registros autorrelatados', completeness: '12 de 21 noites registradas' },
      activity: { label: 'Passos médios', unit: 'passos', start: 4800, end: 4600, target: 6000, targetLabel: 'Meta demonstrativa', source: 'Registros simulados de movimento', completeness: '15 de 29 dias sincronizados', color: '#bd4d4c' },
      adherence: { label: 'Adesão autorrelatada', unit: '%', start: 80, end: 72, target: 80, targetLabel: 'Meta demonstrativa', source: 'Check-ins preservados', completeness: '4 de 7 check-ins respondidos', color: '#bd4d4c' },
    },
  },
  'pac-demo-004': {
    goal: { label: 'Concluir avaliação inicial', target: 'Confirmar 5 informações de preparo', progress: '3 de 5 informações simuladas', source: 'Questionário e anexos demonstrativos' },
    overviewMetrics: [
      { label: 'Anamnese', value: '3 de 5', detail: 'campos preenchidos' },
      { label: 'Exames', value: '2 arquivos', detail: 'aguardam conferência' },
      { label: 'Peso inicial', value: '84,6 kg', detail: 'medida autorrelatada' },
      { label: 'Check-in', value: '1 recebido', detail: 'fonte original preservada' },
    ],
    domains: [['Anamnese', '3 campos concluídos'], ['Documentos', '2 originais anexados'], ['Bem-estar', '1 relato inicial'], ['Adesão ao preparo', '60% demonstrativa']],
    exam: { title: 'Painel de avaliação inicial', currentDate: '16 ago 2026', previousDate: '20 jul 2026', markers: [{ marker: 'Glicemia em jejum', previous: 98, current: 97, unit: 'mg/dL' }, { marker: 'TSH', previous: 2.1, current: 2.2, unit: 'mUI/L' }, { marker: 'Vitamina B12', previous: 410, current: 425, unit: 'pg/mL' }] },
    metricSeeds: {
      weight: { label: 'Etapas da avaliação', unit: 'etapas', start: 1, end: 3, target: 5, targetLabel: 'Meta demonstrativa', source: 'Questionário inicial da paciente', completeness: '3 de 5 campos confirmados' },
      sleep: { label: 'Sono autorrelatado', unit: 'h', start: 6.2, end: 6.4, target: 7, targetLabel: 'Meta demonstrativa', source: 'Questionário inicial', completeness: '1 relato disponível' },
      activity: { label: 'Passos médios', unit: 'passos', start: 4200, end: 4800, target: 5500, targetLabel: 'Meta demonstrativa', source: 'Registro inicial simulado', completeness: '5 de 14 dias registrados', color: '#124da0' },
      adherence: { label: 'Preparo preenchido', unit: '%', start: 20, end: 60, target: 100, targetLabel: 'Meta demonstrativa', source: 'Etapas confirmadas no mock', completeness: '3 de 5 informações confirmadas', color: '#124da0' },
    },
  },
  'pac-demo-005': {
    goal: { label: 'Caminhadas e energia', target: 'Somar 4 caminhadas por semana', progress: '4 caminhadas registradas', source: 'Plano e registros demonstrativos' },
    overviewMetrics: [
      { label: 'Energia', value: '4 de 5', detail: 'último check-in' },
      { label: 'Caminhadas', value: '4 de 4', detail: 'semana demonstrativa' },
      { label: 'Passos médios', value: '6.820', detail: 'fonte simulada' },
      { label: 'Check-ins', value: '6 de 7', detail: 'respostas preservadas' },
    ],
    domains: [['Alimentação', '7 registros confirmados'], ['Movimento', '4 caminhadas'], ['Bem-estar', 'energia 4 de 5'], ['Adesão ao plano', '86% autorrelatada']],
    exam: { title: 'Painel de longevidade', currentDate: '17 ago 2026', previousDate: '21 jul 2026', markers: [{ marker: 'Glicemia em jejum', previous: 95, current: 94, unit: 'mg/dL' }, { marker: 'Vitamina B12', previous: 485, current: 501, unit: 'pg/mL' }, { marker: 'Vitamina D', previous: 29, current: 32, unit: 'ng/mL' }] },
    metricSeeds: {
      weight: { label: 'Energia autorrelatada', unit: 'pontos', start: 3, end: 4, target: 4, targetLabel: 'Meta demonstrativa', source: 'Check-ins confirmados', completeness: '6 de 7 check-ins respondidos' },
      sleep: { label: 'Sono médio', unit: 'h', start: 6.5, end: 6.8, target: 7, targetLabel: 'Meta demonstrativa', source: 'Relatos de sono simulados', completeness: '20 de 21 noites registradas' },
      activity: { label: 'Passos médios', unit: 'passos', start: 5200, end: 6820, target: 6500, targetLabel: 'Meta demonstrativa', source: 'Dispositivo simulado', completeness: '25 de 29 dias sincronizados', color: '#2d8a67' },
      adherence: { label: 'Adesão autorrelatada', unit: '%', start: 78, end: 86, target: 85, targetLabel: 'Meta demonstrativa', source: 'Check-ins preservados', completeness: '6 de 7 check-ins respondidos', color: '#2d8a67' },
    },
  },
  'pac-demo-006': {
    goal: { label: 'Completar preparação inicial', target: 'Confirmar 5 informações essenciais', progress: '1 de 5 informações confirmadas', source: 'Convite e dados básicos demonstrativos' },
    overviewMetrics: [
      { label: 'Etapas', value: '1 de 5', detail: 'preparo inicial' },
      { label: 'Medidas', value: 'Pendentes', detail: 'nenhuma fonte enviada' },
      { label: 'Exames', value: 'Pendentes', detail: 'pedido demonstrativo aberto' },
      { label: 'Check-in', value: 'Pendente', detail: 'sem conteúdo inventado' },
    ],
    domains: [['Anamnese', 'dados básicos confirmados'], ['Documentos', 'aguardando envio'], ['Bem-estar', 'sem relato inicial'], ['Adesão ao preparo', '1 de 5 etapas']],
    metricSeeds: {
      weight: { label: 'Etapas concluídas', unit: 'etapas', start: 1, end: 1, target: 5, targetLabel: 'Meta demonstrativa', source: 'Preparação inicial confirmada', completeness: '1 de 5 etapas concluídas' },
      sleep: { label: 'Registros de sono', unit: 'registros', start: 0, end: 0, target: 5, targetLabel: 'Meta demonstrativa', source: 'Nenhum relato recebido', completeness: '0 de 5 registros solicitados' },
      activity: { label: 'Registros de movimento', unit: 'registros', start: 0, end: 0, target: 3, targetLabel: 'Meta demonstrativa', source: 'Nenhuma fonte recebida', completeness: '0 de 3 registros solicitados', color: '#bf8620' },
      adherence: { label: 'Preparo preenchido', unit: '%', start: 20, end: 20, target: 100, targetLabel: 'Meta demonstrativa', source: 'Etapas confirmadas no mock', completeness: '1 de 5 informações confirmadas', color: '#bf8620' },
    },
  },
  'pac-demo-007': {
    goal: { label: 'Regularidade de rotina', target: 'Registrar refeições e medidas na semana', progress: '6 de 7 dias registrados', source: 'Plano e relatos demonstrativos' },
    overviewMetrics: [
      { label: 'Peso registrado', value: '74,8 kg', detail: '−1,2 kg no período' },
      { label: 'Medidas', value: '2 atualizadas', detail: 'fontes preservadas' },
      { label: 'Check-ins', value: '6 de 7', detail: 'semana demonstrativa' },
      { label: 'Adesão', value: '91%', detail: 'autorrelato preservado' },
    ],
    domains: [['Alimentação', '10 registros confirmados'], ['Medidas', '2 atualizações'], ['Bem-estar', '6 check-ins'], ['Adesão ao plano', '91% autorrelatada']],
    exam: { title: 'Painel de acompanhamento de rotina', currentDate: '18 ago 2026', previousDate: '22 jul 2026', markers: [{ marker: 'Glicemia em jejum', previous: 93, current: 91, unit: 'mg/dL' }, { marker: 'Hemoglobina glicada', previous: 5.4, current: 5.3, unit: '%' }, { marker: 'Ferritina', previous: 46, current: 49, unit: 'ng/mL' }] },
    metricSeeds: {
      weight: { label: 'Peso', unit: 'kg', start: 76, end: 74.8, target: 74, targetLabel: 'Meta demonstrativa', source: 'Medidas autorrelatadas', completeness: '5 de 5 pesagens esperadas' },
      sleep: { label: 'Sono médio', unit: 'h', start: 6.6, end: 6.8, target: 7, targetLabel: 'Meta demonstrativa', source: 'Check-ins de rotina', completeness: '20 de 21 noites registradas' },
      activity: { label: 'Passos médios', unit: 'passos', start: 5900, end: 7100, target: 7000, targetLabel: 'Meta demonstrativa', source: 'Dispositivo simulado', completeness: '27 de 29 dias sincronizados', color: '#2d8a67' },
      adherence: { label: 'Adesão autorrelatada', unit: '%', start: 84, end: 91, target: 85, targetLabel: 'Meta demonstrativa', source: 'Check-ins confirmados', completeness: '6 de 7 check-ins respondidos', color: '#2d8a67' },
    },
  },
  'pac-demo-008': {
    goal: { label: 'Retomar frequência de check-ins', target: 'Enviar 2 check-ins por semana', progress: '1 de 2 respostas no período', source: 'Plano e registros demonstrativos' },
    overviewMetrics: [
      { label: 'Check-ins', value: '4 de 9', detail: 'registros preservados' },
      { label: 'Refeições', value: '5 registros', detail: 'período demonstrativo' },
      { label: 'Passos médios', value: '4.900', detail: 'fonte simulada' },
      { label: 'Adesão', value: '44%', detail: 'autorrelato preservado' },
    ],
    domains: [['Alimentação', '5 registros confirmados'], ['Check-ins', '4 de 9 respondidos'], ['Bem-estar', '1 relato recente'], ['Adesão ao plano', '44% autorrelatada']],
    exam: { title: 'Painel de acompanhamento metabólico', currentDate: '19 ago 2026', previousDate: '23 jul 2026', markers: [{ marker: 'Glicemia em jejum', previous: 102, current: 101, unit: 'mg/dL' }, { marker: 'Triglicerídeos', previous: 154, current: 151, unit: 'mg/dL' }, { marker: 'HDL', previous: 42, current: 43, unit: 'mg/dL' }] },
    metricSeeds: {
      weight: { label: 'Peso', unit: 'kg', start: 88.4, end: 88.1, target: 86.5, targetLabel: 'Meta demonstrativa', source: 'Pesagens autorrelatadas', completeness: '2 de 5 pesagens registradas' },
      sleep: { label: 'Sono médio', unit: 'h', start: 6.2, end: 6, target: 6.5, targetLabel: 'Meta demonstrativa', source: 'Check-ins disponíveis', completeness: '9 de 21 noites registradas' },
      activity: { label: 'Passos médios', unit: 'passos', start: 5600, end: 4900, target: 6000, targetLabel: 'Meta demonstrativa', source: 'Dispositivo simulado', completeness: '14 de 29 dias sincronizados', color: '#bd4d4c' },
      adherence: { label: 'Adesão autorrelatada', unit: '%', start: 62, end: 44, target: 75, targetLabel: 'Meta demonstrativa', source: 'Check-ins preservados', completeness: '4 de 9 check-ins respondidos', color: '#bd4d4c' },
    },
  },
  'pac-demo-009': {
    goal: { label: 'Movimento frequente', target: 'Manter média de 6.500 passos', progress: '7.100 passos no último recorte', source: 'Plano e fonte simulada de dispositivo' },
    overviewMetrics: [
      { label: 'Passos médios', value: '7.100', detail: '+1.600 no ciclo' },
      { label: 'Check-ins', value: '8 de 9', detail: 'respostas preservadas' },
      { label: 'Sono médio', value: '6h50', detail: 'relatos demonstrativos' },
      { label: 'Adesão', value: '84%', detail: 'autorrelato preservado' },
    ],
    domains: [['Alimentação', '9 registros confirmados'], ['Movimento', '24 dias sincronizados'], ['Bem-estar', '8 check-ins'], ['Adesão ao plano', '84% autorrelatada']],
    exam: { title: 'Painel metabólico de rotina', currentDate: '20 ago 2026', previousDate: '24 jul 2026', markers: [{ marker: 'Glicemia em jejum', previous: 99, current: 97, unit: 'mg/dL' }, { marker: 'HDL', previous: 51, current: 53, unit: 'mg/dL' }, { marker: 'Triglicerídeos', previous: 128, current: 122, unit: 'mg/dL' }] },
    metricSeeds: {
      weight: { label: 'Peso', unit: 'kg', start: 71.8, end: 71.2, target: 70.8, targetLabel: 'Meta demonstrativa', source: 'Medidas autorrelatadas', completeness: '4 de 5 pesagens esperadas' },
      sleep: { label: 'Sono médio', unit: 'h', start: 6.4, end: 6.8, target: 7, targetLabel: 'Meta demonstrativa', source: 'Check-ins confirmados', completeness: '19 de 21 noites registradas' },
      activity: { label: 'Passos médios', unit: 'passos', start: 5500, end: 7100, target: 6500, targetLabel: 'Meta demonstrativa', source: 'Dispositivo simulado', completeness: '24 de 29 dias sincronizados', color: '#2d8a67' },
      adherence: { label: 'Adesão autorrelatada', unit: '%', start: 74, end: 84, target: 80, targetLabel: 'Meta demonstrativa', source: 'Check-ins preservados', completeness: '8 de 9 check-ins respondidos', color: '#2d8a67' },
    },
  },
  'pac-demo-010': {
    goal: { label: 'Regularidade de sono', target: 'Registrar horário de sono 5 vezes por semana', progress: '5 de 7 registros recebidos', source: 'Plano e relatos demonstrativos' },
    overviewMetrics: [
      { label: 'Sono médio', value: '6h18', detail: 'último período simulado' },
      { label: 'Registros', value: '5 de 7', detail: 'noites confirmadas' },
      { label: 'Passos médios', value: '5.400', detail: 'fonte simulada' },
      { label: 'Adesão', value: '76%', detail: 'autorrelato preservado' },
    ],
    domains: [['Alimentação', '6 registros confirmados'], ['Sono', '5 de 7 noites'], ['Bem-estar', '5 check-ins'], ['Adesão ao plano', '76% autorrelatada']],
    exam: { title: 'Painel de longevidade e sono', currentDate: '21 ago 2026', previousDate: '25 jul 2026', markers: [{ marker: 'Glicemia em jejum', previous: 96, current: 95, unit: 'mg/dL' }, { marker: 'Creatinina', previous: 0.94, current: 0.92, unit: 'mg/dL' }, { marker: 'Vitamina B12', previous: 402, current: 415, unit: 'pg/mL' }] },
    metricSeeds: {
      weight: { label: 'Peso', unit: 'kg', start: 83.6, end: 83.2, target: 82.5, targetLabel: 'Meta demonstrativa', source: 'Medidas autorrelatadas', completeness: '4 de 5 pesagens esperadas' },
      sleep: { label: 'Sono médio', unit: 'h', start: 6.6, end: 6.3, target: 7, targetLabel: 'Meta demonstrativa', source: 'Relatos de sono preservados', completeness: '5 de 7 noites registradas' },
      activity: { label: 'Passos médios', unit: 'passos', start: 4800, end: 5400, target: 6000, targetLabel: 'Meta demonstrativa', source: 'Dispositivo simulado', completeness: '19 de 29 dias sincronizados', color: '#bf8620' },
      adherence: { label: 'Adesão autorrelatada', unit: '%', start: 81, end: 76, target: 80, targetLabel: 'Meta demonstrativa', source: 'Check-ins preservados', completeness: '5 de 7 check-ins respondidos', color: '#bf8620' },
    },
  },
};

function fallbackCareData(patientId: string): PatientCareDemo {
  const fallbackSeed: PatientCareSeed = {
    goal: { label: 'Acompanhamento demonstrativo', target: 'Confirmar próximo registro', progress: 'Sem dados específicos', source: 'Cenário fictício' },
    overviewMetrics: [
      { label: 'Registros', value: '—', detail: 'sem dado demonstrativo' },
      { label: 'Exames', value: '—', detail: 'sem arquivo demonstrativo' },
      { label: 'Meta', value: 'Pendente', detail: 'aguarda revisão humana' },
      { label: 'Check-ins', value: '—', detail: 'fonte preservada' },
    ],
    domains: [['Registros', 'sem dado demonstrativo'], ['Documentos', 'sem arquivo demonstrativo'], ['Bem-estar', 'sem relato'], ['Adesão', 'não calculada']],
    metricSeeds: {
      weight: { label: 'Registros', unit: 'registros', start: 0, end: 0, source: 'Cenário demonstrativo', completeness: 'Sem registros' },
      sleep: { label: 'Sono', unit: 'h', start: 0, end: 0, source: 'Cenário demonstrativo', completeness: 'Sem registros' },
      activity: { label: 'Movimento', unit: 'registros', start: 0, end: 0, source: 'Cenário demonstrativo', completeness: 'Sem registros' },
      adherence: { label: 'Adesão', unit: '%', start: 0, end: 0, source: 'Cenário demonstrativo', completeness: 'Sem registros' },
    },
  };
  return {
    ...fallbackSeed,
    documents: createDocuments(patientId, 'Paciente demonstrativo', fallbackSeed),
    evolution: Object.fromEntries(Object.entries(fallbackSeed.metricSeeds).map(([key, value]) => [key, createMetric(value)])) as PatientCareDemo['evolution'],
  };
}

export function getPatientCareDemo(patientId: string, patientName: string): PatientCareDemo {
  const seed = seeds[patientId];
  if (!seed) return fallbackCareData(patientId);

  return {
    goal: seed.goal,
    overviewMetrics: seed.overviewMetrics,
    domains: seed.domains,
    documents: createDocuments(patientId, patientName, seed),
    evolution: Object.fromEntries(Object.entries(seed.metricSeeds).map(([key, value]) => [key, createMetric(value)])) as PatientCareDemo['evolution'],
  };
}
