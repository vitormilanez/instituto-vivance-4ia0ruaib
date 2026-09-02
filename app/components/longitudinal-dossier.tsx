'use client';

import { useMemo, useState } from 'react';
import { useCareDemo } from './care-demo-store';
import { DoctorFollowUpWorkspace } from './doctor-follow-up-workspace';
import type {
  CareAuditAction,
  CareAuditEvent,
  CareCheckIn,
} from './care-demo-types';
import { getDefaultEncounterId } from './demo-routes';
import {
  getLongitudinalDossier,
  type LongitudinalRecord,
  type LongitudinalRecordKind,
} from './longitudinal-demo-data';
import { cn, Status } from './shared';

type DossierFilter = 'all' | LongitudinalRecordKind;

const filterOptions: Array<{ value: DossierFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'patient-report', label: 'Relatos originais' },
  { value: 'recorded-data', label: 'Dados registrados' },
  { value: 'care-draft', label: 'Preparos e sínteses' },
  { value: 'medical-review', label: 'Revisões médicas' },
  { value: 'care-plan', label: 'Planos e versões' },
];

const kindPresentation: Record<
  LongitudinalRecordKind,
  { label: string; tone: 'green' | 'amber' | 'blue' | 'gray'; dot: string; border: string }
> = {
  'patient-report': {
    label: 'Relato original',
    tone: 'blue',
    dot: 'bg-[#6f8fbd]',
    border: 'border-l-[#6f8fbd]',
  },
  'recorded-data': {
    label: 'Dado registrado',
    tone: 'gray',
    dot: 'bg-[#61718a]',
    border: 'border-l-[#61718a]',
  },
  'care-draft': {
    label: 'Preparo ou síntese',
    tone: 'amber',
    dot: 'bg-[#c18821]',
    border: 'border-l-[#c18821]',
  },
  'medical-review': {
    label: 'Revisão médica',
    tone: 'green',
    dot: 'bg-[#124da0]',
    border: 'border-l-[#124da0]',
  },
  'care-plan': {
    label: 'Plano de cuidado',
    tone: 'green',
    dot: 'bg-[#4a9a7e]',
    border: 'border-l-[#4a9a7e]',
  },
};

function formatTimelineTimestamp(isoTimestamp: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(isoTimestamp));
}

function reviewStateLabel(status: 'draft' | 'approved' | 'rejected') {
  if (status === 'approved') return 'Aprovado para uso na consulta';
  if (status === 'rejected') return 'Rejeitado · versão preservada';
  return 'Em edição';
}

const auditPresentation: Record<CareAuditAction, { label: string; tone: 'green' | 'amber' | 'blue' | 'gray' }> = {
  'check-in-submitted': { label: 'Check-in enviado', tone: 'blue' },
  'check-in-reviewed': { label: 'Fonte lida', tone: 'green' },
  'follow-up-configured': { label: 'Cadência configurada', tone: 'blue' },
  'follow-up-contact-recorded': { label: 'Contato humano registrado', tone: 'amber' },
  'diary-entry-submitted': { label: 'Diário compartilhado', tone: 'blue' },
  'conversation-message-sent': { label: 'Mensagem contextualizada', tone: 'blue' },
  'pre-consultation-submitted': { label: 'Pré-consulta enviada', tone: 'blue' },
  'pre-consultation-review-started': { label: 'Revisão iniciada', tone: 'amber' },
  'pre-consultation-review-approved': { label: 'Preparo aprovado', tone: 'blue' },
  'pre-consultation-review-rejected': { label: 'Preparo rejeitado', tone: 'gray' },
  'consultation-closure-approved': { label: 'Fechamento aprovado', tone: 'green' },
  'care-plan-created': { label: 'Plano em rascunho', tone: 'amber' },
  'care-plan-approved': { label: 'Plano aprovado', tone: 'blue' },
  'care-plan-published': { label: 'Plano publicado', tone: 'green' },
  'ai-preparation-reviewed': { label: 'Pauta assistida revisada', tone: 'green' },
};

const sleepPresentation: Record<CareCheckIn['sleepQuality'], string> = {
  poor: 'sono ruim',
  regular: 'sono regular',
  good: 'sono bom',
};

function OperationalCheckIn({ checkIn }: { checkIn: CareCheckIn | null }) {
  return (
    <section aria-labelledby="operational-checkin-title" className="rounded-2xl border border-[#dbe4f0] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h4 id="operational-checkin-title" className="text-lg font-semibold text-[#071a3a]">Check-in mais recente</h4>
        <Status tone={checkIn?.newSymptom ? 'amber' : checkIn ? 'green' : 'gray'}>
          {checkIn?.newSymptom ? 'Revisar fonte' : checkIn ? 'Disponível' : 'Sem registro'}
        </Status>
      </div>

      {checkIn ? (
        <>
          <p className="mt-3 text-sm leading-6 text-[#50627f]">
            Autorrelato de energia {checkIn.energy}/5 e {sleepPresentation[checkIn.sleepQuality]}. {checkIn.newSymptom ? 'A paciente marcou que surgiu um sintoma novo.' : 'A paciente não marcou sintoma novo.'}
          </p>
          <p className="mt-3 text-xs font-semibold text-[#405675]">Fonte: check-in da paciente · v{checkIn.version} · {checkIn.submittedAt}</p>
          <p className="mt-3 border-t border-[#e7edf5] pt-3 text-[11px] leading-5 text-[#61718a]">É um autorrelato para orientar a próxima conversa; não é triagem, classificação de urgência, diagnóstico ou conduta.</p>
        </>
      ) : (
        <p className="mt-3 text-sm leading-6 text-[#61718a]">Ainda não há check-in neste contexto. O protótipo não transforma a ausência em sinal clínico.</p>
      )}
    </section>
  );
}

function AuditTrail({ events }: { events: CareAuditEvent[] }) {
  const visibleEvents = [...events].reverse().slice(0, 6);

  return (
    <section aria-labelledby="audit-trail-title" className="rounded-2xl border border-[#dbe4f0] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h4 id="audit-trail-title" className="text-lg font-semibold text-[#071a3a]">Auditoria de transições</h4>
        <Status tone="gray">{events.length}</Status>
      </div>
      <p className="mt-2 text-xs leading-5 text-[#61718a]">Registra mudanças importantes e envios de check-in, sem repetir relatos ou conteúdo clínico.</p>

      {visibleEvents.length > 0 ? (
        <ol className="mt-4 space-y-3">
          {visibleEvents.map((event) => {
            const presentation = auditPresentation[event.action];
            return (
              <li key={event.id} className="rounded-xl bg-[#f6f9fe] p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <time dateTime={event.occurredAtIso} className="text-xs font-bold text-[#124da0]">{event.occurredAt}</time>
                    <p className="mt-1 text-xs font-bold leading-5 text-[#405675]">{event.actorLabel}</p>
                  </div>
                  <Status tone={presentation.tone}>{presentation.label}</Status>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#50627f]">{event.summary}</p>
                {event.consentVersion ? <p className="mt-2 text-[11px] leading-5 text-[#61718a]">Ciência {event.consentVersion} · IA {event.aiAssistanceAllowed ? 'autorizada' : 'não autorizada'}.</p> : null}
                <p className="mt-2 break-all text-[0.6875rem] font-medium text-[#61718a]">Referência: {event.relatedId} · v{event.relatedVersion}</p>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-[#c7d5e7] bg-[#fbfdff] p-4 text-xs leading-5 text-[#61718a]">Ainda não há transições registradas neste contexto. O protótipo não inventa eventos de auditoria.</p>
      )}

      <p className="mt-4 border-t border-[#e7edf5] pt-4 text-[11px] leading-5 text-[#61718a]">Registro demonstrativo em `sessionStorage`; não é log de prontuário, prova legal, autenticação ou sincronização externa.</p>
    </section>
  );
}

export function LongitudinalDossier({ patientId, patientName }: { patientId: string; patientName: string }) {
  const [filter, setFilter] = useState<DossierFilter>('all');
  const dossier = getLongitudinalDossier(patientId);
  const encounterId = getDefaultEncounterId(patientId);
  const {
    hydrated,
    submissions,
    reviews,
    carePlans,
    checkIns,
    checkInReviews,
    followUpConfigurations,
    followUpContacts,
    diaryEntries,
    conversationMessages,
    actionConfirmations,
    aiPreparationReviews,
    latestCheckIn,
    auditEvents,
  } = useCareDemo(patientId, encounterId);

  const sessionRecords = useMemo<LongitudinalRecord[]>(() => {
    const submissionRecords = submissions.map<LongitudinalRecord>((submission) => ({
      id: `timeline-${submission.id}`,
      patientId,
      encounterId,
      occurredAt: formatTimelineTimestamp(submission.submittedAtIso),
      occurredAtIso: submission.submittedAtIso,
      kind: 'patient-report',
      title: `Pré-consulta enviada · versão ${submission.version}`,
      summary: `Objetivo declarado: “${submission.objective}”`,
      source: 'Pré-consulta por texto',
      sourceId: submission.id,
      sourceVersion: submission.version,
      author: `${patientName} · paciente`,
      reviewState: 'Enviada · original preservado',
      visibility: 'medical-team',
      limitation: submission.aiAssistanceAllowed
        ? 'A paciente autorizou a organização assistida; o relato original continua separado do rascunho.'
        : 'A paciente não autorizou assistência de IA; o fluxo manual permanece disponível.',
    }));

    const checkInRecords = checkIns.map<LongitudinalRecord>((checkIn) => ({
      id: `timeline-${checkIn.id}`,
      patientId,
      encounterId,
      occurredAt: formatTimelineTimestamp(checkIn.submittedAtIso),
      occurredAtIso: checkIn.submittedAtIso,
      kind: 'recorded-data',
      title: `Check-in enviado · versão ${checkIn.version}`,
      summary: `Autorrelato: energia ${checkIn.energy}/5, ${sleepPresentation[checkIn.sleepQuality]} e ${checkIn.newSymptom ? 'novo sintoma marcado' : 'nenhum sintoma novo marcado'}.`,
      source: 'Check-in guiado da paciente',
      sourceId: checkIn.id,
      sourceVersion: checkIn.version,
      author: `${patientName} · paciente`,
      reviewState: checkIn.newSymptom ? 'Aguardando leitura médica da fonte' : 'Registro confirmado pela paciente',
      visibility: 'medical-team',
      limitation: 'É um autorrelato da paciente; não equivale a triagem, diagnóstico, classificação de urgência ou decisão clínica.',
    }));

    const checkInReviewRecords = checkInReviews.map<LongitudinalRecord>((review) => ({
      id: `timeline-${review.id}`,
      patientId,
      encounterId,
      occurredAt: formatTimelineTimestamp(review.reviewedAtIso),
      occurredAtIso: review.reviewedAtIso,
      kind: 'medical-review',
      title: `Leitura humana do check-in · versão ${review.checkInVersion}`,
      summary: 'O médico registrou que abriu e leu a fonte do check-in para organizar o acompanhamento.',
      source: 'Check-in guiado da paciente',
      sourceId: review.checkInId,
      sourceVersion: review.checkInVersion,
      author: review.reviewedBy,
      reviewedBy: review.reviewedBy,
      reviewedAt: formatTimelineTimestamp(review.reviewedAtIso),
      reviewState: 'Leitura da fonte registrada',
      visibility: 'medical-team',
      limitation: 'Registrar leitura não equivale a validar hipótese, definir diagnóstico, decidir conduta ou transferir informação ao prontuário.',
    }));

    const followUpConfigurationRecords = followUpConfigurations.map<LongitudinalRecord>((configuration) => ({
      id: `timeline-${configuration.id}`,
      patientId,
      encounterId,
      occurredAt: formatTimelineTimestamp(configuration.configuredAtIso),
      occurredAtIso: configuration.configuredAtIso,
      kind: 'recorded-data',
      title: `Cadência de acompanhamento · versão ${configuration.version}`,
      summary: `Frequência operacional definida como ${configuration.cadence === 'daily' ? 'diária' : configuration.cadence === 'every-three-days' ? 'a cada três dias' : configuration.cadence === 'three-times-week' ? 'três vezes por semana' : 'semanal'}.`,
      source: `Plano publicado · versão ${configuration.planVersion}`,
      sourceId: configuration.id,
      sourceVersion: configuration.version,
      linkedSourceIds: [configuration.planId],
      author: configuration.configuredBy,
      reviewState: 'Configuração demonstrativa ativa',
      visibility: 'medical-team',
      limitation: 'A configuração vale apenas na sessão do protótipo; não cria retenção durável, lembrete automático ou monitoramento de urgência.',
    }));

    const followUpContactRecords = followUpContacts.map<LongitudinalRecord>((contact) => ({
      id: `timeline-${contact.id}`,
      patientId,
      encounterId,
      occurredAt: formatTimelineTimestamp(contact.recordedAtIso),
      occurredAtIso: contact.recordedAtIso,
      kind: 'recorded-data',
      title: 'Contato humano de acompanhamento registrado',
      summary: 'A equipe registrou uma ação manual diante da ausência de novo check-in após a configuração.',
      source: `Cadência de acompanhamento · versão ${contact.configurationVersion}`,
      sourceId: contact.configurationId,
      sourceVersion: contact.configurationVersion,
      author: contact.recordedBy,
      reviewState: 'Registro operacional demonstrativo',
      visibility: 'medical-team',
      limitation: 'Nenhuma mensagem ou notificação real foi enviada; o registro não representa triagem, urgência ou tentativa de contato comprovada.',
    }));

    const diaryRecords = diaryEntries.map<LongitudinalRecord>((entry) => ({
      id: `timeline-${entry.id}`,
      patientId,
      encounterId,
      occurredAt: formatTimelineTimestamp(entry.submittedAtIso),
      occurredAtIso: entry.submittedAtIso,
      kind: 'patient-report',
      title: `Contexto do jantar compartilhado · versão ${entry.version}`,
      summary: `Autorrelato guiado: saciedade ${entry.satiety}/5, conforto digestivo ${entry.digestiveComfort}/5 e facilidade para seguir o combinado ${entry.planEase}/5.`,
      source: 'Diário guiado da paciente · foto demonstrativa',
      sourceId: entry.id,
      sourceVersion: entry.version,
      author: `${patientName} · paciente`,
      reviewState: 'Original preservado · ainda não revisado',
      visibility: 'medical-team',
      limitation: 'As notas são autorrelatos. A foto demonstrativa e sua análise não confirmam ingredientes, quantidades, valor nutricional, diagnóstico ou resultado clínico.',
    }));

    const conversationRecords = conversationMessages.map<LongitudinalRecord>((message) => {
      const contextLabel = message.context === 'care-plan'
        ? 'plano de cuidado'
        : message.context === 'check-in'
          ? 'check-in'
          : message.context === 'diary'
            ? 'diário'
            : 'outro assunto';
      return {
        id: `timeline-${message.id}`,
        patientId,
        encounterId,
        occurredAt: formatTimelineTimestamp(message.sentAtIso),
        occurredAtIso: message.sentAtIso,
        kind: message.sender === 'patient' ? 'patient-report' : 'recorded-data',
        title: `${message.sender === 'patient' ? 'Mensagem da paciente' : 'Resposta do médico'} · versão ${message.version}`,
        summary: message.body,
        source: `Conversa contextualizada · ${contextLabel}`,
        sourceId: message.id,
        sourceVersion: message.version,
        author: message.sender === 'patient'
          ? `${patientName} · paciente`
          : 'Dr. Guilherme Martins · médico responsável',
        reviewState: message.sender === 'patient'
          ? 'Relato original · aguardando leitura humana'
          : 'Resposta humana registrada na sessão',
        visibility: 'medical-team',
        limitation: 'Mensagem demonstrativa retida apenas nesta sessão; não representa canal monitorado continuamente, triagem, urgência, prescrição ou sincronização com prontuário.',
      };
    });

    const reviewRecords = reviews.map<LongitudinalRecord>((review) => {
      const eventTimestampIso = review.reviewedAtIso ?? review.updatedAtIso;
      return {
        id: `timeline-${review.id}`,
        patientId,
        encounterId,
        occurredAt: formatTimelineTimestamp(eventTimestampIso),
        occurredAtIso: eventTimestampIso,
        kind: 'care-draft',
        title: review.sourceMode === 'assisted' ? `Preparo assistido · versão ${review.version}` : `Preparo manual · versão ${review.version}`,
        summary: review.status === 'approved'
          ? 'O conteúdo foi revisado e aprovado somente para apoiar a consulta.'
          : review.status === 'rejected'
            ? `A versão foi rejeitada e preservada${review.rejectionReason ? `: ${review.rejectionReason}` : '.'}`
            : 'O conteúdo permanece em edição e ainda não foi aprovado pelo médico.',
        source: review.sourceMode === 'assisted' ? 'Preparo derivado da pré-consulta' : 'Preparo manual vinculado à pré-consulta',
        sourceId: review.id,
        sourceVersion: review.version,
        linkedSourceIds: [review.submissionId],
        author: review.sourceMode === 'assisted'
          ? 'Assistente demonstrativo'
          : 'Equipe médica · preparo manual',
        reviewedBy: review.reviewedBy ? `${review.reviewedBy} · médico responsável` : undefined,
        reviewedAt: review.reviewedAtIso
          ? formatTimelineTimestamp(review.reviewedAtIso)
          : undefined,
        reviewState: reviewStateLabel(review.status),
        visibility: 'medical-team',
        assistanceMode: review.sourceMode,
        limitation: 'Aprovar o preparo não publica um plano, não registra uma decisão clínica e não sincroniza prontuário.',
      };
    });

    const aiPreparationRecords = aiPreparationReviews.map<LongitudinalRecord>((review) => {
      const includedCount = review.items.filter((item) => item.decision === 'included').length;
      const dismissedCount = review.items.length - includedCount;
      return {
        id: `timeline-${review.id}`,
        patientId,
        encounterId,
        occurredAt: formatTimelineTimestamp(review.reviewedAtIso),
        occurredAtIso: review.reviewedAtIso,
        kind: 'care-draft',
        title: `Pauta assistida revisada · versão ${review.version}`,
        summary: `${includedCount} ${includedCount === 1 ? 'pergunta incluída' : 'perguntas incluídas'} e ${dismissedCount} ${dismissedCount === 1 ? 'descartada' : 'descartadas'} pelo médico.`,
        source: `${review.sourceRefs.length} fontes · template ${review.templateVersion}`,
        sourceId: review.id,
        sourceVersion: review.version,
        linkedSourceIds: review.sourceRefs.map((sourceRef) => sourceRef.id),
        author: 'Assistente demonstrativo · organização inicial',
        reviewedBy: review.reviewedBy,
        reviewedAt: formatTimelineTimestamp(review.reviewedAtIso),
        reviewState: 'Pauta revisada para apoiar a consulta',
        visibility: 'medical-team',
        assistanceMode: 'assisted',
        limitation: 'A revisão da pauta não registra diagnóstico, prescrição, dose, conduta, urgência ou sincronização com prontuário.',
      };
    });

    const carePlanRecords = carePlans.map<LongitudinalRecord>((plan) => {
      const eventTimestampIso = plan.status === 'published'
        ? plan.publishedAtIso ?? plan.updatedAtIso
        : plan.status === 'approved'
          ? plan.approvedAtIso ?? plan.updatedAtIso
          : plan.updatedAtIso;
      const state = plan.status === 'published'
        ? `Publicado para a paciente${plan.publishedAt ? ` · ${plan.publishedAt}` : ''}`
        : plan.status === 'approved'
          ? 'Aprovado pelo médico · aguardando publicação'
          : plan.status === 'superseded'
            ? `Versão preservada · substituída pela versão ${plan.supersededByVersion}`
            : 'Rascunho em edição · não visível à paciente';
      return {
        id: `timeline-${plan.id}`,
        patientId,
        encounterId,
        occurredAt: formatTimelineTimestamp(eventTimestampIso),
        occurredAtIso: eventTimestampIso,
        kind: 'care-plan',
        title: `${plan.status === 'published' ? 'Plano publicado' : plan.status === 'approved' ? 'Plano aprovado' : plan.status === 'superseded' ? 'Plano anterior preservado' : 'Plano em rascunho'} · versão ${plan.version}`,
        summary: plan.objective,
        source: plan.sourceDescription,
        sourceId: plan.id,
        sourceVersion: plan.version,
        linkedSourceIds: plan.sourceReviewId ? [plan.sourceReviewId] : undefined,
        author: plan.authoredBy,
        reviewedBy: plan.approvedBy ?? undefined,
        reviewedAt: plan.approvedAtIso ? formatTimelineTimestamp(plan.approvedAtIso) : undefined,
        reviewState: state,
        visibility: 'medical-team',
        assistanceMode: plan.sourceMode,
        limitation: plan.status === 'published'
          ? 'A publicação é demonstrativa e não representa envio ao prontuário, prescrição ou integração externa.'
          : 'Versões em rascunho ou aprovadas não aparecem para a paciente até uma publicação explícita.',
      };
    });

    const actionConfirmationRecords = actionConfirmations.map<LongitudinalRecord>((confirmation) => {
      const plan = carePlans.find((candidate) => candidate.id === confirmation.planId);
      const action = plan?.actions.find((candidate) => candidate.id === confirmation.actionId);
      const actionLabel = action?.title ?? 'Ação da versão publicada';
      return {
        id: `timeline-${confirmation.id}`,
        patientId,
        encounterId,
        occurredAt: formatTimelineTimestamp(confirmation.recordedAtIso),
        occurredAtIso: confirmation.recordedAtIso,
        kind: 'recorded-data',
        title: confirmation.completed ? 'Ação confirmada pela paciente' : 'Confirmação de ação atualizada',
        summary: confirmation.completed
          ? `A paciente marcou “${actionLabel}” como realizada.`
          : `A paciente retirou a marcação de “${actionLabel}”.`,
        source: `Plano de cuidado · versão ${confirmation.planVersion}`,
        sourceId: confirmation.planId,
        sourceVersion: confirmation.planVersion,
        linkedSourceIds: [confirmation.actionId],
        author: `${patientName} · paciente`,
        reviewState: confirmation.completed ? 'Confirmação autorrelatada' : 'Confirmação retirada pela paciente',
        visibility: 'medical-team',
        limitation: 'A confirmação é declarada pela paciente nesta sessão; não comprova execução fora do protótipo nem resultado clínico.',
      };
    });

    return [
      ...checkInRecords,
      ...checkInReviewRecords,
      ...followUpConfigurationRecords,
      ...followUpContactRecords,
      ...diaryRecords,
      ...conversationRecords,
      ...submissionRecords,
      ...reviewRecords,
      ...aiPreparationRecords,
      ...carePlanRecords,
      ...actionConfirmationRecords,
    ];
  }, [
    actionConfirmations,
    aiPreparationReviews,
    carePlans,
    checkInReviews,
    checkIns,
    conversationMessages,
    diaryEntries,
    encounterId,
    followUpConfigurations,
    followUpContacts,
    patientId,
    patientName,
    reviews,
    submissions,
  ]);

  if (!hydrated) {
    return (
      <section aria-labelledby="longitudinal-dossier-title" className="border-t border-[#e7edf5] bg-[#fbfdff] p-5 sm:p-6">
        <h3 id="longitudinal-dossier-title" className="text-xl font-semibold">Carregando o contexto demonstrativo...</h3>
        <p className="mt-2 text-sm leading-6 text-[#61718a]">Nenhum dado de outro paciente é exibido durante o carregamento.</p>
      </section>
    );
  }

  if (!dossier) {
    return (
      <section aria-labelledby="longitudinal-dossier-title" className="border-t border-[#e7edf5] bg-[#fbfdff] p-5 sm:p-6">
        <h3 id="longitudinal-dossier-title" className="text-xl font-semibold">Ainda não há eventos para este contexto.</h3>
        <p className="mt-2 text-sm leading-6 text-[#61718a]">O protótipo não completa lacunas com informações de outra pessoa.</p>
      </section>
    );
  }

  const staticRecords = submissions.length > 0 && patientId === 'pac-demo-001'
    ? dossier.records.filter((record) => record.id !== 'marina-pre-consulta-v1')
    : dossier.records;
  const records = [...sessionRecords, ...staticRecords]
    .filter((record) => record.patientId === patientId && record.encounterId === encounterId)
    .toSorted((left, right) => right.occurredAtIso.localeCompare(left.occurredAtIso));
  const visibleRecords = filter === 'all'
    ? records
    : records.filter((record) => record.kind === filter);
  const sourceCount = new Set(records.flatMap((record) => [record.sourceId, ...(record.linkedSourceIds ?? [])])).size;
  const reviewedCount = records.filter((record) => Boolean(record.reviewedBy)).length;
  const latestUpdate = records[0]?.occurredAt ?? dossier.updatedAt;
  const hasLiveSessionRecords = submissions.length > 0 || reviews.length > 0 || checkIns.length > 0 || checkInReviews.length > 0 || followUpConfigurations.length > 0 || followUpContacts.length > 0 || diaryEntries.length > 0 || conversationMessages.length > 0 || actionConfirmations.length > 0 || aiPreparationReviews.length > 0 || carePlans.some((plan) => !plan.id.startsWith('plan-demo-'));
  const periodLabel = hasLiveSessionRecords ? `Sessão atual + ${dossier.period}` : dossier.period;

  return (
    <section aria-labelledby="longitudinal-dossier-title" className="border-t border-[#e7edf5] bg-[#fbfdff] p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 id="longitudinal-dossier-title" className="text-xl font-semibold tracking-[-0.02em]">O que aconteceu, quem registrou e de onde veio</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">
            Eventos fictícios de {patientName} organizados por origem. Relatos, registros, rascunhos, revisões médicas e planos publicados continuam em camadas separadas.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#61718a]">Última atualização</p>
          <p className="mt-1 text-sm font-bold text-[#405675]">{latestUpdate}</p>
          <p className="mt-1 text-[11px] text-[#61718a]">Sessão demonstrativa</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-[#dbe4f0] bg-[#dbe4f0] sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white p-4">
          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#61718a]">Período coberto</dt>
          <dd className="mt-1 text-sm font-bold text-[#405675]">{periodLabel}</dd>
        </div>
        <div className="bg-white p-4">
          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#61718a]">Eventos visíveis</dt>
          <dd className="mt-1 text-sm font-bold text-[#405675]">{records.length}</dd>
        </div>
        <div className="bg-white p-4">
          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#61718a]">Fontes identificadas</dt>
          <dd className="mt-1 text-sm font-bold text-[#405675]">{sourceCount}</dd>
        </div>
        <div className="bg-white p-4">
          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#61718a]">Itens com revisão médica</dt>
          <dd className="mt-1 text-sm font-bold text-[#405675]">{reviewedCount}</dd>
        </div>
      </dl>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="min-w-0">
          <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filtrar histórico por tipo de informação">
            {filterOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
                className={cn(
                  'min-h-11 shrink-0 cursor-pointer rounded-xl border px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2',
                  filter === option.value
                    ? 'border-[#071a3a] bg-[#071a3a] text-white'
                    : 'border-[#dbe4f0] bg-white text-[#61718a] hover:border-[#9bb5d4] hover:bg-[#edf3fb] hover:text-[#124da0]',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="sr-only" aria-live="polite">{visibleRecords.length} {visibleRecords.length === 1 ? 'evento exibido' : 'eventos exibidos'} no histórico.</p>

          {visibleRecords.length > 0 ? (
            <ol className="mt-3 space-y-3">
              {visibleRecords.map((record) => {
                const presentation = kindPresentation[record.kind];
                const presentationLabel = record.kind === 'care-draft'
                  ? record.assistanceMode === 'manual' ? 'Preparo manual' : 'Rascunho assistido'
                  : record.kind === 'care-plan'
                    ? record.reviewState.startsWith('Publicado') ? 'Plano publicado' : 'Plano versionado'
                  : presentation.label;
                return (
                  <li key={record.id}>
                    <article className={cn('relative rounded-2xl border border-[#dbe4f0] bg-white p-5', presentation.border)}>
                      <span aria-hidden="true" className={cn('absolute -left-[9px] top-6 size-3 rounded-full border-2 border-white', presentation.dot)} />
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <time dateTime={record.occurredAtIso} className="text-xs font-bold text-[#124da0]">{record.occurredAt}</time>
                          <h4 className="mt-1.5 text-base font-bold leading-6 text-[#071a3a]">{record.title}</h4>
                        </div>
                        <Status tone={presentation.tone}>{presentationLabel}</Status>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#50627f]">{record.summary}</p>
                      <dl className="mt-4 grid gap-3 rounded-xl bg-[#f6f9fe] p-4 sm:grid-cols-2 xl:grid-cols-5">
                        <div>
                          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[#61718a]">Origem</dt>
                          <dd className="mt-1 text-xs font-semibold leading-5 text-[#405675]">{record.source}</dd>
                        </div>
                        <div>
                          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[#61718a]">ID e versão</dt>
                          <dd className="mt-1 break-all text-xs font-semibold leading-5 text-[#405675]">
                            {record.sourceId} · v{record.sourceVersion}
                            {record.linkedSourceIds?.length ? <span className="mt-1 block font-normal text-[#61718a]">Fonte ligada: {record.linkedSourceIds.join(', ')}</span> : null}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[#61718a]">Autoria</dt>
                          <dd className="mt-1 text-xs font-semibold leading-5 text-[#405675]">{record.author}</dd>
                        </div>
                        <div>
                          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[#61718a]">Revisão</dt>
                          <dd className="mt-1 text-xs font-semibold leading-5 text-[#405675]">
                            {record.reviewedBy ?? 'Ainda não revisado'}
                            {record.reviewedAt ? <span className="mt-1 block font-normal text-[#61718a]">{record.reviewedAt}</span> : null}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[#61718a]">Estado</dt>
                          <dd className="mt-1 text-xs font-semibold leading-5 text-[#405675]">{record.reviewState}</dd>
                        </div>
                      </dl>
                      {record.limitation ? (
                        <details className="mt-3 rounded-xl border border-[#ead8ad] bg-[#fffaf0] px-4 py-3">
                          <summary className="cursor-pointer text-xs font-bold text-[#704f10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2">Ver limite desta informação</summary>
                          <p className="mt-2 text-xs leading-5 text-[#704f10]">{record.limitation}</p>
                        </details>
                      ) : null}
                    </article>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-[#c7d5e7] bg-white p-6 text-center">
              <p className="text-sm font-bold text-[#405675]">Nenhum evento nesta camada.</p>
              <p className="mt-1 text-xs leading-5 text-[#61718a]">A ausência é mantida visível; o protótipo não cria conteúdo para completar o histórico.</p>
              <button type="button" onClick={() => setFilter('all')} className="mt-4 min-h-11 cursor-pointer rounded-xl border border-[#c7d5e7] bg-white px-4 text-sm font-bold text-[#124da0] transition-colors hover:bg-[#edf3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2">
                Mostrar todos os eventos
              </button>
            </div>
          )}
        </div>

        <aside className="doctor-sticky-offset h-fit space-y-4 xl:sticky xl:top-[calc(var(--doctor-chrome-current-height)+1rem)]">
          <section aria-labelledby="dossier-reading-title" className="rounded-2xl bg-[#071a3a] p-5 text-white">
            <h4 id="dossier-reading-title" className="text-lg font-semibold">Cada camada tem um significado diferente.</h4>
            <ul className="mt-4 space-y-3">
              {(Object.keys(kindPresentation) as LongitudinalRecordKind[]).map((kind) => (
                <li key={kind} className="flex items-start gap-3 text-xs leading-5 text-[#d7e1ef]">
                  <span aria-hidden="true" className={cn('mt-1 size-2.5 shrink-0 rounded-full', kindPresentation[kind].dot)} />
                  <span><strong className="text-white">{kindPresentation[kind].label}:</strong> {kind === 'patient-report' ? 'texto preservado de quem respondeu.' : kind === 'recorded-data' ? 'ocorrência ou confirmação sem interpretação clínica.' : kind === 'care-draft' ? 'organização provisória, manual ou assistida, com estado de revisão separado.' : kind === 'care-plan' ? 'versão do plano com rascunho, aprovação e publicação rastreados separadamente.' : 'conteúdo explicitamente revisado pelo médico.'}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/15 pt-4 text-xs leading-5 text-[#c7d5e7]">Relato não vira fato, rascunho não vira decisão e confirmação manual não significa sincronização com prontuário.</p>
          </section>

          <OperationalCheckIn checkIn={latestCheckIn} />

          <DoctorFollowUpWorkspace patientId={patientId} encounterId={encounterId} />

          <AuditTrail events={auditEvents} />

          <section aria-labelledby="dossier-gaps-title" className="rounded-2xl border border-[#dbe4f0] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h4 id="dossier-gaps-title" className="text-sm font-bold text-[#071a3a]">Lacunas visíveis</h4>
              <Status tone="amber">{dossier.gaps.length}</Status>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-xs leading-5 text-[#61718a]">
              {dossier.gaps.map((gap) => <li key={gap}>{gap}</li>)}
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}
