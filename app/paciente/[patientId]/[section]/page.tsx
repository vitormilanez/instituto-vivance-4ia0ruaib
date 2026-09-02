import { notFound } from 'next/navigation';
import PatientWorkspace from '../../../components/patient-mvp';
import { getDefaultEncounterId, getPatientView } from '../../../components/demo-routes';

export default async function PatientSectionPage({
  params,
}: {
  params: Promise<{ patientId: string; section: string }>;
}) {
  const { patientId, section } = await params;
  const view = getPatientView(section);
  if (!view || view === 'Hoje') notFound();

  return (
    <PatientWorkspace
      patientId={patientId}
      encounterId={getDefaultEncounterId(patientId)}
      initialView={view}
    />
  );
}
