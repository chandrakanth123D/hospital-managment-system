import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { DoctorDashboardView } from './components/views/DoctorDashboardView';
import { PatientDashboardView } from './components/views/PatientDashboardView';
import { ReceptionistDashboardView } from './components/views/ReceptionistDashboardView';
import { NurseDashboardView } from './components/views/NurseDashboardView';
import { PharmacyDashboardView } from './components/views/PharmacyDashboardView';
import { LabDashboardView } from './components/views/LabDashboardView';
import { AccountantDashboardView } from './components/views/AccountantDashboardView';
import { AppointmentsView } from './components/views/AppointmentsView';
import { InpatientView } from './components/views/InpatientView';
import { EMRView } from './components/views/EMRView';
import { DoctorsView } from './components/views/DoctorsView';
import { PatientsView } from './components/views/PatientsView';
import { ReportsView } from './components/views/ReportsView';
import { AcademicHubModal } from './components/academic/AcademicHubModal';

const HospitalAppContent: React.FC = () => {
  const { currentRole } = useHospital();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isAcademicHubOpen, setIsAcademicHubOpen] = useState(false);
  const [academicHubInitialTab, setAcademicHubInitialTab] = useState<string>('code');

  const handleOpenAcademicHub = (initialTab: string = 'code') => {
    setAcademicHubInitialTab(initialTab);
    setIsAcademicHubOpen(true);
  };

  // Render role-specific primary dashboard
  const renderRoleDashboard = () => {
    switch (currentRole) {
      case 'ADMIN':
        return <AdminDashboardView />;
      case 'DOCTOR':
        return <DoctorDashboardView />;
      case 'PATIENT':
        return <PatientDashboardView />;
      case 'RECEPTIONIST':
        return <ReceptionistDashboardView />;
      case 'NURSE':
        return <NurseDashboardView />;
      case 'PHARMACIST':
        return <PharmacyDashboardView />;
      case 'LAB_TECHNICIAN':
        return <LabDashboardView />;
      case 'ACCOUNTANT':
        return <AccountantDashboardView />;
      default:
        return <AdminDashboardView />;
    }
  };

  // Render the selected view
  const renderViewContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderRoleDashboard();
      case 'appointments':
        return <AppointmentsView />;
      case 'patients':
        return <PatientsView />;
      case 'doctors':
        return <DoctorsView />;
      case 'inpatient':
        return <InpatientView />;
      case 'emr':
        return <EMRView />;
      case 'pharmacy':
        return <PharmacyDashboardView />;
      case 'laboratory':
        return <LabDashboardView />;
      case 'billing':
        return <AccountantDashboardView />;
      case 'reports':
        return <ReportsView />;
      default:
        return renderRoleDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onOpenAcademicHub={handleOpenAcademicHub}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenAcademicHub={handleOpenAcademicHub}
        />

        {/* Center Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderViewContent()}
        </main>
      </div>

      {/* Comprehensive Academic Hub Modal (Spring Boot Code, MySQL ER, Postman, Tests, Viva Q&A) */}
      <AcademicHubModal
        isOpen={isAcademicHubOpen}
        onClose={() => setIsAcademicHubOpen(false)}
        initialTab={academicHubInitialTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <HospitalAppContent />
    </HospitalProvider>
  );
}
