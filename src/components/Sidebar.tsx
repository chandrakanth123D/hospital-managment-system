import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  BedDouble,
  FileHeart,
  Pill,
  Microscope,
  ReceiptText,
  BarChart3,
  Code2,
  Database,
  Layers,
  HeartPulse
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAcademicHub: (initialTab?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onOpenAcademicHub }) => {
  const { currentRole, appointments, medicines, beds, labReports } = useHospital();

  // Calculate live badge counters
  const pendingAppointmentsCount = appointments.filter(a => a.status === 'BOOKED' || a.status === 'CONFIRMED').length;
  const lowStockCount = medicines.filter(m => m.stockQuantity <= m.minStockLevel).length;
  const occupiedBedsCount = beds.filter(b => b.status === 'OCCUPIED').length;
  const pendingLabCount = labReports.filter(r => r.status === 'PENDING' || r.status === 'IN_ANALYSIS').length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'appointments', label: 'Appointments & OPD', icon: CalendarDays, badge: pendingAppointmentsCount ? `${pendingAppointmentsCount}` : null, badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'patients', label: 'Patients Directory', icon: Users, badge: null },
    { id: 'doctors', label: 'Doctors & Specialties', icon: Stethoscope, badge: null },
    { id: 'inpatient', label: 'Inpatient & Bed Wards', icon: BedDouble, badge: `${occupiedBedsCount}/${beds.length} Beds`, badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'emr', label: 'Electronic Medical Records', icon: FileHeart, badge: null },
    { id: 'pharmacy', label: 'Pharmacy & Inventory', icon: Pill, badge: lowStockCount > 0 ? `${lowStockCount} Low` : null, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'laboratory', label: 'Diagnostic Laboratory', icon: Microscope, badge: pendingLabCount > 0 ? `${pendingLabCount} Queue` : null, badgeColor: 'bg-cyan-100 text-cyan-800' },
    { id: 'billing', label: 'Billing & Cashier', icon: ReceiptText, badge: null },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3, badge: null },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Current Context Role Indicator */}
      <div className="p-4 border-b border-slate-100">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Persona
            </div>
            <div className="text-sm font-bold text-slate-800">
              {currentRole.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Academic Project Hub Section */}
        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>College Deliverables</span>
          <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-sm font-bold border border-indigo-200">
            Viva Ready
          </span>
        </div>

        <button
          onClick={() => onOpenAcademicHub('code')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
        >
          <Code2 className="w-4 h-4 text-indigo-500" />
          <span>Spring Boot Source Code</span>
        </button>

        <button
          onClick={() => onOpenAcademicHub('er')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
        >
          <Database className="w-4 h-4 text-emerald-500" />
          <span>MySQL ER & Schema DDL</span>
        </button>

        <button
          onClick={() => onOpenAcademicHub('report')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
        >
          <Layers className="w-4 h-4 text-purple-500" />
          <span>Project Report & Viva Q&A</span>
        </button>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="text-[11px] text-slate-500 font-medium leading-relaxed">
          <p className="font-bold text-slate-700">Hospital Management System</p>
          <p>Spring Boot 3 + MySQL 8 + React</p>
          <div className="mt-2 flex items-center space-x-1.5 text-[10px] text-emerald-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>REST API Services Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
