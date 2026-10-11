import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Medicine } from '../../types/hospital';
import {
  Pill,
  AlertTriangle,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  Package,
  Layers,
  ShoppingBag,
  ArrowUpDown
} from 'lucide-react';

export const PharmacyDashboardView: React.FC = () => {
  const {
    medicines,
    prescriptions,
    addMedicine,
    updateMedicineStock,
    dispensePrescription
  } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [dispenseMsg, setDispenseMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // New Medicine Form State
  const [newMed, setNewMed] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotics' as Medicine['category'],
    form: 'Tablet' as Medicine['form'],
    strength: '500 mg',
    batchNumber: 'BT-2026-01',
    expiryDate: '2028-06-30',
    stockQuantity: 200,
    minStockLevel: 50,
    unitPrice: 1.25,
    supplier: 'Apex Pharma'
  });

  const pendingRx = prescriptions.filter(p => p.status === 'PENDING');
  const lowStockMeds = medicines.filter(m => m.stockQuantity <= m.minStockLevel);
  const nearExpiryMeds = medicines.filter(m => {
    const exp = new Date(m.expiryDate);
    const now = new Date();
    const days = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return days <= 30;
  });

  const handleCreateMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;
    addMedicine(newMed);
    setShowAddMedModal(false);
    setNewMed({
      name: '',
      genericName: '',
      category: 'Antibiotics',
      form: 'Tablet',
      strength: '500 mg',
      batchNumber: 'BT-2026-01',
      expiryDate: '2028-06-30',
      stockQuantity: 200,
      minStockLevel: 50,
      unitPrice: 1.25,
      supplier: 'Apex Pharma'
    });
  };

  const handleDispense = (rxId: string) => {
    const res = dispensePrescription(rxId);
    setDispenseMsg({ text: res.message, error: !res.success });
    setTimeout(() => setDispenseMsg(null), 3000);
  };

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Pharmacy Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <Pill className="w-3.5 h-3.5" />
              <span>Pharmaceutical Formulary & Inventory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Pharmacy & Dispensing Terminal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time stock deduction on prescription verification, near-expiry alerts, batch tracking, and automatic invoice settlement.
            </p>
          </div>

          <button
            onClick={() => setShowAddMedModal(true)}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add / Restock Medicine</span>
          </button>
        </div>
      </div>

      {/* Pharmacy Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Formulary Catalog</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{medicines.length} Items</div>
          <span className="text-slate-500">Active SKUs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Pending e-Rx</span>
          <div className="text-2xl font-bold text-teal-600 mt-1">{pendingRx.length} Orders</div>
          <span className="text-slate-500">Awaiting dispensing</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Low Stock Alarms</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{lowStockMeds.length} Items</div>
          <span className="text-amber-700 font-medium">Re-order threshold</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Critical Expiry (&lt;30d)</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{nearExpiryMeds.length} Batches</div>
          <span className="text-rose-700 font-medium">Segregation needed</span>
        </div>
      </div>

      {dispenseMsg && (
        <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${
          dispenseMsg.error
            ? 'bg-rose-50 text-rose-800 border border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {dispenseMsg.error ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{dispenseMsg.text}</span>
        </div>
      )}

      {/* Main Grid: Pending Prescriptions Queue & Stock Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Prescriptions Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Prescription Queue ({pendingRx.length})</h3>
              <p className="text-xs text-slate-500">Doctor orders for verification</p>
            </div>
            <ShoppingBag className="w-4 h-4 text-teal-600" />
          </div>

          <div className="space-y-3 text-xs">
            {pendingRx.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                All doctor prescriptions have been fulfilled.
              </div>
            ) : (
              pendingRx.map(rx => (
                <div key={rx.id} className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-900">{rx.prescriptionNumber}</span>
                    <span className="text-[10px] text-slate-400">{rx.date}</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs">{rx.patientName}</div>
                  <div className="text-[11px] text-slate-600">Prescribed by: {rx.doctorName}</div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                    {rx.items.map(it => (
                      <div key={it.id} className="text-[11px] flex justify-between">
                        <span className="font-semibold text-slate-800">{it.medicineName} ({it.dosage})</span>
                        <span className="text-slate-400">{it.duration}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDispense(rx.id)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Dispense Medication</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Medicine Inventory Catalog */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Medicine Inventory Master</h3>
              <p className="text-xs text-slate-500">Live quantities, batch expiration, and unit costs</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search item or code..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 w-full sm:w-52"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Medicine Info</th>
                  <th className="py-3 px-3">Batch & Expiry</th>
                  <th className="py-3 px-3 text-center">Stock Level</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.map(m => {
                  const isLow = m.stockQuantity <= m.minStockLevel;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {m.genericName} • {m.form} ({m.strength})
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div>{m.batchNumber}</div>
                        <div className="text-slate-400">Exp: {m.expiryDate}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {m.stockQuantity} units
                        </span>
                        {isLow && (
                          <div className="text-[9px] text-rose-600 font-semibold mt-0.5">Low Stock!</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                        ${m.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => updateMedicineStock(m.id, 50)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                            title="Restock 50 units"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => updateMedicineStock(m.id, 100)}
                            className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-[10px] font-bold"
                            title="Restock 100 units"
                          >
                            +100
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Add / Restock Medicine */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Add Medicine to Hospital Formulary</h3>
              <button onClick={() => setShowAddMedModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateMed} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Augmentin"
                    value={newMed.name}
                    onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Generic Chemical Name</label>
                  <input
                    type="text"
                    placeholder="Amoxicillin + Clavulanic Acid"
                    value={newMed.genericName}
                    onChange={e => setNewMed({ ...newMed, genericName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newMed.category}
                    onChange={e => setNewMed({ ...newMed, category: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Analgesics">Analgesics</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="GI Tract">GI Tract</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Form</label>
                  <select
                    value={newMed.form}
                    onChange={e => setNewMed({ ...newMed, form: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 mg"
                    value={newMed.strength}
                    onChange={e => setNewMed({ ...newMed, strength: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newMed.batchNumber}
                    onChange={e => setNewMed({ ...newMed, batchNumber: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newMed.expiryDate}
                    onChange={e => setNewMed({ ...newMed, expiryDate: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newMed.unitPrice}
                    onChange={e => setNewMed({ ...newMed, unitPrice: parseFloat(e.target.value) || 1 })}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    value={newMed.stockQuantity}
                    onChange={e => setNewMed({ ...newMed, stockQuantity: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Threshold Alert</label>
                  <input
                    type="number"
                    value={newMed.minStockLevel}
                    onChange={e => setNewMed({ ...newMed, minStockLevel: parseInt(e.target.value) || 20 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
                >
                  Save into Formulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
