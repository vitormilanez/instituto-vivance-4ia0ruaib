'use client';

import {
  ArrowRight,
  BellRinging,
  CalendarBlank,
  ChartLineUp,
  Check,
  Camera,
  ChatCircle,
  FileText,
  ForkKnife,
  Pill,
  Ruler,
  X,
} from '@phosphor-icons/react';
import {
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getPatientSectionHref } from './demo-routes';
import {
  type FilledPatientMvpData,
  type PatientMvpAppointmentChoice,
  type PatientMvpSessionState,
} from './patient-mvp-data';
import { cn, NavigationLink, Status } from './shared';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--patient-action)] focus-visible:ring-offset-2';
const primaryButton = cn(
  'inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--patient-action)] px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(18,77,160,0.22)] transition-colors hover:bg-[var(--patient-action-hover)] disabled:cursor-not-allowed disabled:bg-[#8a9aaf] disabled:shadow-none',
  focusRing,
);
const secondaryButton = cn(
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#b8cde8] bg-white px-4 text-sm font-bold text-[var(--patient-action)] transition-colors hover:bg-[var(--patient-action-soft)]',
  focusRing,
);

type QuickActionId = 'orientation' | 'treatment' | 'evolution' | 'measures' | 'appointment';

type QuickActionCard = {
  id: QuickActionId | 'message';
  label: string;
  detail: string;
  status: string;
  tone: 'navy' | 'amber' | 'green' | 'blue' | 'rose';
  Icon: ComponentType<{ size?: number; weight?: 'regular' | 'fill' | 'duotone' }>;
  href?: string;
  notificationCount?: number;
};

export function PatientQuickActions({
  data,
  session,
  onMarkMedicationRead,
  onAskMedicationQuestion,
  onChooseAppointment,
  onSaveMeasures,
}: {
  data: FilledPatientMvpData;
  session: PatientMvpSessionState;
  onMarkMedicationRead: () => void;
  onAskMedicationQuestion: () => void;
  onChooseAppointment: (choice: PatientMvpAppointmentChoice) => void;
  onSaveMeasures: (weight: string, waist: string) => void;
}) {
  const [openAction, setOpenAction] = useState<QuickActionId | null>(null);
  const unreadOrientation = !session.medicationRead;
  const appointmentConfirmed = session.appointmentChoice === 'confirmed';
  const appointmentAlternative = session.appointmentChoice === 'alternative';
  const latestMeasure = data.measures.at(-1)!;
  const displayedMeasures = session.measures ?? {
    weight: formatNumber(latestMeasure.weight),
    waist: formatNumber(latestMeasure.waist),
  };

  const cards: QuickActionCard[] = [
    {
      id: 'orientation',
      label: 'Orientações médicas',
      detail: unreadOrientation ? 'Há uma atualização para ler' : 'Última orientação lida',
      status: unreadOrientation ? '1 nova' : 'Lida',
      tone: unreadOrientation ? 'amber' : 'green',
      Icon: BellRinging,
      notificationCount: unreadOrientation ? 1 : undefined,
    },
    {
      id: 'message',
      label: 'Mensagem para o médico',
      detail: 'Escreva para a equipe',
      status: 'Abrir conversa',
      tone: 'navy',
      Icon: ChatCircle,
      href: getPatientSectionHref(data.patientId, 'Mensagens'),
    },
    {
      id: 'treatment',
      label: 'Tratamento',
      detail: 'Medicamentos, receita e plano',
      status: 'Ver tratamento',
      tone: 'navy',
      Icon: Pill,
    },
    {
      id: 'evolution',
      label: 'Minha evolução',
      detail: 'Relatório do último retorno',
      status: '1 relatório',
      tone: 'blue',
      Icon: ChartLineUp,
    },
    {
      id: 'measures',
      label: 'Atualizar medidas',
      detail: `${displayedMeasures.weight} kg · ${displayedMeasures.waist} cm`,
      status: 'Autorrelato',
      tone: 'green',
      Icon: Ruler,
    },
    {
      id: 'appointment',
      label: 'Próximo retorno',
      detail: `${data.appointment.date} · ${data.appointment.time}`,
      status: appointmentConfirmed ? 'Confirmado' : appointmentAlternative ? 'Em revisão' : 'Responder',
      tone: appointmentConfirmed ? 'green' : appointmentAlternative ? 'blue' : 'navy',
      Icon: CalendarBlank,
    },
  ];

  return (
    <>
      <section aria-labelledby="patient-quick-actions-title" className="mt-7">
        <h2 id="patient-quick-actions-title" className="text-xl font-semibold tracking-[-0.02em] text-[var(--patient-ink)]">
          Ações rápidas
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {cards.map((card) => (
            <QuickActionButton
              key={card.id}
              card={card}
              onClick={() => {
                if (card.id !== 'message') setOpenAction(card.id);
              }}
            />
          ))}
        </div>
      </section>

      {openAction ? (
        <QuickActionSheet
          action={openAction}
          data={data}
          session={session}
          onClose={() => setOpenAction(null)}
          onMarkMedicationRead={onMarkMedicationRead}
          onAskMedicationQuestion={onAskMedicationQuestion}
          onChooseAppointment={onChooseAppointment}
          onSaveMeasures={onSaveMeasures}
        />
      ) : null}
    </>
  );
}

function QuickActionButton({ card, onClick }: { card: QuickActionCard; onClick: () => void }) {
  const cardTones = {
    navy: 'border-[#d7e4f4] bg-[#f8fbff] hover:border-[#9bb8db] hover:bg-[#edf3fb]',
    amber: 'border-[#efcf8e] bg-[#fff9ed] hover:border-[#d8ad5f] hover:bg-[#fff4dd]',
    green: 'border-[#c7e3da] bg-[#f7fbf9] hover:border-[#8fc7b7] hover:bg-[#edf8f3]',
    blue: 'border-[#c9dbf6] bg-[#eef5ff] hover:border-[#8fb5e7] hover:bg-[#e3efff]',
    rose: 'border-[#efc9c5] bg-[#fff8f7] hover:border-[#dfaaa3] hover:bg-[#fff1ef]',
  };
  const iconTones = {
    navy: 'bg-[#e8f0fb] text-[#124da0]',
    amber: 'bg-[#fff0ca] text-[var(--patient-attention)]',
    green: 'bg-[#e7f4ef] text-[#0b6a5b]',
    blue: 'bg-[#dceafe] text-[#0d4fba]',
    rose: 'bg-[#fdecea] text-[#9c453f]',
  };
  const statusTones = {
    navy: 'text-[var(--patient-action)]',
    amber: 'text-[var(--patient-attention)]',
    green: 'text-[#17624e]',
    blue: 'text-[#0d4fba]',
    rose: 'text-[#9c453f]',
  };
  const Icon = card.Icon;
  const className = cn(
    'group relative flex min-h-36 flex-col items-start rounded-2xl border p-4 text-left transition-[transform,background-color,border-color,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(7,26,58,0.08)] active:translate-y-0',
    cardTones[card.tone],
    focusRing,
  );
  const content = (
    <>
      <span className={cn('grid size-10 place-items-center rounded-xl', iconTones[card.tone])}>
        <Icon aria-hidden="true" size={21} weight="duotone" />
      </span>
      {card.notificationCount ? (
        <span aria-label={`${card.notificationCount} nova notificação`} className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-[#b46d11] text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(139,90,6,0.26)]">
          {card.notificationCount}
        </span>
      ) : null}
      <span className="mt-4 text-sm font-bold leading-5 text-[var(--patient-ink)]">{card.label}</span>
      <span className="mt-1 text-xs leading-5 text-[var(--patient-subtle)]">{card.detail}</span>
      <span className={cn('mt-auto pt-3 text-[11px] font-bold', statusTones[card.tone])}>
        {card.status}
      </span>
      <ArrowRight aria-hidden="true" size={15} weight="bold" className="absolute bottom-4 right-4 text-[#8da5c3] transition-transform group-hover:translate-x-0.5" />
    </>
  );

  if (card.href) {
    return (
      <NavigationLink href={card.href} className={className}>
        {content}
      </NavigationLink>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}

function QuickActionSheet({
  action,
  data,
  session,
  onClose,
  onMarkMedicationRead,
  onAskMedicationQuestion,
  onChooseAppointment,
  onSaveMeasures,
}: {
  action: QuickActionId;
  data: FilledPatientMvpData;
  session: PatientMvpSessionState;
  onClose: () => void;
  onMarkMedicationRead: () => void;
  onAskMedicationQuestion: () => void;
  onChooseAppointment: (choice: PatientMvpAppointmentChoice) => void;
  onSaveMeasures: (weight: string, waist: string) => void;
}) {
  const label = {
    orientation: 'Nova orientação médica',
    treatment: 'Tratamento',
    evolution: 'Evolução',
    measures: 'Atualizar medidas',
    appointment: 'Próximo retorno',
  }[action];

  return (
    <PatientActionDialog label={label} onClose={onClose}>
      {action === 'orientation' ? (
        <OrientationPanel
          data={data}
          read={session.medicationRead}
          onRead={() => {
            onMarkMedicationRead();
            onClose();
          }}
          onQuestion={() => {
            onAskMedicationQuestion();
            onClose();
          }}
        />
      ) : null}
      {action === 'treatment' ? <TreatmentPanel data={data} /> : null}
      {action === 'evolution' ? <EvolutionPanel data={data} /> : null}
      {action === 'measures' ? <MeasuresPanel data={data} session={session} onClose={onClose} onSave={onSaveMeasures} /> : null}
      {action === 'appointment' ? (
        <AppointmentPanel
          data={data}
          choice={session.appointmentChoice}
          onChoose={(choice) => {
            onChooseAppointment(choice);
            onClose();
          }}
        />
      ) : null}
    </PatientActionDialog>
  );
}

export function PatientMealAnalysisDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (description: string, attachmentName: string | null) => void;
}) {
  return (
    <PatientActionDialog label="Analisar refeição" onClose={onClose}>
      <MealAnalysisPanel onClose={onClose} onSave={onSave} />
    </PatientActionDialog>
  );
}

function PatientActionDialog({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center px-3 pb-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={`Fechar ${label}`}
        onClick={onClose}
        className="absolute inset-0 bg-[#071a3a]/45 backdrop-blur-[2px]"
      />
      <section
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-quick-action-title"
        onKeyDown={(event) => {
          if (event.key === 'Escape') onClose();
        }}
        className="relative z-10 max-h-[min(780px,calc(100vh-24px))] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-white/70 bg-white shadow-[0_28px_76px_rgba(3,19,45,0.3)]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#e4ece8] bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <h2 id="patient-quick-action-title" className="text-xl font-semibold tracking-[-0.02em] text-[#17372f]">{label}</h2>
          <button type="button" onClick={onClose} className={cn('grid size-11 place-items-center rounded-xl text-[#526a62] hover:bg-[#edf7f4]', focusRing)} aria-label="Fechar">
            <X aria-hidden="true" size={21} />
          </button>
        </div>

        <div className="p-5 sm:p-6">{children}</div>
      </section>
    </div>
  );
}

function OrientationPanel({
  data,
  read,
  onRead,
  onQuestion,
}: {
  data: FilledPatientMvpData;
  read: boolean;
  onRead: () => void;
  onQuestion: () => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-[#526a62]">Publicada por {data.doctorName}.</p>
        <Status tone={read ? 'green' : 'amber'}>{read ? 'Leitura registrada' : 'Não visualizada'}</Status>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoCard label="Orientação anterior" tone="muted">{data.medication.previousOrientation}</InfoCard>
        <InfoCard label="Nova orientação aprovada" tone="green">{data.medication.newOrientation}</InfoCard>
      </div>
      <p className="mt-4 rounded-xl bg-[#f7faf8] p-4 text-xs leading-5 text-[#526a62]">Início informado: {data.medication.startsAt}. A IA não criou, alterou ou publicou esta orientação.</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onRead} disabled={read} className={primaryButton}>
          <Check aria-hidden="true" size={18} weight="bold" />
          {read ? 'Leitura registrada' : 'Li e entendi'}
        </button>
        <button type="button" onClick={onQuestion} className={secondaryButton}>Tenho uma dúvida</button>
      </div>
      <p className="mt-4 text-xs leading-5 text-[#60766f]">A leitura é apenas uma confirmação de visualização; não confirma uso do medicamento.</p>
    </div>
  );
}

function MealAnalysisPanel({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (description: string, attachmentName: string | null) => void;
}) {
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const canSubmit = Boolean(description.trim() || attachmentName);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSave(description, attachmentName);
    onClose();
  };

  return (
    <form onSubmit={submit}>
      <div className="rounded-2xl border border-[#cce3da] bg-[#f7fbf9] p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e7f4ef] text-[#0b6a5b]">
            <ForkKnife aria-hidden="true" size={21} weight="duotone" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#17372f]">Registre do seu jeito</h3>
            <p className="mt-1 text-sm leading-6 text-[#526a62]">Envie uma foto ou descreva a refeição. A IA pode organizar o registro para revisão; ela não cria orientação alimentar.</p>
          </div>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="text-xs font-bold text-[#405d54]">Foto da refeição <span className="font-medium text-[#60766f]">(opcional)</span></span>
        <span className="mt-2 flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#9fc9bd] bg-white px-4 text-sm font-semibold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4]">
          <Camera aria-hidden="true" size={18} weight="duotone" />
          {attachmentName ?? 'Escolher foto'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? null)}
          />
        </span>
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-bold text-[#405d54]">Descrição <span className="font-medium text-[#60766f]">(opcional)</span></span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ex.: almoço às 13h, arroz, feijão e frango."
          rows={4}
          className={cn('mt-2 w-full resize-y rounded-xl border border-[#c9d6d1] bg-white px-4 py-3 text-sm leading-6 text-[#17372f] placeholder:text-[#91a6a0]', focusRing)}
        />
      </label>

      <button type="submit" disabled={!canSubmit} className={cn(primaryButton, 'mt-5')}>
        Enviar registro
        <ArrowRight aria-hidden="true" size={17} weight="bold" />
      </button>
      <p className="mt-4 text-xs leading-5 text-[#60766f]">O texto e a foto permanecem como registro original. O médico decide se algo precisa virar orientação.</p>
    </form>
  );
}

function TreatmentPanel({ data }: { data: FilledPatientMvpData }) {
  return (
    <div>
      <p className="text-sm leading-6 text-[#526a62]">Informações publicadas pela equipe. Para qualquer dúvida, use Conversas.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoCard label="Medicamento atual" tone="navy">
          <strong className="block text-sm text-[#17372f]">{data.medication.name}</strong>
          <span className="mt-1 block text-sm leading-6">Orientação anterior: {data.medication.previousOrientation}</span>
        </InfoCard>
        <InfoCard label="Nova orientação publicada" tone="green">
          <strong className="block text-sm text-[#17372f]">{data.medication.name}</strong>
          <span className="mt-1 block text-sm leading-6">{data.medication.newOrientation}</span>
          <span className="mt-2 block text-xs leading-5 text-[#526a62]">{data.medication.startsAt}</span>
        </InfoCard>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <InfoCard label="Receita" tone="amber">
          Vence em {data.medication.prescriptionExpiresIn}. O aviso também fica visível para o médico; não há renovação automática neste mock.
        </InfoCard>
        <InfoCard label="Medicamento anterior" tone="muted">{data.medication.history}</InfoCard>
      </div>
      <div className="mt-5 rounded-2xl border border-[#d9e5e0] bg-[#f7faf8] p-4">
        <div className="flex items-center gap-2"><FileText aria-hidden="true" size={20} className="text-[#0b6a5b]" /><h3 className="text-sm font-bold text-[#17372f]">Recomendações publicadas</h3></div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#405d54]">
          {data.foodPlan.priorities.map((priority) => <li key={priority} className="flex gap-2"><Check aria-hidden="true" size={17} weight="bold" className="mt-0.5 shrink-0 text-[#0b7b68]" />{priority}</li>)}
        </ul>
        <p className="mt-4 border-t border-[#d9e5e0] pt-3 text-xs leading-5 text-[#60766f]">Plano alimentar revisado por {data.foodPlan.approvedBy} em {data.foodPlan.approvedAt}.</p>
      </div>
    </div>
  );
}

function EvolutionPanel({ data }: { data: FilledPatientMvpData }) {
  const first = data.measures[0];
  const latest = data.measures.at(-1)!;
  return (
    <div>
      <div className="rounded-2xl border border-[#d7e4f4] bg-[#f7faff] p-4">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e9f0f9] text-[#124da0]"><FileText aria-hidden="true" size={21} weight="duotone" /></span><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#355b91]">Relatório de consulta</p><h3 className="mt-1 text-base font-bold text-[#17372f]">Retorno de acompanhamento · {data.latestConsultationAt}</h3><p className="mt-2 text-sm leading-6 text-[#526a62]">Resumo demonstrativo publicado pelo médico para você rever quando quiser.</p></div></div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoCard label="Peso registrado" tone="muted">{formatNumber(first.weight)} kg → {formatNumber(latest.weight)} kg</InfoCard>
        <InfoCard label="Cintura registrada" tone="muted">{formatNumber(first.waist)} cm → {formatNumber(latest.waist)} cm</InfoCard>
      </dl>
      <p className="mt-4 text-xs leading-5 text-[#60766f]">Os dados mostram registros com data e origem. Eles não definem diagnóstico, sucesso ou falha isoladamente.</p>
      <NavigationLink href={getPatientSectionHref(data.patientId, 'Evolução')} className={cn(secondaryButton, 'mt-5')}>
        Abrir evolução completa
        <ArrowRight aria-hidden="true" size={17} weight="bold" />
      </NavigationLink>
    </div>
  );
}

function MeasuresPanel({
  data,
  session,
  onSave,
  onClose,
}: {
  data: FilledPatientMvpData;
  session: PatientMvpSessionState;
  onSave: (weight: string, waist: string) => void;
  onClose: () => void;
}) {
  const latest = data.measures.at(-1)!;
  const [weight, setWeight] = useState(session.measures?.weight ?? formatNumber(latest.weight));
  const [waist, setWaist] = useState(session.measures?.waist ?? formatNumber(latest.waist));
  const valid = Boolean(weight.trim() && waist.trim());

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid) return;
    onSave(weight.trim(), waist.trim());
    onClose();
  };

  return (
    <form onSubmit={submit}>
      <p className="text-sm leading-6 text-[#526a62]">Registre peso e cintura. Esses dados entram como autorrelato e permanecem separados da revisão clínica.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="text-xs font-bold text-[#405d54]">Peso (kg)</span><input inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} className={cn('mt-2 min-h-12 w-full rounded-xl border border-[#c9d6d1] bg-white px-4 text-base font-semibold text-[#17372f]', focusRing)} /></label>
        <label className="block"><span className="text-xs font-bold text-[#405d54]">Cintura (cm)</span><input inputMode="decimal" value={waist} onChange={(event) => setWaist(event.target.value)} className={cn('mt-2 min-h-12 w-full rounded-xl border border-[#c9d6d1] bg-white px-4 text-base font-semibold text-[#17372f]', focusRing)} /></label>
      </div>
      <p className="mt-4 rounded-xl bg-[#f7faf8] p-4 text-xs leading-5 text-[#60766f]">Use a técnica combinada com o médico. Este mock não interpreta o valor nem substitui uma avaliação clínica.</p>
      <button type="submit" disabled={!valid} className={cn(primaryButton, 'mt-5')}>Salvar medidas</button>
    </form>
  );
}

function AppointmentPanel({
  data,
  choice,
  onChoose,
}: {
  data: FilledPatientMvpData;
  choice: PatientMvpAppointmentChoice;
  onChoose: (choice: PatientMvpAppointmentChoice) => void;
}) {
  const status = choice === 'confirmed' ? 'Confirmado' : choice === 'alternative' ? 'Outras opções solicitadas' : 'Aguardando sua resposta';
  return (
    <div>
      <p className="text-sm leading-6 text-[#526a62]">{data.appointment.purpose} com {data.doctorName}.</p>
      <div className="mt-5 rounded-2xl border border-[#d9e5e0] bg-[#f7faf8] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#60766f]">Horário proposto</p>
        <p className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#17372f]">{data.appointment.date}</p>
        <p className="mt-1 text-base font-semibold text-[#0b6a5b]">{data.appointment.time}</p>
        <div className="mt-4"><Status tone={choice === 'confirmed' ? 'green' : choice === 'alternative' ? 'blue' : 'amber'}>{status}</Status></div>
      </div>
      {choice === 'pending' ? <div className="mt-5 flex flex-col gap-2 sm:flex-row"><button type="button" onClick={() => onChoose('confirmed')} className={primaryButton}>Confirmar horário</button><button type="button" onClick={() => onChoose('alternative')} className={secondaryButton}>Pedir outras opções</button></div> : null}
      <p className="mt-4 text-xs leading-5 text-[#60766f]">Agenda e notificações são simuladas. Sua resposta chega à área médica deste mock.</p>
    </div>
  );
}

function InfoCard({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'muted' | 'green' | 'navy' | 'amber';
  children: ReactNode;
}) {
  const tones = {
    muted: 'border-[#d9e5e0] bg-[#f7faf8] text-[#405d54]',
    green: 'border-[#9fc9bd] bg-[#edf7f4] text-[#17372f]',
    navy: 'border-[#d7e4f4] bg-[#f7faff] text-[#17372f]',
    amber: 'border-[#ead9a7] bg-[#fffaf0] text-[#5d430d]',
  };
  return <div className={cn('rounded-xl border p-4 text-sm leading-6', tones[tone])}><p className="text-xs font-bold text-[#60766f]">{label}</p><div className="mt-2">{children}</div></div>;
}

function formatNumber(value: number) {
  return String(value).replace('.', ',');
}
