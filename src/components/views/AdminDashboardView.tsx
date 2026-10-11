import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types/hospital';
import {
  Users,
  Stethoscope,
  CalendarCheck2,
  DollarSign,
  BedDouble,
  Pill,
  Microscope,
  TrendingUp,
  UserPlus,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  PlusCircle,
  Building2,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    doctors,
    patients,
    appointments,
    bills,
    beds,
    medicines,
    labReports,
    departments,
    addUser,
    addDoctor,
    toggleUserActive
  } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'DOCTOR' as UserRole,
    phone: ''
  });

  // New Doctor Form State
  const [newDoctor, setNewDoctor] = useState({
    fullName: '',
    email: '',
    phone: '',
    departmentId: departments[0]?.id || '',
    specialization: '',
    qualification: 'MD / MBBS',
    experienceYears: 5,
    consultationFee: 100,
    roomNumber: 'OPD-101'
  });

  // Aggregates
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalStaff = users.length;
  const totalAppointments = appointments.length;
  const completedApts = appointments.filter(a => a.status === 'COMPLETED').length;
  const pendingApts = appointments.filter(a => a.status === 'BOOKED' || a.status === 'CONFIRMED').length;
  
  const totalRevenue = bills.reduce((acc, b) => acc + b.paidAmount, 0);
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE').length;
  const lowStockMeds = medicines.filter(m => m.stockQuantity <= m.minStockLevel).length;
  const pendingLabTests = labReports.filter(r => r.status === 'PENDING' || r.status === 'IN_ANALYSIS').length;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.fullName) return;
    addUser(newUser);
    setShowAddUserModal(false);
    setNewUser({ username: '', fullName: '', email: '', role: 'NURSE', phone: '' });
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.fullName || !newDoctor.specialization) return;
    const selectedDept = departments.find(d => d.id === newDoctor.departmentId);
    addDoctor({
      ...newDoctor,
      departmentName: selectedDept?.name || 'General Medicine'
    });
    setShowAddDoctorModal(false);
    setNewDoctor({
      fullName: '',
      email: '',
      phone: '',
      departmentId: departments[0]?.id || '',
      specialization: '',
      qualification: 'MD',
      experienceYears: 5,
      consultationFee: 100,
      roomNumber: 'OPD-102'
    });
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Hospital Administration Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Operations Overview
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time synchronization across outpatient triage, inpatient bed occupancy, clinical staff rosters, pharmacy inventory, and accounting ledger.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Add Doctor</span>
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create User</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patients Registered</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalPatients}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12% MoM
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {patients.filter(p => p.status === 'ADMITTED').length} Inpatients currently admitted
          </div>
        </div>

        {/* Doctor Roster */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Doctors</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalDoctors}</span>
            <span className="text-xs font-semibold text-slate-500">across {departments.length} depts</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {doctors.filter(d => d.status === 'ACTIVE').length} On-Duty Today
          </div>
        </div>

        {/* Revenue Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            From {bills.length} itemized patient invoices
          </div>
        </div>

        {/* Bed Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Beds</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {availableBeds} <span className="text-lg font-normal text-slate-400">/ {beds.length}</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ({Math.round(((beds.length - availableBeds) / beds.length) * 100)}% occupied)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            ICU: {beds.filter(b => b.wardName.includes('ICU') && b.status === 'AVAILABLE').length} available
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-teal-800 uppercase tracking-wider">Appointments Status</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {pendingApts} Pending / {completedApts} Completed
            </div>
            <div className="text-[11px] text-teal-700">Total {totalAppointments} scheduled</div>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Pharmacy Alerts</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {lowStockMeds} Low-Stock Medications
            </div>
            <div className="text-[11px] text-amber-700">Immediate re-order advised</div>
          </div>
        </div>

        <div className="bg-cyan-50/70 border border-cyan-200/80 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold">
            <Microscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">Clinical Pathology</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {pendingLabTests} Work Orders in Queue
            </div>
            <div className="text-[11px] text-cyan-700">{labReports.filter(r => r.status === 'COMPLETED').length} verified & dispatched</div>
          </div>
        </div>
      </div>

      {/* Main Administrative Tables: User & Doctor Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">User Directory & RBAC Security</h3>
              <p className="text-xs text-slate-500">Manage hospital staff accounts, roles, and status</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user or role..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 w-full sm:w-56"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-100">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{u.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">@{u.username} • {u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                        u.role === 'ADMIN' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        u.role === 'DOCTOR' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        u.role === 'PATIENT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        u.role === 'NURSE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        u.role === 'PHARMACIST' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                        'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {u.phone || 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleUserActive(u.id)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                          u.active
                            ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                            : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hospital Departments Roster */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Departments ({departments.length})</h3>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-3">
              {departments.map(d => (
                <div key={d.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{d.name}</span>
                    <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">
                      {d.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{d.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Head: {d.headDoctorName}</span>
                    <span className="text-teal-700 font-semibold">{d.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-800 flex items-center justify-between">
              <div>
                <span className="font-bold">Total Wards:</span> 4 Inpatient Blocks
              </div>
              <span className="font-semibold text-teal-700">ICU, Gen, Surg, Ped</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Add New Staff / User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Robert Vance"
                  value={newUser.fullName}
                  onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. robert.vance"
                  value={newUser.username}
                  onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@medicare.org"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Role</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="DOCTOR">DOCTOR</option>
                    <option value="RECEPTIONIST">RECEPTIONIST</option>
                    <option value="NURSE">NURSE</option>
                    <option value="PHARMACIST">PHARMACIST</option>
                    <option value="LAB_TECHNICIAN">LAB_TECHNICIAN</option>
                    <option value="ACCOUNTANT">ACCOUNTANT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={newUser.phone}
                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Doctor */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Onboard Medical Specialist / Doctor</h3>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Lucas Meyer"
                    value={newDoctor.fullName}
                    onChange={e => setNewDoctor({ ...newDoctor, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Interventional Pulmonology"
                    value={newDoctor.specialization}
                    onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newDoctor.departmentId}
                    onChange={e => setNewDoctor({ ...newDoctor, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD, FCCP"
                    value={newDoctor.qualification}
                    onChange={e => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    min="1"
                    value={newDoctor.experienceYears}
                    onChange={e => setNewDoctor({ ...newDoctor, experienceYears: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">OPD Fee ($)</label>
                  <input
                    type="number"
                    min="20"
                    step="5"
                    value={newDoctor.consultationFee}
                    onChange={e => setNewDoctor({ ...newDoctor, consultationFee: parseFloat(e.target.value) || 50 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room No.</label>
                  <input
                    type="text"
                    value={newDoctor.roomNumber}
                    onChange={e => setNewDoctor({ ...newDoctor, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
                >
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
