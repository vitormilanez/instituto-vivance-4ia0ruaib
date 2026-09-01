'use client';

import { useState } from 'react';
import { useCareDemo } from './care-demo-store';
import { AiDraftBadge, ClinicalLayerBadge, SimulationDisclaimer } from './clinical';
import { Status } from './shared';

export function PreConsultationReviewWorkspace({
  patientId,
  encounterId,
  onNotify,
}: {
  patientId: string;
  encounterId: string;
  onNotify: (message: string) => void;
}) {
  const {
    hydrated,
    latestSubmission,
    activeReview,
    reviewHistory,
    startPreConsultationReview,
    savePreConsultationReview,
    approvePreConsultationReview,
    rejectPreConsultationReview,
  } = useCareDemo(patientId, encounterId);
  const [showRejection, setShowRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  if (!hydrated) {
    return <SimulationDisclaimer>Carregando o contexto desta consulta...</SimulationDisclaimer>;
  }

  if (!latestSubmission) {
    return (
      <SimulationDisclaimer>
        Nenhuma pré-consulta foi enviada nesta sessão. O atendimento pode seguir pelo fluxo manual.
      </SimulationDisclaimer>
    );
  }

  const beginReview = () => {
    startPreConsultationReview();
    setShowRejection(false);
    setRejectionReason('');
    setError('');
    onNotify('Revisão médica iniciada. O conteúdo continua como rascunho.');
  };

  const approveReview = () => {
    if (!activeReview) return;
    try {
      approvePreConsultationReview(activeReview.content);
      setError('');
      setShowRejection(false);
      onNotify('Preparo aprovado para uso na consulta. Nada foi publicado para a paciente.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível aprovar o preparo.');
    }
  };

  const rejectReview = () => {
    if (!activeReview) return;
    try {
      rejectPreConsultationReview(activeReview.content, rejectionReason);
      setError('');
      setShowRejection(false);
      onNotify('Rascunho rejeitado. O relato original foi preservado.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível rejeitar o rascunho.');
    }
  };

  const status = activeReview?.status;
  const assistedLabel = status === 'approved'
    ? 'Origem: rascunho assistido revisado'
    : status === 'rejected'
      ? 'Origem: rascunho assistido rejeitado'
      : 'Simulação de rascunho — requer revisão médica';

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6" aria-labelledby="source-title">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <ClinicalLayerBadge layer="relato" />
            <h3 id="source-title" className="mt-3 text-xl font-semibold">Fonte enviada pela paciente</h3>
          </div>
          <Status tone="gray">Versão {latestSubmission.version}</Status>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#698078]">
          Enviada em {latestSubmission.submittedAt} · ciência {latestSubmission.consentVersion}
        </p>
        <dl className="mt-5 space-y-4 text-sm leading-6 text-[#526a62]">
          <div className="rounded-2xl bg-[#f4f7f5] p-4">
            <dt className="font-bold text-[#17372f]">Objetivo principal</dt>
            <dd className="mt-1 whitespace-pre-wrap">{latestSubmission.objective}</dd>
          </div>
          <div>
            <dt className="font-bold text-[#17372f]">Mudanças recentes</dt>
            <dd className="mt-1 whitespace-pre-wrap">{latestSubmission.changes}</dd>
          </div>
          <div>
            <dt className="font-bold text-[#17372f]">Dúvidas</dt>
            <dd className="mt-1 whitespace-pre-wrap">{latestSubmission.questions || 'Não informado.'}</dd>
          </div>
          <div>
            <dt className="font-bold text-[#17372f]">Contexto adicional</dt>
            <dd className="mt-1 whitespace-pre-wrap">{latestSubmission.additionalContext || 'Não informado.'}</dd>
          </div>
        </dl>
        <p className="mt-5 border-t border-[#e7eeea] pt-4 text-xs leading-5 text-[#698078]">
          Esta fonte permanece íntegra mesmo quando um rascunho é editado ou rejeitado.
        </p>
      </section>

      <section className="rounded-3xl border border-[#c9d8ec] bg-[#f7f9fc] p-5 sm:p-6" aria-labelledby="review-title">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {latestSubmission.structuredDraft ? <AiDraftBadge>{assistedLabel}</AiDraftBadge> : <Status tone="gray">Preparação manual</Status>}
            <h3 id="review-title" className="mt-3 text-xl font-semibold">Workspace de revisão médica</h3>
          </div>
          {activeReview && (
            <Status tone={status === 'approved' ? 'green' : status === 'rejected' ? 'rose' : 'amber'}>
              {status === 'approved' ? 'Preparo aprovado' : status === 'rejected' ? 'Rascunho rejeitado' : 'Em revisão'} · v{activeReview.version}
            </Status>
          )}
        </div>

        {!activeReview ? (
          <>
            <p className="mt-5 text-sm leading-6 text-[#526a62]">
              {latestSubmission.structuredDraft
                ? 'Abra uma cópia revisável da organização assistida. O relato original continuará separado.'
                : 'A paciente não autorizou IA. Abra uma preparação manual criada somente a partir das respostas originais.'}
            </p>
            <button
              type="button"
              onClick={beginReview}
              className="mt-5 min-h-12 cursor-pointer rounded-xl bg-[#17372f] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0f2d26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2"
            >
              Iniciar revisão médica
            </button>
          </>
        ) : (
          <>
            <label htmlFor="preconsultation-review" className="mt-5 block text-sm font-bold text-[#17372f]">
              Conteúdo preparado para a consulta
            </label>
            <p id="preconsultation-review-helper" className="mt-1 text-xs leading-5 text-[#698078]">
              Edite livremente. Aprovar este conteúdo não publica um plano nem altera o relato original.
            </p>
            <textarea
              id="preconsultation-review"
              value={activeReview.content}
              onChange={(event) => {
                savePreConsultationReview(event.target.value);
                if (error) setError('');
              }}
              readOnly={status !== 'draft'}
              maxLength={3000}
              aria-describedby={`preconsultation-review-helper${error && !showRejection ? ' preconsultation-review-error' : ''}`}
              aria-invalid={Boolean(error && !showRejection)}
              className="mt-3 min-h-64 w-full rounded-2xl border border-[#b8cce5] bg-white p-4 text-sm leading-6 text-[#17372f] outline-none transition-colors focus:border-[#5578a9] focus:ring-3 focus:ring-[#c9d8ec] read-only:bg-[#f1f4f8] read-only:text-[#526a62]"
            />
            <div className="mt-2 flex min-h-6 items-start justify-between gap-3">
              <span id="preconsultation-review-error" role={error && !showRejection ? 'alert' : undefined} className="text-sm font-semibold text-[#9c453f]">{showRejection ? '' : error}</span>
              <span className="shrink-0 text-xs text-[#698078]">{activeReview.content.length}/3000</span>
            </div>

            {status === 'draft' && (
              <div className="mt-5">
                {!showRejection ? (
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRejection(true);
                        setError('');
                      }}
                      className="min-h-12 cursor-pointer rounded-xl border border-[#d9aaa6] bg-white px-5 text-sm font-bold text-[#8d3f39] transition-colors hover:bg-[#fdf0ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c87870] focus-visible:ring-offset-2"
                    >
                      Rejeitar este rascunho
                    </button>
                    <button
                      type="button"
                      onClick={approveReview}
                      className="min-h-12 cursor-pointer rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2"
                    >
                      Aprovar para uso na consulta
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#e4beb9] bg-[#fdf0ef] p-4">
                    <label htmlFor="rejection-reason" className="text-sm font-bold text-[#7b3732]">Motivo da rejeição</label>
                    <p id="rejection-reason-helper" className="mt-1 text-xs leading-5 text-[#7e504c]">O motivo fica no histórico médico e não é enviado à paciente.</p>
                    <textarea
                      id="rejection-reason"
                      value={rejectionReason}
                      onChange={(event) => {
                        setRejectionReason(event.target.value);
                        if (error) setError('');
                      }}
                      maxLength={500}
                      aria-describedby={`rejection-reason-helper${error ? ' rejection-reason-error' : ''}`}
                      aria-invalid={Boolean(error)}
                      className="mt-3 min-h-28 w-full rounded-xl border border-[#d9aaa6] bg-white p-3 text-sm leading-6 outline-none focus:ring-3 focus:ring-[#efc9c5]"
                      placeholder="Ex.: a organização misturou relato e interpretação."
                    />
                    {error && <p id="rejection-reason-error" role="alert" className="mt-2 text-sm font-semibold text-[#8d3f39]">{error}</p>}
                    <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                      <button type="button" onClick={() => setShowRejection(false)} className="min-h-11 cursor-pointer rounded-xl px-4 text-sm font-bold text-[#7e504c] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c87870]">Cancelar</button>
                      <button type="button" onClick={rejectReview} className="min-h-11 cursor-pointer rounded-xl bg-[#8d3f39] px-4 text-sm font-bold text-white hover:bg-[#74332f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d3f39] focus-visible:ring-offset-2">Confirmar rejeição</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === 'approved' && (
              <div className="mt-5 rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-sm leading-6 text-[#45655c]">
                <p className="font-bold text-[#0b6a5b]">Aprovado por {activeReview.reviewedBy}</p>
                <p className="mt-1">{activeReview.reviewedAt} · válido somente como preparo desta consulta.</p>
              </div>
            )}

            {status === 'rejected' && (
              <div className="mt-5 rounded-2xl border border-[#e4beb9] bg-[#fdf0ef] p-4 text-sm leading-6 text-[#7e504c]">
                <p className="font-bold text-[#8d3f39]">Rascunho rejeitado por {activeReview.reviewedBy}</p>
                <p className="mt-1">Motivo: {activeReview.rejectionReason}</p>
              </div>
            )}

            {status !== 'draft' && (
              <button
                type="button"
                onClick={beginReview}
                className="mt-4 min-h-11 cursor-pointer rounded-xl border border-[#9ccdc2] bg-white px-4 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2"
              >
                Criar nova versão de revisão
              </button>
            )}
          </>
        )}

        <div className="mt-5">
          <SimulationDisclaimer>
            A aprovação valida apenas o preparo médico. Publicação de plano para a paciente exige uma confirmação separada no Lote 3.
          </SimulationDisclaimer>
        </div>

        {reviewHistory.length > 1 && (
          <details className="mt-4 rounded-2xl border border-[#d7e3df] bg-white p-4">
            <summary className="cursor-pointer text-sm font-bold text-[#0b6a5b]">Histórico de revisão ({reviewHistory.length} versões)</summary>
            <ol className="mt-4 space-y-3">
              {[...reviewHistory].reverse().map((review) => (
                <li key={review.id} className="rounded-xl bg-[#f4f7f5] p-3 text-xs leading-5 text-[#526a62]">
                  <strong className="text-[#17372f]">Versão {review.version}</strong> · {review.status === 'approved' ? 'aprovada' : review.status === 'rejected' ? 'rejeitada' : 'em revisão'} · {review.updatedAt}
                </li>
              ))}
            </ol>
          </details>
        )}
      </section>
    </div>
  );
}
