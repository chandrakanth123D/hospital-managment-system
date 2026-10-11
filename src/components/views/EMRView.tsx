import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  FileHeart,
  Search,
  User,
  HeartPulse,
  Pill,
  Microscope,
  Calendar,
  Stethoscope
} from 'lucide-react';

export const EMRView: React.FC = () => {
  const { medicalRecords, patients, doctors } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('ALL');

  const filteredRecords = medicalRecords.filter(m => {
    const matchesSearch = m.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = selectedPatientId === 'ALL' || m.patientId === selectedPatientId;
    return matchesSearch && matchesPatient;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Electronic Medical Records (EMR) Archive
          </h2>
          <p className="text-xs text-slate-500">
            Longitudinal patient encounter notes, symptoms, diagnoses, vital histories, and e-prescriptions
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <label className="text-slate-500 font-semibold">Filter Patient:</label>
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
          >
            <option value="ALL">All Patients ({medicalRecords.length} records)</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.fullName} ({p.mrn})</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search diagnosis, physician, or symptoms..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Medical Records Cards */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            No medical encounter records found matching search filters.
          </div>
        ) : (
          filteredRecords.map(rec => (
            <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.patientName}</span>
                    <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-bold border border-teal-200">
                      Encounter Date: {rec.visitDate}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Attending Specialist: <span className="font-semibold text-slate-800">{rec.doctorName}</span>
                  </div>
                </div>

                {rec.followUpDate && (
                  <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 flex items-center space-x-1.5 self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Follow-up: {rec.followUpDate}</span>
                  </div>
                )}
              </div>

              {/* Diagnosis and Complaints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Primary Diagnosis</span>
                  <div className="font-bold text-slate-900 text-sm">{rec.diagnosis}</div>
                  <p className="text-slate-600 mt-1 text-[11px]">
                    <span className="font-semibold text-slate-700">Chief Complaints:</span> {rec.chiefComplaint}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Symptoms Presented</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rec.symptoms.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clinical Notes & Treatment Plan */}
              <div className="space-y-2">
                <div>
                  <span className="font-bold text-slate-700">Physician Clinical Assessment:</span>
                  <p className="text-slate-600 leading-relaxed mt-0.5">{rec.clinicalNotes}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Treatment Plan:</span>
                  <p className="text-slate-600 leading-relaxed mt-0.5">{rec.treatmentPlan}</p>
                </div>
              </div>

              {/* Vitals Snapshot */}
              {rec.vitals && (
                <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-100 flex flex-wrap items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center space-x-1.5 text-teal-800 font-bold">
                    <HeartPulse className="w-4 h-4 text-teal-600" />
                    <span>Encounter Vitals:</span>
                  </div>
                  <span>BP: <strong>{rec.vitals.bloodPressure}</strong></span>
                  <span>Pulse: <strong>{rec.vitals.pulse} bpm</strong></span>
                  <span>SpO2: <strong>{rec.vitals.spo2}%</strong></span>
                  <span>Temp: <strong>{rec.vitals.temperature}°F</strong></span>
                  <span>Weight: <strong>{rec.vitals.weight} kg</strong></span>
                </div>
              )}

              {/* Prescriptions Attached */}
              {rec.prescriptions && rec.prescriptions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="font-bold text-slate-700 flex items-center space-x-1">
                    <Pill className="w-3.5 h-3.5 text-teal-600" />
                    <span>Medications Prescribed:</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {rec.prescriptions.map(rx => (
                      <div key={rx.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="font-bold text-slate-900">{rx.medicineName} ({rx.dosage})</div>
                        <div className="text-slate-500 text-[11px]">{rx.frequency} for {rx.duration}</div>
                        <div className="text-teal-700 text-[10px] mt-0.5 font-medium">{rx.instructions}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
