import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  BedDouble,
  HeartPulse,
  Hospital,
  Activity,
  CheckCircle2,
  Clock,
  User,
  ShieldAlert
} from 'lucide-react';

export const InpatientView: React.FC = () => {
  const { wards, beds, admissions } = useHospital();

  const activeAdmissions = admissions.filter(a => a.status === 'ADMITTED');
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE');
  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Inpatient Wards & Bed Occupancy Matrix
        </h2>
        <p className="text-xs text-slate-500">
          Live census across Intensive Care (ICU), Surgical Recovery, Pediatrics, and General Medical units
        </p>
      </div>

      {/* Ward Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {wards.map(ward => {
          const wardBeds = beds.filter(b => b.wardId === ward.id);
          const wardOccupied = wardBeds.filter(b => b.status === 'OCCUPIED').length;
          const wardAvailable = wardBeds.filter(b => b.status === 'AVAILABLE').length;

          return (
            <div key={ward.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{ward.name}</span>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                  {ward.type}
                </span>
              </div>
              <div className="text-slate-500 text-[11px]">
                {ward.floor} • Rate: <span className="font-bold text-slate-800">${ward.dailyRate}/day</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-medium">
                <span className="text-emerald-600 font-bold">{wardAvailable} Available</span>
                <span className="text-amber-600 font-bold">{wardOccupied} Occupied</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Beds Grid by Room */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Hospital Beds Telemetry</h3>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Available ({availableBeds.length})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Occupied ({occupiedBeds.length})</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          {beds.map(bed => {
            const isOccupied = bed.status === 'OCCUPIED';
            return (
              <div
                key={bed.id}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isOccupied
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center font-bold text-sm bg-white shadow-xs">
                  <BedDouble className={`w-4 h-4 ${isOccupied ? 'text-amber-600' : 'text-emerald-600'}`} />
                </div>
                <div className="font-bold font-mono text-sm">{bed.bedNumber}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{bed.roomNumber}</div>
                <div className="text-[9px] font-bold uppercase mt-2 tracking-wider">
                  {bed.status}
                </div>
                {bed.currentPatientName && (
                  <div className="text-[10px] font-semibold text-slate-800 mt-1 truncate">
                    {bed.currentPatientName}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Admissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Inpatient Admission Records</h3>
            <p className="text-slate-500">Clinical admissions, admitting diagnoses, and attending doctors</p>
          </div>
          <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            {admissions.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Adm #</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Ward / Bed</th>
                <th className="py-3 px-3">Attending Physician</th>
                <th className="py-3 px-3">Diagnosis</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissions.map(adm => (
                <tr key={adm.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {adm.admissionNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {adm.patientName} ({adm.patientAge}y, {adm.patientGender})
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800">{adm.bedNumber}</span>
                    <span className="text-[11px] text-slate-500 ml-1.5">({adm.wardName})</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {adm.attendingDoctorName}
                  </td>
                  <td className="py-3 px-3 text-slate-600 line-clamp-1">
                    {adm.admittingDiagnosis}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      adm.status === 'ADMITTED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {adm.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
