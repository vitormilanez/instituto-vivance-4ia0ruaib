export type MacroCarePriority = {
  label: string;
  target: string;
  note: string;
};

export type MacroCareSummary = {
  patientId: string;
  patientVisibility: 'shared';
  recordedAt: string;
  recordedBy: string;
  measurementDate: string;
  anthropometrics: Array<{ label: string; value: string; detail?: string }>;
  patientSummary: string;
  labTopics: string[];
  priorities: MacroCarePriority[];
  medicationNotice: string;
};

const macroCareSummaries: Record<string, MacroCareSummary> = {
  'pac-demo-001': {
    patientId: 'pac-demo-001',
    patientVisibility: 'shared',
    recordedAt: '17 ago 2026',
    recordedBy: 'Dr. Guilherme Martins',
    measurementDate: 'Não informada',
    anthropometrics: [
      { label: 'Peso no registro', value: '81,17 kg' },
      { label: 'Altura', value: '1,72 m' },
      { label: 'IMC no registro', value: '27,43', detail: 'sobrepeso' },
    ],
    patientSummary: 'Na mensagem, o médico informou que os exames estão bem no geral. Ferro, colesterol e testosterona ficaram como pontos de acompanhamento, sem sinal de alarme naquele recado.',
    labTopics: ['Ferro acima do esperado', 'Colesterol em acompanhamento', 'Testosterona limítrofe'],
    priorities: [
      { label: 'Água', target: '2,5–3 L por dia', note: 'Meta registrada no plano recebido' },
      { label: 'Proteína', target: '140–160 g por dia', note: 'Meta registrada no plano recebido' },
      { label: 'Sono', target: '7–8 h por noite', note: 'Dormir cerca de 30 min mais cedo' },
    ],
    medicationNotice: 'Tirzepatida e Venvanse constam no material. As doses devem seguir apenas a receita confirmada pelo médico.',
  },
};

export function getMacroCareSummary(patientId: string) {
  return macroCareSummaries[patientId] ?? null;
}
