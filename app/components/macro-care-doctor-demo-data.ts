export type MacroCareReviewItem = {
  label: string;
  value: string;
  status: 'Conferir' | 'Não publicar' | 'Sem fonte';
};

export type DoctorMacroCareReview = {
  patientId: string;
  reviewItems: MacroCareReviewItem[];
  receivedProjection: {
    assumption: string;
    weekly: string;
    milestones: Array<{ period: string; value: string }>;
  };
};

const doctorReviews: Record<string, DoctorMacroCareReview> = {
  'pac-demo-001': {
    patientId: 'pac-demo-001',
    reviewItems: [
      {
        label: 'Dose da tirzepatida',
        value: '15 mg no plano alimentar · 25 UI na mensagem',
        status: 'Conferir',
      },
      {
        label: 'Nova fórmula e receita',
        value: 'A mensagem informa um novo envio, mas o conteúdo da receita não faz parte deste mock.',
        status: 'Sem fonte',
      },
      {
        label: 'Projeção de peso',
        value: 'Os marcos recebidos não são consistentes entre si e não foram publicados para a paciente.',
        status: 'Não publicar',
      },
      {
        label: 'Hipótese sobre o ferro',
        value: 'A relação com carne vermelha foi sugerida na mensagem, sem comprovação anexada.',
        status: 'Conferir',
      },
    ],
    receivedProjection: {
      assumption: 'Adesão estimada em 90%',
      weekly: '1–2 kg por semana',
      milestones: [
        { period: 'Mês 1', value: '−6 a −10 kg · 71–75 kg' },
        { period: 'Mês 3', value: '−18 a −30 kg · IMC abaixo de 25' },
        { period: 'Mês 6', value: '65–70 kg' },
      ],
    },
  },
};

export function getDoctorMacroCareReview(patientId: string) {
  return doctorReviews[patientId] ?? null;
}
