'use client';

import { FormEvent, useState } from 'react';
import { cn, Heading, Status, Toast } from './shared';

type PatientView = 'Hoje' | 'Plano' | 'Diário' | 'Evolução' | 'Mensagens' | 'Consultas';

const nav: PatientView[] = ['Hoje', 'Plano', 'Diário', 'Evolução', 'Mensagens', 'Consultas'];

export default function PatientWorkspace() {
  const [view, setView] = useState<PatientView>('Hoje');
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkinDone, setCheckinDone] = useState(false);
  const [mealAnalyzed, setMealAnalyzed] = useState(false);
  const [watchConnected, setWatchConnected] = useState(false);
  const [tasks, setTasks] = useState([true, false, false]);
  const [toast, setToast] = useState('');

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
            watchConnected={watchConnected}
            onCheckin={() => setCheckinOpen(true)}
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
        {view === 'Diário' && <Diary analyzed={mealAnalyzed} onAnalyze={() => setMealAnalyzed(true)} />}
        {view === 'Evolução' && <Evolution />}
        {view === 'Mensagens' && <Messages onNotify={notify} />}
        {view === 'Consultas' && <Appointments />}
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
      <Toast text={toast} patient />
    </>
  );
}

function Today({
  checkinDone,
  watchConnected,
  onCheckin,
  onConnectWatch,
  onNavigate,
}: {
  checkinDone: boolean;
  watchConnected: boolean;
  onCheckin: () => void;
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
          <p className="mt-3 text-sm text-[#60766f]">Dr. Guilherme Mendes · retorno de 30 min</p>
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

function Diary({ analyzed, onAnalyze }: { analyzed: boolean; onAnalyze: () => void }) {
  return (
    <section className="mt-0 lg:mt-8">
      <Heading eyebrow="Diário sem julgamento" title="Registre o que aconteceu" description="A ideia é enxergar padrões e contexto, não classificar refeições como boas ou ruins." />
      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_350px]">
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Jantar · hoje, 19:42</p><h2 className="mt-2 text-xl font-semibold">Refeição registrada</h2></div><Status tone="gray">Foto simulada</Status></div>
          <div className="mt-6 grid gap-5 sm:grid-cols-[220px_1fr] sm:items-center">
            <div className="mx-auto grid aspect-square w-full max-w-[220px] place-items-center rounded-3xl bg-[#e8dfce] p-5">
              <div className="relative aspect-square w-full rounded-full border-[12px] border-white bg-[#f7f0df] shadow-[0_8px_30px_rgba(73,61,42,0.18)]">
                <span className="absolute left-[14%] top-[18%] h-[46%] w-[42%] rounded-[45%] bg-[#5b9d65]" />
                <span className="absolute bottom-[18%] right-[13%] h-[38%] w-[43%] rounded-[50%] bg-[#d09a57]" />
                <span className="absolute right-[17%] top-[14%] h-[31%] w-[34%] rounded-[48%] bg-[#e8c66e]" />
                <span className="absolute bottom-[24%] left-[24%] size-8 rounded-full bg-[#b95842]" />
              </div>
            </div>
            <div>
              <p className="text-sm leading-6 text-[#60766f]">Você marcou esta refeição como <strong className="text-[#17372f]">satisfatória</strong> e informou fome moderada antes de comer.</p>
              <button type="button" onClick={onAnalyze} disabled={analyzed} className="mt-5 min-h-12 w-full rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white disabled:bg-[#779a91] sm:w-auto">{analyzed ? 'Análise concluída' : 'Analisar com IA'}</button>
            </div>
          </div>
          {analyzed && (
            <div className="mt-6 rounded-3xl border border-[#b9d8cf] bg-[#edf7f4] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-[#0b6a5b]">Comparação com o combinado</p><Status>Compatível</Status></div>
              <p className="mt-3 text-sm leading-6 text-[#45655c]">A imagem parece incluir vegetais, uma fonte de proteína e carboidrato. A porção visual está próxima do modelo combinado para o jantar.</p>
              <div className="mt-4 rounded-2xl bg-white/70 p-4"><p className="text-xs font-bold text-[#45655c]">Uma pergunta útil</p><p className="mt-1 text-sm text-[#60766f]">Como ficou sua saciedade 20 minutos depois?</p></div>
              <p className="mt-4 text-xs leading-5 text-[#698078]">Análise demonstrativa: fotos não permitem identificar ingredientes, quantidades ou valor nutricional com precisão.</p>
            </div>
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

function Evolution() {
  const weights = [80, 79.8, 79.3, 78.9, 78.6, 78.2];
  return (
    <section className="mt-0 lg:mt-8">
      <Heading eyebrow="Evolução, não perfeição" title="Seus sinais ao longo do tempo" description="Veja tendências e conquistas sem transformar um único dia em veredito." />
      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_340px]">
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold">Peso · últimas 6 semanas</p><p className="mt-1 text-xs text-[#698078]">Tendência demonstrativa</p></div><div className="text-right"><p className="text-2xl font-semibold">78,2 kg</p><p className="text-xs font-bold text-[#0b7b68]">−1,8 kg no período</p></div></div>
          <div className="mt-8 flex h-56 items-end gap-2 rounded-2xl bg-[#f8faf9] p-4 sm:gap-4">
            {weights.map((weight, index) => {
              const height = 48 + (80 - weight) * 26;
              return <div key={String(weight)} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-bold text-[#526a62]">{String(weight).replace('.', ',')}</span><div className="w-full max-w-12 rounded-t-lg bg-[#77b8a9]" style={{ height: String(height) + 'px' }} /><span className="text-[10px] text-[#8a9c96]">S{index + 1}</span></div>;
            })}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['Adesão', '82%', '+6 p.p.'],
              ['Passos médios', '6.420', '+9%'],
              ['Sono médio', '6h12', 'atenção'],
            ].map((item) => <div key={item[0]} className="rounded-2xl bg-[#f4f7f5] p-4"><p className="text-xs text-[#698078]">{item[0]}</p><p className="mt-2 text-lg font-bold">{item[1]}</p><p className={cn('mt-1 text-xs font-semibold', item[2] === 'atenção' ? 'text-[#a06117]' : 'text-[#0b7b68]')}>{item[2]}</p></div>)}
          </div>
        </article>
        <aside className="space-y-5">
          <div className="rounded-3xl bg-[#17372f] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Conquista do ciclo</p><h2 className="mt-3 text-xl font-semibold">Consistência maior que pressa</h2><p className="mt-3 text-sm leading-6 text-[#d6e8e2]">Você manteve pelo menos duas ações do plano em 11 dos últimos 14 dias.</p></div>
          <div className="rounded-3xl border border-[#dfe8e3] bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm font-bold">Relatório quinzenal</p><Status>Disponível</Status></div><p className="mt-3 text-sm leading-6 text-[#698078]">Revisado pelo Dr. Guilherme em 24 de agosto.</p><button type="button" className="mt-4 min-h-11 text-sm font-bold text-[#0b6a5b] underline underline-offset-4">Ler relatório</button></div>
        </aside>
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
        <div className="flex items-center gap-3 border-b border-[#e7eeea] p-4 sm:p-5"><span className="grid size-11 place-items-center rounded-full bg-[#d9eee8] text-xs font-bold text-[#0b6a5b]">GM</span><div><p className="text-sm font-bold">Dr. Guilherme Mendes</p><p className="text-xs text-[#698078]">Respostas em horário de atendimento</p></div></div>
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

function Appointments() {
  return (
    <section className="mt-0 lg:mt-8">
      <Heading eyebrow="Antes, durante e depois" title="Suas consultas" description="Tudo o que você precisa para chegar preparado e continuar depois do encontro." />
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
