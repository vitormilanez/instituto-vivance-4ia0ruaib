'use client';

import { useMemo, useState } from 'react';
import { AiDraftBadge, ClinicalLayerBadge, SimulationDisclaimer } from './clinical';
import { useClinicalIntelligence } from './clinical-intelligence-context';
import { useCareDemo } from './care-demo-store';
import type {
  CareAiPreparationDismissalReason,
  CareAiPreparationReview,
  CareAiPreparationReviewInput,
  CareAiPreparationReviewItem,
  CareAiPreparationSourceRef,
} from './care-demo-types';
import { getLongitudinalDossier, type LongitudinalRecordKind } from './longitudinal-demo-data';
import { cn, Status } from './shared';

type SourceCoverage = 'direct' | 'partial' | 'hypothesis';

interface PreparationSource extends CareAiPreparationSourceRef {
  date: string;
  state: string;
  kind: LongitudinalRecordKind;
  summary: string;
  limitation: string;
}

interface PreparationQuestion {
  id: string;
  label: string;
  why: string;
  sourceIds: string[];
  coverage: SourceCoverage;
}

interface LocalDecision {
  decision: CareAiPreparationReviewItem['decision'];
  dismissalReason: CareAiPreparationDismissalReason | null;
}

const coveragePresentation: Record<SourceCoverage, { label: string; tone: 'green' | 'amber' | 'blue' }> = {
  direct: { label: 'Fonte direta', tone: 'green' },
  partial: { label: 'Cobertura parcial', tone: 'blue' },
  hypothesis: { label: 'Hipótese para confirmar', tone: 'amber' },
};

const dismissalReasons: Array<{ value: CareAiPreparationDismissalReason; label: string }> = [
  { value: 'duplicate', label: 'Duplicado' },
  { value: 'already-reviewed', label: 'Já revisado' },
  { value: 'insufficient-source', label: 'Fonte insuficiente' },
  { value: 'not-useful', label: 'Não ajuda nesta consulta' },
];

const staticQuestionSeeds: Record<string, PreparationQuestion[]> = {
  'pac-demo-001': [
    {
      id: 'sleep-change',
      label: 'O que mudou nos despertares e na energia ao acordar?',
      why: 'O relato original descreve melhora parcial do sono e cansaço ao acordar.',
      sourceIds: ['src-demo-pre-001'],
      coverage: 'direct',
    },
    {
      id: 'meal-confirmation',
      label: 'O que havia nas refeições que ainda precisam de confirmação?',
      why: 'A foto preserva o contexto, mas não confirma ingredientes, porções ou preparo.',
      sourceIds: ['src-demo-diary-014'],
      coverage: 'partial',
    },
    {
      id: 'sleep-energy-hypothesis',
      label: 'Vale explorar a sequência entre noites curtas e energia percebida?',
      why: 'Há somente uma associação temporal demonstrativa, ainda sem revisão médica.',
      sourceIds: ['src-demo-synthesis-003'],
      coverage: 'hypothesis',
    },
    {
      id: 'sustainable-next-step',
      label: 'Qual próximo passo a paciente considera sustentável neste ciclo?',
      why: 'O relatório revisado manteve sono e energia como temas para a próxima conversa.',
      sourceIds: ['src-demo-rel-002'],
      coverage: 'direct',
    },
  ],
  'pac-demo-002': [
    {
      id: 'training-energy',
      label: 'O que ajudou a manter treino e energia nas últimas semanas?',
      why: 'A paciente relatou maior facilidade para manter os treinos pela manhã.',
      sourceIds: ['src-demo-checkin-021'],
      coverage: 'direct',
    },
    {
      id: 'monthly-draft',
      label: 'Quais pontos do relatório mensal precisam de correção antes de aprovar?',
      why: 'A síntese permanece como rascunho assistido e aguarda revisão médica.',
      sourceIds: ['src-demo-synthesis-008'],
      coverage: 'partial',
    },
  ],
};

function sourceLayer(kind: LongitudinalRecordKind) {
  if (kind === 'patient-report') return 'relato' as const;
  if (kind === 'care-draft') return 'sintese_ia' as const;
  if (kind === 'medical-review' || kind === 'care-plan') return 'decisao_medica' as const;
  return 'fato' as const;
}

function getSourceFingerprint(sourceRefs: CareAiPreparationSourceRef[]) {
  return sourceRefs
    .map((sourceRef) => `${sourceRef.id}@${sourceRef.version}`)
    .toSorted()
    .join('|');
}

function AiPreparationEditor({
  authorizationMode,
  latestReview,
  onNotify,
  onSave,
  questions,
  sourceRefs,
}: {
  authorizationMode: 'mock-scenario' | 'patient-consent';
  latestReview: CareAiPreparationReview | null;
  onNotify?: (message: string) => void;
  onSave: (input: CareAiPreparationReviewInput) => CareAiPreparationReview;
  questions: PreparationQuestion[];
  sourceRefs: CareAiPreparationSourceRef[];
}) {
  const latestItemsById = new Map(latestReview?.items.map((item) => [item.id, item]) ?? []);
  const [decisions, setDecisions] = useState<Record<string, LocalDecision>>(() =>
    Object.fromEntries(
      questions.map((question) => {
        const previous = latestItemsById.get(question.id);
        return [
          question.id,
          previous
            ? { decision: previous.decision, dismissalReason: previous.dismissalReason }
            : { decision: 'included' as const, dismissalReason: null },
        ];
      }),
    ),
  );
  const [feedback, setFeedback] = useState('');

  const includedCount = questions.filter(
    (question) => decisions[question.id]?.decision === 'included',
  ).length;
  const missingReason = questions.some((question) => {
    const decision = decisions[question.id];
    return decision?.decision === 'dismissed' && !decision.dismissalReason;
  });
  const sourceFingerprintChanged = Boolean(
    latestReview && latestReview.sourceFingerprint !== getSourceFingerprint(sourceRefs),
  );

  const setDecision = (
    itemId: string,
    decision: CareAiPreparationReviewItem['decision'],
  ) => {
    setDecisions((current) => ({
      ...current,
      [itemId]: {
        decision,
        dismissalReason: decision === 'included' ? null : current[itemId]?.dismissalReason ?? null,
      },
    }));
    setFeedback('');
  };

  const setDismissalReason = (
    itemId: string,
    dismissalReason: CareAiPreparationDismissalReason | null,
  ) => {
    setDecisions((current) => ({
      ...current,
      [itemId]: { decision: 'dismissed', dismissalReason },
    }));
    setFeedback('');
  };

  const saveReview = () => {
    if (missingReason) {
      setFeedback('Informe o motivo dos itens não incluídos antes de salvar.');
      return;
    }

    try {
      const review = onSave({
        authorizationMode,
        templateVersion: 'preparo-consulta-v1',
        serviceMode: 'deterministic-mock',
        sourceRefs,
        items: questions.map((question) => ({
          id: question.id,
          label: question.label,
          decision: decisions[question.id]?.decision ?? 'included',
          sourceIds: question.sourceIds,
          dismissalReason: decisions[question.id]?.dismissalReason ?? null,
        })),
      });
      const message = `Pauta revisada salva como versão ${review.version}.`;
      setFeedback(message);
      onNotify?.(message);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Não foi possível salvar a pauta.');
    }
  };

  return (
    <section aria-labelledby="ai-preparation-questions-title" className="rounded-2xl border border-[#c9d8ec] bg-[#f7faff] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 id="ai-preparation-questions-title" className="text-lg font-semibold text-[#071a3a]">Perguntas sugeridas para a consulta</h4>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">A IA organiza perguntas a partir das fontes. O médico escolhe o que entra na pauta e registra por que descartou o restante.</p>
        </div>
        <Status tone={latestReview ? 'green' : 'amber'}>
          {latestReview ? `Revisado · v${latestReview.version}` : 'Aguardando revisão'}
        </Status>
      </div>

      {sourceFingerprintChanged ? (
        <p className="mt-4 rounded-xl border border-[#ead8ad] bg-[#fffaf0] p-3 text-xs leading-5 text-[#704f10]">As fontes mudaram desde a última revisão. Salve uma nova versão para atualizar a pauta.</p>
      ) : null}

      <div className="mt-5 space-y-3">
        {questions.map((question, index) => {
          const decision = decisions[question.id] ?? { decision: 'included' as const, dismissalReason: null };
          const presentation = coveragePresentation[question.coverage];
          const descriptionId = `ai-preparation-question-${question.id}`;
          return (
            <article key={question.id} className={cn('rounded-2xl border bg-white p-4 sm:p-5', decision.decision === 'included' ? 'border-[#a9cfc4]' : 'border-[#dbe4f0]')}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#edf3fb] text-xs font-bold text-[#456b9c]">{index + 1}</span>
                    <Status tone={presentation.tone}>{presentation.label}</Status>
                  </div>
                  <h5 className="mt-3 text-sm font-bold leading-6 text-[#071a3a]">{question.label}</h5>
                  <p id={descriptionId} className="mt-1 text-xs leading-5 text-[#61718a]">{question.why}</p>
                  <p className="mt-2 break-all text-[11px] font-semibold text-[#50627f]">Fonte: {question.sourceIds.join(', ')}</p>
                </div>
                <div className="flex shrink-0 gap-2" role="group" aria-label={`Decisão sobre: ${question.label}`}>
                  <button
                    type="button"
                    aria-pressed={decision.decision === 'included'}
                    aria-describedby={descriptionId}
                    onClick={() => setDecision(question.id, 'included')}
                    className={cn(
                      'min-h-11 cursor-pointer rounded-xl border px-4 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2',
                      decision.decision === 'included'
                        ? 'border-[#124da0] bg-[#124da0] text-white'
                        : 'border-[#c7d5e7] bg-white text-[#124da0] hover:bg-[#edf3fb]',
                    )}
                  >
                    Incluir
                  </button>
                  <button
                    type="button"
                    aria-pressed={decision.decision === 'dismissed'}
                    aria-describedby={descriptionId}
                    onClick={() => setDecision(question.id, 'dismissed')}
                    className={cn(
                      'min-h-11 cursor-pointer rounded-xl border px-4 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2',
                      decision.decision === 'dismissed'
                        ? 'border-[#8a9c96] bg-[#f1f5f3] text-[#405675]'
                        : 'border-[#dbe4f0] bg-white text-[#61718a] hover:bg-[#f6f9fe]',
                    )}
                  >
                    Não incluir
                  </button>
                </div>
              </div>

              {decision.decision === 'dismissed' ? (
                <label className="mt-4 block text-xs font-bold text-[#405675]">
                  Motivo do descarte
                  <select
                    value={decision.dismissalReason ?? ''}
                    onChange={(event) => setDismissalReason(
                      question.id,
                      event.target.value ? event.target.value as CareAiPreparationDismissalReason : null,
                    )}
                    className="mt-2 min-h-11 w-full rounded-xl border border-[#dbe4f0] bg-white px-3 text-sm text-[#405675] outline-none focus:ring-2 focus:ring-[#8bc6b9]"
                  >
                    <option value="">Selecione um motivo</option>
                    {dismissalReasons.map((reason) => <option key={reason.value} value={reason.value}>{reason.label}</option>)}
                  </select>
                </label>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[#dce6f2] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-[#61718a]">{includedCount} de {questions.length} itens entrarão na pauta. Salvar cria uma nova versão e registra somente metadados na auditoria.</p>
        <button
          type="button"
          onClick={saveReview}
          disabled={missingReason}
          className="min-h-12 cursor-pointer rounded-xl bg-[#071a3a] px-5 text-sm font-bold text-white transition-colors hover:bg-[#082553] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#8a9c96]"
        >
          Salvar pauta revisada
        </button>
      </div>
      <p aria-live="polite" className={cn('mt-3 text-xs font-semibold', feedback.startsWith('Pauta') ? 'text-[#124da0]' : 'text-[#9c453f]')}>{feedback}</p>
    </section>
  );
}

function ConflictingSourcesState({ patientName, onNotify }: { patientName: string; onNotify?: (message: string) => void }) {
  return (
    <section id="doctor-ai-preparation-workspace" aria-labelledby="doctor-ai-preparation-title" className="border-t border-[#ead8ad] bg-[#fffdf8] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 id="doctor-ai-preparation-title" className="text-2xl font-semibold tracking-[-0.03em] text-[#071a3a]">Fontes conflitantes aguardam revisão</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">Dois originais atribuídos a {patientName} descrevem horários diferentes. A IA não escolhe qual prevalece, não combina os relatos e não sugere resolução.</p>
        </div>
        <Status tone="amber">Síntese bloqueada</Status>
      </div>

      <div className="mt-5 grid overflow-hidden rounded-2xl border border-[#dbe4f0] bg-[#e7edf5] lg:grid-cols-2">
        <article className="bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ClinicalLayerBadge layer="relato" />
            <Status tone="gray">Original preservado</Status>
          </div>
          <h4 className="mt-4 text-base font-semibold text-[#071a3a]">Pré-consulta por texto</h4>
          <blockquote className="mt-3 border-l-2 border-[#8bc6b9] pl-4 text-sm leading-6 text-[#405675]">“Nos últimos dias consegui antecipar o jantar para perto de 19h30.”</blockquote>
          <p className="mt-4 text-xs font-semibold text-[#50627f]">Autora: {patientName} · 1 set 2026 · pre-001 · v2</p>
        </article>
        <article className="border-t border-[#dbe4f0] bg-white p-5 lg:border-l lg:border-t-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ClinicalLayerBadge layer="fato" />
            <Status tone="gray">Registro confirmado</Status>
          </div>
          <h4 className="mt-4 text-base font-semibold text-[#071a3a]">Diário de alimentação</h4>
          <p className="mt-3 text-sm leading-6 text-[#405675]">Jantar registrado às 20h32, com confirmação manual da paciente no mesmo dia.</p>
          <p className="mt-4 text-xs font-semibold text-[#50627f]">Origem: diário guiado · 31 ago 2026 · diary-042 · v1</p>
        </article>
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-xl border border-[#ead8ad] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h4 className="text-sm font-bold text-[#704f10]">Próximo passo exclusivamente humano</h4><p className="mt-1 text-xs leading-5 text-[#61718a]">Abrir os dois originais, conversar com a paciente e registrar qual contexto explica a divergência. Nenhuma síntese foi gerada.</p></div>
        <button type="button" onClick={() => onNotify?.('Revisão médica das fontes conflitantes aberta.')} className="min-h-11 shrink-0 rounded-xl bg-[#071a3a] px-4 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2">Revisar originais</button>
      </div>
    </section>
  );
}

export function DoctorAiPreparationWorkspace({
  conflictMode = false,
  encounterId,
  onNotify,
  patientId,
  patientName,
}: {
  conflictMode?: boolean;
  encounterId: string;
  onNotify?: (message: string) => void;
  patientId: string;
  patientName: string;
}) {
  const dossier = getLongitudinalDossier(patientId);
  const {
    conversationMessages,
    diaryEntries,
    hydrated,
    latestAiPreparationReview,
    latestCheckIn,
    latestCheckInReview,
    latestPublishedCarePlan,
    latestSubmission,
    reviewAiPreparation,
  } = useCareDemo(patientId, encounterId);
  const { activeConfiguration, knowledgeSources, patientContexts } = useClinicalIntelligence();
  const patientAiContext = patientContexts.find((context) => context.patientId === patientId);
  const preparationModule = activeConfiguration.modules.find((module) => module.id === 'visit_preparation');
  const governingSource = knowledgeSources.find((source) => source.id === preparationModule?.primaryKnowledgeSourceId);
  const moduleReady = Boolean(
    preparationModule?.enabled
    && governingSource?.status === 'active'
    && governingSource.applicableModuleIds.includes('visit_preparation')
    && preparationModule.requiredDataConnectionIds.every((connectionId) => (
      activeConfiguration.dataConnections.some((connection) => connection.id === connectionId && connection.enabled)
    ))
    && preparationModule.allowedCapabilityIds.every((capabilityId) => (
      activeConfiguration.capabilities.some((capability) => capability.id === capabilityId && capability.enabled)
    )),
  );

  const preparation = useMemo(() => {
    if (!dossier) return null;

    const staticSources: PreparationSource[] = dossier.records.map((record) => ({
      id: record.sourceId,
      version: record.sourceVersion,
      label: record.source,
      date: record.occurredAt,
      state: record.reviewState,
      kind: record.kind,
      summary: record.summary,
      limitation: record.limitation ?? 'A fonte deve permanecer disponível para conferência humana.',
    }));

    const liveSources: PreparationSource[] = [];
    if (latestSubmission) {
      liveSources.push({
        id: latestSubmission.id,
        version: latestSubmission.version,
        label: 'Pré-consulta por texto',
        date: latestSubmission.submittedAt,
        state: 'Original preservado',
        kind: 'patient-report',
        summary: [latestSubmission.objective, latestSubmission.changes].filter(Boolean).join(' · '),
        limitation: 'Relato autorreferido; ainda precisa ser validado durante a consulta.',
      });
    }
    if (latestCheckIn) {
      liveSources.push({
        id: latestCheckIn.id,
        version: latestCheckIn.version,
        label: 'Check-in guiado da paciente',
        date: latestCheckIn.submittedAt,
        state: latestCheckInReview ? 'Fonte lida pelo médico' : 'Aguardando leitura humana',
        kind: 'recorded-data',
        summary: `Autorrelato de energia ${latestCheckIn.energy}/5, sono ${latestCheckIn.sleepQuality === 'poor' ? 'ruim' : latestCheckIn.sleepQuality === 'regular' ? 'regular' : 'bom'} e ${latestCheckIn.newSymptom ? 'novo sintoma marcado' : 'nenhum sintoma novo marcado'}.`,
        limitation: 'Não equivale a triagem, urgência, diagnóstico ou decisão clínica.',
      });
    }
    const latestDiaryEntry = diaryEntries.at(-1) ?? null;
    if (latestDiaryEntry) {
      liveSources.push({
        id: latestDiaryEntry.id,
        version: latestDiaryEntry.version,
        label: 'Diário guiado da paciente',
        date: latestDiaryEntry.submittedAt,
        state: 'Original preservado',
        kind: 'patient-report',
        summary: `Saciedade ${latestDiaryEntry.satiety}/5, conforto digestivo ${latestDiaryEntry.digestiveComfort}/5 e facilidade do plano ${latestDiaryEntry.planEase}/5.`,
        limitation: 'Autorrelato e foto demonstrativa não confirmam composição, quantidade ou efeito clínico.',
      });
    }
    const latestPatientMessage = [...conversationMessages].reverse().find((message) => message.sender === 'patient') ?? null;
    if (latestPatientMessage) {
      liveSources.push({
        id: latestPatientMessage.id,
        version: latestPatientMessage.version,
        label: 'Mensagem contextualizada da paciente',
        date: latestPatientMessage.sentAt,
        state: 'Relato original',
        kind: 'patient-report',
        summary: latestPatientMessage.body,
        limitation: 'Mensagem demonstrativa; não representa canal monitorado ou triagem.',
      });
    }
    if (latestPublishedCarePlan) {
      liveSources.push({
        id: latestPublishedCarePlan.id,
        version: latestPublishedCarePlan.version,
        label: 'Plano de cuidado publicado',
        date: latestPublishedCarePlan.publishedAt ?? latestPublishedCarePlan.updatedAt,
        state: 'Aprovado e publicado',
        kind: 'care-plan',
        summary: latestPublishedCarePlan.objective,
        limitation: 'Publicação demonstrativa; não representa prescrição ou sincronização externa.',
      });
    }

    const uniqueSources = new Map<string, PreparationSource>();
    for (const source of [...staticSources, ...liveSources]) {
      uniqueSources.set(`${source.id}@${source.version}`, source);
    }
    const sources = [...uniqueSources.values()].toSorted((left, right) => right.date.localeCompare(left.date));
    const sourceIdSet = new Set(sources.map((source) => source.id));

    const dynamicQuestions: PreparationQuestion[] = [];
    if (latestSubmission) {
      dynamicQuestions.push({
        id: `current-priority-${latestSubmission.id}`,
        label: 'O que a paciente gostaria de priorizar hoje dentro do objetivo informado?',
        why: latestSubmission.objective || 'O objetivo foi enviado na pré-consulta.',
        sourceIds: [latestSubmission.id],
        coverage: 'direct',
      });
      if (latestSubmission.questions.trim()) {
        dynamicQuestions.push({
          id: `patient-question-${latestSubmission.id}`,
          label: 'Acolher e esclarecer a dúvida enviada pela paciente.',
          why: latestSubmission.questions,
          sourceIds: [latestSubmission.id],
          coverage: 'direct',
        });
      }
    }
    if (latestCheckIn) {
      dynamicQuestions.push({
        id: `checkin-change-${latestCheckIn.id}`,
        label: latestCheckIn.newSymptom
          ? 'O que mudou desde o registro do novo sintoma?'
          : 'O que mudou desde o último check-in?',
        why: 'A pergunta abre espaço para validar o autorrelato sem classificar causa ou urgência.',
        sourceIds: [latestCheckIn.id],
        coverage: 'direct',
      });
    }

    const questionCandidates = latestSubmission || latestCheckIn
      ? [...dynamicQuestions, ...(staticQuestionSeeds[patientId] ?? [])]
      : staticQuestionSeeds[patientId] ?? [];
    const questions = questionCandidates
      .map((question) => ({
        ...question,
        sourceIds: question.sourceIds.filter((sourceId) => sourceIdSet.has(sourceId)),
      }))
      .filter((question) => question.sourceIds.length > 0)
      .slice(0, 4);

    const questionSourceIds = new Set(questions.flatMap((question) => question.sourceIds));
    const visibleSources = [
      ...sources.filter((source) => questionSourceIds.has(source.id)),
      ...sources.filter((source) => !questionSourceIds.has(source.id)),
    ].slice(0, 8);
    const facts = sources
      .filter((source) => source.kind !== 'care-draft')
      .slice(0, 3);
    const liveGaps = [
      latestCheckIn?.newSymptom && !latestCheckInReview
        ? 'O novo sintoma foi marcado pela paciente, mas a fonte ainda não tem leitura humana registrada.'
        : '',
      latestSubmission && !latestSubmission.questions.trim()
        ? 'A pré-consulta não trouxe uma pergunta explícita; este campo permanece vazio.'
        : '',
    ].filter(Boolean);

    return {
      facts,
      gaps: [...new Set([...liveGaps, ...dossier.gaps])].slice(0, 4),
      questions,
      sourceRefs: visibleSources.map(({ id, version, label }) => ({ id, version, label })),
      sources: visibleSources,
    };
  }, [
    conversationMessages,
    diaryEntries,
    dossier,
    latestCheckIn,
    latestCheckInReview,
    latestPublishedCarePlan,
    latestSubmission,
    patientId,
  ]);

  if (!hydrated) {
    return (
      <section aria-labelledby="doctor-ai-preparation-title" className="border-t border-[#e7edf5] bg-[#fbfdff] p-5 sm:p-6">
        <h3 id="doctor-ai-preparation-title" className="text-xl font-semibold">Carregando fontes da sessão...</h3>
      </section>
    );
  }

  if (!preparation) return null;

  if (conflictMode) {
    return <ConflictingSourcesState patientName={patientName} onNotify={onNotify} />;
  }

  const hasStaticAssistedScenario = dossier?.records.some((record) => record.assistanceMode === 'assisted') ?? false;
  const sourceAuthorizationAllowed = latestSubmission
    ? latestSubmission.aiAssistanceAllowed
    : hasStaticAssistedScenario;
  const patientContextAllowed = patientAiContext?.authorizationStatus === 'authorized'
    && (patientAiContext.status === 'ready' || patientAiContext.status === 'review_required');
  const assistanceAllowed = sourceAuthorizationAllowed && patientContextAllowed && moduleReady;
  const authorizationMode = latestSubmission?.aiAssistanceAllowed
    ? 'patient-consent' as const
    : 'mock-scenario' as const;
  const authorizationLabel = latestSubmission?.aiAssistanceAllowed
    ? `Autorizado na pré-consulta v${latestSubmission.version}`
    : 'Autorização registrada no acompanhamento';

  if (!assistanceAllowed || preparation.questions.length === 0) {
    return (
      <section aria-labelledby="doctor-ai-preparation-title" className="border-t border-[#e7edf5] bg-[#f8fbff] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 id="doctor-ai-preparation-title" className="text-xl font-semibold text-[#071a3a]">Fluxo manual preservado</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">A assistência de IA não está autorizada, o contexto é insuficiente ou o módulo não possui diretriz e dados ativos. O médico continua com os originais e as lacunas visíveis.</p>
          </div>
          <Status tone="gray">Sem geração assistida</Status>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
          <section className="rounded-2xl border border-[#dbe4f0] bg-white p-5">
            <h4 className="text-sm font-bold text-[#071a3a]">Fontes para leitura humana</h4>
            <ul className="mt-4 space-y-3">
              {preparation.sources.slice(0, 4).map((source) => (
                <li key={`${source.id}-${source.version}`} className="rounded-xl bg-[#f6f9fe] p-3">
                  <p className="text-sm font-bold text-[#405675]">{source.label}</p>
                  <p className="mt-1 text-xs text-[#50627f]">{source.id} · v{source.version} · {source.date}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-[#dbe4f0] bg-white p-5">
            <h4 className="text-sm font-bold text-[#071a3a]">Lacunas preservadas</h4>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-xs leading-5 text-[#61718a]">
              {preparation.gaps.map((gap) => <li key={gap}>{gap}</li>)}
            </ul>
            <a href="#longitudinal-dossier-title" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-[#c7d5e7] px-4 text-sm font-bold text-[#124da0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2">Abrir histórico completo</a>
          </section>
        </div>
      </section>
    );
  }

  const governedSourceRefs: CareAiPreparationSourceRef[] = governingSource ? [
    ...preparation.sourceRefs,
    {
      id: `${governingSource.id}@${governingSource.version}`,
      version: activeConfiguration.version,
      label: `${governingSource.reference} v${governingSource.version} · ${preparationModule?.label}`,
    },
  ] : preparation.sourceRefs;
  const currentFingerprint = getSourceFingerprint(governedSourceRefs);
  const editorKey = `${latestAiPreparationReview?.id ?? 'new'}-${currentFingerprint}`;

  return (
    <section id="doctor-ai-preparation-workspace" aria-labelledby="doctor-ai-preparation-title" className="scroll-mt-24 border-t border-[#dce6f2] bg-[#fbfdff] p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <AiDraftBadge>Preparação assistida · revisão médica obrigatória</AiDraftBadge>
            <Status tone="gray">Fontes rastreáveis</Status>
          </div>
          <h3 id="doctor-ai-preparation-title" className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#071a3a]">Pauta médica com fatos, lacunas e fontes</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">Organiza o contexto de {patientName} para reduzir releitura, sem transformar relato em fato nem sugerir diagnóstico, prescrição, dose ou conduta.</p>
        </div>
        <div className="rounded-2xl border border-[#c9d8ec] bg-white px-4 py-3 text-xs leading-5 text-[#50627f]">
          <p><strong className="text-[#071a3a]">Template:</strong> preparo-consulta-v1</p>
          <p><strong className="text-[#071a3a]">Execução:</strong> local, estática e sem API externa</p>
          <p><strong className="text-[#071a3a]">Autorização:</strong> {authorizationLabel}</p>
          <p><strong className="text-[#071a3a]">Política:</strong> configuração v{activeConfiguration.version}</p>
          <p><strong className="text-[#071a3a]">Diretriz:</strong> {governingSource?.reference} v{governingSource?.version}</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-[#dce6f2] bg-[#dce6f2] sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Fontes reunidas', String(governedSourceRefs.length)],
          ['Lacunas explícitas', String(preparation.gaps.length)],
          ['Perguntas sugeridas', String(preparation.questions.length)],
          ['Contradições confirmadas', '0'],
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-4">
            <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#50627f]">{label}</dt>
            <dd className="mt-1 text-xl font-bold text-[#071a3a]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <section aria-labelledby="ai-preparation-facts-title" className="rounded-2xl border border-[#dbe4f0] bg-white p-5">
          <h4 id="ai-preparation-facts-title" className="text-lg font-semibold text-[#071a3a]">O que as fontes dizem</h4>
          <div className="mt-4 space-y-3">
            {preparation.facts.map((source) => (
              <article key={`${source.id}-${source.version}`} className="rounded-xl border border-[#e1eae6] bg-[#fbfdff] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <ClinicalLayerBadge layer={sourceLayer(source.kind)} />
                  <span className="text-[11px] font-semibold text-[#50627f]">{source.date}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-[#405675]">{source.label}</p>
                <p className="mt-1 text-sm leading-6 text-[#50627f]">{source.summary}</p>
                <p className="mt-2 break-all text-[11px] font-semibold text-[#50627f]">{source.id} · v{source.version}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="ai-preparation-gaps-title" className="rounded-2xl border border-[#ead8ad] bg-[#fffdf8] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 id="ai-preparation-gaps-title" className="text-lg font-semibold text-[#071a3a]">Lacunas e contradições</h4>
            </div>
            <Status tone="amber">{preparation.gaps.length} lacunas</Status>
          </div>
          <ul className="mt-4 space-y-3">
            {preparation.gaps.map((gap) => (
              <li key={gap} className="rounded-xl bg-white p-3 text-xs leading-5 text-[#61718a]">
                <strong className="block text-[#704f10]">Lacuna</strong>
                {gap}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl border border-[#dbe4f0] bg-white p-3 text-xs leading-5 text-[#50627f]"><strong className="text-[#071a3a]">Contradições:</strong> nenhuma divergência documental confirmada neste cenário. O produto não inventa conflito para completar a pauta.</p>
        </section>
      </div>

      <div className="mt-5">
        <AiPreparationEditor
          key={editorKey}
          authorizationMode={authorizationMode}
          latestReview={latestAiPreparationReview}
          onNotify={onNotify}
          onSave={reviewAiPreparation}
          questions={preparation.questions}
          sourceRefs={governedSourceRefs}
        />
      </div>

      <details className="mt-5 rounded-2xl border border-[#dbe4f0] bg-white p-5">
        <summary className="cursor-pointer text-sm font-bold text-[#071a3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2">Conferir fontes, versões e limites</summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {preparation.sources.map((source) => (
            <article key={`${source.id}-${source.version}`} className="rounded-xl bg-[#f6f9fe] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <ClinicalLayerBadge layer={sourceLayer(source.kind)} />
                <span className="text-[11px] font-semibold text-[#50627f]">{source.date}</span>
              </div>
              <p className="mt-3 text-sm font-bold text-[#405675]">{source.label}</p>
              <p className="mt-1 break-all text-[11px] font-semibold text-[#50627f]">{source.id} · v{source.version}</p>
              <p className="mt-2 text-xs leading-5 text-[#61718a]">Estado: {source.state}</p>
              <p className="mt-2 text-[11px] leading-5 text-[#50627f]">Limite: {source.limitation}</p>
            </article>
          ))}
        </div>
        <a href="#longitudinal-dossier-title" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-[#c7d5e7] px-4 text-sm font-bold text-[#124da0] transition-colors hover:bg-[#edf3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2">Abrir histórico completo</a>
      </details>

      <div className="mt-5">
        <SimulationDisclaimer>Esta camada demonstra organização e revisão de contexto com dados fictícios. Em produto real, execução, modelo, prompt, entrada, autorização, revisão e correções precisam ficar versionados; o fluxo manual continua disponível quando a IA falha ou é recusada.</SimulationDisclaimer>
      </div>
    </section>
  );
}
