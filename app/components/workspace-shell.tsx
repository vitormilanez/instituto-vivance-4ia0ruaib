import type { ReactNode } from 'react';
import { DEFAULT_PATIENT_ID } from './demo-routes';
import { RoleHeader, type Role } from './shared';

export function WorkspaceShell({
  role,
  patientId = DEFAULT_PATIENT_ID,
  children,
}: {
  role: Role;
  patientId?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f7f5] text-[#17372f]">
      <a
        href="#main-content"
        className="sr-only z-[90] rounded-lg bg-[#17372f] px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ir para o conteúdo
      </a>
      <RoleHeader role={role} patientId={patientId} />
      {children}
    </div>
  );
}
