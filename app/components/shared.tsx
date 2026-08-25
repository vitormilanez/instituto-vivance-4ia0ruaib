'use client';

import type { ReactNode } from 'react';

export type Role = 'doctor' | 'patient';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function RoleHeader({ role, onRoleChange }: { role: Role; onRoleChange: (role: Role) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe8e3] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1540px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#0b7b68] text-sm font-bold text-white shadow-[0_8px_24px_rgba(11,123,104,0.2)]">
            L
          </div>
          <div className="min-w-0">
            <p className="truncate text-[17px] font-bold tracking-[-0.02em]">Lume Saúde</p>
            <p className="hidden text-xs font-medium text-[#698078] sm:block">Cuidado contínuo</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex rounded-xl border border-[#dfe8e3] bg-[#f4f7f5] p-1" aria-label="Perfil de visualização">
            <button
              type="button"
              aria-pressed={role === 'doctor'}
              onClick={() => onRoleChange('doctor')}
              className={cn(
                'min-h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors sm:px-4 sm:text-sm',
                role === 'doctor' ? 'bg-white text-[#17372f] shadow-sm' : 'text-[#698078] hover:text-[#17372f]'
              )}
            >
              Médico
            </button>
            <button
              type="button"
              aria-pressed={role === 'patient'}
              onClick={() => onRoleChange('patient')}
              className={cn(
                'min-h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors sm:px-4 sm:text-sm',
                role === 'patient' ? 'bg-white text-[#17372f] shadow-sm' : 'text-[#698078] hover:text-[#17372f]'
              )}
            >
              Paciente
            </button>
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
