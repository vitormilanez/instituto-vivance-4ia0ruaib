import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DEFAULT_PATIENT_ID } from '../../components/demo-routes';
import { WorkspaceShell } from '../../components/workspace-shell';

export default async function PatientLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  if (patientId !== DEFAULT_PATIENT_ID) notFound();

  return <WorkspaceShell role="patient" patientId={patientId}>{children}</WorkspaceShell>;
}
