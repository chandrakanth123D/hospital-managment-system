import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  CalendarPlus,
  CalendarCheck,
  FileHeart,
  Pill,
  Microscope,
  ReceiptText,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

export const PatientDashboardView: React.FC = () => {
  const {
    currentUser,
    patients,
    doctors,
    departments,
    appointments,
    prescriptions,
    labReports,
    bills,
    bookAppointment,
    updateAppointmentStatus
  } = useHospital();

  // Find active patient entity
  const currentPatient = patients.find(p => p.userId === currentUser?.id) || patients[0];

  const myAppointments = appointments.filter(a => a.patientId === currentPatient.id);
  const myPrescriptions = prescriptions.filter(p => p.patientId === currentPatient.id);
  const myLabReports = labReports.filter(r => r.patientId === currentPatient.id);
  const myBills = bills.filter(b => b.patientId === currentPatient.id);

  // Book Appointment Modal State
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('2026-09-26');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [bookingMessage, setBookingMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Selected Bill for Printable Modal
  const [selectedBillForPrint, setSelectedBillForPrint] = useState<(typeof bills)[0] | null>(null);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingMessage(null);

    const result = bookAppointment({
      patientId: currentPatient.id,
      doctorId: selectedDoctorId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      reason: reason || 'General medical consultation'
    });

    if (result.success) {
      setBookingMessage({ text: result.message, error: false });
      setTimeout(() => {
        setShowBookModal(false);
        setBookingMessage(null);
        setReason('');
      }, 1500);
    } else {
      setBookingMessage({ text: result.message, error: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentPatient.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'}
              alt={currentPatient.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/30"
            />
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Patient Health Portal</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">{currentPatient.fullName}</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                MRN: <span className="font-mono font-bold text-teal-300">{currentPatient.mrn}</span> • Blood Group: <span className="font-bold text-rose-300">{currentPatient.bloodGroup}</span> • Age: {currentPatient.age} yrs
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBookModal(true)}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-2 self-start md:self-auto"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">Appointments</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{myAppointments.length}</div>
          <div className="text-slate-500 mt-1">Upcoming & Past</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">Active Prescriptions</div>
          <div className="text-2xl font-bold text-teal-600 mt-1">{myPrescriptions.length}</div>
          <div className="text-slate-500 mt-1">Prescribed courses</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">Lab Reports</div>
          <div className="text-2xl font-bold text-cyan-600 mt-1">{myLabReports.length}</div>
          <div className="text-slate-500 mt-1">Diagnostic results</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">Outstanding Bills</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ${myBills.reduce((acc, b) => acc + b.balanceAmount, 0).toFixed(2)}
          </div>
          <div className="text-slate-500 mt-1">Due balance</div>
        </div>
      </div>

      {/* Main Grid: Appointments & Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Appointments */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">My Appointments</h3>
              <p className="text-xs text-slate-500">Upcoming visits and completed consultations</p>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="text-xs text-teal-600 hover:text-teal-700 font-bold"
            >
              + New Booking
            </button>
          </div>

          <div className="space-y-3">
            {myAppointments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No appointments found. Book your first consultation above!
              </div>
            ) : (
              myAppointments.map(apt => (
                <div key={apt.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{apt.doctorName}</span>
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-semibold border border-teal-200">
                        {apt.departmentName}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1 flex items-center space-x-2 text-[11px]">
                      <span>{apt.date} at {apt.timeSlot}</span>
                      <span>•</span>
                      <span>Fee: ${apt.consultationFee}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                      apt.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      apt.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {apt.status}
                    </span>
                    {apt.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED', 'Cancelled by patient')}
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Active Prescriptions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Prescribed Medications</h3>
              <p className="text-xs text-slate-500">Dosage schedules and directions from attending physician</p>
            </div>
            <Pill className="w-4 h-4 text-teal-600" />
          </div>

          <div className="space-y-3">
            {myPrescriptions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No prescriptions issued yet.
              </div>
            ) : (
              myPrescriptions.map(rx => (
                <div key={rx.id} className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 font-mono">{rx.prescriptionNumber}</span>
                      <span className="text-slate-400 ml-2">by {rx.doctorName}</span>
                    </div>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-bold">
                      {rx.status}
                    </span>
                  </div>
                  <div className="text-slate-700 font-medium">Diagnosis: {rx.diagnosis}</div>
                  <div className="space-y-1.5 pt-1">
                    {rx.items.map(item => (
                      <div key={item.id} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-slate-900">{item.medicineName}</span>
                          <span className="text-slate-400 ml-2">({item.dosage})</span>
                          <div className="text-slate-500">{item.frequency} for {item.duration}</div>
                        </div>
                        <div className="text-right text-[10px] text-teal-700 font-medium">
                          {item.instructions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Lab Reports & Billing Statements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diagnostic Reports */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Laboratory & Radiology Findings</h3>
              <p className="text-xs text-slate-500">Verified pathology parameters and imaging reports</p>
            </div>
            <Microscope className="w-4 h-4 text-cyan-600" />
          </div>

          <div className="space-y-3">
            {myLabReports.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No diagnostic reports currently on file.
              </div>
            ) : (
              myLabReports.map(rep => (
                <div key={rep.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{rep.testName}</span>
                      <span className="text-slate-400 ml-2 font-mono text-[10px]">({rep.reportNumber})</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {rep.status}
                    </span>
                  </div>

                  {rep.results && rep.results.length > 0 && (
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden text-[11px]">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="py-1 px-2 font-semibold">Test Parameter</th>
                            <th className="py-1 px-2 font-semibold">Result Value</th>
                            <th className="py-1 px-2 font-semibold">Reference Range</th>
                            <th className="py-1 px-2 font-semibold text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rep.results.map((r, i) => (
                            <tr key={i}>
                              <td className="py-1 px-2 font-medium">{r.parameter}</td>
                              <td className="py-1 px-2 font-bold font-mono">{r.value} {r.unit}</td>
                              <td className="py-1 px-2 text-slate-400">{r.referenceRange}</td>
                              <td className="py-1 px-2 text-center">
                                <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${
                                  r.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {rep.pathologistImpression && (
                    <p className="text-[11px] text-slate-600 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                      <span className="font-bold text-amber-900">Impression:</span> {rep.pathologistImpression}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Billing & Receipts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Billing Invoices & Receipts</h3>
              <p className="text-xs text-slate-500">Download official tax invoices and payment slips</p>
            </div>
            <ReceiptText className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {myBills.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No billing statements recorded.
              </div>
            ) : (
              myBills.map(bill => (
                <div key={bill.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 font-mono">{bill.invoiceNumber}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        bill.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        bill.paymentStatus === 'PARTIAL' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {bill.paymentStatus}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1 text-[11px]">
                      Date: {bill.date} • Total: <span className="font-bold text-slate-800">${bill.totalAmount}</span>
                      {bill.balanceAmount > 0 && (
                        <span className="text-rose-600 font-bold ml-2">Due: ${bill.balanceAmount}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBillForPrint(bill)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold flex items-center space-x-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View / Print</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Schedule Doctor Consultation</h3>
              <button
                onClick={() => {
                  setShowBookModal(false);
                  setBookingMessage(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {bookingMessage && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center space-x-2 ${
                bookingMessage.error
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}>
                {bookingMessage.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{bookingMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Physician / Specialist</label>
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.departmentName}) - ${d.consultationFee}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Slot</label>
                  <select
                    value={selectedTimeSlot}
                    onChange={e => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    {selectedDoctor.timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chief Reason for Consultation</label>
                <textarea
                  rows={2}
                  placeholder="Describe your symptoms or reason for visit..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-800 flex items-center justify-between">
                <span>Doctor Consultation Fee:</span>
                <span className="font-bold text-sm text-teal-900">${selectedDoctor.consultationFee}.00</span>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md flex items-center space-x-2"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Confirm Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedBillForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Medicare Pro Hospital</h2>
                <p className="text-slate-400 text-[10px]">Official Tax Invoice & Health Receipt</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-slate-800">{selectedBillForPrint.invoiceNumber}</span>
                <div className="text-[10px] text-slate-400">Date: {selectedBillForPrint.date}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 flex justify-between">
              <div>
                <span className="text-slate-400">Billed To:</span>
                <div className="font-bold text-slate-900">{selectedBillForPrint.patientName}</div>
              </div>
              <div>
                <span className="text-slate-400">Payment Status:</span>
                <div className="font-bold text-emerald-600">{selectedBillForPrint.paymentStatus}</div>
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-4">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="py-1">Description</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Unit Price</th>
                  <th className="py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedBillForPrint.items.map(it => (
                  <tr key={it.id}>
                    <td className="py-2 font-medium">{it.description}</td>
                    <td className="py-2 text-center">{it.quantity}</td>
                    <td className="py-2 text-right">${it.unitPrice.toFixed(2)}</td>
                    <td className="py-2 text-right font-bold">${it.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-right font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>${selectedBillForPrint.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (5%):</span>
                <span>${selectedBillForPrint.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Grand Total:</span>
                <span>${selectedBillForPrint.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Paid Amount:</span>
                <span>${selectedBillForPrint.paidAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Authorized System Generated Invoice</span>
              <button
                onClick={() => setSelectedBillForPrint(null)}
                className="px-4 py-2 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
