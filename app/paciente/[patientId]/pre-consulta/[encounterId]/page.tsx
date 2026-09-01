import { notFound } from 'next/navigation';
import PatientWorkspace from '../../../../components/patient';
import { encounterBelongsToPatient } from '../../../../components/demo-routes';

export default async function PatientPreConsultationPage({
  params,
}: {
  params: Promise<{ patientId: string; encounterId: string }>;
}) {
  const { patientId, encounterId } = await params;
  if (!encounterBelongsToPatient(patientId, encounterId)) notFound();

  return (
    <PatientWorkspace
      patientId={patientId}
      encounterId={encounterId}
      initialView="Consultas"
      preVisitRouteOpen
    />
  );
}
