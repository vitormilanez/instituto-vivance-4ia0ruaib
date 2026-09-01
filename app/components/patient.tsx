'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useCareDemo } from './care-demo-store';
import type { PreConsultationAnswers, PreConsultationSubmission } from './care-demo-types';
import { AiDraftBadge, ClinicalLayerBadge, SimulationDisclaimer } from './clinical';
import { cn, Heading, Status, Toast } from './shared';

type PatientView = 'Hoje' | 'Plano' | 'Diário' | 'Evolução' | 'Mensagens' | 'Consultas';
type MealRatings = [number, number, number];

const nav: PatientView[] = ['Hoje', 'Plano', 'Diário', 'Evolução', 'Mensagens', 'Consultas'];

export default function PatientWorkspace() {
  const {
    draft: preConsultationDraft,
    latestSubmission,
    savePreConsultationDraft,
    submitPreConsultation,
  } = useCareDemo();
  const [view, setView] = useState<PatientView>('Hoje');
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkinDone, setCheckinDone] = useState(false);
  const [preVisitOpen, setPreVisitOpen] = useState(false);
  const [mealAnalyzed, setMealAnalyzed] = useState(false);
  const [mealRatings, setMealRatings] = useState<MealRatings>([0, 0, 0]);
  const [mealFeedbackSent, setMealFeedbackSent] = useState(false);
  const [watchConnected, setWatchConnected] = useState(false);
  const [tasks, setTasks] = useState([true, false, false]);
  const [toast, setToast] = useState('');
  const preVisitDone = Boolean(latestSubmission);

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3200);
  };

  return (
    <>
      <main id="main-content" className="mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
        <div className="hidden gap-2 rounded-2xl border border-[#dfe8e3] bg-white p-1.5 lg:flex" aria-label="Navegação do paciente">
          {nav.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setView(item)}
              className={cn(
                'min-h-10 flex-1 rounded-xl px-4 text-sm font-semibold',
                view === item ? 'bg-[#17372f] text-white' : 'text-[#60766f] hover:bg-[#f4f7f5]'
              )}
            >
              {item}
            </button>
          ))}
        </div>

        {view === 'Hoje' && (
          <Today
            checkinDone={checkinDone}
            preVisitDone={preVisitDone}
            watchConnected={watchConnected}
            onCheckin={() => setCheckinOpen(true)}
            onPreVisit={() => setPreVisitOpen(true)}
            onConnectWatch={() => {
              setWatchConnected(true);
              notify('Relógio demonstrativo conectado.');
            }}
            onNavigate={setView}
          />
        )}
        {view === 'Plano' && (
          <Plan
            tasks={tasks}
            onToggle={(index) => setTasks(tasks.map((done, taskIndex) => taskIndex === index ? !done : done))}
          />
        )}
        {view === 'Diário' && (
          <Diary
            analyzed={mealAnalyzed}
            ratings={mealRatings}
            feedbackSent={mealFeedbackSent}
            onAnalyze={() => setMealAnalyzed(true)}
            onRate={(questionIndex, value) => {
              setMealRatings((current) => current.map((rating, index) => index === questionIndex ? value : rating) as MealRatings);
            }}
            onSubmitFeedback={() => {
              setMealFeedbackSent(true);
              notify('Avaliação enviada ao Dr. Guilherme.');
            }}
          />
        )}
        {view === 'Evolução' && <Evolution onNavigate={setView} />}
        {view === 'Mensagens' && <Messages onNotify={notify} />}
        {view === 'Consultas' && <Appointments preVisitDone={preVisitDone} onPreVisit={() => setPreVisitOpen(true)} />}
      </main>

      <nav aria-label="Navegação do paciente" className="fixed inset-x-0 bottom-0 z-30 border-t border-[#dfe8e3] bg-white px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-6">
          {nav.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setView(item)}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold',
                view === item ? 'bg-[#e8f4f0] text-[#0b6a5b]' : 'text-[#789087]'
              )}
            >
              <span aria-hidden="true" className={cn('size-2 rounded-full', view === item ? 'bg-[#0b7b68]' : 'bg-[#c3d0cc]')} />
              {item}
            </button>
          ))}
        </div>
      </nav>

      {checkinOpen && (
        <Checkin
          onClose={() => setCheckinOpen(false)}
          onComplete={() => {
            setCheckinOpen(false);
            setCheckinDone(true);
            notify('Check-in registrado. Obrigado, Marina.');
          }}
        />
      )}
      {preVisitOpen && (
        <PreVisitInterview
          initialDraft={preConsultationDraft}
          latestSubmission={latestSubmission}
          onSaveDraft={savePreConsultationDraft}
          onClose={() => setPreVisitOpen(false)}
          onSubmit={() => {
            submitPreConsultation();
            setPreVisitOpen(false);
            notify('Pré-consulta enviada ao Dr. Guilherme.');
          }}
        />
      )}
      <Toast text={toast} patient />
    </>
  );
}

function Today({
  checkinDone,
  preVisitDone,
  watchConnected,
  onCheckin,
  onPreVisit,
  onConnectWatch,
  onNavigate,
}: {
  checkinDone: boolean;
  preVisitDone: boolean;
  watchConnected: boolean;
  onCheckin: () => void;
  onPreVisit: () => void;
  onConnectWatch: () => void;
  onNavigate: (view: PatientView) => void;
}) {
  return (
    <>
      <section className="mt-0 flex flex-col gap-4 lg:mt-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2"><Status tone="amber">Dados demonstrativos</Status><Status>Plano em andamento · dia 29</Status></div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Bom dia, Marina</h1>
          <p className="mt-2 text-sm leading-6 text-[#60766f]">Hoje tem só o essencial. Um pequeno passo de cada vez.</p>
        </div>
        <button type="button" onClick={onCheckin} disabled={checkinDone} className="min-h-12 rounded-xl bg-[#0b7b68] px-6 text-sm font-bold text-white shadow-[0_10px_25px_rgba(11,123,104,0.22)] disabled:bg-[#779a91]">
          {checkinDone ? 'Check-in concluído' : 'Fazer check-in de hoje'}
        </button>
      </section>

      <article className="mt-7 overflow-hidden rounded-3xl border border-[#9fc9bd] bg-white shadow-[0_12px_34px_rgba(28,55,47,0.07)]">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="grid size-14 place-items-center rounded-full bg-[#17372f] text-xs font-bold uppercase tracking-[0.08em] text-white">
            Texto
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Conversa de pré-consulta</p>
              <Status tone={preVisitDone ? 'green' : 'amber'}>{preVisitDone ? 'Enviada ao médico' : 'cerca de 4 minutos'}</Status>
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
              {preVisitDone ? 'Seu objetivo já está no preparo da consulta' : 'Organize o que deseja conversar na consulta'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#60766f]">
              Responda quatro etapas em texto, revise suas palavras e escolha se deseja permitir uma organização assistida do relato.
            </p>
          </div>
          <button type="button" onClick={onPreVisit} className="min-h-12 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white">
            {preVisitDone ? 'Ver resumo enviado' : 'Começar conversa'}
          </button>
        </div>
        <div className="border-t border-[#e2ece8] bg-[#f7faf8] px-5 py-3 text-xs leading-5 text-[#698078] sm:px-6">
          Texto guiado · salvamento durante a sessão · revisão obrigatória antes do envio
        </div>
      </article>

      <section className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="overflow-hidden rounded-3xl bg-[#17372f] text-white shadow-[0_16px_40px_rgba(23,55,47,0.16)]">
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Seu próximo passo</p><h2 className="mt-3 max-w-lg text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Registrar como foi o jantar</h2></div>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#d6e8e2]">até 21h</span>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#d6e8e2]">Uma foto ajuda você e o Dr. Guilherme a enxergarem padrões sem precisar contar calorias.</p>
            <button type="button" onClick={() => onNavigate('Diário')} className="mt-6 min-h-12 rounded-xl bg-white px-5 text-sm font-bold text-[#17372f]">Abrir diário alimentar</button>
          </div>
          <div className="grid grid-cols-3 border-t border-white/10">
            {[
              ['29', 'dias de plano'],
              ['82%', 'ações concluídas'],
              ['3', 'dias até o retorno'],
            ].map((item, index) => (
              <div key={item[1]} className={cn('p-4 sm:p-5', index > 0 && 'border-l border-white/10')}><p className="text-xl font-bold">{item[0]}</p><p className="mt-1 text-[11px] leading-4 text-[#b8d3cb]">{item[1]}</p></div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Próxima consulta</p><h2 className="mt-2 text-xl font-semibold">Hoje, 10:30</h2></div><Status>Confirmada</Status></div>
          <p className="mt-3 text-sm text-[#60766f]">Dr. Guilherme Martins · retorno de 30 min</p>
          <div className="mt-5 flex gap-2"><button type="button" className="min-h-11 flex-1 rounded-xl bg-[#0b7b68] px-3 text-sm font-bold text-white">Entrar na sala</button><button type="button" onClick={() => onNavigate('Consultas')} className="min-h-11 rounded-xl border border-[#d7e3df] px-4 text-sm font-bold">Detalhes</button></div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5">
          <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Hoje no plano</p><h2 className="mt-2 text-xl font-semibold">2 de 3 ações</h2></div><span className="text-2xl font-semibold text-[#0b7b68]">67%</span></div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e3ebe7]"><div className="h-full w-2/3 rounded-full bg-[#0b7b68]" /></div>
          <button type="button" onClick={() => onNavigate('Plano')} className="mt-4 min-h-11 text-sm font-bold text-[#0b6a5b] underline underline-offset-4">Ver plano completo</button>
        </article>
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Relógio e saúde</p>
          <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#f4f7f5] p-3"><p className="text-xs text-[#698078]">Sono</p><p className="mt-1 text-lg font-bold">6h18</p></div><div className="rounded-2xl bg-[#f4f7f5] p-3"><p className="text-xs text-[#698078]">Passos</p><p className="mt-1 text-lg font-bold">5.840</p></div></div>
          <button type="button" onClick={onConnectWatch} disabled={watchConnected} className="mt-4 min-h-11 text-left text-sm font-bold text-[#0b6a5b] disabled:text-[#698078]">{watchConnected ? 'Relógio demonstrativo conectado' : 'Conectar um relógio'}</button>
        </article>
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 md:col-span-2 xl:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Mensagem do médico</p>
          <p className="mt-4 text-sm leading-6 text-[#526a62]">“Marina, mantenha o combinado hoje. Vamos conversar sobre o sono na consulta.”</p>
          <button type="button" onClick={() => onNavigate('Mensagens')} className="mt-4 min-h-11 text-sm font-bold text-[#0b6a5b] underline underline-offset-4">Responder ao Dr. Guilherme</button>
        </article>
      </section>
      <p className="mt-6 text-center text-xs leading-5 text-[#8a9c96]">Este protótipo não atende emergências. Em uma situação urgente, procure os serviços de emergência da sua região.</p>
    </>
  );
}

function Plan({ tasks, onToggle }: { tasks: boolean[]; onToggle: (index: number) => void }) {
  const done = tasks.filter(Boolean).length;
  const percent = Math.round((done / 3) * 100);
  return (
    <section className="mt-0 lg:mt-8">
      <Heading eyebrow="Plano combinado" title="Seu cuidado, em passos claros" description="Você sabe o que fazer, por que importa e quando conversar com seu médico." />
      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_340px]">
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between"><div><p className="text-sm font-bold">Hoje</p><p className="mt-1 text-xs text-[#698078]">{done} de 3 ações concluídas</p></div><span className="text-2xl font-semibold text-[#0b7b68]">{percent}%</span></div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e3ebe7]"><div className="h-full rounded-full bg-[#0b7b68] transition-[width]" style={{ width: String(percent) + '%' }} /></div>
          <div className="mt-6 space-y-3">
            {['Tomar água antes do almoço', 'Registrar uma foto do jantar', 'Começar a desacelerar às 22h'].map((task, index) => (
              <button type="button" key={task} onClick={() => onToggle(index)} className={cn('flex min-h-16 w-full items-center gap-4 rounded-2xl border p-4 text-left', tasks[index] ? 'border-[#b9d8cf] bg-[#edf7f4]' : 'border-[#dfe8e3] bg-white')}>
                <span className={cn('grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-bold', tasks[index] ? 'border-[#0b7b68] bg-[#0b7b68] text-white' : 'border-[#aebfba] text-transparent')}>✓</span>
                <span><strong className={cn('block text-sm', tasks[index] && 'text-[#45655c] line-through')}>{task}</strong><span className="mt-1 block text-xs text-[#698078]">{index === 0 ? 'Hábitos alimentares' : index === 1 ? 'Diário · até 21h' : 'Sono e recuperação'}</span></span>
              </button>
            ))}
          </div>
        </article>
        <aside className="space-y-5">
          <div className="rounded-3xl bg-[#17372f] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Foco desta semana</p><h2 className="mt-3 text-xl font-semibold">Recuperar regularidade do sono</h2><p className="mt-3 text-sm leading-6 text-[#d6e8e2]">Antes de aumentar metas, vamos entender o que está atrapalhando suas noites.</p></div>
          <div className="rounded-3xl border border-[#f0d59c] bg-[#fff8e9] p-5"><p className="text-sm font-bold text-[#6f4b0d]">Quando avisar o médico</p><p className="mt-2 text-sm leading-6 text-[#805f24]">Se surgir um novo sintoma, envie uma mensagem pelo app. Não espere o próximo relatório.</p></div>
          <div className="rounded-3xl border border-[#dfe8e3] bg-white p-5"><p className="text-sm font-bold">Como esse plano foi criado?</p><p className="mt-2 text-sm leading-6 text-[#698078]">Foi definido pelo Dr. Guilherme. A IA apenas ajudou a transformar a orientação em lembretes simples.</p></div>
        </aside>
      </div>
    </section>
  );
}

function Diary({
  analyzed,
  ratings,
  feedbackSent,
  onAnalyze,
  onRate,
  onSubmitFeedback,
}: {
  analyzed: boolean;
  ratings: MealRatings;
  feedbackSent: boolean;
  onAnalyze: () => void;
  onRate: (questionIndex: number, value: number) => void;
  onSubmitFeedback: () => void;
}) {
  const questions = [
    { question: 'Quanto essa refeição deixou você saciada?', low: 'Nada saciada', high: 'Muito saciada' },
    { question: 'Como ficou seu conforto digestivo depois?', low: 'Muito desconfortável', high: 'Muito confortável' },
    { question: 'Quão fácil foi seguir o combinado nesta refeição?', low: 'Muito difícil', high: 'Muito fácil' },
  ];
  const allAnswered = ratings.every((rating) => rating > 0);

  const submitFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!allAnswered || feedbackSent) return;
    onSubmitFeedback();
  };

  return (
    <section className="mt-0 lg:mt-8">
      <Heading eyebrow="Diário sem julgamento" title="Registre o que aconteceu" description="A ideia é enxergar padrões e contexto, não classificar refeições como boas ou ruins." />
      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_350px]">
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Jantar · hoje, 19:42</p><h2 className="mt-2 text-xl font-semibold">Refeição registrada</h2></div><Status tone="gray">Foto demonstrativa</Status></div>
          <div className="mt-6 grid gap-5 sm:grid-cols-[220px_1fr] sm:items-center">
            <div className="mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-3xl bg-[#e8dfce] shadow-[0_12px_34px_rgba(73,61,42,0.16)]">
              <img src="/meals/jantar-omelete.jpg" alt="Prato demonstrativo com omelete, batata-doce, brócolis e salada." className="size-full object-cover" />
            </div>
            <div>
              <p className="text-sm leading-6 text-[#60766f]">Você marcou esta refeição como <strong className="text-[#17372f]">satisfatória</strong> e informou fome moderada antes de comer.</p>
              <button type="button" onClick={onAnalyze} disabled={analyzed} className="mt-5 min-h-12 w-full cursor-pointer rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2 disabled:cursor-default disabled:bg-[#779a91] sm:w-auto">{analyzed ? 'Análise concluída' : 'Analisar com IA'}</button>
            </div>
          </div>
          {analyzed && (
            <>
              <div className="mt-6 rounded-3xl border border-[#b9d8cf] bg-[#edf7f4] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-[#0b6a5b]">Comparação com o combinado</p><Status>Compatível</Status></div>
                <p className="mt-3 text-sm leading-6 text-[#45655c]">A imagem parece incluir vegetais, uma fonte de proteína e carboidrato. A composição visual está próxima do modelo combinado para o jantar.</p>
                <p className="mt-4 text-xs leading-5 text-[#698078]">Análise demonstrativa: fotos não permitem identificar ingredientes, quantidades ou valor nutricional com precisão.</p>
              </div>

              <form onSubmit={submitFeedback} className="mt-6 rounded-3xl border border-[#dfe8e3] bg-[#fbfcfb] p-5 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div><p className="text-xs font-bold uppercase tracking-[0.11em] text-[#0b7b68]">Como você se sentiu</p><h3 className="mt-2 text-lg font-semibold text-[#17372f]">Dê uma nota de 1 a 5</h3><p className="mt-1 text-xs leading-5 text-[#698078]">Essas respostas ajudam a contextualizar a foto para o médico.</p></div>
                  {!feedbackSent && <Status tone={allAnswered ? 'green' : 'gray'}>{ratings.filter(Boolean).length} de 3 respondidas</Status>}
                </div>

                <div className="mt-6 space-y-5">
                  {questions.map((item, questionIndex) => (
                    <fieldset key={item.question} disabled={feedbackSent} className="rounded-2xl border border-[#e1e9e5] bg-white p-4">
                      <legend className="px-1 text-sm font-bold leading-5 text-[#294940]">{questionIndex + 1}. {item.question}</legend>
                      <div className="mt-3 flex items-center gap-2" role="radiogroup" aria-label={item.question}>
                        {[1, 2, 3, 4, 5].map((score) => {
                          const inputId = `meal-question-${questionIndex}-score-${score}`;
                          const selected = ratings[questionIndex] === score;
                          return (
                            <div key={inputId} className="min-w-0 flex-1">
                              <input id={inputId} type="radio" name={`meal-question-${questionIndex}`} value={score} checked={selected} onChange={() => onRate(questionIndex, score)} className="peer sr-only" />
                              <label htmlFor={inputId} className={cn('grid min-h-11 cursor-pointer place-items-center rounded-xl border text-sm font-bold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#0b7b68] peer-focus-visible:ring-offset-2', selected ? 'border-[#0b7b68] bg-[#0b7b68] text-white' : 'border-[#c9d6d1] bg-white text-[#526a62] hover:border-[#82b6a9] hover:bg-[#edf7f4]', feedbackSent && 'cursor-default opacity-80')}>{score}</label>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex justify-between gap-3 text-[11px] leading-4 text-[#789087]"><span>1 · {item.low}</span><span className="text-right">5 · {item.high}</span></div>
                    </fieldset>
                  ))}
                </div>

                {feedbackSent ? (
                  <div role="status" className="mt-5 rounded-2xl border border-[#b9d8cf] bg-[#e8f4f0] p-4">
                    <p className="text-sm font-bold text-[#0b6a5b]">Avaliação enviada ao Dr. Guilherme</p>
                    <p className="mt-1 text-xs leading-5 text-[#526a62]">Suas três respostas foram adicionadas ao acompanhamento desta refeição.</p>
                  </div>
                ) : (
                  <button type="submit" disabled={!allAnswered} className="mt-5 min-h-12 w-full cursor-pointer rounded-xl bg-[#17372f] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0f2d26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#a9b8b3]">Enviar avaliação ao Dr. Guilherme</button>
                )}
              </form>
            </>
          )}
        </article>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-[#dfe8e3] bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Últimos registros</p>
            {[
              ['Almoço', 'Hoje, 12:36', 'Dentro do combinado'],
              ['Jantar', 'Ontem, 20:08', 'Contexto registrado'],
              ['Café da manhã', 'Ontem, 08:14', 'Sem análise'],
            ].map((item) => <div key={item.join('-')} className="border-b border-[#edf2ef] py-4 last:border-0"><div className="flex justify-between gap-3"><strong className="text-sm">{item[0]}</strong><small className="text-[#8a9c96]">{item[1]}</small></div><p className="mt-1 text-xs text-[#698078]">{item[2]}</p></div>)}
          </div>
          <div className="rounded-3xl bg-[#17372f] p-5 text-white"><p className="text-sm font-bold">Privacidade por padrão</p><p className="mt-2 text-sm leading-6 text-[#d6e8e2]">No produto real, você escolheria o que compartilhar com sua equipe de cuidado.</p></div>
        </aside>
      </div>
    </section>
  );
}

function Evolution({ onNavigate }: { onNavigate: (view: PatientView) => void }) {
  type EvolutionRange = '6 semanas' | '3 meses' | '6 meses';
  const [range, setRange] = useState<EvolutionRange>('6 semanas');
  const rangeData: Record<EvolutionRange, Array<{ label: string; remaining: number }>> = {
    '6 semanas': [
      { label: 'S1', remaining: 8 },
      { label: 'S2', remaining: 7.8 },
      { label: 'S3', remaining: 7.3 },
      { label: 'S4', remaining: 6.9 },
      { label: 'S5', remaining: 6.6 },
      { label: 'Hoje', remaining: 6.2 },
    ],
    '3 meses': [
      { label: 'Jun', remaining: 9.2 },
      { label: 'Fim jun', remaining: 8.8 },
      { label: 'Jul', remaining: 8 },
      { label: 'Fim jul', remaining: 7.3 },
      { label: 'Ago', remaining: 6.6 },
      { label: 'Hoje', remaining: 6.2 },
    ],
    '6 meses': [
      { label: 'Mar', remaining: 11.7 },
      { label: 'Abr', remaining: 10.8 },
      { label: 'Mai', remaining: 9.9 },
      { label: 'Jun', remaining: 9.2 },
      { label: 'Jul', remaining: 8 },
      { label: 'Hoje', remaining: 6.2 },
    ],
  };
  const data = rangeData[range];
  const maxRemaining = Math.max(...data.map((point) => point.remaining));
  const firstRemaining = data[0]?.remaining ?? 6.2;
  const progressInRange = firstRemaining - 6.2;
  const journeyProgress = 23;
  const movementWeek = [54, 63, 47, 72, 67, 83, 76];
  const sleepWeek = [78, 51, 63, 56, 74, 68, 61];

  return (
    <section className="mt-0 lg:mt-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2"><Status tone="amber">Dados demonstrativos</Status><Status>Dia 29 de 90</Status></div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.13em] text-[#0b7b68]">Seu caminho, com clareza</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#15342c] sm:text-4xl">Quanto falta para meu objetivo?</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#60766f]">Um gráfico simples para enxergar o que já mudou e o que ainda falta, sem transformar variações de um dia em cobrança.</p>
        </div>
        <button type="button" onClick={() => onNavigate('Mensagens')} className="min-h-11 cursor-pointer rounded-xl border border-[#bfd4cd] bg-white px-5 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
          Conversar sobre a meta
        </button>
      </div>

      <article className="mt-7 overflow-hidden rounded-[32px] bg-[#17372f] text-white shadow-[0_18px_45px_rgba(23,55,47,0.18)]">
        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.05fr)_190px_minmax(240px,0.85fr)] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9fd6c8]">Objetivo combinado</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-md">
              <div className="rounded-2xl bg-white/8 p-4"><p className="text-xs text-[#b8d3cb]">Hoje</p><p className="mt-1 text-2xl font-semibold">78,2 kg</p></div>
              <div className="rounded-2xl bg-white/8 p-4"><p className="text-xs text-[#b8d3cb]">Objetivo</p><p className="mt-1 text-2xl font-semibold">72,0 kg</p></div>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold"><span className="text-[#d3e4df]">1,8 kg percorridos</span><span className="text-white">{journeyProgress}% do caminho</span></div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/12"><div className="h-full rounded-full bg-[#8fd3c0]" style={{ width: `${journeyProgress}%` }} /></div>
              <div className="mt-2 flex justify-between text-[11px] text-[#9fbab2]"><span>Início · 80,0 kg</span><span>Meta · 72,0 kg</span></div>
            </div>
          </div>

          <div className="mx-auto">
            <div role="img" aria-label="Vinte e três por cento do caminho concluído; faltam 6,2 quilos para o objetivo demonstrativo." className="grid size-44 place-items-center rounded-full p-3" style={{ background: `conic-gradient(#8fd3c0 0 ${journeyProgress}%, rgba(255,255,255,0.12) ${journeyProgress}% 100%)` }}>
              <div className="grid size-full place-items-center rounded-full border border-white/10 bg-[#17372f] text-center">
                <div><p className="text-3xl font-semibold tracking-[-0.04em]">6,2 kg</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.09em] text-[#9fd6c8]">ainda faltam</p></div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#9fd6c8]">Próximo marco</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">77,0 kg</p>
            <p className="mt-1 text-sm font-semibold text-white">Faltam 1,2 kg até lá</p>
            <p className="mt-4 text-sm leading-6 text-[#d3e4df]">Metas menores deixam o caminho mais compreensível. Este marco pode ser revisto com seu médico.</p>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-3 text-xs leading-5 text-[#aac5bd] sm:px-7">Meta demonstrativa definida com o Dr. Guilherme · peso é apenas um dos sinais do cuidado</div>
      </article>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-[28px] border border-[#dfe8e3] bg-white p-5 shadow-[0_10px_30px_rgba(28,55,47,0.045)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0b7b68]">Quanto faltava a cada período</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">O gráfico diminui conforme você avança</h2>
              <p className="mt-1 text-sm text-[#698078]">Cada coluna mostra somente os quilos restantes até a meta.</p>
            </div>
            <div role="group" aria-label="Período do gráfico" className="flex w-fit rounded-xl bg-[#f1f5f3] p-1">
              {(Object.keys(rangeData) as EvolutionRange[]).map((item) => (
                <button type="button" key={item} aria-pressed={range === item} onClick={() => setRange(item)} className={cn('min-h-10 cursor-pointer rounded-lg px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68]', range === item ? 'bg-white text-[#17372f] shadow-sm' : 'text-[#698078] hover:text-[#0b6a5b]')}>{item}</button>
              ))}
            </div>
          </div>

          <div role="img" aria-label={`Gráfico de ${range}: o valor restante diminui de ${String(firstRemaining).replace('.', ',')} para 6,2 quilos.`} className="mt-7 rounded-2xl border border-[#e7eeea] bg-[#f8faf9] p-4 sm:p-5">
            <div className="flex h-64 items-end gap-2 sm:gap-4">
              {data.map((point, index) => {
                const height = (point.remaining / maxRemaining) * 100;
                const isCurrent = index === data.length - 1;
                return (
                  <div key={`${point.label}-${point.remaining}`} className="flex h-full min-w-0 flex-1 flex-col items-center">
                    <span className={cn('mb-2 whitespace-nowrap text-[10px] font-bold sm:text-xs', isCurrent ? 'text-[#0b6a5b]' : 'text-[#526a62]')}>{String(point.remaining).replace('.', ',')} kg</span>
                    <div className="flex min-h-0 w-full flex-1 items-end justify-center">
                      <div className={cn('w-full max-w-16 rounded-t-xl border-x border-t transition-[height] duration-300 motion-reduce:transition-none', isCurrent ? 'border-[#0b7b68] bg-[#0b7b68]' : 'border-[#a6cfc4] bg-[#b9ddd4]')} style={{ height: `${height}%` }} />
                    </div>
                    <span className={cn('mt-2 truncate text-[10px] sm:text-xs', isCurrent ? 'font-bold text-[#0b6a5b]' : 'text-[#8a9c96]')}>{point.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#c9d6d1] pt-3 text-[11px] text-[#789087]"><span>Quanto menor, mais perto</span><strong className="text-[#0b6a5b]">Meta = 0 kg restantes</strong></div>
            <table className="sr-only"><caption>Quilos restantes por período</caption><tbody>{data.map((point) => <tr key={`table-${point.label}`}><th>{point.label}</th><td>{String(point.remaining).replace('.', ',')} kg restantes</td></tr>)}</tbody></table>
          </div>
          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-[#edf7f4] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-[#0b6a5b]">{String(progressInRange.toFixed(1)).replace('.', ',')} kg a menos para percorrer neste período</p><p className="mt-1 text-xs text-[#60766f]">Tendência demonstrativa; pequenas oscilações são esperadas.</p></div><Status>6,2 kg restantes</Status></div>
        </article>
        <aside className="space-y-5">
          <article className="rounded-[28px] border border-[#c9ddd6] bg-[#edf7f4] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0b7b68]">Ritmo observado</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#17372f]">0,3 kg</p>
            <p className="mt-1 text-sm font-bold text-[#405d54]">por semana, em média</p>
            <div className="mt-5 rounded-2xl bg-white/80 p-4"><p className="text-xs font-bold uppercase tracking-[0.08em] text-[#698078]">Se o ritmo fosse mantido</p><p className="mt-2 text-xl font-bold text-[#17372f]">cerca de 20 semanas</p><p className="mt-2 text-xs leading-5 text-[#789087]">Cenário matemático, não promessa. O ritmo pode mudar e deve ser interpretado com seu médico.</p></div>
          </article>
          <article className="rounded-[28px] border border-[#dfe8e3] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3"><p className="text-sm font-bold">Relatório quinzenal</p><Status>Disponível</Status></div>
            <p className="mt-3 text-sm leading-6 text-[#698078]">Revisado pelo Dr. Guilherme em 24 de agosto.</p>
            <a href="/docs/evolucao-quinzenal-marina-costa.pdf" target="_blank" rel="noreferrer" className="mt-4 flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-[#bfd4cd] px-4 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Ler relatório</a>
          </article>
        </aside>
      </div>

      <div className="mt-9 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Além da balança</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#17372f]">Outros sinais que contam essa história</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#698078]">Leituras rápidas para entender o ciclo inteiro, sem depender de uma única medida.</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-[0_8px_24px_rgba(28,55,47,0.04)]">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-[#17372f]">Adesão ao plano</p><p className="mt-1 text-xs text-[#789087]">Últimos 14 dias</p></div><Status>+6 p.p.</Status></div>
          <p className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#17372f]">82%</p>
          <div role="img" aria-label="Adesão de oitenta e dois por cento ao plano nos últimos quatorze dias." className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#e4ece8]"><div className="h-full w-[82%] rounded-full bg-[#0b7b68]" /></div>
          <p className="mt-3 text-xs leading-5 text-[#698078]">11 de 14 dias com pelo menos duas ações combinadas.</p>
        </article>

        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-[0_8px_24px_rgba(28,55,47,0.04)]">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-[#17372f]">Movimento</p><p className="mt-1 text-xs text-[#789087]">Média diária</p></div><Status>+9%</Status></div>
          <p className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#17372f]">6.420 <span className="text-sm font-bold text-[#60766f]">passos</span></p>
          <div role="img" aria-label="Barras dos passos dos últimos sete dias, com tendência geral de aumento." className="mt-4 flex h-12 items-end gap-1.5">
            {movementWeek.map((height, index) => <span key={`movement-${index}`} className={cn('min-w-0 flex-1 rounded-t-md', index === movementWeek.length - 1 ? 'bg-[#0b7b68]' : 'bg-[#b9ddd4]')} style={{ height: `${height}%` }} />)}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#698078]">Sua semana ficou mais ativa, com variações naturais entre os dias.</p>
        </article>

        <article className="rounded-3xl border border-[#eadfca] bg-[#fffdf9] p-5 shadow-[0_8px_24px_rgba(80,61,28,0.04)]">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-[#17372f]">Sono</p><p className="mt-1 text-xs text-[#789087]">Média por noite</p></div><Status tone="amber">Atenção</Status></div>
          <p className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#17372f]">6h12</p>
          <div role="img" aria-label="Barras da duração de sono dos últimos sete dias; quatro noites ficaram abaixo do padrão pessoal." className="mt-4 flex h-12 items-end gap-1.5">
            {sleepWeek.map((height, index) => <span key={`sleep-${index}`} className={cn('min-w-0 flex-1 rounded-t-md', height < 65 ? 'bg-[#d8a658]' : 'bg-[#c6d8d2]')} style={{ height: `${height}%` }} />)}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#698078]">4 noites abaixo do seu padrão pessoal neste ciclo.</p>
        </article>

        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-[0_8px_24px_rgba(28,55,47,0.04)]">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-[#17372f]">Consistência</p><p className="mt-1 text-xs text-[#789087]">Presença, não perfeição</p></div><Status>Boa</Status></div>
          <p className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#17372f]">11 <span className="text-sm font-bold text-[#60766f]">de 14 dias</span></p>
          <div role="img" aria-label="Onze de quatorze dias com ações do plano registradas." className="mt-4 grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }, (_, index) => <span key={`consistency-${index}`} className={cn('aspect-square rounded-full border', index < 11 ? 'border-[#0b7b68] bg-[#0b7b68]' : 'border-[#b8c9c3] bg-white')} />)}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#698078]">Você retomou o plano mesmo depois de dias diferentes.</p>
        </article>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <article className="rounded-[28px] bg-[#17372f] p-5 text-white sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9fd6c8]">Conquista do ciclo</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Consistência maior que pressa</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d3e4df]">Seu peso se aproximou da meta enquanto movimento e adesão melhoraram. O sono ainda merece atenção — um sinal para conversar, não uma falha.</p>
          <button type="button" onClick={() => onNavigate('Mensagens')} className="mt-5 min-h-11 cursor-pointer rounded-xl bg-white px-5 text-sm font-bold text-[#17372f] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fd3c0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17372f]">Levar para a conversa</button>
        </article>

        <details className="group rounded-[28px] border border-[#dfe8e3] bg-white p-5 sm:p-7">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#17372f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">
            Como calculamos o que falta?
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-[#edf7f4] text-lg text-[#0b6a5b] transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
          </summary>
          <div className="mt-4 border-t border-[#e7eeea] pt-4 text-xs leading-5 text-[#698078]">
            <p><strong className="text-[#405d54]">Valor restante:</strong> peso mais recente validado menos a meta atual.</p>
            <p className="mt-2"><strong className="text-[#405d54]">Leitura do gráfico:</strong> médias do período reduzem o ruído das oscilações diárias.</p>
            <p className="mt-2">Meta e ritmo são demonstrativos e podem ser revistos com o médico a qualquer momento.</p>
          </div>
        </details>
      </div>
    </section>
  );
}

function Messages({ onNotify }: { onNotify: (text: string) => void }) {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) return;
    setValue('');
    setSent(true);
    onNotify('Mensagem demonstrativa enviada.');
  };

  return (
    <section className="mt-0 lg:mt-8">
      <Heading eyebrow="Canal de acompanhamento" title="Conversa com seu médico" description="Orientações e dúvidas ficam junto do seu plano, sem se perder em outros aplicativos." />
      <article className="mt-7 flex min-h-[580px] flex-col overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white">
        <div className="flex items-center gap-3 border-b border-[#e7eeea] p-4 sm:p-5"><span className="grid size-11 place-items-center rounded-full bg-[#d9eee8] text-xs font-bold text-[#0b6a5b]">GM</span><div><p className="text-sm font-bold">Dr. Guilherme Martins</p><p className="text-xs text-[#698078]">Respostas em horário de atendimento</p></div></div>
        <div className="flex-1 space-y-4 bg-[#f8faf9] p-4 sm:p-6">
          <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-md bg-[#0b7b68] p-4 text-sm leading-6 text-white">Consegui registrar o jantar. Também dormi melhor esta noite.<p className="mt-2 text-[11px] text-[#c9e4dd]">09:18</p></div>
          <div className="max-w-[82%] rounded-2xl rounded-tl-md bg-white p-4 text-sm leading-6 shadow-sm">Ótimo, Marina. Vou revisar seus registros antes da nossa consulta.<p className="mt-2 text-[11px] text-[#8a9c96]">09:22 · Dr. Guilherme</p></div>
          {sent && <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-md bg-[#0b7b68] p-4 text-sm text-white">Mensagem demonstrativa enviada agora.</div>}
        </div>
        <form onSubmit={submit} className="flex gap-2 border-t border-[#e7eeea] p-4"><label htmlFor="patient-message" className="sr-only">Escrever mensagem</label><input id="patient-message" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Escreva sua mensagem..." className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#d7e3df] px-4 text-sm outline-none focus:ring-2 focus:ring-[#8bc6b9]" /><button type="submit" className="min-h-11 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white">Enviar</button></form>
      </article>
      <p className="mt-4 text-center text-xs text-[#8a9c96]">Este canal não substitui atendimento de urgência.</p>
    </section>
  );
}

function Appointments({ preVisitDone, onPreVisit }: { preVisitDone: boolean; onPreVisit: () => void }) {
  return (
    <section className="mt-0 lg:mt-8">
      <Heading eyebrow="Antes, durante e depois" title="Suas consultas" description="Tudo o que você precisa para chegar preparado e continuar depois do encontro." />
      <article className="mt-7 rounded-3xl border border-[#9fc9bd] bg-[#edf7f4] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#17372f] text-xs font-bold uppercase text-white">Texto</span>
            <div>
              <div className="flex flex-wrap items-center gap-2"><p className="font-bold">Pré-consulta guiada</p><Status>{preVisitDone ? 'Concluída' : 'Pendente'}</Status></div>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#60766f]">Responda em texto, confira o relato completo e envie seu principal objetivo ao Dr. Guilherme.</p>
            </div>
          </div>
          <button type="button" onClick={onPreVisit} className="min-h-11 shrink-0 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white">
            {preVisitDone ? 'Revisar envio' : 'Responder em texto'}
          </button>
        </div>
      </article>
      <article className="mt-7 overflow-hidden rounded-3xl border border-[#8bbcaf] bg-white shadow-[0_10px_35px_rgba(28,55,47,0.06)]">
        <div className="bg-[#edf7f4] p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Hoje · próxima consulta</p><h2 className="mt-2 text-2xl font-semibold">10:30 com Dr. Guilherme</h2><p className="mt-2 text-sm text-[#60766f]">Retorno de emagrecimento e saúde do sono · 30 min</p></div><Status>Confirmada</Status></div><button type="button" className="mt-6 min-h-12 rounded-xl bg-[#0b7b68] px-6 text-sm font-bold text-white">Entrar na sala de vídeo</button></div>
        <div className="grid sm:grid-cols-3">
          {[
            ['Antes', 'Você já concluiu o check-in e registrou suas dúvidas.'],
            ['Durante', 'A sala abre 10 minutos antes do horário.'],
            ['Depois', 'Seu plano atualizado aparecerá aqui após a revisão.'],
          ].map((item, index) => <div key={item[0]} className={cn('p-5 sm:p-6', index > 0 && 'border-t border-[#e7eeea] sm:border-l sm:border-t-0')}><p className="text-sm font-bold">{item[0]}</p><p className="mt-2 text-sm leading-6 text-[#698078]">{item[1]}</p></div>)}
        </div>
      </article>
      <div className="mt-5 rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Consulta anterior</p><div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-bold">27 de julho de 2026</p><p className="mt-1 text-sm text-[#698078]">Plano iniciado · relatório disponível</p></div><button type="button" className="min-h-11 rounded-xl border border-[#bfd4cd] px-5 text-sm font-bold text-[#0b6a5b]">Ver resumo</button></div></div>
    </section>
  );
}

function PreVisitInterview({
  initialDraft,
  latestSubmission,
  onSaveDraft,
  onClose,
  onSubmit,
}: {
  initialDraft: PreConsultationAnswers;
  latestSubmission: PreConsultationSubmission | null;
  onSaveDraft: (patch: Partial<PreConsultationAnswers>) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  type AnswerField = 'objective' | 'changes' | 'questions' | 'additionalContext';
  type Stage = 'intro' | AnswerField | 'review';

  const stages: Array<{ key: AnswerField; label: string; title: string; helper: string; required: boolean }> = [
    {
      key: 'objective',
      label: 'Objetivo principal',
      title: 'O que você mais gostaria de conversar nesta consulta?',
      helper: 'Escreva com suas palavras. Não precisa usar termos médicos.',
      required: true,
    },
    {
      key: 'changes',
      label: 'Mudanças recentes',
      title: 'O que mudou desde a última consulta?',
      helper: 'Conte o que percebeu na sua rotina, disposição ou bem-estar.',
      required: true,
    },
    {
      key: 'questions',
      label: 'Dúvidas',
      title: 'Quais perguntas você não quer esquecer?',
      helper: 'Este campo é opcional. Você poderá conversar sobre outros assuntos durante a consulta.',
      required: false,
    },
    {
      key: 'additionalContext',
      label: 'Contexto adicional',
      title: 'Existe mais alguma informação que gostaria de registrar?',
      helper: 'Este campo é opcional e será exibido como relato original.',
      required: false,
    },
  ];

  const [stage, setStage] = useState<Stage>(latestSubmission ? 'review' : 'intro');
  const [errors, setErrors] = useState<Partial<Record<AnswerField | 'consent', string>>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  const activeIndex = stages.findIndex((item) => item.key === stage);
  const activeStage = activeIndex >= 0 ? stages[activeIndex] : null;

  const updateAnswer = (field: AnswerField, value: string) => {
    onSaveDraft({ [field]: value });
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validateStage = (field: AnswerField) => {
    const config = stages.find((item) => item.key === field);
    const value = initialDraft[field].trim();
    if (config?.required && value.length < 10) {
      setErrors((current) => ({
        ...current,
        [field]: 'Escreva pelo menos 10 caracteres para que o médico tenha contexto suficiente.',
      }));
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!activeStage || !validateStage(activeStage.key)) return;
    const next = stages[activeIndex + 1];
    setStage(next ? next.key : 'review');
  };

  const goBack = () => {
    if (!activeStage) return;
    const previous = stages[activeIndex - 1];
    setStage(previous ? previous.key : 'intro');
  };

  const startForm = () => {
    if (!initialDraft.consentGiven) {
      setErrors((current) => ({
        ...current,
        consent: 'Confirme que entendeu como as respostas serão usadas para continuar.',
      }));
      return;
    }
    setErrors((current) => ({ ...current, consent: undefined }));
    setStage('objective');
  };

  const submit = () => {
    if (!initialDraft.consentGiven) {
      setStage('intro');
      setErrors((current) => ({
        ...current,
        consent: 'Confirme que entendeu como as respostas serão usadas para continuar.',
      }));
      return;
    }
    if (!validateStage('objective')) {
      setStage('objective');
      return;
    }
    if (!validateStage('changes')) {
      setStage('changes');
      return;
    }
    onSubmit();
  };

  const structuredPreview = [
    `Objetivo declarado: ${initialDraft.objective.trim()}`,
    `Mudanças relatadas: ${initialDraft.changes.trim()}`,
    initialDraft.questions.trim() ? `Dúvidas para a consulta: ${initialDraft.questions.trim()}` : '',
    initialDraft.additionalContext.trim()
      ? `Contexto adicional: ${initialDraft.additionalContext.trim()}`
      : '',
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#102a24]/60 sm:items-center sm:p-5">
      <div
        ref={dialogRef}
        className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="previsit-title"
        aria-describedby="previsit-description"
      >
        <p id="previsit-description" className="sr-only">Pré-consulta textual em quatro etapas, com revisão das respostas antes do envio.</p>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e2ebe7] bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Pré-consulta por texto</p>
            <h2 id="previsit-title" className="mt-1 text-xl font-semibold">Prepare sua consulta</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Fechar pré-consulta" className="grid size-11 cursor-pointer place-items-center rounded-full border border-[#d7e3df] text-xl transition-colors hover:bg-[#f4f7f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">×</button>
        </div>

        {stage === 'intro' && (
          <div className="p-5 sm:p-7">
            <Status tone="green">Cerca de 4 minutos</Status>
            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Escreva do seu jeito. Você poderá revisar tudo.</h3>
            <p className="mt-3 text-base leading-7 text-[#526a62]">Quatro etapas ajudam a organizar seu objetivo, mudanças recentes e dúvidas antes da consulta.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['1', 'Você escreve'],
                ['2', 'O sistema organiza'],
                ['3', 'Você revisa'],
              ].map((item) => <div key={item[0]} className="rounded-2xl bg-[#f4f7f5] p-4"><span className="grid size-7 place-items-center rounded-full bg-[#d9eee8] text-xs font-bold text-[#0b6a5b]">{item[0]}</span><p className="mt-3 text-sm font-bold">{item[1]}</p></div>)}
            </div>
            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#d7e3df] p-4 text-sm leading-6 text-[#405d54]">
              <input
                type="checkbox"
                checked={initialDraft.consentGiven}
                onChange={(event) => {
                  onSaveDraft({ consentGiven: event.target.checked });
                  setErrors((current) => ({ ...current, consent: undefined }));
                }}
                aria-describedby={errors.consent ? 'previsit-consent-error' : undefined}
                className="mt-0.5 size-5 shrink-0 accent-[#0b7b68]"
              />
              Li e entendi que estas respostas serão disponibilizadas ao médico e à equipe clínica para preparar a consulta demonstrativa.
            </label>
            {errors.consent && <p id="previsit-consent-error" role="alert" className="mt-2 text-sm font-semibold text-[#9c453f]">{errors.consent}</p>}
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#c9d8ec] bg-[#f7f9fc] p-4 text-sm leading-6 text-[#405d54]">
              <input
                type="checkbox"
                checked={initialDraft.aiAssistanceAllowed}
                onChange={(event) => onSaveDraft({ aiAssistanceAllowed: event.target.checked })}
                className="mt-0.5 size-5 shrink-0 accent-[#5578a9]"
              />
              Permito que uma IA organize uma cópia do meu relato como rascunho para revisão médica. Posso continuar sem marcar esta opção.
            </label>
            <button type="button" onClick={startForm} className="mt-5 min-h-12 w-full cursor-pointer rounded-xl bg-[#0b7b68] text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Começar pré-consulta</button>
            <div className="mt-4"><SimulationDisclaimer>Nenhuma informação é enviada a serviços externos nesta primeira implementação.</SimulationDisclaimer></div>
          </div>
        )}

        {activeStage && (
          <div className="bg-[#f4f7f5] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#60766f]">Etapa {activeIndex + 1} de {stages.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-[#0b7b68]">{activeStage.label}</p>
              </div>
              <Status tone={activeStage.required ? 'green' : 'gray'}>{activeStage.required ? 'Obrigatória' : 'Opcional'}</Status>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dfe8e3]" aria-hidden="true"><div className="h-full rounded-full bg-[#0b7b68] transition-[width]" style={{ width: `${((activeIndex + 1) / stages.length) * 100}%` }} /></div>
            <label htmlFor={`previsit-${activeStage.key}`} className="mt-7 block text-xl font-semibold leading-8 text-[#17372f]">{activeStage.title}</label>
            <p id={`previsit-${activeStage.key}-helper`} className="mt-2 text-sm leading-6 text-[#60766f]">{activeStage.helper}</p>
            <textarea
              id={`previsit-${activeStage.key}`}
              value={initialDraft[activeStage.key]}
              onChange={(event) => updateAnswer(activeStage.key, event.target.value)}
              onBlur={() => validateStage(activeStage.key)}
              maxLength={800}
              aria-describedby={`${`previsit-${activeStage.key}-helper`}${errors[activeStage.key] ? ` previsit-${activeStage.key}-error` : ''}`}
              aria-invalid={Boolean(errors[activeStage.key])}
              className={cn(
                'mt-4 min-h-44 w-full rounded-2xl border bg-white p-4 text-base leading-7 outline-none transition-colors focus:ring-3',
                errors[activeStage.key] ? 'border-[#d38780] focus:ring-[#efb9b4]' : 'border-[#b9d8cf] focus:ring-[#8bc6b9]',
              )}
              placeholder="Escreva aqui..."
            />
            <div className="mt-2 flex min-h-6 items-start justify-between gap-3">
              <span>{errors[activeStage.key] && <span id={`previsit-${activeStage.key}-error`} role="alert" className="text-sm font-semibold text-[#9c453f]">{errors[activeStage.key]}</span>}</span>
              <span className="shrink-0 text-xs text-[#698078]">{initialDraft[activeStage.key].length}/800</span>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={goBack} className="min-h-12 cursor-pointer rounded-xl border border-[#bfd4cd] bg-white px-5 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Voltar</button>
              <button type="button" onClick={goNext} className="min-h-12 cursor-pointer rounded-xl bg-[#0b7b68] px-6 text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">{activeIndex === stages.length - 1 ? 'Revisar respostas' : 'Continuar'}</button>
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-[#789087]">Rascunho salvo somente nesta sessão demonstrativa.</p>
          </div>
        )}

        {stage === 'review' && (
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Revisão antes do envio</p><h3 className="mt-2 text-2xl font-semibold">Confira o que será compartilhado</h3></div><Status>Você está no controle</Status></div>
            {latestSubmission && <p className="mt-3 text-sm text-[#60766f]">A última submissão foi enviada em {latestSubmission.submittedAt}. Um novo envio criará a versão {latestSubmission.version + 1}.</p>}
            <div className="mt-6 space-y-3">
              {stages.map((item) => (
                <article key={item.key} className="rounded-2xl border border-[#dfe8e3] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <ClinicalLayerBadge layer="relato" />
                    <button type="button" onClick={() => setStage(item.key)} className="min-h-9 cursor-pointer rounded-lg px-3 text-xs font-bold text-[#0b6a5b] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68]">Editar</button>
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-[#17372f]">{item.label}</h4>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#526a62]">{initialDraft[item.key].trim() || 'Não informado.'}</p>
                </article>
              ))}
            </div>
            {initialDraft.aiAssistanceAllowed ? (
              <article className="mt-5 rounded-2xl border border-[#c9d8ec] bg-[#f7f9fc] p-4">
                <AiDraftBadge />
                <div className="mt-4 space-y-3 text-sm leading-6 text-[#405d54]">{structuredPreview.map((item) => <p key={item}>{item}</p>)}</div>
              </article>
            ) : (
              <div className="mt-5"><SimulationDisclaimer>A assistência de IA não foi autorizada. O médico receberá apenas o relato original e poderá realizar todo o processo manualmente.</SimulationDisclaimer></div>
            )}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setStage('objective')} className="min-h-12 cursor-pointer rounded-xl border border-[#bfd4cd] px-5 text-sm font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Revisar respostas</button>
              <button type="button" onClick={submit} className="min-h-12 cursor-pointer rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Enviar para o Dr. Guilherme</button>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-[#789087]">O médico continua responsável pela interpretação, registro e decisão clínica.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Checkin({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(2);
  const [symptom, setSymptom] = useState<'Não' | 'Sim'>('Não');
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#102a24]/55 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="checkin-title">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Leva menos de 1 minuto</p><h2 id="checkin-title" className="mt-2 text-2xl font-semibold">Como você está hoje?</h2></div><button type="button" onClick={onClose} aria-label="Fechar check-in" className="grid size-11 place-items-center rounded-full border border-[#d7e3df] text-xl">×</button></div>
        <div className="mt-7 space-y-7">
          <fieldset><legend className="text-sm font-bold">Sua energia</legend><div className="mt-3 grid grid-cols-5 gap-2">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setEnergy(value)} aria-pressed={energy === value} className={cn('min-h-12 rounded-xl border text-sm font-bold', energy === value ? 'border-[#0b7b68] bg-[#0b7b68] text-white' : 'border-[#d7e3df]')}>{value}</button>)}</div><div className="mt-2 flex justify-between text-[11px] text-[#8a9c96]"><span>Muito baixa</span><span>Muito boa</span></div></fieldset>
          <fieldset><legend className="text-sm font-bold">Como foi seu sono?</legend><div className="mt-3 grid grid-cols-3 gap-2">{[
            ['Ruim', 1],
            ['Regular', 2],
            ['Bom', 3],
          ].map((item) => <button type="button" key={String(item[0])} onClick={() => setSleep(Number(item[1]))} aria-pressed={sleep === item[1]} className={cn('min-h-12 rounded-xl border text-sm font-bold', sleep === item[1] ? 'border-[#0b7b68] bg-[#edf7f4] text-[#0b6a5b]' : 'border-[#d7e3df]')}>{item[0]}</button>)}</div></fieldset>
          <fieldset><legend className="text-sm font-bold">Surgiu algum sintoma novo?</legend><div className="mt-3 grid grid-cols-2 gap-2">{(['Não', 'Sim'] as const).map((value) => <button type="button" key={value} onClick={() => setSymptom(value)} aria-pressed={symptom === value} className={cn('min-h-12 rounded-xl border text-sm font-bold', symptom === value ? value === 'Sim' ? 'border-[#d38780] bg-[#fdecea] text-[#9c453f]' : 'border-[#0b7b68] bg-[#edf7f4] text-[#0b6a5b]' : 'border-[#d7e3df]')}>{value}</button>)}</div></fieldset>
          {symptom === 'Sim' && <label className="block text-sm font-bold">Conte brevemente<textarea className="mt-2 min-h-24 w-full rounded-2xl border border-[#d7e3df] p-3 font-normal outline-none focus:ring-2 focus:ring-[#8bc6b9]" placeholder="Descreva o que sentiu..." /></label>}
        </div>
        <button type="button" onClick={onComplete} className="mt-8 min-h-12 w-full rounded-xl bg-[#0b7b68] text-sm font-bold text-white">Concluir check-in</button>
        <p className="mt-4 text-center text-xs leading-5 text-[#8a9c96]">O check-in ajuda no acompanhamento, mas não substitui avaliação médica.</p>
      </div>
    </div>
  );
}
