'use client';

import type { ReactNode } from 'react';
import { cn } from './shared';

export type ClinicalLayer = 'relato' | 'fato' | 'sintese_ia' | 'decisao_medica';

const clinicalLayers: Record<ClinicalLayer, { label: string; className: string; dot: string }> = {
  relato: {
    label: 'Relato original',
    className: 'border-[#bfd4cd] bg-[#f4f7f5] text-[#405d54]',
    dot: 'bg-[#789087]',
  },
  fato: {
    label: 'Dado observado',
    className: 'border-[#b9d8cf] bg-[#edf7f4] text-[#0b6a5b]',
    dot: 'bg-[#0b7b68]',
  },
  sintese_ia: {
    label: 'Rascunho assistido',
    className: 'border-[#c9d8ec] bg-[#edf3fb] text-[#456b9c]',
    dot: 'bg-[#6997d4]',
  },
  decisao_medica: {
    label: 'Decisão médica aprovada',
    className: 'border-[#ead3a6] bg-[#fff8e9] text-[#825b0b]',
    dot: 'bg-[#d39439]',
  },
};

export function ClinicalLayerBadge({ layer }: { layer: ClinicalLayer }) {
  const config = clinicalLayers[layer];

  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold',
        config.className,
      )}
    >
      <span aria-hidden="true" className={cn('size-2 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

export function AiDraftBadge({ children = 'Simulação de rascunho — requer revisão médica' }: { children?: ReactNode }) {
  return (
    <span
      role="status"
      className="inline-flex min-h-7 items-center gap-2 rounded-full border border-[#c9d8ec] bg-[#edf3fb] px-3 py-1 text-xs font-bold text-[#456b9c]"
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-[#6997d4]" />
      {children}
    </span>
  );
}

export function SimulationDisclaimer({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#d7e3df] bg-[#f8faf9] p-4 text-sm leading-6 text-[#526a62]">
      <strong className="text-[#17372f]">Protótipo demonstrativo.</strong> {children}
    </div>
  );
}
