'use client';

import { ArrowsLeftRight, Bell, CaretDown, CheckCircle, List, UsersThree, WarningCircle } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { DEFAULT_PATIENT_ID, doctorDemoCohortSummary, doctorNavigation } from './demo-routes';

export type Role = 'doctor' | 'patient';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function RoleSwitcher({
  role,
  patientId,
  className,
}: {
  role: Role;
  patientId: string;
  className?: string;
}) {
  const linkClass = 'flex min-h-10 items-center justify-center rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2 sm:px-3.5 sm:text-sm';
  const patientLabel = role === 'doctor' ? 'Marina demo' : 'Paciente';

  return (
    <nav
      aria-label="Alternar entre área médica e área do paciente"
      className={cn('rounded-xl border border-[#dbe4f0] bg-[#edf3fb]/82 p-1 backdrop-blur', className)}
    >
      <Link
        href="/medico"
        aria-current={role === 'doctor' ? 'page' : undefined}
        className={cn(
          linkClass,
          role === 'doctor'
            ? 'bg-[#03132d] text-white shadow-[0_5px_14px_rgba(3,19,45,0.16)]'
            : 'text-[#405675] hover:bg-white/75 hover:text-[#071a3a]',
        )}
      >
        Médico
      </Link>
      <Link
        href={`/paciente/${patientId}`}
        aria-label={role === 'doctor' ? 'Abrir demonstração da paciente Marina Costa' : undefined}
        aria-current={role === 'patient' ? 'page' : undefined}
        className={cn(
          linkClass,
          role === 'patient'
            ? 'bg-[#03132d] text-white shadow-[0_5px_14px_rgba(3,19,45,0.16)]'
            : 'text-[#405675] hover:bg-white/75 hover:text-[#071a3a]',
        )}
      >
        {patientLabel}
      </Link>
    </nav>
  );
}

export function RoleHeader({ role, patientId = DEFAULT_PATIENT_ID }: { role: Role; patientId?: string }) {
  if (role === 'doctor') {
    return (
      <header className="sticky top-0 z-40">
        <div className="grid h-[76px] lg:grid-cols-[252px_minmax(0,1fr)]">
          <Link href="/medico" aria-label="VIVANSE — início" className="vivanse-sidebar-surface hidden items-center px-5 lg:flex">
            <Image
              src="/brand/vivanse-horizontal-transparent.png"
              alt="VIVANSE"
              width={180}
              height={60}
              priority
              className="h-auto w-[180px]"
            />
          </Link>

          <div className="vivanse-glass-bar flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/medico" aria-label="VIVANSE — início" className="flex items-center gap-2.5 lg:hidden">
              <Image src="/brand/vivanse-mark.png" alt="" width={40} height={40} className="size-10 rounded-xl" />
              <span className="text-sm font-semibold tracking-[0.22em] text-[#071a3a]">VIVANSE</span>
            </Link>

            <Link
              href="/medico/pacientes"
              aria-label={`${doctorDemoCohortSummary.activePatients} pacientes em acompanhamento, ${doctorDemoCohortSummary.checkInsOnTime} com check-ins em dia e ${doctorDemoCohortSummary.checkInsToReview} check-ins para revisar. Abrir pacientes.`}
              className="hidden min-h-12 items-center overflow-hidden rounded-xl border border-[#dbe4f0] bg-white/72 text-[#405675] shadow-[0_8px_24px_rgba(3,19,45,0.05)] backdrop-blur transition-colors hover:border-[#a9bfdb] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2 xl:flex"
            >
              <span className="flex items-center gap-2.5 px-4">
                <UsersThree aria-hidden="true" size={19} className="text-[#124da0]" />
                <strong className="text-sm tabular-nums text-[#071a3a]">{doctorDemoCohortSummary.activePatients}</strong>
                <span className="text-xs font-medium">acompanhados</span>
              </span>
              <span className="flex items-center gap-2.5 border-l border-[#dbe4f0] px-4">
                <CheckCircle aria-hidden="true" size={18} className="text-[#124da0]" />
                <strong className="text-sm tabular-nums text-[#071a3a]">{doctorDemoCohortSummary.checkInsOnTime}</strong>
                <span className="text-xs font-medium">check-ins em dia</span>
              </span>
              <span className="flex items-center gap-2.5 border-l border-[#dbe4f0] px-4">
                <WarningCircle aria-hidden="true" size={18} className="text-[#9b6a12]" />
                <strong className="text-sm tabular-nums text-[#071a3a]">{doctorDemoCohortSummary.checkInsToReview}</strong>
                <span className="text-xs font-medium">check-ins para revisar</span>
              </span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <RoleSwitcher role={role} patientId={patientId} className="hidden items-center md:flex" />
              <Link
                href={`/paciente/${patientId}`}
                aria-label="Abrir demonstração da paciente Marina Costa"
                className="flex min-h-11 items-center gap-2 rounded-xl border border-[#cbd9ea] bg-white/70 px-3 text-xs font-bold text-[#124da0] backdrop-blur transition-colors hover:bg-[#edf3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2 md:hidden"
              >
                <ArrowsLeftRight aria-hidden="true" size={17} weight="bold" />
                Marina
              </Link>
              <details className="relative lg:hidden">
                <summary aria-label="Abrir menu principal" className="grid size-11 cursor-pointer list-none place-items-center rounded-xl text-[#0b2854] transition-colors hover:bg-[#edf3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c5ba8] focus-visible:ring-offset-2">
                  <List aria-hidden="true" size={22} weight="bold" />
                </summary>
                <nav aria-label="Menu principal" className="vivanse-glass-menu absolute right-0 top-12 z-50 w-56 rounded-xl p-2 shadow-[0_20px_48px_rgba(3,19,45,0.3)]">
                  {doctorNavigation.map((item) => (
                    <Link key={item.href} href={item.href} className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79a8df]">
                      {item.label === 'Visão geral' ? 'Hoje' : item.label}
                    </Link>
                  ))}
                  <div className="mt-2 border-t border-white/12 pt-2">
                    <Link href="/medico/mensagens" className="flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79a8df]">
                      <Bell aria-hidden="true" size={18} />
                      3 notificações
                    </Link>
                    <div className="flex min-h-12 items-center gap-2.5 px-3 text-white/80" aria-label="Perfil atual: Dr. Guilherme Martins, médico">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-white">GM</span>
                      <span><strong className="block text-xs text-white">Dr. Guilherme Martins</strong><span className="block text-[11px]">Médico</span></span>
                    </div>
                  </div>
                </nav>
              </details>
              <button
                type="button"
                aria-label="Abrir notificações"
                className="relative hidden size-11 cursor-pointer place-items-center rounded-xl text-[#0b2854] transition-colors hover:bg-[#edf3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c5ba8] focus-visible:ring-offset-2 sm:grid"
              >
                <Bell aria-hidden="true" size={21} weight="regular" />
                <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-[#124da0] text-[9px] font-bold text-white">3</span>
              </button>
              <span aria-hidden="true" className="hidden h-8 w-px bg-[#dce5f2] min-[1360px]:block" />
              <button
                type="button"
                aria-label="Abrir perfil do Dr. Guilherme Martins"
                className="hidden min-h-11 cursor-pointer items-center gap-3 rounded-xl px-1.5 text-left transition-colors hover:bg-[#edf3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c5ba8] focus-visible:ring-offset-2 sm:flex"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#061b3e] text-xs font-bold text-white">GM</span>
                <span className="hidden min-[1360px]:block">
                  <strong className="block text-sm text-[#071a3a]">Dr. Guilherme Martins</strong>
                  <span className="block text-xs text-[#61718a]">Médico</span>
                </span>
                <CaretDown aria-hidden="true" size={15} className="hidden text-[#50627f] min-[1360px]:block" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe8e3] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1540px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Image src="/brand/vivanse-mark.png" alt="" width={40} height={40} className="size-10 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <p className="truncate text-[17px] font-bold tracking-[0.12em]">VIVANSE</p>
            <p className="hidden text-xs font-medium text-[#698078] sm:block">Cuidado contínuo</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <RoleSwitcher role={role} patientId={patientId} className="flex items-center" />
          <div className="hidden size-10 place-items-center rounded-full bg-[#d9eee8] text-sm font-bold text-[#0b6a5b] sm:grid">
            {role === 'doctor' ? 'GM' : 'MC'}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Status({
  children,
  tone = 'green',
}: {
  children: ReactNode;
  tone?: 'green' | 'amber' | 'rose' | 'blue' | 'gray';
}) {
  const tones = {
    green: 'bg-[#e7f4ef] text-[#17624e]',
    amber: 'bg-[#fff0ca] text-[#77500a]',
    rose: 'bg-[#fdecea] text-[#9c453f]',
    blue: 'bg-[#edf3fb] text-[#124da0]',
    gray: 'bg-[#eef2f7] text-[#50627f]',
  };
  return <span className={cn('inline-flex rounded-full px-3 py-1.5 text-xs font-bold', tones[tone])}>{children}</span>;
}

export function Heading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#15342c]">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#60766f]">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Toast({ text, patient = false }: { text: string; patient?: boolean }) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed left-1/2 z-[80] -translate-x-1/2',
        patient ? 'bottom-24 lg:bottom-5' : 'bottom-5'
      )}
      aria-live="polite"
    >
      {text && <div className="rounded-xl bg-[#03132d] px-4 py-3 text-sm font-semibold text-white shadow-2xl">{text}</div>}
    </div>
  );
}
