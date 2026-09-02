'use client';

import {
  ArrowLeft,
  ArrowRight,
  ChartLineUp,
  CheckCircle,
  FileText,
  Sparkle,
  WarningCircle,
} from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { getPatientDossierHref } from './demo-routes';
import {
  getPatientAvatarIdentity,
  getPatientCareDemo,
  type PatientEvolutionMetric,
} from './patient-care-demo-data';
import { PatientAvatar } from './doctor-patient-longitudinal';
import { cn, NavigationLink as Link } from './shared';

type SummaryPeriod = '7 dias' | '30 dias' | 'Ciclo completo';

type SummaryPoint = {
  id: string;
  title: string;
  detail: string;
  source: string;
};

const periods: Array<{ id: SummaryPeriod; detail: string }> = [
  { id: '7 dias', detail: 'Ponto mais recente de cada registro' },
  { id: '30 dias', detail: 'Série de registros disponível' },
  { id: 'Ciclo completo', detail: 'Plano, check-ins, medidas e documentos' },
];

function formatMetricValue(value: number, metric: PatientEvolutionMetric) {
  if (metric.unit === 'h') {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}h${String(minutes).padStart(2, '0')}`;
  }

  if (metric.unit === 'passos') return new Intl.NumberFormat('pt-BR').format(value);
  if (metric.unit === '%') return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value)}%`;

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)} ${metric.unit}`;
}

function metricStatus(metric: PatientEvolutionMetric) {
  const latest = metric.points.at(-1);
  if (!latest || metric.target === undefined) return null;

  const targetReached = metric.label === 'Peso'
    ? latest.value <= metric.target
    : latest.value >= metric.target;
  const targetRelation = metric.label === 'Peso' ? 'até' : 'de';

  return {
    reached: targetReached,
    value: formatMetricValue(latest.value, metric),
    target: `${targetRelation} ${formatMetricValue(metric.target, metric)}`,
  };
}

function getSummaryPoints(patientId: string, patientName: string, period: SummaryPeriod) {
  const care = getPatientCareDemo(patientId, patientName);
  const metricPoints = Object.entries(care.evolution).flatMap(([key, metric]) => {
    const status = metricStatus(metric);
    if (!status) return [];

    return [{
      id: `metric-${key}`,
      reached: status.reached,
      title: status.reached
        ? `${metric.label}: ${status.value} está dentro da meta registrada`
        : `${metric.label}: ${status.value} ainda não alcança a meta registrada`,
      detail: `${metric.targetLabel ?? 'Meta registrada'} ${status.target}.`,
      source: `${metric.source} · ${metric.completeness}`,
    }];
  });

  const attention = metricPoints
    .filter((point) => !point.reached)
    .map(({ id, title, detail, source }) => ({ id, title, detail, source }));
  const favorable = metricPoints
    .filter((point) => point.reached)
    .map(({ id, title, detail, source }) => ({ id, title, detail, source }));
  const pendingExam = period === '7 dias'
    ? undefined
    : care.documents.find((document) => document.kind === 'exam' && document.statusTone === 'amber');

  if (pendingExam) {
    attention.push({
      id: 'exam-review',
      title: 'Exame mais recente aguarda conferência médica',
      detail: 'O resumo não interpreta nem classifica valores laboratoriais.',
      source: `${pendingExam.title} · ${pendingExam.date}`,
    });
  }

  return {
    includedDocumentCount: period === '7 dias' ? 0 : care.documents.filter((document) => document.kind === 'exam').length,
    favorable: favorable.slice(0, 3),
    attention: attention.slice(0, 3),
  };
}

function SummaryList({
  tone,
  title,
  description,
  points,
}: {
  tone: 'good' | 'attention';
  title: string;
  description: string;
  points: SummaryPoint[];
}) {
  const isGood = tone === 'good';
  const Icon = isGood ? CheckCircle : WarningCircle;

  return (
    <section
      aria-labelledby={`${tone}-summary-title`}
      className={cn(
        'overflow-hidden rounded-3xl border',
        isGood ? 'border-[#c9e1d7] bg-[#f7fbf9]' : 'border-[#edd8a7] bg-[#fffaf1]',
      )}
    >
      <div className="flex items-start gap-3 border-b border-current/10 px-5 py-5 sm:px-6">
        <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl', isGood ? 'bg-[#dff1e9] text-[#17624e]' : 'bg-[#fff0ca] text-[#80530a]')}>
          <Icon aria-hidden="true" size={23} weight="duotone" />
        </span>
        <div>
          <h2 id={`${tone}-summary-title`} className="text-lg font-semibold tracking-[-0.025em] text-[#071a3a]">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-[#526681]">{description}</p>
        </div>
      </div>

      <div className="divide-y divide-[#dce7e0]">
        {points.length > 0 ? points.map((point) => (
          <article key={point.id} className="px-5 py-4 sm:px-6">
            <h3 className="text-sm font-bold leading-6 text-[#071a3a]">{point.title}</h3>
            <p className="mt-1 text-sm leading-5 text-[#526681]">{point.detail}</p>
            <p className="mt-2 text-xs font-medium text-[#6b7d96]">Fonte: {point.source}</p>
          </article>
        )) : (
          <p className="px-5 py-5 text-sm leading-6 text-[#526681]">Não há comparação suficiente com meta registrada neste recorte.</p>
        )}
      </div>
    </section>
  );
}

export function DoctorPatientResultsSummary({ patientId, patientName }: { patientId: string; patientName: string }) {
  const [period, setPeriod] = useState<SummaryPeriod>('30 dias');
  const { includedDocumentCount, favorable, attention } = useMemo(
    () => getSummaryPoints(patientId, patientName, period),
    [patientId, patientName, period],
  );
  const activePeriod = periods.find((item) => item.id === period) ?? periods[1];
  const patientAvatar = getPatientAvatarIdentity(patientId, patientName);

  return (
    <main id="main-content" className="mx-auto w-full max-w-[1160px] px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
      <Link
        href={getPatientDossierHref(patientId)}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-1.5 text-sm font-bold text-[#405675] transition-colors hover:text-[#124da0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0]"
      >
        <ArrowLeft aria-hidden="true" size={19} />
        Voltar ao acompanhamento
      </Link>

      <section className="mt-4 overflow-hidden rounded-3xl border border-[#dbe4f0] bg-white shadow-[0_16px_42px_rgba(3,19,45,0.06)]">
        <div className="border-b border-[#e2e9f3] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <PatientAvatar patient={patientAvatar} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f4ef] px-3 py-1.5 text-xs font-bold text-[#17624e]">
                    <Sparkle aria-hidden="true" size={15} weight="duotone" />
                    Rascunho assistido por IA
                  </span>
                  <span className="rounded-full bg-[#fff0ca] px-3 py-1.5 text-xs font-bold text-[#77500a]">Revisão médica necessária</span>
                </div>
                <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#071a3a] sm:text-3xl">Resumo dos resultados de {patientName}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526681]">Comparação dos registros com as metas já publicadas. A IA organiza o recorte; não cria diagnóstico, conduta ou orientação à paciente.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#dbe4f0] bg-[#f7faff] p-3 text-sm lg:max-w-[320px]">
              <p className="font-bold text-[#071a3a]">Recorte considerado</p>
              <p className="mt-1 leading-5 text-[#61718a]">Plano, check-ins, medidas e registros de atividade{includedDocumentCount ? `, além de ${includedDocumentCount} documento${includedDocumentCount === 1 ? '' : 's'} de exame` : ''}.</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#506681]">Período do resumo</p>
              <p className="mt-1 text-sm text-[#61718a]">{activePeriod.detail}</p>
            </div>
            <div className="grid grid-cols-3 rounded-2xl border border-[#d8e3f1] bg-[#eef4fb] p-1" role="group" aria-label="Escolher período do resumo">
              {periods.map((item) => {
                const active = item.id === period;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPeriod(item.id)}
                    className={cn(
                      'min-h-10 cursor-pointer rounded-xl px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2',
                      active ? 'bg-white text-[#071a3a] shadow-[0_3px_10px_rgba(3,19,45,0.08)]' : 'text-[#526681] hover:text-[#124da0]',
                    )}
                  >
                    {item.id}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <SummaryList
              tone="good"
              title="O que está alinhado"
              description="Registros que atingem a meta já definida no plano."
              points={favorable}
            />
            <SummaryList
              tone="attention"
              title="Pontos para revisar"
              description="Itens que ainda pedem conversa, contexto ou leitura humana."
              points={attention}
            />
          </div>

          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#dbe4f0] bg-[#f7faff] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5" aria-label="Fontes do resumo">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#124da0] shadow-sm"><ChartLineUp aria-hidden="true" size={20} weight="duotone" /></span>
              <div>
                <h2 className="text-sm font-bold text-[#071a3a]">Fontes continuam separadas do resumo</h2>
                <p className="mt-1 text-sm leading-5 text-[#526681]">Abra o acompanhamento para conferir medidas, documentos e registros originais antes de qualquer decisão.</p>
              </div>
            </div>
            <Link
              href={getPatientDossierHref(patientId)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#b9cbe2] bg-white px-4 text-sm font-bold text-[#124da0] transition-colors hover:bg-[#edf3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2"
            >
              <FileText aria-hidden="true" size={18} />
              Ver dados de origem
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
