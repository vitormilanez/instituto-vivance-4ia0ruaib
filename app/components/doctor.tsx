'use client';

import { FormEvent, useState } from 'react';
import { cn, Heading, Status, Toast } from './shared';

type DoctorView = 'Visão geral' | 'Agenda' | 'Pacientes' | 'Mensagens' | 'Relatórios';

const nav: DoctorView[] = ['Visão geral', 'Agenda', 'Pacientes', 'Mensagens', 'Relatórios'];

const alerts = [
  {
    patient: 'Marina Costa',
    detail: 'Sono abaixo do padrão pessoal por 4 dias',
    context: 'Média de 5h42, 18% abaixo do padrão das últimas quatro semanas.',
    tag: 'Revisar hoje',
    tone: 'amber' as const,
  },
  {
    patient: 'Paulo Mendes',
    detail: 'Relatou enjoo após atualização do plano',
    context: 'Novo sintoma informado no check-in das 08:12. Ainda sem resposta.',
    tag: 'Nova mensagem',
    tone: 'rose' as const,
  },
  {
    patient: 'Ana Ribeiro',
    detail: 'Relatório quinzenal pronto para aprovação',
    context: 'A IA reuniu adesão, peso, sono e observações. Requer revisão médica.',
    tag: 'Relatório',
    tone: 'blue' as const,
  },
];

const appointments = [
  ['10:30', 'Marina Costa', 'Retorno · 30 min', 'Próxima'],
  ['11:30', 'Rafael Lima', 'Primeira consulta · 50 min', 'Confirmada'],
  ['14:00', 'Ana Ribeiro', 'Retorno · 30 min', 'Confirmada'],
  ['16:30', 'Paulo Mendes', 'Acompanhamento · 25 min', 'A confirmar'],
];

const patients = [
  ['MC', 'Marina Costa', 'Emagrecimento · sono', '−1,8 kg', 'Sono'],
  ['AR', 'Ana Ribeiro', 'Longevidade · força', '+8% adesão', 'Relatório'],
  ['PM', 'Paulo Mendes', 'Emagrecimento · rotina', '72% plano', 'Sintoma'],
  ['RL', 'Rafael Lima', 'Avaliação inicial', 'Novo', 'Anamnese'],
];

export default function DoctorWorkspace() {
  const [view, setView] = useState<DoctorView>('Visão geral');
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<(typeof alerts)[number] | null>(null);
  const [approved, setApproved] = useState(false);
  const [toast, setToast] = useState('');

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3200);
  };

  return (
    <>
      <div className="mx-auto grid max-w-[1540px] lg:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-72px)] border-r border-[#dfe8e3] bg-white px-4 py-6 lg:block">
          <nav aria-label="Navegação do médico" className="space-y-1">
            {nav.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setView(item)}
                className={cn(
                  'flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors',
                  view === item
                    ? 'bg-[#e8f4f0] text-[#075f52]'
                    : 'text-[#60766f] hover:bg-[#f4f7f5] hover:text-[#17372f]'
                )}
              >
                <span aria-hidden="true" className={cn('size-2 rounded-full', view === item ? 'bg-[#0b7b68]' : 'bg-[#b7c7c1]')} />
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-10 rounded-2xl bg-[#17372f] p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9cc7ba]">Ciclos de cuidado</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">86%</p>
            <p className="mt-1 text-sm leading-5 text-[#d6e8e2]">19 de 22 pacientes com próximo passo definido.</p>
          </div>
          <div className="mt-4 rounded-2xl border border-[#dfe8e3] bg-[#f8faf9] p-4">
            <p className="text-xs font-bold text-[#45655c]">IA com revisão médica</p>
            <p className="mt-2 text-xs leading-5 text-[#698078]">Sugestões nunca são enviadas ao paciente sem sua aprovação.</p>
          </div>
        </aside>

        <main id="main-content" className="min-w-0 px-4 pb-12 pt-6 sm:px-5 lg:px-9 lg:pt-9">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Navegação do médico">
            {nav.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setView(item)}
                className={cn(
                  'min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold',
                  view === item ? 'bg-[#17372f] text-white' : 'border border-[#dfe8e3] bg-white text-[#60766f]'
                )}
              >
                {item}
              </button>
            ))}
          </div>

          {view === 'Visão geral' && (
            <Overview
              onStart={() => setConsultationOpen(true)}
              onPatient={() => setView('Pacientes')}
              onAlert={setSelectedAlert}
            />
          )}
          {view === 'Agenda' && <Agenda onStart={() => setConsultationOpen(true)} />}
          {view === 'Pacientes' && <Patients onStart={() => setConsultationOpen(true)} />}
          {view === 'Mensagens' && <Messages onNotify={notify} />}
          {view === 'Relatórios' && (
            <Reports
              approved={approved}
              onApprove={() => {
                setApproved(true);
                notify('Relatório aprovado e disponibilizado para Marina.');
              }}
            />
          )}
        </main>
      </div>

      {consultationOpen && (
        <Consultation
          onClose={() => setConsultationOpen(false)}
          onComplete={() => {
            setConsultationOpen(false);
            notify('Consulta concluída. Plano e relatório ficaram salvos como rascunho.');
          }}
        />
      )}
      {selectedAlert && (
        <AlertDrawer
          item={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onResolve={() => {
            setSelectedAlert(null);
            notify('Item marcado como revisado.');
          }}
        />
      )}
      <Toast text={toast} />
    </>
  );
}

function Overview({
  onStart,
  onPatient,
  onAlert,
}: {
  onStart: () => void;
  onPatient: () => void;
  onAlert: (item: (typeof alerts)[number]) => void;
}) {
  return (
    <>
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#c9ddd6] bg-white px-3 py-1 text-xs font-semibold text-[#45655c]">
              Terça-feira, 25 de agosto
            </span>
            <Status tone="amber">Dados demonstrativos</Status>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#15342c] sm:text-4xl">Bom dia, Dr. Guilherme</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-[#60766f]">
            Sua agenda está organizada. Três pacientes merecem uma revisão antes do próximo contato.
          </p>
        </div>
        <button type="button" onClick={onStart} className="min-h-12 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(11,123,104,0.22)] hover:bg-[#096b5b]">
          Iniciar próxima consulta
        </button>
      </section>

      <section aria-label="Resumo do dia" className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ['Consultas hoje', '5', 'Próxima às 10:30'],
          ['Precisam de atenção', '3', '1 novo sintoma relatado'],
          ['Relatórios pendentes', '4', '2 prontos para revisar'],
        ].map((item, index) => (
          <article key={item[0]} className="rounded-2xl border border-[#dfe8e3] bg-white p-5 shadow-[0_8px_28px_rgba(28,55,47,0.04)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#60766f]">{item[0]}</p>
              <span aria-hidden="true" className={cn('size-2.5 rounded-full', index === 0 ? 'bg-[#3da58f]' : index === 1 ? 'bg-[#e49d45]' : 'bg-[#6997d4]')} />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{item[1]}</p>
            <p className="mt-1 text-xs font-medium text-[#789087]">{item[2]}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <article className="overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white shadow-[0_10px_35px_rgba(28,55,47,0.05)]">
          <div className="flex items-center justify-between border-b border-[#e7eeea] px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Próxima consulta</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Marina Costa</h2>
            </div>
            <Status>10:30</Status>
          </div>
          <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1fr_220px]">
            <div>
              <div className="flex flex-wrap gap-2">
                {['Emagrecimento', 'Saúde do sono', 'Retorno 30 dias'].map((tag) => <Status key={tag} tone="gray">{tag}</Status>)}
              </div>
              <h3 className="mt-6 text-sm font-bold">Resumo preparado pela IA</h3>
              <p className="mt-2 text-sm leading-6 text-[#60766f]">
                Peso reduziu 1,8 kg desde a última consulta. Adesão consistente, mas o sono ficou abaixo do padrão pessoal em quatro dos últimos sete dias.
              </p>
              <button type="button" onClick={onPatient} className="mt-4 min-h-11 text-sm font-bold text-[#0b7b68] underline decoration-[#9ccdc2] underline-offset-4">
                Abrir visão completa da paciente
              </button>
            </div>
            <div className="rounded-2xl bg-[#f4f7f5] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#698078]">Antes da consulta</p>
              <ol className="mt-4 space-y-3 text-sm text-[#405d54]">
                <li><strong className="mr-2 text-[#0b7b68]">01</strong>Revisar diário de sono</li>
                <li><strong className="mr-2 text-[#0b7b68]">02</strong>Confirmar tolerância</li>
                <li><strong className="mr-2 text-[#0b7b68]">03</strong>Atualizar plano</li>
              </ol>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-[0_10px_35px_rgba(28,55,47,0.05)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b46a15]">Caixa por exceção</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Quem precisa de você</h2>
            </div>
            <span className="grid size-8 place-items-center rounded-full bg-[#fff0dc] text-sm font-bold text-[#9b5e16]">3</span>
          </div>
          <div className="mt-5 divide-y divide-[#e7eeea]">
            {alerts.map((item) => (
              <button type="button" key={item.patient} onClick={() => onAlert(item)} className="group min-h-20 w-full py-4 text-left first:pt-0 last:pb-0">
                <span className="flex items-start gap-3">
                  <span aria-hidden="true" className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', item.tone === 'amber' ? 'bg-[#e49d45]' : item.tone === 'rose' ? 'bg-[#db766f]' : 'bg-[#6997d4]')} />
                  <span className="min-w-0">
                    <strong className="block text-sm group-hover:text-[#0b7b68]">{item.patient}</strong>
                    <span className="mt-1 block text-xs leading-5 text-[#698078]">{item.detail}</span>
                    <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a9c96]">{item.tag}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function Agenda({ onStart }: { onStart: () => void }) {
  return (
    <>
      <Heading
        eyebrow="Agenda integrada"
        title="Consultas de hoje"
        description="Encontros, contexto clínico e sala de vídeo reunidos em um único fluxo."
        action={<button type="button" className="min-h-11 rounded-xl border border-[#bfd4cd] bg-white px-4 text-sm font-bold text-[#0b6a5b]">Novo agendamento</button>}
      />
      <section className="mt-7 overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white">
        {appointments.map((appointment, index) => (
          <article key={appointment.join('-')} className={cn('grid gap-4 p-5 sm:grid-cols-[80px_1fr_auto] sm:items-center sm:p-6', index > 0 && 'border-t border-[#e7eeea]')}>
            <p className="text-xl font-semibold">{appointment[0]}</p>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold">{appointment[1]}</h2>
                <Status tone={appointment[3] === 'A confirmar' ? 'amber' : 'green'}>{appointment[3]}</Status>
              </div>
              <p className="mt-1 text-sm text-[#698078]">{appointment[2]}</p>
            </div>
            <button type="button" onClick={onStart} className="min-h-11 rounded-xl bg-[#17372f] px-4 text-sm font-bold text-white">
              {index === 0 ? 'Abrir consulta' : 'Ver preparo'}
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function Patients({ onStart }: { onStart: () => void }) {
  return (
    <>
      <Heading
        eyebrow="Carteira ativa"
        title="Pacientes"
        description="Evolução, próximos passos e sinais fora do padrão individual."
        action={
          <label className="flex min-h-11 items-center rounded-xl border border-[#d7e3df] bg-white px-4 text-sm text-[#698078]">
            <span className="sr-only">Buscar paciente</span>
            <input className="w-44 bg-transparent outline-none" placeholder="Buscar paciente" />
          </label>
        }
      />
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {patients.map((patient, index) => (
          <article key={patient[1]} className={cn('rounded-3xl border bg-white p-5 shadow-[0_8px_28px_rgba(28,55,47,0.04)]', index === 0 ? 'border-[#8bbcaf] ring-2 ring-[#dceee9]' : 'border-[#dfe8e3]')}>
            <div className="flex items-start justify-between">
              <span className="grid size-11 place-items-center rounded-full bg-[#d9eee8] text-sm font-bold text-[#0b6a5b]">{patient[0]}</span>
              <Status tone={patient[4] === 'Sintoma' ? 'rose' : patient[4] === 'Sono' ? 'amber' : 'gray'}>{patient[4]}</Status>
            </div>
            <h2 className="mt-5 font-bold">{patient[1]}</h2>
            <p className="mt-1 text-sm text-[#698078]">{patient[2]}</p>
            <p className="mt-5 text-2xl font-semibold tracking-[-0.04em]">{patient[3]}</p>
            <p className="mt-1 text-xs text-[#8a9c96]">desde o último ciclo</p>
            <button type="button" onClick={index === 0 ? onStart : undefined} className="mt-5 min-h-11 w-full rounded-xl border border-[#c9ddd6] text-sm font-bold text-[#0b6a5b] hover:bg-[#edf7f4]">
              {index === 0 ? 'Abrir consulta' : 'Ver perfil'}
            </button>
          </article>
        ))}
      </section>
    </>
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
    onNotify('Mensagem adicionada à conversa.');
  };

  return (
    <>
      <Heading eyebrow="Comunicação segura" title="Mensagens" description="Conversas contextualizadas, sem perder orientações entre canais." />
      <section className="mt-7 grid min-h-[590px] overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white lg:grid-cols-[290px_1fr]">
        <div className="border-b border-[#e7eeea] lg:border-b-0 lg:border-r">
          <div className="p-4"><input aria-label="Buscar conversa" placeholder="Buscar conversa" className="min-h-11 w-full rounded-xl bg-[#f4f7f5] px-4 text-sm outline-none focus:ring-2 focus:ring-[#8bc6b9]" /></div>
          {[
            ['MC', 'Marina Costa', 'Consegui registrar o jantar.', '09:18'],
            ['PM', 'Paulo Mendes', 'Estou sentindo enjoo hoje.', '08:12'],
            ['AR', 'Ana Ribeiro', 'Obrigada, doutor.', 'Ontem'],
          ].map((item, index) => (
            <button type="button" key={item[1]} className={cn('flex w-full gap-3 border-t border-[#edf2ef] p-4 text-left', index === 0 ? 'bg-[#edf7f4]' : 'hover:bg-[#f8faf9]')}>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#d9eee8] text-xs font-bold text-[#0b6a5b]">{item[0]}</span>
              <span className="min-w-0 flex-1">
                <span className="flex justify-between gap-3"><strong className="text-sm">{item[1]}</strong><small className="text-[#8a9c96]">{item[3]}</small></span>
                <span className="mt-1 block truncate text-xs text-[#698078]">{item[2]}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="flex min-h-[470px] flex-col">
          <div className="flex items-center gap-3 border-b border-[#e7eeea] p-4 sm:px-6">
            <span className="grid size-10 place-items-center rounded-full bg-[#d9eee8] text-xs font-bold text-[#0b6a5b]">MC</span>
            <div><p className="text-sm font-bold">Marina Costa</p><p className="text-xs text-[#698078]">Plano iniciado há 29 dias</p></div>
          </div>
          <div className="flex-1 space-y-4 bg-[#f8faf9] p-4 sm:p-6">
            <div className="max-w-[78%] rounded-2xl rounded-tl-md bg-white p-4 text-sm leading-6 shadow-sm">Consegui registrar o jantar. Também dormi melhor esta noite.<p className="mt-2 text-[11px] text-[#8a9c96]">09:18</p></div>
            <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-[#17372f] p-4 text-sm leading-6 text-white">Ótimo, Marina. Vou revisar seus registros antes da nossa consulta.<p className="mt-2 text-[11px] text-[#b8d3cb]">09:22 · Dr. Guilherme</p></div>
            {sent && <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-[#0b7b68] p-4 text-sm text-white">Mensagem demonstrativa enviada agora.</div>}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-[#e7eeea] p-4">
            <label className="sr-only" htmlFor="doctor-message">Escrever mensagem</label>
            <input id="doctor-message" value={value} onChange={(event) => setValue(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#d7e3df] px-4 text-sm outline-none focus:ring-2 focus:ring-[#8bc6b9]" placeholder="Escreva uma mensagem..." />
            <button type="submit" className="min-h-11 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white">Enviar</button>
          </form>
        </div>
      </section>
    </>
  );
}

function Reports({ approved, onApprove }: { approved: boolean; onApprove: () => void }) {
  return (
    <>
      <Heading eyebrow="Evolução longitudinal" title="Relatórios" description="Rascunhos gerados a partir de dados demonstrativos, sempre revisados pelo médico." />
      <section className="mt-7 grid gap-6 xl:grid-cols-[300px_1fr]">
        <div className="space-y-3">
          {[
            ['Marina Costa', 'Quinzenal · pronto'],
            ['Ana Ribeiro', 'Quinzenal · pronto'],
            ['Paulo Mendes', 'Semanal · processando'],
          ].map((item, index) => (
            <button type="button" key={item[0]} className={cn('w-full rounded-2xl border p-4 text-left', index === 0 ? 'border-[#8bbcaf] bg-[#edf7f4]' : 'border-[#dfe8e3] bg-white')}>
              <strong className="block text-sm">{item[0]}</strong><span className="mt-1 block text-xs text-[#698078]">{item[1]}</span>
            </button>
          ))}
        </div>
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-[#e7eeea] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Rascunho assistido por IA</p><h2 className="mt-2 text-2xl font-semibold">Evolução quinzenal · Marina Costa</h2><p className="mt-1 text-sm text-[#698078]">11–25 de agosto de 2026</p></div>
            <Status tone={approved ? 'green' : 'amber'}>{approved ? 'Aprovado' : 'Requer revisão'}</Status>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ['Peso', '−1,8 kg'],
              ['Adesão', '82%'],
              ['Sono médio', '6h12'],
            ].map((item) => <div key={item[0]} className="rounded-2xl bg-[#f4f7f5] p-4"><p className="text-xs font-semibold text-[#698078]">{item[0]}</p><p className="mt-2 text-xl font-bold">{item[1]}</p></div>)}
          </div>
          <div className="mt-6 space-y-5 text-sm leading-6 text-[#526a62]">
            <section><h3 className="font-bold text-[#17372f]">Síntese do período</h3><p className="mt-1">Evolução consistente de peso e boa adesão. A principal oportunidade é recuperar regularidade de sono antes de ampliar metas.</p></section>
            <section><h3 className="font-bold text-[#17372f]">Pontos para próxima consulta</h3><ul className="mt-1 list-disc space-y-1 pl-5"><li>Investigar despertares noturnos.</li><li>Revisar tolerância e rotina do jantar.</li><li>Manter meta de passos nesta semana.</li></ul></section>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" className="min-h-11 rounded-xl border border-[#bfd4cd] bg-white px-5 text-sm font-bold text-[#0b6a5b]">Editar texto</button>
            <button type="button" disabled={approved} onClick={onApprove} className="min-h-11 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white disabled:bg-[#779a91]">{approved ? 'Relatório aprovado' : 'Aprovar e disponibilizar'}</button>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#8a9c96]">A IA organiza informações; a interpretação e a decisão permanecem com o médico.</p>
        </article>
      </section>
    </>
  );
}

function Consultation({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  type Step = 'preparo' | 'consulta' | 'plano' | 'fechamento';
  const [step, setStep] = useState<Step>('preparo');
  const [meetOpen, setMeetOpen] = useState(false);
  const [notes, setNotes] = useState('Paciente relata boa adaptação ao plano e melhora da saciedade.');
  const [summary, setSummary] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const steps: Array<[Step, string]> = [
    ['preparo', '1. Preparo'],
    ['consulta', '2. Consulta'],
    ['plano', '3. Plano'],
    ['fechamento', '4. Fechamento'],
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#102a24]/55 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
      <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-[#f4f7f5] shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dfe8e3] bg-white px-5 py-4 sm:px-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Consulta · 10:30</p><h2 id="consultation-title" className="mt-1 text-xl font-semibold">Marina Costa</h2></div>
          <button type="button" onClick={onClose} aria-label="Fechar consulta" className="grid size-11 place-items-center rounded-full border border-[#d7e3df] text-xl">×</button>
        </div>
        <div className="border-b border-[#dfe8e3] bg-white px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {steps.map((item) => <button type="button" key={item[0]} onClick={() => setStep(item[0])} className={cn('min-h-12 shrink-0 border-b-2 px-3 text-sm font-bold', step === item[0] ? 'border-[#0b7b68] text-[#0b6a5b]' : 'border-transparent text-[#698078]')}>{item[1]}</button>)}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {step === 'preparo' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Briefing longitudinal</p><h3 className="mt-2 text-2xl font-semibold">O que mudou desde a última consulta</h3></div>
                  <Status tone="amber">1 ponto de atenção</Status>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Peso', '78,2 kg', '−1,8 kg'],
                    ['Adesão', '82%', '+6 p.p.'],
                    ['Sono', '5h42', 'abaixo do padrão'],
                  ].map((item) => <div key={item[0]} className="rounded-2xl bg-[#f4f7f5] p-4"><p className="text-xs text-[#698078]">{item[0]}</p><p className="mt-2 text-xl font-bold">{item[1]}</p><p className={cn('mt-1 text-xs font-semibold', item[0] === 'Sono' ? 'text-[#a06117]' : 'text-[#0b7b68]')}>{item[2]}</p></div>)}
                </div>
                <div className="mt-6 rounded-2xl border-l-4 border-[#e49d45] bg-[#fff8e9] p-4"><p className="text-sm font-bold text-[#6f4b0d]">Sono fora do padrão pessoal</p><p className="mt-1 text-sm leading-6 text-[#805f24]">Quatro noites abaixo de seis horas. Dados do relógio são demonstrativos e não equivalem a diagnóstico.</p></div>
              </section>
              <aside className="rounded-3xl bg-[#17372f] p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Preparar em 30 segundos</p>
                <ol className="mt-5 space-y-4 text-sm text-[#e0eee9]"><li><strong className="mr-2 text-[#76c5b3]">01</strong>Validar sono</li><li><strong className="mr-2 text-[#76c5b3]">02</strong>Confirmar tolerância</li><li><strong className="mr-2 text-[#76c5b3]">03</strong>Decidir próximo passo</li></ol>
                <button type="button" onClick={() => setStep('consulta')} className="mt-7 min-h-11 w-full rounded-xl bg-white px-4 text-sm font-bold text-[#17372f]">Começar consulta</button>
              </aside>
            </div>
          )}

          {step === 'consulta' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
              <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Registro estruturado</p><h3 className="mt-1 text-xl font-semibold">Notas da consulta</h3></div>
                  <button type="button" onClick={() => setMeetOpen(!meetOpen)} className={cn('min-h-11 rounded-xl px-4 text-sm font-bold', meetOpen ? 'bg-[#e8f4f0] text-[#0b6a5b]' : 'bg-[#17372f] text-white')}>{meetOpen ? 'Sala de vídeo aberta' : 'Abrir sala de vídeo'}</button>
                </div>
                {meetOpen && <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-sm text-[#0b6a5b]"><span className="size-2.5 rounded-full bg-[#1f9d79]" />Sala demonstrativa ativa · link pronto</div>}
                <label htmlFor="notes" className="mt-6 block text-sm font-bold">Observações</label>
                <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 min-h-56 w-full rounded-2xl border border-[#d7e3df] p-4 text-sm leading-6 outline-none focus:ring-2 focus:ring-[#8bc6b9]" />
                <p className="mt-2 text-xs text-[#8a9c96]">Gravação ou transcrição exigiria consentimento explícito.</p>
              </section>
              <aside className="space-y-4">
                <div className="rounded-3xl border border-[#dfe8e3] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Copiloto clínico</p><p className="mt-3 text-sm leading-6 text-[#526a62]">Organiza as notas e destaca lacunas. Não diagnostica nem decide conduta.</p><button type="button" onClick={() => setSummary(true)} className="mt-4 min-h-11 w-full rounded-xl border border-[#9ccdc2] text-sm font-bold text-[#0b6a5b]">Organizar notas com IA</button></div>
                {summary && <div className="rounded-3xl bg-[#17372f] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Síntese sugerida</p><p className="mt-3 text-sm leading-6 text-[#e0eee9]">Boa adaptação e saciedade. Investigar sono antes de modificar intensidade do plano.</p></div>}
                <button type="button" onClick={() => setStep('plano')} className="min-h-11 w-full rounded-xl bg-[#0b7b68] text-sm font-bold text-white">Construir próximo plano</button>
              </aside>
            </div>
          )}

          {step === 'plano' && (
            <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Compilador do plano</p><h3 className="mt-2 text-2xl font-semibold">Da decisão clínica ao dia a dia</h3><p className="mt-2 text-sm leading-6 text-[#698078]">Transforme a orientação em ações, frequência, monitoramento e regras de escalonamento.</p></div>
                <Status tone={compiled ? 'green' : 'gray'}>{compiled ? 'Plano compilado' : 'Rascunho'}</Status>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <label className="rounded-2xl bg-[#f4f7f5] p-4 text-sm font-bold">Meta principal<select className="mt-3 min-h-11 w-full rounded-xl border border-[#d7e3df] bg-white px-3 font-normal"><option>Regularizar sono</option><option>Manter adesão alimentar</option></select></label>
                <label className="rounded-2xl bg-[#f4f7f5] p-4 text-sm font-bold">Check-in<select className="mt-3 min-h-11 w-full rounded-xl border border-[#d7e3df] bg-white px-3 font-normal"><option>Diário · 20h</option><option>3 vezes por semana</option></select></label>
                <label className="rounded-2xl bg-[#f4f7f5] p-4 text-sm font-bold">Se sair do esperado<select className="mt-3 min-h-11 w-full rounded-xl border border-[#d7e3df] bg-white px-3 font-normal"><option>Avisar o médico</option><option>Apenas registrar</option></select></label>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {['Registrar jantar em 3 dias', 'Meta de 7.000 passos', 'Desacelerar às 22h', 'Relatar qualquer novo sintoma'].map((item, index) => (
                  <label key={item} className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#dfe8e3] p-4 text-sm font-semibold"><input type="checkbox" defaultChecked={index !== 1} className="size-5 accent-[#0b7b68]" />{item}</label>
                ))}
              </div>
              {compiled && <div className="mt-5 rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4"><p className="text-sm font-bold text-[#0b6a5b]">Plano pronto para revisão</p><p className="mt-1 text-sm text-[#45655c]">4 ações, check-in diário e alerta por novo sintoma.</p></div>}
              <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setCompiled(true)} className="min-h-11 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white">Compilar plano com IA</button><button type="button" onClick={() => setStep('fechamento')} className="min-h-11 rounded-xl border border-[#bfd4cd] px-5 text-sm font-bold text-[#0b6a5b]">Revisar fechamento</button></div>
            </section>
          )}

          {step === 'fechamento' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
              <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Fechamento revisável</p>
                <h3 className="mt-2 text-2xl font-semibold">Tudo pronto para conferir</h3>
                <div className="mt-6 space-y-3">
                  {[
                    ['Resumo da consulta', summary ? 'Organizado e revisável' : 'Usará as notas atuais'],
                    ['Plano de cuidado', compiled ? '4 ações e 1 regra de alerta' : 'Rascunho básico'],
                    ['Relatório', 'Será salvo como rascunho'],
                    ['Próximo contato', 'Check-in amanhã às 20h'],
                  ].map((item) => <div key={item[0]} className="flex flex-col justify-between gap-1 rounded-2xl bg-[#f4f7f5] p-4 sm:flex-row"><strong className="text-sm">{item[0]}</strong><span className="text-sm text-[#60766f]">{item[1]}</span></div>)}
                </div>
                <p className="mt-5 text-xs leading-5 text-[#8a9c96]">Nenhuma sugestão será tratada como prescrição automática.</p>
              </section>
              <aside className="rounded-3xl bg-[#17372f] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9cc7ba]">Próximo passo</p><h3 className="mt-3 text-xl font-semibold">Manter o cuidado vivo</h3><p className="mt-3 text-sm leading-6 text-[#d6e8e2]">O app transforma o plano em pequenos compromissos e traz de volta somente o que merece atenção.</p><button type="button" onClick={onComplete} className="mt-7 min-h-12 w-full rounded-xl bg-white px-4 text-sm font-bold text-[#17372f]">Concluir consulta</button><button type="button" onClick={onClose} className="mt-2 min-h-11 w-full text-sm font-semibold text-[#b8d3cb]">Salvar e sair</button></aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertDrawer({
  item,
  onClose,
  onResolve,
}: {
  item: (typeof alerts)[number];
  onClose: () => void;
  onResolve: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-[#102a24]/45" role="dialog" aria-modal="true" aria-labelledby="alert-title">
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between">
          <div><Status tone={item.tone}>{item.tag}</Status><h2 id="alert-title" className="mt-4 text-2xl font-semibold">{item.patient}</h2></div>
          <button type="button" onClick={onClose} aria-label="Fechar alerta" className="grid size-11 place-items-center rounded-full border border-[#d7e3df] text-xl">×</button>
        </div>
        <div className="mt-8 rounded-3xl bg-[#f4f7f5] p-5"><p className="text-sm font-bold">{item.detail}</p><p className="mt-2 text-sm leading-6 text-[#60766f]">{item.context}</p></div>
        <section className="mt-7">
          <h3 className="text-sm font-bold">Contexto relevante</h3>
          {[
            ['Plano atual', 'Regularizar sono e manter adesão'],
            ['Último contato', 'Ontem, 20:14'],
            ['Próxima consulta', 'Hoje, 10:30'],
          ].map((row) => <div key={row[0]} className="flex justify-between gap-4 border-b border-[#e7eeea] py-3 text-sm"><span className="text-[#698078]">{row[0]}</span><strong className="text-right">{row[1]}</strong></div>)}
        </section>
        <div className="mt-8 space-y-3"><button type="button" onClick={onResolve} className="min-h-12 w-full rounded-xl bg-[#0b7b68] text-sm font-bold text-white">Marcar como revisado</button><button type="button" className="min-h-12 w-full rounded-xl border border-[#bfd4cd] text-sm font-bold text-[#0b6a5b]">Enviar mensagem</button></div>
        <p className="mt-5 text-xs leading-5 text-[#8a9c96]">Este alerta organiza prioridade; não representa diagnóstico ou emergência.</p>
      </div>
    </div>
  );
}
