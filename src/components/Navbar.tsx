import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { UserRole } from '../types/hospital';
import {
  Activity,
  Bell,
  Code2,
  Database,
  FileText,
  HelpCircle,
  LogOut,
  RefreshCw,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onOpenAcademicHub: (initialTab?: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const ROLES_LIST: { role: UserRole; label: string; badgeColor: string; icon: string }[] = [
  { role: 'ADMIN', label: 'Admin', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200', icon: '👑' },
  { role: 'DOCTOR', label: 'Doctor', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '🩺' },
  { role: 'PATIENT', label: 'Patient', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200', icon: '👤' },
  { role: 'RECEPTIONIST', label: 'Reception', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200', icon: '📋' },
  { role: 'NURSE', label: 'Nurse', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200', icon: '💉' },
  { role: 'PHARMACIST', label: 'Pharmacy', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200', icon: '💊' },
  { role: 'LAB_TECHNICIAN', label: 'Lab Tech', badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: '🔬' },
  { role: 'ACCOUNTANT', label: 'Accountant', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: '💰' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenAcademicHub, activeView, setActiveView }) => {
  const {
    currentUser,
    currentRole,
    switchRole,
    notifications,
    unreadNotifsCount,
    markNotificationRead,
    markAllNotificationsRead,
    resetDatabase
  } = useHospital();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center space-x-3 text-left focus:outline-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tight text-slate-900">
                    MediCare <span className="text-teal-600 font-extrabold">PRO</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Spring Boot + React
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Hospital Management & Clinical Informatics System
                </p>
              </div>
            </button>
          </div>

          {/* Center: Role Switcher Toolbar (Quick Tester) */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold uppercase text-slate-400 px-2 tracking-wider flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Role:
            </span>
            {ROLES_LIST.map(r => {
              const active = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => switchRole(r.role)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`Switch active view to ${r.label}`}
                >
                  <span className="text-xs">{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Role Switcher Trigger */}
            <div className="relative lg:hidden">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center space-x-1"
              >
                <span>Role: {currentRole}</span>
              </button>
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  {ROLES_LIST.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        currentRole === r.role ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{r.icon}</span>
                        <span>{r.label}</span>
                      </span>
                      {currentRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Academic Project Hub CTA */}
            <button
              onClick={() => onOpenAcademicHub('code')}
              className="relative inline-flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-sm shadow-indigo-500/20 transition-all hover:shadow-md"
              title="View Spring Boot Code, MySQL Schema, ER Diagram & Project Report"
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Academic Project Hub</span>
              <span className="sm:hidden">Code/Docs</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-200"></span>
              </span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm text-slate-900">Hospital Notifications</h4>
                      {unreadNotifsCount > 0 && (
                        <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          {unreadNotifsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications currently.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors text-xs flex items-start space-x-3 ${
                            !n.read ? 'bg-teal-50/40' : ''
                          }`}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-md ${
                            n.type === 'APPOINTMENT' ? 'bg-blue-100 text-blue-700' :
                            n.type === 'LAB' ? 'bg-cyan-100 text-cyan-700' :
                            n.type === 'PRESCRIPTION' ? 'bg-teal-100 text-teal-700' :
                            n.type === 'STOCK' ? 'bg-amber-100 text-amber-700' :
                            n.type === 'BILLING' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            <Activity className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-800">{n.title}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-teal-500 mt-1.5"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Current User Pill */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256'}
                alt={currentUser?.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/30"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.fullName}
                </div>
                <div className="text-[10px] font-semibold text-teal-600 tracking-wider">
                  {currentUser?.role}
                </div>
              </div>
            </div>

            {/* Reset Database Trigger */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset Database to Seed State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-center font-bold text-slate-900 text-base">Reset Demo Database?</h3>
            <p className="text-center text-xs text-slate-500 mt-2 leading-relaxed">
              This will restore all default patients, doctors, appointments, beds, medicines, and billing records to their initial state.
            </p>
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDatabase();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
