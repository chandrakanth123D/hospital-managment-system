import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { LabReport, LabResultItem } from '../../types/hospital';
import {
  Microscope,
  FileCheck,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  AlertCircle,
  Eye,
  FileText
} from 'lucide-react';

export const LabDashboardView: React.FC = () => {
  const {
    labReports,
    labTests,
    updateLabReportResults
  } = useHospital();

  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [pathologistNotes, setPathologistNotes] = useState('');

  // Sample result parameters to enter
  const [resultRows, setResultRows] = useState<LabResultItem[]>([
    {
      parameter: 'Fasting Blood Glucose',
      value: '105',
      unit: 'mg/dL',
      referenceRange: '70 - 99',
      status: 'HIGH'
    },
    {
      parameter: 'HbA1c',
      value: '6.2',
      unit: '%',
      referenceRange: '< 5.7',
      status: 'HIGH'
    }
  ]);

  const pendingReports = labReports.filter(r => r.status === 'PENDING' || r.status === 'IN_ANALYSIS');
  const completedReports = labReports.filter(r => r.status === 'COMPLETED');

  const handleOpenEntry = (rep: LabReport) => {
    setSelectedReport(rep);
    if (rep.results && rep.results.length > 0) {
      setResultRows(rep.results);
    } else {
      // Default parameters based on test
      setResultRows([
        {
          parameter: `${rep.testName} Primary Assay`,
          value: '14.2',
          unit: 'units',
          referenceRange: '10.0 - 20.0',
          status: 'NORMAL'
        },
        {
          parameter: 'Secondary Biomarker',
          value: '0.8',
          unit: 'mg/L',
          referenceRange: '< 1.0',
          status: 'NORMAL'
        }
      ]);
    }
    setPathologistNotes(rep.pathologistImpression || 'Parameters evaluated. Clinical correlation recommended.');
    setShowResultModal(true);
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    updateLabReportResults(selectedReport.id, resultRows, pathologistNotes);
    setShowResultModal(false);
    setSelectedReport(null);
  };

  const handleUpdateRow = (index: number, field: keyof LabResultItem, val: string) => {
    const updated = [...resultRows];
    (updated[index] as any)[field] = val;
    setResultRows(updated);
  };

  return (
    <div className="space-y-6">
      {/* Lab Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3 border border-cyan-500/30">
              <Microscope className="w-3.5 h-3.5" />
              <span>Clinical Pathology & Diagnostic Imaging</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Diagnostic Laboratory Terminal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Work order management, specimen accessioning, reference interval flagging, and automated reporting to physician dashboards.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
            <span className="text-xs text-cyan-200">Requisitions in Queue</span>
            <div className="text-2xl font-black text-white">{pendingReports.length} Pending</div>
          </div>
        </div>
      </div>

      {/* Lab Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Total Work Orders</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{labReports.length}</div>
          <span className="text-slate-500">Diagnostic requisitions</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Awaiting Analysis</span>
          <div className="text-2xl font-bold text-cyan-600 mt-1">{pendingReports.length}</div>
          <span className="text-cyan-700 font-medium">In technician queue</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Verified & Dispatched</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{completedReports.length}</div>
          <span className="text-emerald-700 font-medium">Pathologist signed</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Assay Menu</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{labTests.length} Tests</div>
          <span className="text-slate-500">Available panels</span>
        </div>
      </div>

      {/* Main Grid: Pending Work Orders & Completed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requisitions Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Diagnostic Work Orders Queue</h3>
              <p className="text-xs text-slate-500">Specimens waiting for quantitative analysis</p>
            </div>
            <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
              {pendingReports.length} Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {pendingReports.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                All laboratory investigations have been processed and signed.
              </div>
            ) : (
              pendingReports.map(rep => (
                <div key={rep.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{rep.testName}</span>
                      <span className="font-mono text-[10px] text-slate-400">({rep.reportNumber})</span>
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      Patient: <span className="font-semibold text-slate-800">{rep.patientName}</span> ({rep.patientAge}y, {rep.patientGender})
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-3">
                      <span>Ordered by: {rep.doctorName}</span>
                      <span>•</span>
                      <span>Category: {rep.testCategory}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {rep.status}
                    </span>
                    <button
                      onClick={() => handleOpenEntry(rep)}
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Enter Results</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Completed Pathology Reports */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Dispatched Reports</h3>
              <p className="text-xs text-slate-500">Available to attending physicians</p>
            </div>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3 text-xs">
            {completedReports.map(rep => (
              <div key={rep.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rep.testName}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    COMPLETED
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Patient: <span className="font-semibold text-slate-800">{rep.patientName}</span>
                </div>
                {rep.results && rep.results.length > 0 && (
                  <div className="space-y-1 text-[11px] font-mono">
                    {rep.results.slice(0, 2).map((r, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-slate-600">{r.parameter}:</span>
                        <span className={r.status === 'HIGH' ? 'text-rose-600 font-bold' : 'text-slate-900 font-bold'}>
                          {r.value} {r.unit} ({r.status})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {rep.pathologistImpression && (
                  <p className="text-[10px] text-slate-500 italic line-clamp-2">
                    "{rep.pathologistImpression}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Enter Diagnostic Findings */}
      {showResultModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                  Report: {selectedReport.reportNumber}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  Upload Findings: {selectedReport.testName}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Patient: {selectedReport.patientName} ({selectedReport.patientAge}y, {selectedReport.patientGender})
                </p>
              </div>
              <button onClick={() => setShowResultModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveResults} className="space-y-4">
              <div className="space-y-2">
                <div className="font-bold text-slate-700">Quantitative Assay Parameters</div>
                {resultRows.map((row, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Parameter</label>
                      <input
                        type="text"
                        value={row.parameter}
                        onChange={e => handleUpdateRow(idx, 'parameter', e.target.value)}
                        className="w-full px-2 py-1 rounded-md border border-slate-200 bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Result Value</label>
                      <input
                        type="text"
                        value={row.value}
                        onChange={e => handleUpdateRow(idx, 'value', e.target.value)}
                        className="w-full px-2 py-1 rounded-md border border-slate-200 bg-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Ref Range</label>
                      <input
                        type="text"
                        value={row.referenceRange}
                        onChange={e => handleUpdateRow(idx, 'referenceRange', e.target.value)}
                        className="w-full px-2 py-1 rounded-md border border-slate-200 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Flag</label>
                      <select
                        value={row.status}
                        onChange={e => handleUpdateRow(idx, 'status', e.target.value)}
                        className="w-full px-2 py-1 rounded-md border border-slate-200 bg-white font-bold"
                      >
                        <option value="NORMAL">NORMAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pathologist Impression & Diagnostic Notes</label>
                <textarea
                  rows={3}
                  required
                  value={pathologistNotes}
                  onChange={e => setPathologistNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-md flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Sign Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
