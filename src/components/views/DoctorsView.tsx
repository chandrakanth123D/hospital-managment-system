import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Stethoscope,
  Search,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  GraduationCap,
  Award
} from 'lucide-react';

export const DoctorsView: React.FC = () => {
  const { doctors, departments } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || d.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Medical Specialists & Physician Roster
        </h2>
        <p className="text-xs text-slate-500">
          Consultant credentials, clinical specialties, consultation schedules, and OPD chambers
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <label className="text-slate-500 font-semibold">Specialty Dept:</label>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
          >
            <option value="ALL">All Departments ({doctors.length})</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search physician or specialty..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <div
            key={doctor.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start space-x-4">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {doctor.departmentName}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{doctor.fullName}</h3>
                  <div className="text-xs font-semibold text-slate-600">{doctor.specialization}</div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                {doctor.bio}
              </p>

              <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center text-slate-600 space-x-2">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{doctor.qualification} ({doctor.experienceYears} yrs exp)</span>
                </div>
                <div className="flex items-center text-slate-600 space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Chamber: {doctor.roomNumber}</span>
                </div>
                <div className="flex items-center text-slate-600 space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-900">OPD Consultation Fee: ${doctor.consultationFee}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Consultation Days</div>
              <div className="flex flex-wrap gap-1">
                {doctor.availableDays.map(day => (
                  <span key={day} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
