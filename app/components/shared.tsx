'use client';

import { Bell, CaretDown } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { DEFAULT_PATIENT_ID } from './demo-routes';

export type Role = 'doctor' | 'patient';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
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

          <div className="vivanse-glass-bar flex items-center justify-between gap-4 px-4 sm:px-6 lg:justify-end lg:px-8">
            <Link href="/medico" aria-label="VIVANSE — início" className="flex items-center gap-2.5 lg:hidden">
              <Image src="/brand/vivanse-mark.png" alt="" width={40} height={40} className="size-10 rounded-xl" />
              <span className="text-sm font-semibold tracking-[0.22em] text-[#071a3a]">VIVANSE</span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                aria-label="Abrir notificações"
                className="relative grid size-11 cursor-pointer place-items-center rounded-xl text-[#0b2854] transition-colors hover:bg-[#edf3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c5ba8] focus-visible:ring-offset-2"
              >
                <Bell aria-hidden="true" size={21} weight="regular" />
                <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-[#124da0] text-[9px] font-bold text-white">3</span>
              </button>
              <span aria-hidden="true" className="hidden h-8 w-px bg-[#dce5f2] sm:block" />
              <button
                type="button"
                aria-label="Abrir perfil do Dr. Guilherme Martins"
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-1.5 text-left transition-colors hover:bg-[#edf3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c5ba8] focus-visible:ring-offset-2"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#061b3e] text-xs font-bold text-white">GM</span>
                <span className="hidden sm:block">
                  <strong className="block text-sm text-[#071a3a]">Dr. Guilherme Martins</strong>
                  <span className="block text-xs text-[#61718a]">Médico</span>
                </span>
                <CaretDown aria-hidden="true" size={15} className="hidden text-[#50627f] sm:block" />
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
          <div className="flex rounded-xl border border-[#dfe8e3] bg-[#f4f7f5] p-1" aria-label="Perfil de visualização">
            <Link
              href="/medico"
              aria-current={role === 'doctor' ? 'page' : undefined}
              className={cn(
                'flex min-h-10 items-center rounded-lg px-3 text-xs font-semibold transition-colors sm:px-4 sm:text-sm',
                role === 'doctor' ? 'bg-white text-[#17372f] shadow-sm' : 'text-[#698078] hover:text-[#17372f]'
              )}
            >
              Médico
            </Link>
            <Link
              href={`/paciente/${patientId}`}
              aria-current={role === 'patient' ? 'page' : undefined}
              className={cn(
                'flex min-h-10 items-center rounded-lg px-3 text-xs font-semibold transition-colors sm:px-4 sm:text-sm',
                role === 'patient' ? 'bg-white text-[#17372f] shadow-sm' : 'text-[#698078] hover:text-[#17372f]'
              )}
            >
              Paciente
            </Link>
          </div>
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
    green: 'bg-[#e8f4f0] text-[#0b6a5b]',
    amber: 'bg-[#fff4d8] text-[#825b0b]',
    rose: 'bg-[#fdecea] text-[#9c453f]',
    blue: 'bg-[#edf3fb] text-[#456b9c]',
    gray: 'bg-[#f1f5f3] text-[#526a62]',
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
      {text && <div className="rounded-xl bg-[#17372f] px-4 py-3 text-sm font-semibold text-white shadow-2xl">{text}</div>}
    </div>
  );
}
