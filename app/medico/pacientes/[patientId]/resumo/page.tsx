import { notFound } from 'next/navigation';
import { DoctorPatientResultsSummary } from '../../../../components/doctor-patient-results-summary';
import { getDemoPatient } from '../../../../components/demo-routes';

export default async function DoctorPatientResultsSummaryPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const patient = getDemoPatient(patientId);
  if (!patient) notFound();

  return <DoctorPatientResultsSummary patientId={patient.id} patientName={patient.name} />;
}
