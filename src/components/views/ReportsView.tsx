import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  BedDouble,
  Pill,
  Microscope,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    patients,
    doctors,
    appointments,
    bills,
    beds,
    medicines,
    labReports,
    wards
  } = useHospital();

  const totalRevenue = bills.reduce((acc, b) => acc + b.paidAmount, 0);
  const totalBilled = bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const bedOccupancyRate = Math.round(((beds.length - beds.filter(b => b.status === 'AVAILABLE').length) / beds.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Executive Hospital Intelligence & Analytics
        </h2>
        <p className="text-xs text-slate-500">
          Clinical workload, bed occupancy metrics, pharmacy revenue, and diagnostic turnaround analytics
        </p>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Net Collections</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-emerald-600 font-semibold text-[11px] flex items-center mt-1">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> 98.4% Realization Rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Bed Occupancy</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {bedOccupancyRate}%
          </div>
          <span className="text-slate-500 text-[11px]">
            {beds.filter(b => b.status === 'OCCUPIED').length} / {beds.length} Total beds
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Total Consultations</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{appointments.length}</div>
          <span className="text-teal-600 font-semibold text-[11px]">
            {appointments.filter(a => a.status === 'COMPLETED').length} Fulfilled
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Laboratory Tests</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{labReports.length}</div>
          <span className="text-cyan-600 font-semibold text-[11px]">
            {labReports.filter(r => r.status === 'COMPLETED').length} Verified reports
          </span>
        </div>
      </div>

      {/* Ward Occupancy Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Ward Utilization & Capacity</h3>
            <BedDouble className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-3">
            {wards.map(w => {
              const total = beds.filter(b => b.wardId === w.id).length || 1;
              const occ = beds.filter(b => b.wardId === w.id && b.status === 'OCCUPIED').length;
              const pct = Math.round((occ / total) * 100);

              return (
                <div key={w.id} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">{w.name} ({w.type})</span>
                    <span className="text-slate-500 font-mono">{occ} / {total} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct > 75 ? 'bg-rose-500' : pct > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Revenue Breakdown by Service Category */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Revenue Distribution by Department</h3>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Outpatient Consultation Fees</span>
                <div className="text-[11px] text-slate-400">Cardiology, Neurology, General Medicine</div>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-sm">$340.00</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Inpatient Bed & Room Charges</span>
                <div className="text-[11px] text-slate-400">General Ward & Intensive Care Units</div>
              </div>
              <span className="font-mono font-bold text-indigo-700 text-sm">$300.00</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Diagnostic Laboratory & Imaging</span>
                <div className="text-[11px] text-slate-400">Lipid Profile, CBC, Radiology X-Ray</div>
              </div>
              <span className="font-mono font-bold text-cyan-700 text-sm">$80.00</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Hospital Pharmacy Dispensing</span>
                <div className="text-[11px] text-slate-400">Prescription medicines & therapeutics</div>
              </div>
              <span className="font-mono font-bold text-teal-700 text-sm">$25.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
