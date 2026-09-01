import { notFound } from 'next/navigation';
import DoctorWorkspace from '../../../components/doctor';
import { getDemoPatient } from '../../../components/demo-routes';

export default async function DoctorPatientPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  if (!getDemoPatient(patientId)) notFound();

  return <DoctorWorkspace initialView="Pacientes" patientId={patientId} />;
}
