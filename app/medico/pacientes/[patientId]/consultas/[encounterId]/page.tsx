import { notFound } from 'next/navigation';
import DoctorWorkspace from '../../../../../components/doctor';
import { encounterBelongsToPatient, getDemoPatient } from '../../../../../components/demo-routes';

export default async function DoctorConsultationPage({
  params,
}: {
  params: Promise<{ patientId: string; encounterId: string }>;
}) {
  const { patientId, encounterId } = await params;
  if (!getDemoPatient(patientId) || !encounterBelongsToPatient(patientId, encounterId)) notFound();

  return (
    <DoctorWorkspace
      initialView="Pacientes"
      patientId={patientId}
      encounterId={encounterId}
      routeMode="consultation"
    />
  );
}
