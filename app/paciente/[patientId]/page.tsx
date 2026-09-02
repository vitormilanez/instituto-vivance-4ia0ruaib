import PatientWorkspace from '../../components/patient-mvp';
import { getDefaultEncounterId } from '../../components/demo-routes';

export default async function PatientHomePage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  return (
    <PatientWorkspace
      patientId={patientId}
      encounterId={getDefaultEncounterId(patientId)}
      initialView="Hoje"
    />
  );
}
