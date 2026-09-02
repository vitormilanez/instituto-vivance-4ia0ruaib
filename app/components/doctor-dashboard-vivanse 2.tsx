'use client';

import {
  ArrowRight,
  CalendarBlank,
  CaretRight,
  Clock,
  FileText,
  VideoCamera,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from './shared';

export type DashboardAppointment = {
  patientId: string;
  encounterId: string;
  time: string;
  patient: string;
  initials: string;
  type: string;
  status: string;
  preVisit: string;
};

export type DashboardAttention = {
  patient: string;
  detail: string;
  tag: string;
  tone: 'amber' | 'rose' | 'blue';
};

function shortAppointmentType(type: string) {
  return type.split(' · ')[0].replace('Retorno longevidade', 'Retorno');
}

function attentionAction(patient: string) {
  if (patient === 'Marina Costa') return 'Abrir pré-consulta';
  if (patient === 'Paulo Mendes') return 'Ler mensagem';
  return 'Revisar relatório';
}

export function VivanseDoctorDashboard({
  appointments,
  attentionItems,
  hasPreConsultation,
  onStartConsultation,
  onOpenPreparation,
  onOpenAttention,
}: {
  appointments: DashboardAppointment[];
  attentionItems: DashboardAttention[];
  hasPreConsultation: boolean;
  onStartConsultation: (patientId: string, encounterId: string) => void;
  onOpenPreparation: (patientId: string, encounterId: string) => void;
  onOpenAttention: (patient: string) => void;
}) {
  const nextAppointment = appointments.find((appointment) => appointment.status === 'Próxima') ?? appointments[0];
  const preConsultationLabel = hasPreConsultation ? 'Pré-consulta recebida' : 'Pré-consulta pendente';

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <article className="vivanse-panel rounded-2xl p-5 sm:p-6" aria-labelledby="next-consultation-title">
            <h2 id="next-consultation-title" className="text-sm font-bold uppercase tracking-[0.08em] text-[#334d71]">
              Próxima consulta
            </h2>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3.5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e8f0fb] text-sm font-bold text-[#0b2854]">
                    {nextAppointment.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#071a3a]">{nextAppointment.patient}</h3>
                      <span className="inline-flex rounded-full bg-[#fff0ca] px-3 py-1.5 text-xs font-semibold text-[#77500a]">
                        {preConsultationLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#61718a]">Aguardando na sala virtual</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#405675]">
                  <span className="inline-flex items-center gap-2 font-semibold text-[#071a3a]">
                    <Clock aria-hidden="true" size={20} />
                    {nextAppointment.time}
                  </span>
                  <span>Aguardando há 4 min</span>
                  <span className="inline-flex items-center gap-2">
                    <FileText aria-hidden="true" size={19} />
                    {preConsultationLabel}
                  </span>
                  <span>O atendimento manual continua disponível</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartConsultation(nextAppointment.patientId, nextAppointment.encounterId)}
                className="vivanse-primary-action inline-flex min-h-14 shrink-0 cursor-pointer items-center justify-center gap-3 rounded-xl px-6 text-sm font-bold text-white transition-colors sm:text-base"
              >
                <VideoCamera aria-hidden="true" size={21} />
                Atender agora
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>
          </article>

          <section className="vivanse-panel overflow-hidden rounded-2xl" aria-labelledby="today-appointments-title">
            <div className="flex flex-col gap-3 border-b border-[#dce5f1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-2.5">
                <h2 id="today-appointments-title" className="text-sm font-bold uppercase tracking-[0.08em] text-[#334d71]">
                  Consultas de hoje
                </h2>
                <span className="grid size-7 place-items-center rounded-full bg-[#e8f0fb] text-xs font-bold text-[#124da0]">
                  {appointments.length}
                </span>
              </div>
              <Link
                href="/medico/agenda"
                className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#cbd8e9] bg-white/75 px-3.5 text-xs font-bold text-[#124da0] transition-colors hover:bg-[#edf3fb]"
              >
                <CalendarBlank aria-hidden="true" size={18} />
                Ver agenda completa
              </Link>
            </div>

            <div role="table" aria-label="Consultas agendadas para hoje">
              <div role="row" className="hidden grid-cols-[90px_minmax(0,1fr)_180px_140px_24px] gap-3 border-b border-[#e4ebf4] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#526681] sm:grid">
                <span role="columnheader">Horário</span>
                <span role="columnheader">Paciente</span>
                <span role="columnheader">Tipo</span>
                <span role="columnheader">Situação</span>
                <span aria-hidden="true" />
              </div>

              {appointments.map((appointment) => {
                const isNext = appointment.patientId === nextAppointment.patientId;
                return (
                  <button
                    type="button"
                    role="row"
                    key={`${appointment.patientId}-${appointment.time}`}
                    onClick={() => onOpenPreparation(appointment.patientId, appointment.encounterId)}
                    className={cn(
                      'grid min-h-[62px] w-full cursor-pointer grid-cols-[58px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#e4ebf4] px-5 text-left transition-colors last:border-b-0 hover:bg-[#f4f7fc] sm:grid-cols-[90px_minmax(0,1fr)_180px_140px_24px] sm:px-6',
                      isNext && 'bg-[#eef4fc]'
                    )}
                  >
                    <span role="cell" className={cn('text-sm font-semibold tabular-nums', isNext ? 'text-[#124da0]' : 'text-[#203a5f]')}>
                      {appointment.time}
                    </span>
                    <span role="cell" className="flex min-w-0 items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8f0fb] text-[11px] font-bold text-[#183b6a]">
                        {appointment.initials}
                      </span>
                      <span className="truncate text-sm font-semibold text-[#071a3a]">{appointment.patient}</span>
                    </span>
                    <span role="cell" className="hidden text-sm text-[#405675] sm:block">{shortAppointmentType(appointment.type)}</span>
                    <span role="cell" className="inline-flex items-center justify-end gap-2 text-xs font-medium text-[#405675] sm:justify-start sm:text-sm">
                      <span aria-hidden="true" className={cn('size-2 rounded-full', isNext ? 'bg-[#155bc2]' : appointment.status === 'Concluída' ? 'bg-[#7d93ad]' : 'bg-[#aab7c6]')} />
                      <span className="hidden sm:inline">{appointment.status}</span>
                    </span>
                    <CaretRight aria-hidden="true" size={16} className="hidden text-[#7890ac] sm:block" />
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="vivanse-panel overflow-hidden rounded-2xl" aria-labelledby="attention-title">
          <div className="flex items-center justify-between border-b border-[#dce5f1] px-5 py-[18px]">
            <h2 id="attention-title" className="text-sm font-bold uppercase tracking-[0.08em] text-[#334d71]">
              Precisa de atenção
            </h2>
            <span className="grid size-7 place-items-center rounded-full bg-[#e8f0fb] text-xs font-bold text-[#124da0]">{attentionItems.length}</span>
          </div>

          <div className="divide-y divide-[#dce5f1]">
            {attentionItems.map((item, index) => (
              <button
                type="button"
                key={item.patient}
                onClick={() => onOpenAttention(item.patient)}
                className="group flex min-h-[150px] w-full cursor-pointer items-start gap-3.5 px-5 py-5 text-left transition-colors hover:bg-[#f4f7fc]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e8f0fb] text-xs font-bold text-[#173a67]">
                  {item.patient.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-base text-[#071a3a]">{item.patient}</strong>
                  <span className="mt-1.5 block text-sm leading-5 text-[#5b6d88]">{item.detail}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#124da0] group-hover:underline group-hover:underline-offset-4">
                    {attentionAction(item.patient)}
                    <CaretRight aria-hidden="true" size={15} />
                  </span>
                </span>
                <span aria-hidden="true" className={cn('mt-1 size-2 rounded-full', index === 0 ? 'bg-[#d99b2b]' : index === 1 ? 'bg-[#c65e59]' : 'bg-[#4c78b5]')} />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onOpenAttention(attentionItems[0]?.patient ?? 'Marina Costa')}
            className="flex min-h-14 w-full cursor-pointer items-center justify-between border-t border-[#dce5f1] px-5 text-sm font-semibold text-[#124da0] transition-colors hover:bg-[#f4f7fc]"
          >
            Ver todos que precisam de atenção
            <CaretRight aria-hidden="true" size={16} />
          </button>
        </aside>
      </section>

      <p className="mt-6 text-center text-xs text-[#667892]">Dados de exemplo. Não representam pacientes reais.</p>
    </div>
  );
}
