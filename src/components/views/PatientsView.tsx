import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Users,
  Search,
  UserPlus,
  ShieldAlert,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const PatientsView: React.FC = () => {
  const { patients, registerPatient } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);

  const [newPatient, setNewPatient] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '1990-01-01',
    age: 36,
    gender: 'MALE' as const,
    bloodGroup: 'O+' as const,
    address: '',
    allergies: 'Penicillin',
    chronicConditions: 'Mild Asthma'
  });

  const handleRegister = (e: React.FormEvent) => {
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
      allergies: newPatient.allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: newPatient.chronicConditions.split(',').map(s => s.trim()).filter(Boolean)
    });

    setShowRegModal(false);
  };

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Patient Information & Medical Record Index
          </h2>
          <p className="text-xs text-slate-500">
            Authoritative registry of patient demographics, blood groups, known drug allergies, and active clinical status
          </p>
        </div>

        <button
          onClick={() => setShowRegModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient by full name, MRN, or phone number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
          />
        </div>
        <span className="text-slate-500 font-semibold hidden sm:inline">
          Showing {filteredPatients.length} of {patients.length} patients
        </span>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 text-xs"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={patient.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                    alt={patient.fullName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-teal-500/20"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{patient.fullName}</h3>
                    <div className="font-mono text-[11px] font-bold text-teal-700">{patient.mrn}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  patient.status === 'ADMITTED' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {patient.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400">Age / Gender:</span>
                  <div className="font-semibold text-slate-800">{patient.age} yrs • {patient.gender}</div>
                </div>
                <div>
                  <span className="text-slate-400">Blood Group:</span>
                  <div className="font-bold text-rose-600">{patient.bloodGroup}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Phone:</span>
                  <div className="font-mono text-slate-700">{patient.phone}</div>
                </div>
              </div>

              {/* Allergies & Conditions */}
              <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-1.5 text-rose-700 font-bold text-[10px]">
                  <AlertCircle className="w-3 h-3" />
                  <span>Known Allergies:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.length > 0 ? (
                    patient.allergies.map((alg, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-semibold">
                        {alg}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-[10px]">No known drug allergies</span>
                  )}
                </div>
              </div>

              {patient.chronicConditions.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  <div className="text-slate-400 font-semibold text-[10px]">Chronic Conditions:</div>
                  <div className="flex flex-wrap gap-1">
                    {patient.chronicConditions.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Emergency: {patient.emergencyContact?.name} ({patient.emergencyContact?.relationship})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Register Patient Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Register New Patient</h3>
              <button onClick={() => setShowRegModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Green"
                  value={newPatient.fullName}
                  onChange={e => setNewPatient({ ...newPatient, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={newPatient.phone}
                    onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="samuel@gmail.com"
                    value={newPatient.email}
                    onChange={e => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={e => setNewPatient({ ...newPatient, age: parseInt(e.target.value) || 30 })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={e => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
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
                <label className="block font-bold text-slate-700 mb-1">Known Drug Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa"
                  value={newPatient.allergies}
                  onChange={e => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
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
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
