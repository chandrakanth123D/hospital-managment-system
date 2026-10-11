import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Bill } from '../../types/hospital';
import {
  DollarSign,
  ReceiptText,
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const AccountantDashboardView: React.FC = () => {
  const {
    bills,
    patients,
    recordPayment,
    createBill
  } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);
  const [selectedBillForPrint, setSelectedBillForPrint] = useState<Bill | null>(null);

  // Payment Modal State
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'INSURANCE'>('CASH');
  const [payRef, setPayRef] = useState('');

  // Aggregates
  const totalBilled = bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPaid = bills.reduce((acc, b) => acc + b.paidAmount, 0);
  const totalOutstanding = bills.reduce((acc, b) => acc + b.balanceAmount, 0);

  const handleOpenPayment = (bill: Bill) => {
    setSelectedBillForPayment(bill);
    setPayAmount(bill.balanceAmount);
    setPayRef('TXN-' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillForPayment) return;

    recordPayment(selectedBillForPayment.id, payAmount, payMethod, payRef);
    setSelectedBillForPayment(null);
  };

  const filteredBills = bills.filter(b => {
    const matchesSearch = b.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Revenue Cycle & Accounts Settlement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Financial Accounting & Invoicing
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Consolidated itemized ledger for outpatient visits, bed occupancy, pharmacy orders, lab diagnostic assays, and multi-channel reconciliation.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <span className="text-xs text-emerald-200">Total Collections</span>
              <div className="text-2xl font-black text-white">
                ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Total Invoiced</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ReceiptText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">
            ${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-slate-500">Across {bills.length} patient bills</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Revenue Realized</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">
            ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-emerald-700 font-semibold">Cash / Card / UPI reconciled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Outstanding Receivables</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-3">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-rose-700 font-semibold">Pending settlement</span>
        </div>
      </div>

      {/* Invoices Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Invoices Master Ledger</h3>
            <p className="text-slate-500">Track consultation fees, bed daily charges, and medicines</p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">PAID</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="PENDING">PENDING</option>
            </select>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoice or patient..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 w-full sm:w-56"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Billed Amount</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-3 text-right">Balance</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {b.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {b.patientName}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {b.date}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ${b.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600">
                    ${b.paidAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                    ${b.balanceAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      b.paymentStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedBillForPrint(b)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-[11px] font-semibold flex items-center space-x-1"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>

                      {b.balanceAmount > 0 && (
                        <button
                          onClick={() => handleOpenPayment(b)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Collect</span>
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

      {/* Record Payment Modal */}
      {selectedBillForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Collect Cashier Payment</h3>
                <p className="text-slate-500">
                  {selectedBillForPayment.invoiceNumber} • {selectedBillForPayment.patientName}
                </p>
              </div>
              <button onClick={() => setSelectedBillForPayment(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Total:</span>
                  <span className="font-bold text-slate-900">${selectedBillForPayment.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Already Settled:</span>
                  <span className="font-semibold text-emerald-600">${selectedBillForPayment.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-rose-600">
                  <span>Remaining Balance:</span>
                  <span>${selectedBillForPayment.balanceAmount.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount to Pay ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  max={selectedBillForPayment.balanceAmount}
                  value={payAmount}
                  onChange={e => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="UPI">UPI / Digital QR</option>
                  <option value="NET_BANKING">Net Banking</option>
                  <option value="INSURANCE">Insurance TPA</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction Reference</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={e => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  placeholder="TXN-XXXX"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedBillForPayment(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Post Payment & Settle
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
              <span className="text-[10px] text-slate-400">Authorized Cashier Stamp: Victoria Sterling, CPA</span>
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
