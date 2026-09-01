import type { ReactNode } from 'react';
import { WorkspaceShell } from '../components/workspace-shell';

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return <WorkspaceShell role="doctor">{children}</WorkspaceShell>;
}
