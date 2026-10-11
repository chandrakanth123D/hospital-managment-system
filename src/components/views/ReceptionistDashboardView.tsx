import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Patient, Bed } from '../../types/hospital';
import {
  UserPlus,
  BedDouble,
  CalendarCheck,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  ShieldAlert,
  ArrowRight,
  LogOut,
  Hospital
} from 'lucide-react';

export const ReceptionistDashboardView: React.FC = () => {
  const {
    patients,
    doctors,
    beds,
    admissions,
    appointments,
    registerPatient,
    admitPatient,
    dischargePatient
  } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);

  // New Patient Form
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '1995-05-15',
    age: 31,
    gender: 'FEMALE' as Patient['gender'],
    bloodGroup: 'B+' as Patient['bloodGroup'],
    address: '',
    emergencyName: '',
    emergencyPhone: ''
  });

  // Admission Form
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [admittingDiagnosis, setAdmittingDiagnosis] = useState('');
  const [admitMsg, setAdmitMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Discharge Form
  const [selectedAdmissionId, setSelectedAdmissionId] = useState('');
  const [dischargeSummary, setDischargeSummary] = useState('');

  const availableBeds = beds.filter(b => b.status === 'AVAILABLE');
  const activeAdmissions = admissions.filter(a => a.status === 'ADMITTED');

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.fullName || !newPatient.phone) return;

    registerPatient({
      fullName: newPatient.fullName,
      email: newPatient.email,
      phone: newPatient.phone,
      dateOfBirth: newPatient.dateOfBirth,
      age: newPatient.age,
      gender: newPatient.gender,
      bloodGroup: newPatient.bloodGroup,
      address: newPatient.address,
      emergencyContact: {
        name: newPatient.emergencyName || 'Family',
        relationship: 'Contact',
        phone: newPatient.emergencyPhone || newPatient.phone
      }
    });

    setShowRegModal(false);
    setNewPatient({
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '1995-05-15',
      age: 31,
      gender: 'FEMALE',
      bloodGroup: 'B+',
      address: '',
      emergencyName: '',
      emergencyPhone: ''
    });
  };

  const handleAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedBedId) return;

    const res = admitPatient({
      patientId: selectedPatientId,
      bedId: selectedBedId,
      attendingDoctorId: selectedDoctorId,
      admittingDiagnosis: admittingDiagnosis || 'Inpatient observational admission',
      treatmentDetails: 'Standard inpatient protocol and IV fluids.'
    });

    if (res.success) {
      setAdmitMsg({ text: res.message, error: false });
      setTimeout(() => {
        setShowAdmitModal(false);
        setAdmitMsg(null);
        setSelectedPatientId('');
        setSelectedBedId('');
        setAdmittingDiagnosis('');
      }, 1200);
    } else {
      setAdmitMsg({ text: res.message, error: true });
    }
  };

  const handleDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmissionId) return;

    dischargePatient(selectedAdmissionId, dischargeSummary);
    setShowDischargeModal(false);
    setSelectedAdmissionId('');
    setDischargeSummary('');
  };

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Front-Desk Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
              <Hospital className="w-3.5 h-3.5" />
              <span>Front Desk & Triage Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Reception & Inpatient Admissions
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Expedited patient onboarding, electronic Medical Record Number (MRN) generation, bed reservation, and discharge clearance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowRegModal(true)}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={() => setShowAdmitModal(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center space-x-2"
            >
              <BedDouble className="w-4 h-4" />
              <span>Inpatient Admission</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reception Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Total Registered</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{patients.length}</div>
          <span className="text-emerald-600 font-medium">MRN database</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Today's OPD Queue</span>
          <div className="text-2xl font-bold text-teal-600 mt-1">{appointments.length}</div>
          <span className="text-slate-500">Scheduled slots</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Active Inpatients</span>
          <div className="text-2xl font-bold text-purple-600 mt-1">{activeAdmissions.length}</div>
          <span className="text-slate-500">Occupied beds</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Available Beds</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{availableBeds.length}</div>
          <span className="text-slate-500">Ready for intake</span>
        </div>
      </div>

      {/* Main Grid: Patient Registry & Active Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Registry */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Master Patient Index</h3>
              <p className="text-xs text-slate-500">Search patients by MRN, name, or contact number</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search MRN or name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 w-full sm:w-60"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Patient Info</th>
                  <th className="py-3 px-3">MRN</th>
                  <th className="py-3 px-3">Age / Blood</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{p.fullName}</div>
                      <div className="text-[11px] text-slate-400">{p.gender} • DOB: {p.dateOfBirth}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-teal-700">
                      {p.mrn}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-700">{p.age} yrs</span>
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-sm bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {p.phone}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'ADMITTED' ? 'bg-purple-100 text-purple-800' :
                        p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Inpatients & Discharge Desk */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Admitted Patients ({activeAdmissions.length})</h3>
              <p className="text-xs text-slate-500">Inpatient ward occupancy</p>
            </div>
            <BedDouble className="w-4 h-4 text-purple-600" />
          </div>

          <div className="space-y-3">
            {activeAdmissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active inpatient admissions.
              </div>
            ) : (
              activeAdmissions.map(adm => (
                <div key={adm.id} className="p-3 rounded-xl border border-purple-100 bg-purple-50/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{adm.patientName}</span>
                    <span className="font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md text-[10px]">
                      {adm.bedNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700">Ward:</span> {adm.wardName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Attending: {adm.attendingDoctorName}
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedAdmissionId(adm.id);
                        setShowDischargeModal(true);
                      }}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-[10px] flex items-center space-x-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Process Discharge</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: Register Patient */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">New Patient Registration (OPD Desk)</h3>
              <button onClick={() => setShowRegModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleRegisterPatient} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={newPatient.fullName}
                  onChange={e => setNewPatient({ ...newPatient, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={newPatient.phone}
                    onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={newPatient.email}
                    onChange={e => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newPatient.dateOfBirth}
                    onChange={e => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={e => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={e => setNewPatient({ ...newPatient, bloodGroup: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State"
                  value={newPatient.address}
                  onChange={e => setNewPatient({ ...newPatient, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
                >
                  Generate MRN & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admit Patient to Bed */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Inpatient Admission Desk</h3>
              <button onClick={() => setShowAdmitModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {admitMsg && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                admitMsg.error ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {admitMsg.text}
              </div>
            )}

            <form onSubmit={handleAdmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient to Admit</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.filter(p => p.status !== 'ADMITTED').map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.mrn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Available Bed</label>
                <select
                  required
                  value={selectedBedId}
                  onChange={e => setSelectedBedId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">-- Choose Available Bed --</option>
                  {availableBeds.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.bedNumber} - {b.wardName} (${b.dailyRate}/day)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attending Physician</label>
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.fullName} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Admitting Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Appendicitis / Severe Dehydration"
                  value={admittingDiagnosis}
                  onChange={e => setAdmittingDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
                >
                  Complete Bed Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Process Discharge */}
      {showDischargeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 text-base mb-2">Confirm Patient Discharge</h3>
            <p className="text-slate-500 mb-4">
              Discharging this inpatient will release the bed to 'AVAILABLE' status and automatically calculate room charges to billing.
            </p>
            <form onSubmit={handleDischarge} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Discharge Summary & Instructions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Patient vitals stabilized. Discharge with oral medications and follow-up in 10 days."
                  value={dischargeSummary}
                  onChange={e => setDischargeSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDischargeModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl"
                >
                  Discharge & Bill Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
