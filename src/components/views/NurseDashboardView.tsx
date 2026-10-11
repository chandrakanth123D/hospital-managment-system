import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  HeartPulse,
  Thermometer,
  Activity,
  BedDouble,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  FileEdit,
  ClipboardList
} from 'lucide-react';

export const NurseDashboardView: React.FC = () => {
  const {
    beds,
    admissions,
    vitalSigns,
    recordVitals,
    currentUser
  } = useHospital();

  const activeInpatients = admissions.filter(a => a.status === 'ADMITTED');

  // Vitals Entry Modal State
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<(typeof activeInpatients)[0] | null>(null);

  const [vitalsData, setVitalsData] = useState({
    temperature: 98.6,
    bloodPressureSys: 120,
    bloodPressureDia: 80,
    pulse: 75,
    spo2: 98,
    respiratoryRate: 18,
    weight: 65,
    nurseNotes: 'Patient calm, alert, and resting in bed.'
  });

  // Track administered medications in-memory
  const [administeredDoses, setAdministeredDoses] = useState<Record<string, boolean>>({
    'adm-1-dose-morning': true
  });

  const handleOpenVitals = (adm: typeof activeInpatients[0]) => {
    setSelectedAdmission(adm);
    setShowVitalsModal(true);
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmission) return;

    recordVitals({
      admissionId: selectedAdmission.id,
      patientId: selectedAdmission.patientId,
      patientName: selectedAdmission.patientName,
      bedNumber: selectedAdmission.bedNumber,
      temperature: vitalsData.temperature,
      bloodPressureSys: vitalsData.bloodPressureSys,
      bloodPressureDia: vitalsData.bloodPressureDia,
      pulse: vitalsData.pulse,
      spo2: vitalsData.spo2,
      respiratoryRate: vitalsData.respiratoryRate,
      weight: vitalsData.weight,
      recordedByNurse: currentUser?.fullName || 'Maria Rodriguez, RN',
      nurseNotes: vitalsData.nurseNotes
    });

    setShowVitalsModal(false);
    setSelectedAdmission(null);
  };

  const toggleDose = (key: string) => {
    setAdministeredDoses(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Inpatient Clinical Nursing Station</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ward Floor Care & Vital Signs Monitor
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time bedside vitals logging, SpO2/BP telemetry alarms, and inpatient medication administration tracking.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
            <span className="text-xs text-amber-200">Active Inpatient Beds</span>
            <div className="text-2xl font-black text-white">{activeInpatients.length} Occupied</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Inpatient Beds List & Recent Vitals Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inpatients Bed Ward */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Inpatient Ward Bed Allocation</h3>
            <span className="text-xs text-slate-500 font-semibold">{beds.length} Total Hospital Beds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {beds.map(b => {
              const admission = activeInpatients.find(a => a.bedId === b.id);
              const latestVitals = admission
                ? vitalSigns.find(v => v.patientId === admission.patientId)
                : null;

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                    b.status === 'OCCUPIED'
                      ? 'bg-white border-amber-200 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200/80 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-sm text-slate-900">{b.bedNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'OCCUPIED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mb-3">
                      {b.wardName} • {b.roomNumber}
                    </div>

                    {b.status === 'OCCUPIED' && admission && (
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-1.5 mb-3">
                        <div className="font-bold text-slate-900 text-xs">{admission.patientName}</div>
                        <div className="text-slate-600 text-[11px]">
                          Diagnosis: <span className="font-medium">{admission.admittingDiagnosis}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Attending: {admission.attendingDoctorName}
                        </div>

                        {latestVitals && (
                          <div className="pt-2 mt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] font-mono">
                            <span className={latestVitals.bloodPressureSys > 135 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                              BP: {latestVitals.bloodPressureSys}/{latestVitals.bloodPressureDia}
                            </span>
                            <span className={latestVitals.spo2 < 95 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                              SpO2: {latestVitals.spo2}%
                            </span>
                            <span className={latestVitals.temperature > 99.5 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                              {latestVitals.temperature}°F
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {b.status === 'OCCUPIED' && admission && (
                    <button
                      onClick={() => handleOpenVitals(admission)}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Vitals & Clinical Chart</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Medication Administration (MAR) & Nursing Log */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Medication Schedule (MAR)</h3>
              <ClipboardList className="w-4 h-4 text-amber-600" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Bed GEN-202: Eleanor Bennett</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                    Due 08:00 AM
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Salbutamol / Ipratropium Nebulization (q6h)
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Dr. Anita Desai</span>
                  <button
                    onClick={() => toggleDose('adm-1-dose-morning')}
                    className={`px-3 py-1 rounded-lg font-bold text-[10px] flex items-center space-x-1 ${
                      administeredDoses['adm-1-dose-morning']
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{administeredDoses['adm-1-dose-morning'] ? 'Administered' : 'Mark Given'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Bed GEN-202: Eleanor Bennett</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                    Due 02:00 PM
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  IV Hydrocortisone 100mg bolus
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Dr. Anita Desai</span>
                  <button
                    onClick={() => toggleDose('adm-1-dose-afternoon')}
                    className={`px-3 py-1 rounded-lg font-bold text-[10px] flex items-center space-x-1 ${
                      administeredDoses['adm-1-dose-afternoon']
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{administeredDoses['adm-1-dose-afternoon'] ? 'Administered' : 'Mark Given'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bedside Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Recent Ward Vitals Audit Log</h3>
            <div className="space-y-2 text-xs">
              {vitalSigns.map(v => (
                <div key={v.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{v.patientName} ({v.bedNumber})</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-600">
                    <span>BP: {v.bloodPressureSys}/{v.bloodPressureDia}</span>
                    <span>HR: {v.pulse}</span>
                    <span>SpO2: {v.spo2}%</span>
                    <span>Temp: {v.temperature}°F</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">"{v.nurseNotes}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Record Vitals Modal */}
      {showVitalsModal && selectedAdmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Record Patient Bedside Vitals</h3>
                <p className="text-slate-500">
                  {selectedAdmission.patientName} • {selectedAdmission.bedNumber} ({selectedAdmission.wardName})
                </p>
              </div>
              <button onClick={() => setShowVitalsModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveVitals} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    required
                    value={vitalsData.bloodPressureSys}
                    onChange={e => setVitalsData({ ...vitalsData, bloodPressureSys: parseInt(e.target.value) || 120 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    required
                    value={vitalsData.bloodPressureDia}
                    onChange={e => setVitalsData({ ...vitalsData, bloodPressureDia: parseInt(e.target.value) || 80 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    required
                    value={vitalsData.pulse}
                    onChange={e => setVitalsData({ ...vitalsData, pulse: parseInt(e.target.value) || 75 })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    required
                    value={vitalsData.spo2}
                    onChange={e => setVitalsData({ ...vitalsData, spo2: parseInt(e.target.value) || 98 })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={vitalsData.temperature}
                    onChange={e => setVitalsData({ ...vitalsData, temperature: parseFloat(e.target.value) || 98.6 })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resp. Rate (/min)</label>
                  <input
                    type="number"
                    value={vitalsData.respiratoryRate}
                    onChange={e => setVitalsData({ ...vitalsData, respiratoryRate: parseInt(e.target.value) || 18 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={vitalsData.weight}
                    onChange={e => setVitalsData({ ...vitalsData, weight: parseFloat(e.target.value) || 65 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nursing Observation Notes</label>
                <textarea
                  rows={2}
                  value={vitalsData.nurseNotes}
                  onChange={e => setVitalsData({ ...vitalsData, nurseNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVitalsModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md"
                >
                  Save & Log to EMR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
