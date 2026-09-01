'use client';

import { useMemo } from 'react';
import { useCareDemo } from './care-demo-store';
import type { CarePlanAction, CarePlanDraftContent, CarePlanStatus, CarePlanVersion } from './care-demo-types';
import { cn, Status } from './shared';

type StatusPresentation = {
  label: string;
  tone: 'green' | 'amber' | 'blue' | 'gray';
  description: string;
};

const statusPresentation: Record<CarePlanStatus, StatusPresentation> = {
  draft: {
    label: 'Rascunho editável',
    tone: 'amber',
    description: 'Esta versão ainda não foi aprovada nem aparece para a paciente.',
  },
  approved: {
    label: 'Aprovado pelo médico',
    tone: 'blue',
    description: 'A aprovação é um passo separado da publicação para a paciente.',
  },
  published: {
    label: 'Publicado para a paciente',
    tone: 'green',
    description: 'Esta é a versão que a paciente consegue ver no próprio plano.',
  },
  superseded: {
    label: 'Versão anterior preservada',
    tone: 'gray',
    description: 'O histórico permanece disponível; a paciente vê a versão publicada mais recente.',
  },
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Não foi possível atualizar o plano demonstrativo.';
}

function PlanActionInputs({
  actions,
  disabled,
  onChange,
}: {
  actions: CarePlanAction[];
  disabled: boolean;
  onChange: (index: number, patch: Partial<CarePlanAction>) => void;
}) {
  return (
    <fieldset disabled={disabled} className="mt-5">
      <legend className="text-sm font-bold text-[#17372f]">Ações visíveis para a paciente</legend>
      <p className="mt-1 text-xs leading-5 text-[#698078]">Escreva passos observáveis; a publicação não substitui prescrição, prontuário ou orientação de urgência.</p>
      <div className="mt-3 space-y-3">
        {actions.map((action, index) => (
          <div key={action.id} className="grid gap-3 rounded-2xl border border-[#dfe8e3] bg-[#fbfdfc] p-4 sm:grid-cols-[minmax(0,1fr)_190px_auto] sm:items-end">
            <label className="block text-xs font-bold text-[#405d54]">
              Ação {index + 1}
              <input
                value={action.title}
                onChange={(event) => onChange(index, { title: event.target.value })}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbdcd5] bg-white px-3 text-sm font-normal text-[#17372f] outline-none focus:ring-2 focus:ring-[#0b7b68] disabled:cursor-not-allowed disabled:bg-[#f1f5f3]"
              />
            </label>
            <label className="block text-xs font-bold text-[#405d54]">
              Frequência ou momento
              <input
                value={action.cadence}
                onChange={(event) => onChange(index, { cadence: event.target.value })}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbdcd5] bg-white px-3 text-sm font-normal text-[#17372f] outline-none focus:ring-2 focus:ring-[#0b7b68] disabled:cursor-not-allowed disabled:bg-[#f1f5f3]"
              />
            </label>
            <label className="flex min-h-11 items-center gap-2 text-xs font-bold text-[#405d54]">
              <input
                type="checkbox"
                checked={action.active}
                onChange={(event) => onChange(index, { active: event.target.checked })}
                className="size-4 accent-[#0b7b68]"
              />
              Exibir
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function ReadOnlyPlan({ plan }: { plan: CarePlanVersion }) {
  return (
    <>
      <div className="mt-6 rounded-2xl bg-[#f4f7f5] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0b7b68]">Objetivo desta versão</p>
        <p className="mt-2 text-base font-semibold leading-6 text-[#17372f]">{plan.objective}</p>
        <p className="mt-3 text-sm leading-6 text-[#526a62]">{plan.introduction}</p>
      </div>
      <div className="mt-5 space-y-3">
        {plan.actions.filter((action) => action.active).map((action) => (
          <article key={action.id} className="rounded-2xl border border-[#dfe8e3] bg-white p-4">
            <p className="text-sm font-bold text-[#17372f]">{action.title}</p>
            <p className="mt-1 text-xs text-[#698078]">{action.cadence}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-[#dfe8e3] bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#789087]">Acompanhamento</p>
          <p className="mt-2 text-sm leading-6 text-[#526a62]">{plan.monitoring}</p>
        </article>
        <article className="rounded-2xl border border-[#f0d59c] bg-[#fff8e9] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#704f10]">Canal combinado</p>
          <p className="mt-2 text-sm leading-6 text-[#704f10]">{plan.supportNotice}</p>
        </article>
      </div>
    </>
  );
}

export function DoctorCarePlanWorkspace({
  patientId,
  encounterId,
  notesPresent,
  onNotify,
  onContinue,
}: {
  patientId: string;
  encounterId: string;
  notesPresent: boolean;
  onNotify: (message: string) => void;
  onContinue: () => void;
}) {
  const {
    hydrated,
    activeReview,
    activeCarePlan,
    carePlans,
    latestCarePlan,
    latestPublishedCarePlan,
    startCarePlan,
    createCarePlanRevision,
    saveCarePlan,
    approveCarePlan,
    publishCarePlan,
  } = useCareDemo(patientId, encounterId);

  const template = useMemo<Partial<CarePlanDraftContent>>(() => {
    const approvedReview = activeReview?.status === 'approved' ? activeReview : null;
    return {
      sourceDescription: approvedReview
        ? `Preparo ${approvedReview.sourceMode === 'assisted' ? 'assistido' : 'manual'} revisado · versão ${approvedReview.version}`
        : notesPresent
          ? 'Notas da consulta demonstrativa'
          : 'Estrutura manual do plano demonstrativo',
      sourceMode: approvedReview?.sourceMode ?? 'manual',
      sourceReviewId: approvedReview?.id ?? null,
    };
  }, [activeReview, notesPresent]);

  if (!hydrated) {
    return <div className="rounded-3xl border border-[#dfe8e3] bg-white p-6 text-sm text-[#60766f]">Carregando o estado demonstrativo do plano...</div>;
  }

  const plan = activeCarePlan;
  const presentation = plan ? statusPresentation[plan.status] : statusPresentation.draft;
  const isEditable = plan?.status === 'draft';

  const createOrResume = () => {
    const hasOpenVersion = latestCarePlan?.status === 'draft' || latestCarePlan?.status === 'approved';
    const next = hasOpenVersion ? startCarePlan(template) : createCarePlanRevision(template);
    onNotify(`Versão ${next.version} do plano aberta como rascunho.`);
  };

  const createRevision = () => {
    const next = createCarePlanRevision(template);
    onNotify(`Versão ${next.version} do plano aberta como rascunho.`);
  };

  const updatePlan = (patch: Partial<CarePlanDraftContent>) => {
    if (!plan || !isEditable) return;
    try {
      saveCarePlan(plan.id, patch);
    } catch (error) {
      onNotify(getErrorMessage(error));
    }
  };

  const updateAction = (index: number, patch: Partial<CarePlanAction>) => {
    if (!plan) return;
    updatePlan({
      actions: plan.actions.map((action, actionIndex) => actionIndex === index ? { ...action, ...patch } : action),
    });
  };

  const approve = () => {
    if (!plan) return;
    try {
      const approved = approveCarePlan(plan.id);
      onNotify(`Versão ${approved.version} aprovada. A paciente ainda não consegue vê-la.`);
    } catch (error) {
      onNotify(getErrorMessage(error));
    }
  };

  const publish = () => {
    if (!plan) return;
    try {
      const published = publishCarePlan(plan.id);
      onNotify(`Versão ${published.version} publicada para a paciente nesta sessão demonstrativa.`);
    } catch (error) {
      onNotify(getErrorMessage(error));
    }
  };

  return (
    <section aria-labelledby="care-plan-workspace-title" className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Plano versionado</p>
          <h3 id="care-plan-workspace-title" className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Da consulta ao plano que a paciente vê</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#60766f]">Rascunhar, aprovar e publicar são ações distintas. A publicação não envia dados para prontuário ou integrações externas.</p>
        </div>
        <Status tone={presentation.tone}>{plan ? `v${plan.version} · ${presentation.label}` : presentation.label}</Status>
      </div>

      {!plan ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#bfd4cd] bg-[#fbfdfc] p-6 text-center">
          <p className="text-sm font-bold text-[#405d54]">Ainda não há um plano para este contexto.</p>
          <p className="mt-1 text-xs leading-5 text-[#789087]">Crie um rascunho manual; ele só ficará visível à paciente depois da aprovação e da publicação.</p>
          <button type="button" onClick={createOrResume} className="mt-4 min-h-11 cursor-pointer rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Criar rascunho do plano</button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className={cn('rounded-2xl border p-4', plan.status === 'published' ? 'border-[#b9d8cf] bg-[#edf7f4]' : plan.status === 'approved' ? 'border-[#c8d9e8] bg-[#f0f6fb]' : 'border-[#f0d59c] bg-[#fff8e9]')}>
              <p className="text-sm font-bold text-[#17372f]">{presentation.label}</p>
              <p className="mt-1 text-sm leading-6 text-[#526a62]">{presentation.description}</p>
            </div>

            {isEditable ? (
              <div className="mt-5 space-y-5">
                <label className="block text-sm font-bold text-[#17372f]">
                  Nome do plano
                  <input value={plan.title} onChange={(event) => updatePlan({ title: event.target.value })} className="mt-2 min-h-11 w-full rounded-xl border border-[#cbdcd5] px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#0b7b68]" />
                </label>
                <label className="block text-sm font-bold text-[#17372f]">
                  Objetivo combinado
                  <textarea value={plan.objective} onChange={(event) => updatePlan({ objective: event.target.value })} className="mt-2 min-h-28 w-full rounded-2xl border border-[#cbdcd5] p-3 text-sm font-normal leading-6 outline-none focus:ring-2 focus:ring-[#0b7b68]" />
                </label>
                <label className="block text-sm font-bold text-[#17372f]">
                  Texto de abertura para a paciente
                  <textarea value={plan.introduction} onChange={(event) => updatePlan({ introduction: event.target.value })} className="mt-2 min-h-24 w-full rounded-2xl border border-[#cbdcd5] p-3 text-sm font-normal leading-6 outline-none focus:ring-2 focus:ring-[#0b7b68]" />
                </label>
                <PlanActionInputs actions={plan.actions} disabled={false} onChange={updateAction} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-bold text-[#17372f]">
                    Como acompanhar
                    <textarea value={plan.monitoring} onChange={(event) => updatePlan({ monitoring: event.target.value })} className="mt-2 min-h-28 w-full rounded-2xl border border-[#cbdcd5] p-3 text-sm font-normal leading-6 outline-none focus:ring-2 focus:ring-[#0b7b68]" />
                  </label>
                  <label className="block text-sm font-bold text-[#17372f]">
                    Mensagem sobre o canal combinado
                    <textarea value={plan.supportNotice} onChange={(event) => updatePlan({ supportNotice: event.target.value })} className="mt-2 min-h-28 w-full rounded-2xl border border-[#cbdcd5] p-3 text-sm font-normal leading-6 outline-none focus:ring-2 focus:ring-[#0b7b68]" />
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => { updatePlan({}); onNotify(`Rascunho da versão ${plan.version} salvo nesta sessão.`); }} className="min-h-11 cursor-pointer rounded-xl border border-[#bfd4cd] px-5 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Salvar rascunho</button>
                  <button type="button" onClick={approve} className="min-h-11 cursor-pointer rounded-xl bg-[#17372f] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0b6a5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Aprovar versão {plan.version}</button>
                </div>
              </div>
            ) : (
              <>
                <ReadOnlyPlan plan={plan} />
                <div className="mt-6 flex flex-wrap gap-3">
                  {plan.status === 'approved' ? (
                    <button type="button" onClick={publish} className="min-h-11 cursor-pointer rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Publicar versão {plan.version} para a paciente</button>
                  ) : null}
                  <button type="button" onClick={createRevision} className="min-h-11 cursor-pointer rounded-xl border border-[#bfd4cd] px-5 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Criar nova versão</button>
                  <button type="button" onClick={onContinue} className="min-h-11 cursor-pointer rounded-xl px-5 text-sm font-bold text-[#405d54] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Revisar fechamento</button>
                </div>
              </>
            )}
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl bg-[#17372f] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#9cc7ba]">Origem desta versão</p>
              <p className="mt-3 text-sm font-semibold leading-6">{plan.sourceDescription}</p>
              <p className="mt-3 text-xs leading-5 text-[#c9e4dd]">{plan.sourceMode === 'assisted' ? 'A organização assistida é uma referência revisável; a autoria e a decisão permanecem médicas.' : 'Esta versão começou no fluxo manual do protótipo.'}</p>
              {plan.sourceReviewId ? <p className="mt-3 break-all text-[11px] text-[#b8d3cb]">Fonte ligada: {plan.sourceReviewId}</p> : null}
            </section>
            <section className="rounded-2xl border border-[#dfe8e3] bg-white p-5">
              <div className="flex items-center justify-between gap-3"><h4 className="text-sm font-bold text-[#17372f]">Histórico de versões</h4><Status tone="gray">{carePlans.length}</Status></div>
              <ol className="mt-4 space-y-3">
                {[...carePlans].reverse().map((version) => (
                  <li key={version.id} className={cn('rounded-xl border p-3', version.id === plan.id ? 'border-[#9fc9bd] bg-[#edf7f4]' : 'border-[#e0e9e4] bg-[#fbfdfc]')}>
                    <div className="flex items-start justify-between gap-2"><p className="text-xs font-bold text-[#17372f]">Versão {version.version}</p><Status tone={statusPresentation[version.status].tone}>{statusPresentation[version.status].label}</Status></div>
                    <p className="mt-2 text-xs leading-5 text-[#60766f]">{version.status === 'published' ? `Publicada em ${version.publishedAt}` : version.status === 'approved' ? `Aprovada em ${version.approvedAt}` : version.status === 'superseded' ? `Substituída pela versão ${version.supersededByVersion}` : `Atualizada em ${version.updatedAt}`}</p>
                  </li>
                ))}
              </ol>
            </section>
            {latestPublishedCarePlan ? <p className="rounded-xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-xs leading-5 text-[#0b6a5b]">A paciente vê a versão {latestPublishedCarePlan.version} publicada em {latestPublishedCarePlan.publishedAt}.</p> : <p className="rounded-xl border border-dashed border-[#bfd4cd] bg-[#fbfdfc] p-4 text-xs leading-5 text-[#60766f]">Nenhuma versão foi publicada para a paciente neste contexto.</p>}
          </aside>
        </div>
      )}
    </section>
  );
}
