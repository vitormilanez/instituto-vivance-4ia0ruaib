'use client';

import { useMemo, useState } from 'react';
import { useCareDemo } from './care-demo-store';
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
    dot: 'bg-[#789087]',
    border: 'border-l-[#789087]',
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
    dot: 'bg-[#0b7b68]',
    border: 'border-l-[#0b7b68]',
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

export function LongitudinalDossier({ patientId, patientName }: { patientId: string; patientName: string }) {
  const [filter, setFilter] = useState<DossierFilter>('all');
  const dossier = getLongitudinalDossier(patientId);
  const encounterId = getDefaultEncounterId(patientId);
  const { hydrated, submissions, reviews } = useCareDemo(patientId, encounterId);

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

    return [...submissionRecords, ...reviewRecords];
  }, [encounterId, patientId, patientName, reviews, submissions]);

  if (!hydrated) {
    return (
      <section aria-labelledby="longitudinal-dossier-title" className="border-t border-[#e7eeea] bg-[#fbfdfc] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#0b7b68]">Histórico longitudinal</p>
        <h3 id="longitudinal-dossier-title" className="mt-2 text-xl font-semibold">Carregando o contexto demonstrativo...</h3>
        <p className="mt-2 text-sm leading-6 text-[#60766f]">Nenhum dado de outro paciente é exibido durante o carregamento.</p>
      </section>
    );
  }

  if (!dossier) {
    return (
      <section aria-labelledby="longitudinal-dossier-title" className="border-t border-[#e7eeea] bg-[#fbfdfc] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#0b7b68]">Histórico longitudinal</p>
        <h3 id="longitudinal-dossier-title" className="mt-2 text-xl font-semibold">Ainda não há eventos para este contexto.</h3>
        <p className="mt-2 text-sm leading-6 text-[#60766f]">O protótipo não completa lacunas com informações de outra pessoa.</p>
      </section>
    );
  }

  const staticRecords = submissions.length > 0 && patientId === 'pac-demo-001'
    ? dossier.records.filter((record) => record.id !== 'marina-pre-consulta-v1')
    : dossier.records;
  const records = [...sessionRecords, ...staticRecords]
    .filter((record) => record.patientId === patientId && record.encounterId === encounterId)
    .sort((left, right) => right.occurredAtIso.localeCompare(left.occurredAtIso));
  const visibleRecords = filter === 'all'
    ? records
    : records.filter((record) => record.kind === filter);
  const sourceCount = new Set(records.flatMap((record) => [record.sourceId, ...(record.linkedSourceIds ?? [])])).size;
  const reviewedCount = records.filter((record) => Boolean(record.reviewedBy)).length;
  const latestUpdate = records[0]?.occurredAt ?? dossier.updatedAt;
  const periodLabel = sessionRecords.length > 0 ? `Sessão atual + ${dossier.period}` : dossier.period;

  return (
    <section aria-labelledby="longitudinal-dossier-title" className="border-t border-[#e7eeea] bg-[#fbfdfc] p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#0b7b68]">Histórico rastreável no protótipo</p>
          <h3 id="longitudinal-dossier-title" className="mt-2 text-xl font-semibold tracking-[-0.02em]">O que aconteceu, quem registrou e de onde veio</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#60766f]">
            Eventos fictícios de {patientName} organizados por origem. Relatos, registros, rascunhos assistidos e revisões médicas continuam em camadas separadas.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-[#d7e3df] bg-white px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#789087]">Última atualização</p>
          <p className="mt-1 text-sm font-bold text-[#2d4d44]">{latestUpdate}</p>
          <p className="mt-1 text-[11px] text-[#789087]">Sessão demonstrativa</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-[#dfe8e3] bg-[#dfe8e3] sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white p-4">
          <dt className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#789087]">Período coberto</dt>
          <dd className="mt-1 text-sm font-bold text-[#2d4d44]">{periodLabel}</dd>
        </div>
        <div className="bg-white p-4">
          <dt className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#789087]">Eventos visíveis</dt>
          <dd className="mt-1 text-sm font-bold text-[#2d4d44]">{records.length}</dd>
        </div>
        <div className="bg-white p-4">
          <dt className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#789087]">Fontes identificadas</dt>
          <dd className="mt-1 text-sm font-bold text-[#2d4d44]">{sourceCount}</dd>
        </div>
        <div className="bg-white p-4">
          <dt className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#789087]">Itens com revisão médica</dt>
          <dd className="mt-1 text-sm font-bold text-[#2d4d44]">{reviewedCount}</dd>
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
                  'min-h-11 shrink-0 cursor-pointer rounded-xl border px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2',
                  filter === option.value
                    ? 'border-[#17372f] bg-[#17372f] text-white'
                    : 'border-[#d7e3df] bg-white text-[#60766f] hover:border-[#9fc8bd] hover:bg-[#edf7f4] hover:text-[#0b6a5b]',
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
                  : presentation.label;
                return (
                  <li key={record.id}>
                    <article className={cn('relative rounded-2xl border border-l-4 border-[#dfe8e3] bg-white p-5', presentation.border)}>
                      <span aria-hidden="true" className={cn('absolute -left-[9px] top-6 size-3 rounded-full border-2 border-white', presentation.dot)} />
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <time dateTime={record.occurredAtIso} className="text-xs font-bold text-[#0b6a5b]">{record.occurredAt}</time>
                          <h4 className="mt-1.5 text-base font-bold leading-6 text-[#17372f]">{record.title}</h4>
                        </div>
                        <Status tone={presentation.tone}>{presentationLabel}</Status>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#526a62]">{record.summary}</p>
                      <dl className="mt-4 grid gap-3 rounded-xl bg-[#f4f7f5] p-4 sm:grid-cols-2 xl:grid-cols-5">
                        <div>
                          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#789087]">Origem</dt>
                          <dd className="mt-1 text-xs font-semibold leading-5 text-[#405d54]">{record.source}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#789087]">ID e versão</dt>
                          <dd className="mt-1 break-all text-xs font-semibold leading-5 text-[#405d54]">
                            {record.sourceId} · v{record.sourceVersion}
                            {record.linkedSourceIds?.length ? <span className="mt-1 block font-normal text-[#698078]">Fonte ligada: {record.linkedSourceIds.join(', ')}</span> : null}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#789087]">Autoria</dt>
                          <dd className="mt-1 text-xs font-semibold leading-5 text-[#405d54]">{record.author}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#789087]">Revisão</dt>
                          <dd className="mt-1 text-xs font-semibold leading-5 text-[#405d54]">
                            {record.reviewedBy ?? 'Ainda não revisado'}
                            {record.reviewedAt ? <span className="mt-1 block font-normal text-[#698078]">{record.reviewedAt}</span> : null}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#789087]">Estado</dt>
                          <dd className="mt-1 text-xs font-semibold leading-5 text-[#405d54]">{record.reviewState}</dd>
                        </div>
                      </dl>
                      {record.limitation ? (
                        <details className="mt-3 rounded-xl border border-[#ead8ad] bg-[#fffaf0] px-4 py-3">
                          <summary className="cursor-pointer text-xs font-bold text-[#704f10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Ver limite desta informação</summary>
                          <p className="mt-2 text-xs leading-5 text-[#704f10]">{record.limitation}</p>
                        </details>
                      ) : null}
                    </article>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-[#bfd4cd] bg-white p-6 text-center">
              <p className="text-sm font-bold text-[#405d54]">Nenhum evento nesta camada.</p>
              <p className="mt-1 text-xs leading-5 text-[#789087]">A ausência é mantida visível; o protótipo não cria conteúdo para completar o histórico.</p>
              <button type="button" onClick={() => setFilter('all')} className="mt-4 min-h-11 cursor-pointer rounded-xl border border-[#bfd4cd] bg-white px-4 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
                Mostrar todos os eventos
              </button>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-4 xl:sticky xl:top-24">
          <section aria-labelledby="dossier-reading-title" className="rounded-2xl bg-[#17372f] p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#9fd6c8]">Leitura segura</p>
            <h4 id="dossier-reading-title" className="mt-2 text-lg font-semibold">Cada camada tem um significado diferente.</h4>
            <ul className="mt-4 space-y-3">
              {(Object.keys(kindPresentation) as LongitudinalRecordKind[]).map((kind) => (
                <li key={kind} className="flex items-start gap-3 text-xs leading-5 text-[#d3e4df]">
                  <span aria-hidden="true" className={cn('mt-1 size-2.5 shrink-0 rounded-full', kindPresentation[kind].dot)} />
                  <span><strong className="text-white">{kindPresentation[kind].label}:</strong> {kind === 'patient-report' ? 'texto preservado de quem respondeu.' : kind === 'recorded-data' ? 'ocorrência ou confirmação sem interpretação clínica.' : kind === 'care-draft' ? 'organização provisória, manual ou assistida, com estado de revisão separado.' : 'conteúdo explicitamente revisado pelo médico.'}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/15 pt-4 text-xs leading-5 text-[#b8d3cb]">Relato não vira fato, rascunho não vira decisão e confirmação manual não significa sincronização com prontuário.</p>
          </section>

          <section aria-labelledby="dossier-gaps-title" className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h4 id="dossier-gaps-title" className="text-sm font-bold text-[#17372f]">Lacunas visíveis</h4>
              <Status tone="amber">{dossier.gaps.length}</Status>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-xs leading-5 text-[#60766f]">
              {dossier.gaps.map((gap) => <li key={gap}>{gap}</li>)}
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}
