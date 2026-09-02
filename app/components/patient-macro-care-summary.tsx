import { CheckCircle, Info } from '@phosphor-icons/react';
import { getMacroCareSummary } from './macro-care-demo-data';
import { cn, Status } from './shared';

export function PatientMacroCareSummary({
  patientId,
  onOpenCare,
}: {
  patientId: string;
  onOpenCare: () => void;
}) {
  const summary = getMacroCareSummary(patientId);
  if (!summary || summary.patientVisibility !== 'shared') return null;

  return (
    <section aria-labelledby="patient-macro-summary-title" className="mt-7 overflow-hidden rounded-2xl border border-[#cfe0da] bg-white">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="patient-macro-summary-title" className="text-2xl font-semibold tracking-[-0.03em] text-[#17372f]">Seu cuidado, em resumo</h2>
            <p className="mt-1 text-xs leading-5 text-[#698078]">Atualizado por {summary.recordedBy} · {summary.recordedAt}</p>
          </div>
          <Status tone="green">Orientação do médico</Status>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
          <div>
            <p className="max-w-2xl text-sm leading-6 text-[#405d54]">{summary.patientSummary}</p>
            <dl className="mt-5 grid grid-cols-2 border-y border-[#e2ece8] sm:grid-cols-4">
              {summary.anthropometrics.map((item, index) => (
                <div key={item.label} className={cn(
                  'py-3',
                  index % 2 === 0 ? 'pr-3' : 'border-l border-[#e2ece8] pl-3',
                  index > 1 && 'border-t border-[#e2ece8] sm:border-t-0',
                  index > 0 && 'sm:border-l sm:pl-3',
                )}>
                  <dt className="text-[11px] font-semibold leading-4 text-[#698078]">{item.label}</dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums text-[#17372f]">{item.value}</dd>
                  {item.detail ? <p className="mt-0.5 text-[11px] text-[#698078]">{item.detail}</p> : null}
                </div>
              ))}
              <div className="border-l border-t border-[#e2ece8] py-3 pl-3 sm:border-t-0">
                <dt className="text-[11px] font-semibold leading-4 text-[#698078]">Data da medida</dt>
                <dd className="mt-1 text-sm font-semibold text-[#17372f]">{summary.measurementDate}</dd>
                <p className="mt-0.5 text-[11px] text-[#698078]">confirmar com a equipe</p>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#17372f]">Foco desta fase</h3>
            <ul className="mt-3 divide-y divide-[#e2ece8] border-y border-[#e2ece8]">
              {summary.priorities.map((priority) => (
                <li key={priority.label} className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr] sm:items-baseline">
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#17372f]"><CheckCircle aria-hidden="true" size={17} className="shrink-0 text-[#0b7b68]" />{priority.label}</span>
                  <span className="text-sm text-[#405d54]"><strong>{priority.target}</strong><span className="block text-xs leading-5 text-[#698078]">{priority.note}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#e2ece8] bg-[#f7faf8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex max-w-3xl items-start gap-2 text-xs leading-5 text-[#60766f]"><Info aria-hidden="true" size={16} className="mt-0.5 shrink-0" />{summary.medicationNotice}</p>
        <button type="button" onClick={onOpenCare} className="min-h-11 shrink-0 rounded-xl border border-[#b9d1c9] bg-white px-4 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Ver meu cuidado</button>
      </div>
    </section>
  );
}
