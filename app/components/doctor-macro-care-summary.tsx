import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { getMacroCareSummary } from './macro-care-demo-data';
import { getDoctorMacroCareReview, type MacroCareReviewItem } from './macro-care-doctor-demo-data';
import { cn, Status } from './shared';

const reviewTone: Record<MacroCareReviewItem['status'], 'amber' | 'rose' | 'gray'> = {
  Conferir: 'amber',
  'Não publicar': 'rose',
  'Sem fonte': 'gray',
};

export function DoctorMacroCareSummary({ patientId }: { patientId: string }) {
  const summary = getMacroCareSummary(patientId);
  const review = getDoctorMacroCareReview(patientId);
  if (!summary || !review) return null;

  return (
    <section aria-labelledby="doctor-macro-summary-title" className="vivance-panel overflow-hidden rounded-2xl">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="doctor-macro-summary-title" className="text-xl font-semibold tracking-[-0.02em] text-[#071a3a] sm:text-2xl">Resumo macro recebido</h2>
            <p className="mt-1 text-xs leading-5 text-[#61718a]">Mensagem e plano alimentar · {summary.recordedBy} · {summary.recordedAt}</p>
          </div>
          <div className="flex flex-wrap gap-2"><Status tone="gray">Dados fictícios</Status><Status tone="amber">{review.reviewItems.length} pontos para conferir</Status></div>
        </div>

        <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-8">
          <div>
            <dl className="grid grid-cols-2 border-y border-[#e7edf5]">
              {summary.anthropometrics.map((item, index) => (
                <div key={item.label} className={cn(
                  'py-3',
                  index % 2 === 0 ? 'pr-3' : 'border-l border-[#e7edf5] pl-3',
                  index > 1 && 'border-t border-[#e7edf5]',
                )}>
                  <dt className="text-xs font-semibold text-[#61718a]">{item.label}</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums text-[#071a3a]">{item.value}</dd>
                  {item.detail ? <p className="mt-0.5 text-xs text-[#61718a]">{item.detail}</p> : null}
                </div>
              ))}
              <div className="border-l border-t border-[#e7edf5] py-3 pl-3">
                <dt className="text-xs font-semibold text-[#61718a]">Perspectiva informada</dt>
                <dd className="mt-1 text-sm font-bold text-[#405675]">Muito positiva</dd>
                <p className="mt-0.5 text-xs text-[#61718a]">opinião do material recebido</p>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-6 text-[#405675]">{summary.patientSummary}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-[#071a3a]">Pontos de laboratório citados</h3>
              <ul className="mt-3 divide-y divide-[#e7edf5] border-y border-[#e7edf5]">
                {summary.labTopics.map((topic) => <li key={topic} className="flex items-start gap-2 py-2.5 text-sm text-[#405675]"><CheckCircle aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[#124da0]" />{topic}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#071a3a]">Metas registradas no plano</h3>
              <ul className="mt-3 divide-y divide-[#e7edf5] border-y border-[#e7edf5]">
                {summary.priorities.map((priority) => <li key={priority.label} className="flex items-baseline justify-between gap-3 py-2.5 text-sm"><span className="text-[#61718a]">{priority.label}</span><strong className="text-right text-[#071a3a]">{priority.target}</strong></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#dbe4f0] bg-[#fbfcfe] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <WarningCircle aria-hidden="true" size={21} weight="fill" className="mt-0.5 shrink-0 text-[#9c6500]" />
          <div>
            <h3 className="text-base font-semibold text-[#071a3a]">Antes de compartilhar qualquer ajuste</h3>
            <p className="mt-1 text-xs leading-5 text-[#61718a]">O material mistura fatos, hipóteses e estimativas. Estes itens continuam somente na área profissional.</p>
          </div>
        </div>
        <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
          {review.reviewItems.map((item) => (
            <li key={item.label} className="border-t border-[#dbe4f0] py-3">
              <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-[#071a3a]">{item.label}</strong><Status tone={reviewTone[item.status]}>{item.status}</Status></div>
              <p className="mt-1.5 text-xs leading-5 text-[#61718a]">{item.value}</p>
            </li>
          ))}
        </ul>

        <details className="border-t border-[#dbe4f0] pt-2">
          <summary className="flex min-h-11 cursor-pointer list-none items-center text-sm font-bold text-[#124da0] focus-visible:outline-none">Ver projeção original não validada</summary>
          <div className="pb-1 pt-2 text-xs leading-5 text-[#61718a]">
            <p><strong className="text-[#405675]">Premissa recebida:</strong> {review.receivedProjection.assumption} · {review.receivedProjection.weekly}.</p>
            <dl className="mt-3 grid gap-2 sm:grid-cols-3">
              {review.receivedProjection.milestones.map((milestone) => <div key={milestone.period} className="border-t border-[#dbe4f0] pt-2"><dt className="font-bold text-[#071a3a]">{milestone.period}</dt><dd className="mt-0.5">{milestone.value}</dd></div>)}
            </dl>
            <p className="mt-3 text-[#9c453f]">Não usar como promessa ou meta até revisão clínica e reconciliação dos marcos.</p>
          </div>
        </details>
      </div>
    </section>
  );
}
