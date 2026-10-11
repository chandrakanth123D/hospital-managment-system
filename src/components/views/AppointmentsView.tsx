import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { AppointmentStatus } from '../../types/hospital';
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarPlus,
  AlertTriangle,
  Stethoscope,
  Building2
} from 'lucide-react';

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    doctors,
    patients,
    departments,
    bookAppointment,
    updateAppointmentStatus
  } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showBookModal, setShowBookModal] = useState(false);

  // New Booking State
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [bookingDate, setBookingDate] = useState('2026-09-26');
  const [bookingTime, setBookingTime] = useState('09:00 AM');
  const [reason, setReason] = useState('Routine consultation');
  const [bookingResult, setBookingResult] = useState<{ text: string; error?: boolean } | null>(null);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingResult(null);

    const res = bookAppointment({
      patientId: selectedPatientId,
      doctorId: selectedDoctorId,
      date: bookingDate,
      timeSlot: bookingTime,
      reason
    });

    if (res.success) {
      setBookingResult({ text: res.message, error: false });
      setTimeout(() => {
        setShowBookModal(false);
        setBookingResult(null);
      }, 1400);
    } else {
      setBookingResult({ text: res.message, error: true });
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.appointmentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Outpatient Appointments Master Schedule
          </h2>
          <p className="text-xs text-slate-500">
            Real-time consultation calendar with automated double-booking prevention logic
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses ({appointments.length})</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="BOOKED">BOOKED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, doctor, or apt ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Appointments Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Appointment #</th>
                <th className="py-3 px-3">Patient Details</th>
                <th className="py-3 px-3">Physician & Dept</th>
                <th className="py-3 px-3">Date & Slot</th>
                <th className="py-3 px-3">Fee / Paid</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {a.appointmentNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{a.patientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{a.patientPhone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{a.doctorName}</div>
                    <div className="text-[11px] text-teal-700 font-semibold">{a.departmentName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{a.date}</div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{a.timeSlot}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-slate-900">${a.consultationFee}</div>
                    <div className="text-[10px] text-emerald-600 font-bold">PAID</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      a.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      a.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                      a.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center space-x-1.5">
                      {a.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateAppointmentStatus(a.id, 'COMPLETED', 'Consultation finished')}
                          className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
                        >
                          Complete
                        </button>
                      )}
                      {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
                        <button
                          onClick={() => updateAppointmentStatus(a.id, 'CANCELLED', 'Cancelled by front desk')}
                          className="px-2 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Book Outpatient Consultation</h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {bookingResult && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center space-x-2 ${
                bookingResult.error ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}>
                {bookingResult.error ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{bookingResult.text}</span>
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.mrn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physician</label>
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.fullName} ({d.departmentName}) - ${d.consultationFee}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {selectedDoctor.timeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consultation Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Recurrent fever and cough"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-800 flex justify-between items-center">
                <span>Double-Booking Safety:</span>
                <span className="font-bold text-[10px] bg-teal-200 text-teal-900 px-2 py-0.5 rounded-sm">
                  Active Concurrency Lock
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
