export type ClinicalOutputType =
  | 'FACT'
  | 'CALCULATION'
  | 'REFERENCE_FLAG'
  | 'AI_SUMMARY'
  | 'DATA_GAP'
  | 'SOURCE_CONFLICT';

export type ClinicalChangeSource = {
  id: string;
  label: string;
  date: string;
  origin: string;
  reviewState: string;
  limitation?: string;
};

export type ClinicalChangeMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  type: Extract<ClinicalOutputType, 'CALCULATION'>;
  formula: string;
  sourceIds: string[];
  limitation: string;
};

export type ClinicalLabComparison = {
  id: string;
  label: string;
  previous: string;
  current: string;
  type: Extract<ClinicalOutputType, 'FACT' | 'CALCULATION' | 'REFERENCE_FLAG'>;
  detail: string;
  sourceIds: string[];
};

export type ClinicalReviewItem = {
  id: string;
  title: string;
  type: Extract<ClinicalOutputType, 'DATA_GAP' | 'SOURCE_CONFLICT'>;
  detail: string;
  nextStep: string;
  sourceIds: string[];
};

export type ClinicalDraftPoint = {
  id: string;
  text: string;
  sourceIds: string[];
};

export type ClinicalChangeDemo = {
  patientId: string;
  period: { from: string; to: string; previousConsultation: string };
  sources: ClinicalChangeSource[];
  metrics: ClinicalChangeMetric[];
  labComparisons: ClinicalLabComparison[];
  reviewItems: ClinicalReviewItem[];
  draft: {
    text: string;
    points: ClinicalDraftPoint[];
    questions: string[];
  };
};

function positive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} precisa ser um número positivo.`);
  }
  return value;
}

function round(value: number, decimals = 2) {
  const scale = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * scale) / scale;
}

function formatPt(value: number, decimals = 1) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function calculateBmi(weightKg: number, heightCm: number) {
  const weight = positive(weightKg, 'Peso');
  const heightM = positive(heightCm, 'Altura') / 100;
  return round(weight / (heightM ** 2));
}

export function calculateWaistToHeightRatio(waistCm: number, heightCm: number) {
  return round(positive(waistCm, 'Cintura') / positive(heightCm, 'Altura'));
}

export function calculateTotalBodyWeightLossPercent(baselineKg: number, currentKg: number) {
  const baseline = positive(baselineKg, 'Peso inicial');
  const current = positive(currentKg, 'Peso atual');
  return round(((baseline - current) / baseline) * 100);
}

export function calculateEstimatedAverageGlucose(hba1cPercent: number) {
  return round((28.7 * positive(hba1cPercent, 'HbA1c')) - 46.7);
}

export function calculateNonHdl(totalCholesterol: number, hdl: number) {
  const total = positive(totalCholesterol, 'Colesterol total');
  const hdlValue = positive(hdl, 'HDL');
  if (hdlValue > total) throw new Error('HDL não pode exceder o colesterol total.');
  return round(total - hdlValue);
}

const heightCm = 164;
const baseline = {
  weightKg: 94.8,
  waistCm: 109,
  glucoseMgDl: 101,
  hba1cPercent: 5.8,
  totalCholesterolMgDl: 208,
  hdlMgDl: 47,
};
const current = {
  weightKg: 91.6,
  waistCm: 104.5,
  glucoseMgDl: 96,
  hba1cPercent: 5.5,
  totalCholesterolMgDl: 196,
  hdlMgDl: 49,
};

const baselineBmi = calculateBmi(baseline.weightKg, heightCm);
const currentBmi = calculateBmi(current.weightKg, heightCm);
const baselineWthr = calculateWaistToHeightRatio(baseline.waistCm, heightCm);
const currentWthr = calculateWaistToHeightRatio(current.waistCm, heightCm);
const weightLossPercent = calculateTotalBodyWeightLossPercent(baseline.weightKg, current.weightKg);
const baselineEag = calculateEstimatedAverageGlucose(baseline.hba1cPercent);
const currentEag = calculateEstimatedAverageGlucose(current.hba1cPercent);
const baselineNonHdl = calculateNonHdl(baseline.totalCholesterolMgDl, baseline.hdlMgDl);
const currentNonHdl = calculateNonHdl(current.totalCholesterolMgDl, current.hdlMgDl);

const marinaChangeDemo: ClinicalChangeDemo = {
  patientId: 'pac-demo-001',
  period: {
    from: '28 jul 2026',
    to: '1 set 2026',
    previousConsultation: '28 jul 2026',
  },
  sources: [
    {
      id: 'src-height-clinic-001',
      label: 'Altura medida na clínica · 164 cm',
      date: '1 jul 2026',
      origin: 'Equipe clínica · registro demonstrativo',
      reviewState: 'Conferido no mock',
    },
    {
      id: 'src-weight-baseline-001',
      label: 'Peso inicial · 94,8 kg',
      date: '28 jul 2026',
      origin: 'Balança da clínica · roupa leve',
      reviewState: 'Conferido no mock',
    },
    {
      id: 'src-weight-current-001',
      label: 'Peso atual · 91,6 kg',
      date: '1 set 2026',
      origin: 'Paciente · balança doméstica · autorrelato',
      reviewState: 'Aguardando conferência',
      limitation: 'Equipamento e condições diferentes do registro inicial.',
    },
    {
      id: 'src-waist-baseline-001',
      label: 'Cintura inicial · 109 cm',
      date: '28 jul 2026',
      origin: 'Equipe clínica · técnica registrada',
      reviewState: 'Conferido no mock',
    },
    {
      id: 'src-waist-current-001',
      label: 'Cintura atual · 104,5 cm',
      date: '1 set 2026',
      origin: 'Paciente · autorrelato',
      reviewState: 'Aguardando conferência',
      limitation: 'O ponto anatômico usado na medida atual não foi informado.',
    },
    {
      id: 'src-lab-jul-001',
      label: 'Painel laboratorial anterior · original fictício',
      date: '18 jul 2026',
      origin: 'Laboratório Campo Azul · laudo demonstrativo',
      reviewState: 'Valores conferidos no mock',
    },
    {
      id: 'src-lab-aug-001',
      label: 'Painel laboratorial atual · original fictício',
      date: '14 ago 2026',
      origin: 'Laboratório Campo Azul · laudo demonstrativo',
      reviewState: 'Extração aguardando conferência médica',
    },
    {
      id: 'src-checkins-001',
      label: 'Check-ins do período · 11 de 14 respondidos',
      date: '4 ago–1 set 2026',
      origin: 'Relatos originais da paciente',
      reviewState: 'Fonte preservada',
      limitation: 'Três respostas ausentes e seis noites sem registro de sono.',
    },
    {
      id: 'src-plan-v2-001',
      label: 'Plano de cuidado v2 · medicamento em mg',
      date: '1 set 2026',
      origin: 'Rascunho médico demonstrativo',
      reviewState: 'Aguardando aprovação',
    },
    {
      id: 'src-med-report-001',
      label: 'Relato da paciente · medicamento em UI',
      date: '1 set 2026',
      origin: 'Pré-consulta por texto · original',
      reviewState: 'Aguardando reconciliação',
    },
  ],
  metrics: [
    {
      id: 'weight-change',
      label: 'Peso',
      value: `${formatPt(baseline.weightKg)} → ${formatPt(current.weightKg)} kg`,
      change: `−${formatPt(baseline.weightKg - current.weightKg)} kg · ${formatPt(weightLossPercent, 2)}% de perda`,
      type: 'CALCULATION',
      formula: `(94,8 − 91,6) ÷ 94,8 × 100 = ${formatPt(weightLossPercent, 2)}%`,
      sourceIds: ['src-weight-baseline-001', 'src-weight-current-001'],
      limitation: 'A comparação usa balanças e condições diferentes; não foi corrigida ou suavizada.',
    },
    {
      id: 'bmi-change',
      label: 'IMC calculado',
      value: `${formatPt(baselineBmi, 2)} → ${formatPt(currentBmi, 2)} kg/m²`,
      change: `−${formatPt(baselineBmi - currentBmi, 2)} kg/m²`,
      type: 'CALCULATION',
      formula: `peso ÷ 1,64²; versão demonstrativa da fórmula 1.0`,
      sourceIds: ['src-height-clinic-001', 'src-weight-baseline-001', 'src-weight-current-001'],
      limitation: 'Marcador de rastreio; não estima composição corporal nem define conduta.',
    },
    {
      id: 'waist-change',
      label: 'Circunferência da cintura',
      value: `${formatPt(baseline.waistCm, 0)} → ${formatPt(current.waistCm)} cm`,
      change: `−${formatPt(baseline.waistCm - current.waistCm)} cm`,
      type: 'CALCULATION',
      formula: `104,5 − 109,0 = −${formatPt(baseline.waistCm - current.waistCm)} cm`,
      sourceIds: ['src-waist-baseline-001', 'src-waist-current-001'],
      limitation: 'A técnica da medida atual precisa ser confirmada antes de interpretar a tendência.',
    },
    {
      id: 'wthr-change',
      label: 'Relação cintura/altura',
      value: `${formatPt(baselineWthr, 2)} → ${formatPt(currentWthr, 2)}`,
      change: `−${formatPt(baselineWthr - currentWthr, 2)}`,
      type: 'CALCULATION',
      formula: `cintura em cm ÷ altura em cm; ${formatPt(current.waistCm)} ÷ 164 = ${formatPt(currentWthr, 2)}`,
      sourceIds: ['src-height-clinic-001', 'src-waist-baseline-001', 'src-waist-current-001'],
      limitation: 'A Slice mostra o cálculo, sem aplicar classificação ou faixa automaticamente.',
    },
  ],
  labComparisons: [
    {
      id: 'fasting-glucose',
      label: 'Glicemia em jejum',
      previous: `${baseline.glucoseMgDl} mg/dL`,
      current: `${current.glucoseMgDl} mg/dL`,
      type: 'REFERENCE_FLAG',
      detail: 'O laudo fictício marca o valor anterior acima e o atual dentro do intervalo impresso de 70–99 mg/dL.',
      sourceIds: ['src-lab-jul-001', 'src-lab-aug-001'],
    },
    {
      id: 'hba1c',
      label: 'Hemoglobina glicada',
      previous: `${formatPt(baseline.hba1cPercent)}%`,
      current: `${formatPt(current.hba1cPercent)}%`,
      type: 'FACT',
      detail: 'Comparação numérica dos laudos; nenhuma meta individual foi aplicada.',
      sourceIds: ['src-lab-jul-001', 'src-lab-aug-001'],
    },
    {
      id: 'eag',
      label: 'Glicose média estimada (eAG)',
      previous: `${formatPt(baselineEag, 0)} mg/dL`,
      current: `${formatPt(currentEag, 0)} mg/dL`,
      type: 'CALCULATION',
      detail: 'Estimativa: 28,7 × HbA1c − 46,7. Não representa uma média diretamente medida.',
      sourceIds: ['src-lab-jul-001', 'src-lab-aug-001'],
    },
    {
      id: 'non-hdl',
      label: 'Colesterol não HDL',
      previous: `${formatPt(baselineNonHdl, 0)} mg/dL`,
      current: `${formatPt(currentNonHdl, 0)} mg/dL`,
      type: 'CALCULATION',
      detail: 'Colesterol total − HDL. O resultado não define uma meta terapêutica individual.',
      sourceIds: ['src-lab-jul-001', 'src-lab-aug-001'],
    },
  ],
  reviewItems: [
    {
      id: 'missing-fasting-insulin',
      title: 'HOMA-IR não calculado',
      type: 'DATA_GAP',
      detail: 'Não há insulina de jejum confirmada no painel atual. O sistema não preencheu o dado e não inferiu resistência à insulina.',
      nextStep: 'Conferir o laudo original e decidir se esse cálculo é pertinente.',
      sourceIds: ['src-lab-aug-001'],
    },
    {
      id: 'medication-unit-conflict',
      title: 'Unidades de medicamento não reconciliadas',
      type: 'SOURCE_CONFLICT',
      detail: 'O plano demonstrativo registra 7,5 mg; o relato da paciente menciona 25 UI. As unidades não foram convertidas nem tratadas como equivalentes.',
      nextStep: 'Conferir a prescrição original antes de registrar ou comunicar qualquer orientação.',
      sourceIds: ['src-plan-v2-001', 'src-med-report-001'],
    },
  ],
  draft: {
    text: 'Entre 28 de julho e 1 de setembro, os registros mostram redução numérica de peso e cintura. O painel de 14 de agosto apresenta valores menores de glicemia em jejum, hemoglobina glicada e colesterol não HDL em comparação ao laudo de 18 de julho, preservado como contexto anterior. A série de sono está incompleta e existe um conflito de unidades no relato de medicamento; ambos precisam de conferência médica. O resumo descreve mudanças no período e não estabelece causa, diagnóstico ou conduta.',
    points: [
      {
        id: 'draft-anthropometrics',
        text: 'Revisar a comparabilidade das medidas de peso e cintura, pois origem e técnica mudaram.',
        sourceIds: ['src-weight-baseline-001', 'src-weight-current-001', 'src-waist-baseline-001', 'src-waist-current-001'],
      },
      {
        id: 'draft-labs',
        text: 'Conferir a extração do painel de 14 de agosto antes de usar as comparações laboratoriais.',
        sourceIds: ['src-lab-jul-001', 'src-lab-aug-001'],
      },
      {
        id: 'draft-sleep',
        text: 'Explorar o contexto das seis noites sem registro, sem assumir piora ou melhora.',
        sourceIds: ['src-checkins-001'],
      },
      {
        id: 'draft-medication',
        text: 'Reconciliar a unidade do medicamento diretamente com a prescrição original.',
        sourceIds: ['src-plan-v2-001', 'src-med-report-001'],
      },
    ],
    questions: [
      'As medidas atuais foram feitas nas mesmas condições do ponto de partida?',
      'O que aconteceu nas noites sem registro de sono?',
      'Qual documento confirma o medicamento, a apresentação e a unidade corretos?',
    ],
  },
};

export function getClinicalChangeDemo(patientId: string) {
  return patientId === marinaChangeDemo.patientId ? marinaChangeDemo : null;
}
