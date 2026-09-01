export type LongitudinalRecordKind = 'patient-report' | 'recorded-data' | 'care-draft' | 'medical-review';

export interface LongitudinalRecord {
  id: string;
  patientId: string;
  encounterId: string;
  occurredAt: string;
  occurredAtIso: string;
  kind: LongitudinalRecordKind;
  title: string;
  summary: string;
  source: string;
  sourceId: string;
  sourceVersion: number;
  author: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewState: string;
  visibility: 'medical-team';
  assistanceMode?: 'assisted' | 'manual';
  linkedSourceIds?: string[];
  limitation?: string;
}

export interface LongitudinalDossierData {
  patientId: string;
  encounterId: string;
  period: string;
  updatedAt: string;
  gaps: string[];
  records: LongitudinalRecord[];
}

type LongitudinalRecordSeed = Omit<LongitudinalRecord, 'patientId' | 'encounterId' | 'visibility'>;
type LongitudinalDossierSeed = Omit<LongitudinalDossierData, 'records'> & { records: LongitudinalRecordSeed[] };

const longitudinalDossierSeeds: Record<string, LongitudinalDossierSeed> = {
  'pac-demo-001': {
    patientId: 'pac-demo-001',
    encounterId: 'enc-demo-002',
    period: '12–26 de agosto',
    updatedAt: '26 ago · 09:20',
    gaps: [
      'Dois registros de refeição ainda aguardam confirmação da paciente.',
      'O padrão entre sono e energia ainda é apenas uma hipótese para revisão.',
    ],
    records: [
      {
        id: 'marina-pre-consulta-v1',
        occurredAt: '26 ago · 09:18',
        occurredAtIso: '2026-08-26T09:18:00-03:00',
        kind: 'patient-report',
        title: 'Objetivo e mudanças enviados antes da consulta',
        summary: 'Marina descreveu melhora parcial do sono, cansaço ao acordar e dúvidas sobre a relação entre jantar e despertares.',
        source: 'Pré-consulta por texto · versão 1',
        sourceId: 'src-demo-pre-001',
        sourceVersion: 1,
        author: 'Marina Costa · paciente',
        reviewState: 'Original preservado',
        limitation: 'É um relato autorreferido e ainda não foi validado durante a consulta.',
      },
      {
        id: 'marina-relatorio-v2',
        occurredAt: '25 ago · 16:42',
        occurredAtIso: '2026-08-25T16:42:00-03:00',
        kind: 'medical-review',
        title: 'Relatório quinzenal revisado',
        summary: 'O médico revisou a síntese do período e manteve sono e energia como temas para investigação na próxima consulta.',
        source: 'Relatório quinzenal · versão 2',
        sourceId: 'src-demo-rel-002',
        sourceVersion: 2,
        author: 'Dr. Guilherme · médico responsável',
        reviewedBy: 'Dr. Guilherme · médico responsável',
        reviewedAt: '25 ago · 16:42',
        reviewState: 'Revisado no protótipo',
        limitation: 'A revisão demonstrativa não representa assinatura ou sincronização com prontuário.',
      },
      {
        id: 'marina-jantar-2408',
        occurredAt: '24 ago · 20:08',
        occurredAtIso: '2026-08-24T20:08:00-03:00',
        kind: 'recorded-data',
        title: 'Foto do jantar recebida',
        summary: 'O registro contém a imagem e a descrição informada pela paciente; ingredientes, porções e preparo ainda precisam ser confirmados.',
        source: 'Diário alimentar · registro fotográfico',
        sourceId: 'src-demo-diary-014',
        sourceVersion: 1,
        author: 'Marina Costa · paciente',
        reviewState: 'Confirmação pendente',
        limitation: 'A foto não permite estimar composição ou adequação clínica com precisão.',
      },
      {
        id: 'marina-sono-energia-draft',
        occurredAt: '24 ago · 09:30',
        occurredAtIso: '2026-08-24T09:30:00-03:00',
        kind: 'care-draft',
        title: 'Possível relação temporal entre sono curto e energia',
        summary: 'O rascunho encontrou energia mais baixa em três de quatro dias posteriores a noites abaixo de seis horas.',
        source: '14 noites + 11 check-ins demonstrativos',
        sourceId: 'src-demo-synthesis-003',
        sourceVersion: 1,
        author: 'Assistente demonstrativo',
        reviewState: 'Aguardando revisão médica',
        assistanceMode: 'assisted',
        limitation: 'Associação temporal não demonstra causa e não orienta conduta.',
      },
      {
        id: 'marina-consulta-inicial',
        occurredAt: '12 ago · 11:14',
        occurredAtIso: '2026-08-12T11:14:00-03:00',
        kind: 'medical-review',
        title: 'Primeira consulta registrada no ciclo',
        summary: 'Objetivo inicial, plano demonstrativo e retorno em 30 dias foram registrados após a consulta.',
        source: 'Resumo da primeira consulta · versão 1',
        sourceId: 'src-demo-consult-001',
        sourceVersion: 1,
        author: 'Dr. Guilherme · médico responsável',
        reviewedBy: 'Dr. Guilherme · médico responsável',
        reviewedAt: '12 ago · 11:14',
        reviewState: 'Aprovado no protótipo',
        limitation: 'A transferência ao prontuário oficial não foi confirmada.',
      },
    ],
  },
  'pac-demo-002': {
    patientId: 'pac-demo-002',
    encounterId: 'enc-demo-004',
    period: '12–25 de agosto',
    updatedAt: '25 ago · 18:42',
    gaps: ['O relatório mensal ainda precisa de aprovação médica.', 'Não há receita ativa neste ciclo demonstrativo.'],
    records: [
      {
        id: 'ana-checkin-semanal',
        occurredAt: '25 ago · 18:40',
        occurredAtIso: '2026-08-25T18:40:00-03:00',
        kind: 'patient-report',
        title: 'Energia estável relatada no check-in',
        summary: 'Ana informou que os treinos pela manhã ficaram mais fáceis de manter e que a energia permaneceu estável.',
        source: 'Check-in semanal · 4 respostas',
        sourceId: 'src-demo-checkin-021',
        sourceVersion: 1,
        author: 'Ana Ribeiro · paciente',
        reviewState: 'Original preservado',
        limitation: 'Relato autorreferido, sem inferência sobre resposta clínica.',
      },
      {
        id: 'ana-relatorio-mensal-draft',
        occurredAt: '25 ago · 16:20',
        occurredAtIso: '2026-08-25T16:20:00-03:00',
        kind: 'care-draft',
        title: 'Relatório mensal organizado para revisão',
        summary: 'O rascunho reuniu adesão, progressão de força e registros de energia das últimas quatro semanas.',
        source: 'Check-ins + registros manuais de atividade',
        sourceId: 'src-demo-synthesis-008',
        sourceVersion: 1,
        author: 'Assistente demonstrativo',
        reviewState: 'Aguardando aprovação médica',
        assistanceMode: 'assisted',
        limitation: 'O conteúdo não foi publicado nem apresentado como conclusão clínica.',
      },
      {
        id: 'ana-meta-forca',
        occurredAt: '23 ago · 07:32',
        occurredAtIso: '2026-08-23T07:32:00-03:00',
        kind: 'recorded-data',
        title: 'Meta de força registrada manualmente',
        summary: 'O registro demonstra a conclusão da atividade planejada no período da manhã.',
        source: 'Plano de cuidado · confirmação manual',
        sourceId: 'src-demo-plan-017',
        sourceVersion: 1,
        author: 'Ana Ribeiro · paciente',
        reviewState: 'Registro confirmado pela paciente',
        limitation: 'Não existe integração ativa com relógio ou aplicativo de treino.',
      },
      {
        id: 'ana-plano-inicial',
        occurredAt: '12 ago · 15:10',
        occurredAtIso: '2026-08-12T15:10:00-03:00',
        kind: 'medical-review',
        title: 'Objetivo inicial revisado na consulta',
        summary: 'O médico registrou o acompanhamento de força e energia como foco do ciclo demonstrativo.',
        source: 'Resumo de consulta · versão 1',
        sourceId: 'src-demo-consult-004',
        sourceVersion: 1,
        author: 'Dr. Guilherme · médico responsável',
        reviewedBy: 'Dr. Guilherme · médico responsável',
        reviewedAt: '12 ago · 15:10',
        reviewState: 'Aprovado no protótipo',
        limitation: 'Não representa documento assinado no prontuário oficial.',
      },
    ],
  },
  'pac-demo-003': {
    patientId: 'pac-demo-003',
    encounterId: 'enc-demo-005',
    period: '18–26 de agosto',
    updatedAt: '26 ago · 08:14',
    gaps: ['O novo relato de enjoo ainda precisa de avaliação médica.', 'Dois check-ins do período não foram concluídos.'],
    records: [
      {
        id: 'paulo-enjoo',
        occurredAt: '26 ago · 08:12',
        occurredAtIso: '2026-08-26T08:12:00-03:00',
        kind: 'patient-report',
        title: 'Novo sintoma relatado no check-in',
        summary: 'Paulo registrou enjoo e redução da rotina desde o dia anterior.',
        source: 'Check-in diário · resposta original',
        sourceId: 'src-demo-checkin-026',
        sourceVersion: 1,
        author: 'Paulo Mendes · paciente',
        reviewState: 'Aguardando avaliação médica',
        limitation: 'O destaque não classifica gravidade, urgência ou causa.',
      },
      {
        id: 'paulo-enjoo-draft',
        occurredAt: '26 ago · 08:14',
        occurredAtIso: '2026-08-26T08:14:00-03:00',
        kind: 'care-draft',
        title: 'Preparo manual do novo relato',
        summary: 'A equipe médica reuniu o novo relato, a receita vigente e as ausências de check-in sem usar assistência de IA.',
        source: 'Check-in + receita demonstrativa + adesão',
        sourceId: 'src-demo-synthesis-011',
        sourceVersion: 1,
        author: 'Equipe médica · preparo manual',
        reviewState: 'Não revisado',
        assistanceMode: 'manual',
        limitation: 'Nenhum diagnóstico, ajuste de dose ou orientação foi produzido.',
      },
      {
        id: 'paulo-checkin-ausente',
        occurredAt: '25 ago · 19:26',
        occurredAtIso: '2026-08-25T19:26:00-03:00',
        kind: 'recorded-data',
        title: 'Check-in previsto não concluído',
        summary: 'O protótipo registrou ausência de resposta no horário demonstrativo esperado.',
        source: 'Agenda de check-ins · mock',
        sourceId: 'src-demo-schedule-013',
        sourceVersion: 1,
        author: 'Sistema demonstrativo',
        reviewState: 'Registro operacional',
        limitation: 'Ausência de check-in não significa risco clínico ou necessidade de urgência.',
      },
      {
        id: 'paulo-receita-v1',
        occurredAt: '18 ago · 16:30',
        occurredAtIso: '2026-08-18T16:30:00-03:00',
        kind: 'medical-review',
        title: 'Receita demonstrativa emitida após consulta',
        summary: 'Um documento de prescrição foi registrado no ciclo e agora aparece associado ao novo relato para revisão.',
        source: 'Receita digital #RX-1051 · versão 1',
        sourceId: 'src-demo-prescription-005',
        sourceVersion: 1,
        author: 'Dr. Guilherme · médico responsável',
        reviewedBy: 'Dr. Guilherme · médico responsável',
        reviewedAt: '18 ago · 16:30',
        reviewState: 'Documento vigente no mock',
        limitation: 'O protótipo não emite receita válida nem substitui o prontuário oficial.',
      },
    ],
  },
  'pac-demo-004': {
    patientId: 'pac-demo-004',
    encounterId: 'enc-demo-003',
    period: '24–25 de agosto',
    updatedAt: '25 ago · 11:05',
    gaps: ['Anamnese ainda está incompleta.', 'Exames anexados ainda não foram revisados.', 'A consulta inicial ainda não aconteceu.'],
    records: [
      {
        id: 'rafael-anamnese',
        occurredAt: '25 ago · 11:05',
        occurredAtIso: '2026-08-25T11:05:00-03:00',
        kind: 'patient-report',
        title: 'Anamnese salva parcialmente',
        summary: 'Rafael preencheu 68% do formulário e preservou as respostas para concluir depois.',
        source: 'Anamnese textual · rascunho do paciente',
        sourceId: 'src-demo-intake-019',
        sourceVersion: 1,
        author: 'Rafael Lima · paciente',
        reviewState: 'Incompleto',
        limitation: 'Campos não respondidos permanecem vazios e não são inferidos pelo sistema.',
      },
      {
        id: 'rafael-exames',
        occurredAt: '24 ago · 17:22',
        occurredAtIso: '2026-08-24T17:22:00-03:00',
        kind: 'recorded-data',
        title: 'Dois documentos anexados ao contexto',
        summary: 'Os arquivos aparecem apenas como recebidos e ainda não possuem interpretação médica.',
        source: 'Documentos enviados · mock',
        sourceId: 'src-demo-document-022',
        sourceVersion: 1,
        author: 'Rafael Lima · paciente',
        reviewState: 'Revisão pendente',
        limitation: 'O protótipo não interpreta exames nem confirma autenticidade dos arquivos.',
      },
      {
        id: 'rafael-consulta-confirmada',
        occurredAt: '24 ago · 17:20',
        occurredAtIso: '2026-08-24T17:20:00-03:00',
        kind: 'recorded-data',
        title: 'Consulta inicial confirmada',
        summary: 'O atendimento demonstrativo foi confirmado para 25 ago às 11:30.',
        source: 'Agenda demonstrativa',
        sourceId: 'src-demo-appointment-009',
        sourceVersion: 1,
        author: 'Sistema demonstrativo',
        reviewState: 'Confirmação operacional',
        limitation: 'Não existe sincronização ativa com agenda externa.',
      },
    ],
  },
};

const longitudinalDossiers = Object.fromEntries(
  Object.entries(longitudinalDossierSeeds).map(([patientId, dossier]) => [
    patientId,
    {
      ...dossier,
      records: dossier.records.map((record) => ({
        ...record,
        patientId: dossier.patientId,
        encounterId: dossier.encounterId,
        visibility: 'medical-team' as const,
      })),
    },
  ]),
) as Record<string, LongitudinalDossierData>;

export function getLongitudinalDossier(patientId: string) {
  return longitudinalDossiers[patientId] ?? null;
}
