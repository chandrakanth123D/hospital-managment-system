import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment, PrescriptionItem } from '../../types/hospital';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  FileText,
  Pill,
  Microscope,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Activity,
  HeartPulse,
  Eye,
  CalendarCheck
} from 'lucide-react';

export const DoctorDashboardView: React.FC = () => {
  const {
    currentUser,
    doctors,
    patients,
    appointments,
    medicalRecords,
    recordConsultation,
    updateAppointmentStatus,
    labTests
  } = useHospital();

  // Find active doctor entity
  const currentDoctor = doctors.find(d => d.userId === currentUser?.id) || doctors[0];

  const doctorAppointments = appointments.filter(a => a.doctorId === currentDoctor.id);
  const todayApts = doctorAppointments.filter(a => a.date === '2026-09-25');
  const pendingApts = doctorAppointments.filter(a => a.status === 'CONFIRMED' || a.status === 'BOOKED');
  const completedApts = doctorAppointments.filter(a => a.status === 'COMPLETED');

  // Consultation Modal State
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-25');

  // Vitals State
  const [vitals, setVitals] = useState({
    temperature: 98.6,
    bloodPressure: '120/80',
    pulse: 76,
    spo2: 98,
    weight: 70
  });

  // Prescription builder
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'temp-rx-1',
      medicineName: 'Paracetamol',
      dosage: '650 mg',
      frequency: 'Twice daily after food (1-0-1)',
      duration: '5 Days',
      instructions: 'Take with warm water'
    }
  ]);

  // Selected Lab requests
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([]);

  // History Drawer State
  const [viewHistoryPatientId, setViewHistoryPatientId] = useState<string | null>(null);

  const startConsultation = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setChiefComplaint(apt.reason || 'Routine follow-up');
    setSymptomsInput('Fatigue, Mild headache');
    setDiagnosis('Acute Upper Respiratory Tract Infection');
    setClinicalNotes('Patient alert, oriented. Throat hyperemic. Chest clear bilaterally.');
    setTreatmentPlan('Symptomatic medical management, adequate hydration and rest.');
    setShowConsultModal(true);
  };

  const handleAddRxItem = () => {
    setPrescriptions([
      ...prescriptions,
      {
        id: 'temp-rx-' + Date.now(),
        medicineName: 'Amoxicillin / Clavulanate',
        dosage: '625 mg',
        frequency: 'Twice daily after meals',
        duration: '7 Days',
        instructions: 'Complete full course'
      }
    ]);
  };

  const handleRemoveRxItem = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const handleCompleteConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const symptomsList = symptomsInput.split(',').map(s => s.trim()).filter(Boolean);

    recordConsultation({
      appointmentId: selectedAppointment.id,
      patientId: selectedAppointment.patientId,
      doctorId: currentDoctor.id,
      chiefComplaint,
      symptoms: symptomsList,
      diagnosis,
      clinicalNotes,
      treatmentPlan,
      vitals,
      prescriptions,
      labRequests: selectedLabTests,
      followUpDate
    });

    setShowConsultModal(false);
    setSelectedAppointment(null);
  };

  const toggleLabTest = (testName: string) => {
    if (selectedLabTests.includes(testName)) {
      setSelectedLabTests(selectedLabTests.filter(t => t !== testName));
    } else {
      setSelectedLabTests([...selectedLabTests, testName]);
    }
  };

  const activePatientHistory = viewHistoryPatientId
    ? medicalRecords.filter(m => m.patientId === viewHistoryPatientId)
    : [];

  return (
    <div className="space-y-6">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentDoctor.avatarUrl}
              alt={currentDoctor.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-500/30"
            />
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{currentDoctor.departmentName} Specialist</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">{currentDoctor.fullName}</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentDoctor.qualification} • Room {currentDoctor.roomNumber} • Fee: ${currentDoctor.consultationFee}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10 text-center">
              <div className="text-xs text-slate-300">Today's Queue</div>
              <div className="text-xl font-black text-white">{todayApts.length}</div>
            </div>
            <div className="bg-emerald-500/20 rounded-2xl px-4 py-2 border border-emerald-500/30 text-center">
              <div className="text-xs text-emerald-300">Completed</div>
              <div className="text-xl font-black text-emerald-400">{completedApts.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Consultation Schedule & Patient Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Outpatient Consultation Queue</h3>
              <p className="text-xs text-slate-500">Scheduled patients waiting for clinical review</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {pendingApts.length} Waiting
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {doctorAppointments.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No appointments assigned to this physician.
              </div>
            ) : (
              doctorAppointments.map(apt => (
                <div key={apt.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex flex-col items-center justify-center font-bold shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                      <span className="text-[9px] font-mono">{apt.timeSlot.split(' ')[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{apt.patientName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({apt.appointmentNumber})</span>
                      </div>
                      <div className="text-slate-500 mt-0.5 line-clamp-1">
                        <span className="font-medium text-slate-700">Reason:</span> {apt.reason}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-3">
                        <span>Date: {apt.date}</span>
                        <span>•</span>
                        <span>Slot: {apt.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                      apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      apt.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      apt.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {apt.status}
                    </span>

                    <button
                      onClick={() => setViewHistoryPatientId(apt.patientId)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold flex items-center space-x-1"
                      title="View Patient EMR History"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>History</span>
                    </button>

                    {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                      <button
                        onClick={() => startConsultation(apt)}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center space-x-1 shadow-xs"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Consult</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Doctor Quick Tools & Diagnostics Requisitions */}
        <div className="space-y-6">
          {/* Quick Doctor Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Consultation Schedule & OPD</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Working Days:</span>
                <span className="font-semibold text-slate-800">{currentDoctor.availableDays.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Total Consultation Fee:</span>
                <span className="font-bold text-emerald-600">${currentDoctor.consultationFee}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Room Location:</span>
                <span className="font-semibold text-slate-800">{currentDoctor.roomNumber}</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Investigation Catalog */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Pathology & Radiology Catalog</h3>
              <Microscope className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {labTests.map(test => (
                <div key={test.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{test.name}</div>
                    <div className="text-[10px] text-slate-400">{test.category} • Turnaround: {test.turnaroundHours}h</div>
                  </div>
                  <span className="font-bold text-slate-700">${test.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Medical History Drawer / Modal */}
      {viewHistoryPatientId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Longitudinal Patient EMR History</h3>
                <p className="text-xs text-slate-500">Past diagnoses, physician clinical notes, and therapies</p>
              </div>
              <button
                onClick={() => setViewHistoryPatientId(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs">
              {activePatientHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No prior medical consultation records recorded for this patient.
                </div>
              ) : (
                activePatientHistory.map(rec => (
                  <div key={rec.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-teal-800">Visit Date: {rec.visitDate}</span>
                      <span className="text-[11px] text-slate-500">Attending: {rec.doctorName}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Diagnosis:</span>
                      <p className="text-slate-900 font-semibold">{rec.diagnosis}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Chief Complaints:</span>
                      <p className="text-slate-600">{rec.chiefComplaint}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Clinical Notes:</span>
                      <p className="text-slate-600">{rec.clinicalNotes}</p>
                    </div>
                    {rec.vitals && (
                      <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
                        <span>BP: {rec.vitals.bloodPressure}</span>
                        <span>Pulse: {rec.vitals.pulse} bpm</span>
                        <span>SpO2: {rec.vitals.spo2}%</span>
                        <span>Temp: {rec.vitals.temperature}°F</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewHistoryPatientId(null)}
                className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Clinical Consultation Modal */}
      {showConsultModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-200">
                  Encounter Note: {selectedAppointment.appointmentNumber}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-1">
                  Clinical Consultation: {selectedAppointment.patientName}
                </h3>
              </div>
              <button
                onClick={() => setShowConsultModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteConsultation} className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs">
              {/* Vitals Recording Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-800 text-xs mb-3 flex items-center space-x-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>Encounter Vitals Check</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">Blood Pressure</label>
                    <input
                      type="text"
                      value={vitals.bloodPressure}
                      onChange={e => setVitals({ ...vitals, bloodPressure: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      placeholder="120/80"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Pulse (bpm)</label>
                    <input
                      type="number"
                      value={vitals.pulse}
                      onChange={e => setVitals({ ...vitals, pulse: parseInt(e.target.value) || 72 })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={e => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 98.6 })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">SpO2 (%)</label>
                    <input
                      type="number"
                      value={vitals.spo2}
                      onChange={e => setVitals({ ...vitals, spo2: parseInt(e.target.value) || 98 })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={vitals.weight}
                      onChange={e => setVitals({ ...vitals, weight: parseFloat(e.target.value) || 70 })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis & Symptoms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chief Complaints</label>
                  <input
                    type="text"
                    required
                    value={chiefComplaint}
                    onChange={e => setChiefComplaint(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Symptoms (comma separated)</label>
                  <input
                    type="text"
                    value={symptomsInput}
                    onChange={e => setSymptomsInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                    placeholder="e.g. Cough, High fever, Chills"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Clinical Diagnosis</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 font-semibold"
                  placeholder="e.g. Acute Bronchitis / Hypertension Stage 1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clinical Assessment Notes</label>
                  <textarea
                    rows={2}
                    value={clinicalNotes}
                    onChange={e => setClinicalNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Treatment Plan</label>
                  <textarea
                    rows={2}
                    value={treatmentPlan}
                    onChange={e => setTreatmentPlan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Electronic Prescriptions (Rx) Builder */}
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-teal-900 text-xs flex items-center space-x-1.5">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <span>Electronic Prescription (e-Rx)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRxItem}
                    className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {prescriptions.map((rx, idx) => (
                    <div key={rx.id} className="p-3 bg-white rounded-xl border border-teal-100 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Medicine name"
                          value={rx.medicineName}
                          onChange={e => {
                            const updated = [...prescriptions];
                            updated[idx].medicineName = e.target.value;
                            setPrescriptions(updated);
                          }}
                          className="w-full px-2 py-1 rounded-md border border-slate-200 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Dosage (500mg)"
                          value={rx.dosage}
                          onChange={e => {
                            const updated = [...prescriptions];
                            updated[idx].dosage = e.target.value;
                            setPrescriptions(updated);
                          }}
                          className="w-full px-2 py-1 rounded-md border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Duration (5 days)"
                          value={rx.duration}
                          onChange={e => {
                            const updated = [...prescriptions];
                            updated[idx].duration = e.target.value;
                            setPrescriptions(updated);
                          }}
                          className="w-full px-2 py-1 rounded-md border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveRxItem(rx.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Requisitions */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                  <Microscope className="w-4 h-4 text-cyan-600" />
                  <span>Order Diagnostic Investigations (Sent to Lab Queue)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {labTests.map(test => {
                    const selected = selectedLabTests.includes(test.name);
                    return (
                      <button
                        type="button"
                        key={test.id}
                        onClick={() => toggleLabTest(test.name)}
                        className={`p-2 rounded-xl text-left border text-xs font-semibold transition-colors flex items-center justify-between ${
                          selected
                            ? 'bg-cyan-50 border-cyan-300 text-cyan-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate pr-1">{test.name}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Follow-up Date */}
              <div className="flex items-center space-x-3">
                <label className="font-bold text-slate-700">Follow-up Date:</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={e => setFollowUpDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowConsultModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalize & Sign Encounter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
