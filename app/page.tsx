'use client';

import { useState } from 'react';
import DoctorWorkspace from './components/doctor';
import PatientWorkspace from './components/patient';
import { CareDemoProvider } from './components/care-demo-context';
import { Role, RoleHeader } from './components/shared';

export default function Home() {
  const [role, setRole] = useState<Role>('doctor');

  return (
    <CareDemoProvider>
      <div className="min-h-screen bg-[#f4f7f5] text-[#17372f]">
        <a
          href="#main-content"
          className="sr-only z-[90] rounded-lg bg-[#17372f] px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Ir para o conteúdo
        </a>
        <RoleHeader role={role} onRoleChange={setRole} />
        {role === 'doctor' ? <DoctorWorkspace /> : <PatientWorkspace />}
      </div>
    </CareDemoProvider>
  );
}
