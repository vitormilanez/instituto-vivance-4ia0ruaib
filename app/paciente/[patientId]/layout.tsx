import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { DEFAULT_PATIENT_ID } from '../../components/demo-routes';
import { WorkspaceShell } from '../../components/workspace-shell';
import { getCurrentUser, homeForUser } from '../../lib/auth';

export const dynamic = 'force-dynamic';

export default async function PatientLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  if (patientId !== DEFAULT_PATIENT_ID && patientId !== 'pac-demo-006') notFound();

  const user = await getCurrentUser();
  if (!user) redirect('/');
  if (user.role !== 'patient') redirect(homeForUser(user));
  if (user.patientId !== patientId) redirect(homeForUser(user));

  return <WorkspaceShell role="patient" patientId={patientId}>{children}</WorkspaceShell>;
}
