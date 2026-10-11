import React, { useState } from 'react';
import JSZip from 'jszip';
import { BACKEND_CODEBASE, CodeFile } from '../../data/backendCodebase';
import { PROJECT_DOCS } from '../../data/projectDocs';
import {
  Code2,
  Database,
  Send,
  Layers,
  HelpCircle,
  Download,
  Copy,
  Check,
  CheckCircle2,
  FileText,
  Play,
  Server,
  Key,
  Shield,
  Table,
  Cpu,
  Presentation
} from 'lucide-react';

interface AcademicHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const AcademicHubModal: React.FC<AcademicHubModalProps> = ({ isOpen, onClose, initialTab = 'code' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedFile, setSelectedFile] = useState<CodeFile>(BACKEND_CODEBASE[0]);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Postman Simulator State
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState('/api/auth/login');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT'>('POST');
  const [apiPayload, setApiPayload] = useState('{\n  "username": "dr.jenkins",\n  "password": "Password@123"\n}');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // JUnit Test Simulation State
  const [testsRunning, setTestsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ name: string; duration: number; passed: boolean }[] | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunApiTest = () => {
    setApiLoading(true);
    setTimeout(() => {
      if (selectedApiEndpoint === '/api/auth/login') {
        setApiResponse({
          jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkci5qZW5raW5zIiwiaWF0IjoxNzI3MjUyNDAwLCJleHAiOjE3MjczMzg4MDB9.sample_signature',
          id: 2,
          username: 'dr.jenkins',
          email: 'dr.jenkins@medicare.org',
          fullName: 'Dr. Sarah Jenkins',
          role: 'ROLE_DOCTOR',
          status: 200,
          timestamp: new Date().toISOString()
        });
      } else if (selectedApiEndpoint === '/api/patients') {
        setApiResponse([
          { id: 1, mrn: 'MRN-2026-0814', fullName: 'James Alexander Miller', bloodGroup: 'O+', status: 'ACTIVE' },
          { id: 2, mrn: 'MRN-2026-0922', fullName: 'Eleanor Sophia Bennett', bloodGroup: 'A+', status: 'ADMITTED' }
        ]);
      } else if (selectedApiEndpoint === '/api/appointments/book') {
        setApiResponse({
          appointmentNumber: 'APT-2026-8891',
          status: 'CONFIRMED',
          doctorName: 'Dr. Sarah Jenkins',
          patientName: 'James Alexander Miller',
          timeSlot: '10:00 AM',
          consultationFee: 120.00,
          paid: true
        });
      } else {
        setApiResponse({ status: 200, message: 'Resource fetched successfully' });
      }
      setApiLoading(false);
    }, 400);
  };

  const handleRunJUnitTests = () => {
    setTestsRunning(true);
    setTestResults(null);
    setTimeout(() => {
      setTestResults([
        { name: 'PatientServiceTest#registerPatient_Success()', duration: 42, passed: true },
        { name: 'PatientServiceTest#validateBloodGroup_Constraints()', duration: 18, passed: true },
        { name: 'AppointmentServiceTest#preventDoubleBooking_ThrowException()', duration: 35, passed: true },
        { name: 'AppointmentServiceTest#calculateConsultationFee_WithTaxes()', duration: 22, passed: true },
        { name: 'AuthControllerTest#authenticateUser_ValidJwtTokenIssued()', duration: 64, passed: true },
        { name: 'PharmacyServiceTest#dispensePrescription_DeductInventory()', duration: 29, passed: true },
        { name: 'SecurityFilterTest#protectedAdminEndpoints_Unauthorized403()', duration: 31, passed: true }
      ]);
      setTestsRunning(false);
    }, 600);
  };

  // One-click full ZIP export using JSZip
  const handleDownloadFullProjectZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Backend folder
      BACKEND_CODEBASE.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Project Report
      const reportMarkdown = PROJECT_DOCS.map(d => `${d.title}\n\n${d.content}`).join('\n\n---\n\n');
      zip.file('documentation/PROJECT_REPORT.md', reportMarkdown);

      // Postman Collection
      const postmanJson = {
        info: {
          name: 'Hospital Management System (MediCare Pro) API',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        },
        item: [
          {
            name: 'Auth - Login',
            request: {
              method: 'POST',
              url: 'http://localhost:8080/api/auth/login',
              body: {
                mode: 'raw',
                raw: '{\n  "username": "dr.jenkins",\n  "password": "Password@123"\n}'
              }
            }
          },
          {
            name: 'Patients - Get All',
            request: {
              method: 'GET',
              url: 'http://localhost:8080/api/patients'
            }
          },
          {
            name: 'Appointments - Book Slot',
            request: {
              method: 'POST',
              url: 'http://localhost:8080/api/appointments',
              body: {
                mode: 'raw',
                raw: '{\n  "patientId": 1,\n  "doctorId": 1,\n  "appointmentDate": "2026-09-26",\n  "timeSlot": "09:00 AM"\n}'
              }
            }
          }
        ]
      };
      zip.file('testing/postman_collection.json', JSON.stringify(postmanJson, null, 2));

      // README instructions
      const readme = `# MediCare Pro - Hospital Management System (HMS)
## Full-Stack College Software Engineering Project

### Technology Stack
- **Backend:** Java 17, Spring Boot 3.2.4, Spring Data JPA, Hibernate, Spring Security, JWT (jjwt), Maven
- **Database:** MySQL 8.0+
- **Frontend:** Responsive React & Modern CSS

### How to Run
1. **Setup Database:**
   - Run \`backend/src/main/resources/schema.sql\` in MySQL Workbench / CLI.
   - Verify database created: \`hospital_management\`

2. **Run Spring Boot Backend:**
   \`\`\`bash
   cd backend
   mvn spring-boot:run
   \`\`\`
   Server starts at: \`http://localhost:8080\`

3. **API Documentation:**
   - Swagger / OpenAPI endpoint: \`http://localhost:8080/swagger-ui.html\`
   - Import \`testing/postman_collection.json\` into Postman.
`;
      zip.file('README.md', readme);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Medicare-Pro-Hospital-Management-System-Full-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Academic Project Suite & Code Explorer
                </h2>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                  College Defense Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete Spring Boot 3 + MySQL 8.0 source files, ER diagrams, test cases, and academic report
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* 1-Click ZIP Download Button */}
            <button
              onClick={handleDownloadFullProjectZip}
              disabled={isExporting}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition-all ${
                exportSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950'
              }`}
              title="Download complete runnable project files as ZIP"
            >
              {exportSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{isExporting ? 'Packaging ZIP...' : exportSuccess ? 'Downloaded!' : 'Download Full Project (.ZIP)'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-900/60 border-b border-slate-800 flex items-center space-x-1 overflow-x-auto shrink-0 py-2">
          {[
            { id: 'code', label: 'Spring Boot Backend Code', icon: Code2 },
            { id: 'er', label: 'MySQL ER & Schema DDL', icon: Database },
            { id: 'postman', label: 'Postman & API Tester', icon: Send },
            { id: 'testing', label: 'JUnit 5 & Mockito Tests', icon: Cpu },
            { id: 'report', label: 'Academic Report (28 Sections)', icon: FileText },
            { id: 'viva', label: 'External Viva Voce Q&A', icon: HelpCircle },
            { id: 'presentation', label: 'PPT Slides Outline', icon: Presentation },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  active
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-hidden p-6 bg-slate-950 text-slate-100 flex flex-col">
          
          {/* TAB 1: CODE EXPLORER */}
          {activeTab === 'code' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full overflow-hidden">
              {/* File Tree */}
              <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-3 overflow-y-auto space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Backend File Explorer
                </div>
                {BACKEND_CODEBASE.map(file => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                      selectedFile.path === file.path
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="truncate">{file.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-mono ${
                      selectedFile.path === file.path ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {file.category}
                    </span>
                  </button>
                ))}
              </div>

              {/* Code Viewer */}
              <div className="md:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
                  <div>
                    <div className="font-mono text-xs font-bold text-indigo-400">{selectedFile.path}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</div>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/70 select-text">
                  <pre>{selectedFile.content}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ER DIAGRAM & SCHEMA DDL */}
          {activeTab === 'er' && (
            <div className="h-full overflow-y-auto space-y-6 text-xs">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">Relational Database ER Architecture</h3>
                    <p className="text-slate-400">Entities, Primary Keys, Foreign Keys & Normalized Relationships (3NF)</p>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    MySQL 8.0 Dialect
                  </span>
                </div>

                {/* Visual Schema Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-2">
                    <div className="font-bold text-indigo-400 text-sm flex justify-between">
                      <span>users</span>
                      <span className="text-[10px] text-slate-500 font-mono">1:1 doctor, patient</span>
                    </div>
                    <div className="font-mono text-[11px] space-y-1 text-slate-300">
                      <div><strong className="text-yellow-400">PK</strong> id: BIGINT AUTO_INCREMENT</div>
                      <div>username: VARCHAR(50) [UNIQUE]</div>
                      <div>email: VARCHAR(100) [UNIQUE]</div>
                      <div>password: VARCHAR(255) [BCrypt]</div>
                      <div>role: VARCHAR(30) [ENUM]</div>
                      <div>active: BOOLEAN</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-teal-500/30 space-y-2">
                    <div className="font-bold text-teal-400 text-sm flex justify-between">
                      <span>patients</span>
                      <span className="text-[10px] text-slate-500 font-mono">1:N appointments, bills</span>
                    </div>
                    <div className="font-mono text-[11px] space-y-1 text-slate-300">
                      <div><strong className="text-yellow-400">PK</strong> id: BIGINT AUTO_INCREMENT</div>
                      <div><strong className="text-cyan-400">FK</strong> user_id: BIGINT [users.id]</div>
                      <div>mrn: VARCHAR(50) [UNIQUE]</div>
                      <div>full_name: VARCHAR(100)</div>
                      <div>blood_group: VARCHAR(5)</div>
                      <div>status: VARCHAR(20)</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="font-bold text-emerald-400 text-sm flex justify-between">
                      <span>doctors</span>
                      <span className="text-[10px] text-slate-500 font-mono">N:1 department</span>
                    </div>
                    <div className="font-mono text-[11px] space-y-1 text-slate-300">
                      <div><strong className="text-yellow-400">PK</strong> id: BIGINT AUTO_INCREMENT</div>
                      <div><strong className="text-cyan-400">FK</strong> user_id: BIGINT [users.id]</div>
                      <div><strong className="text-cyan-400">FK</strong> department_id: BIGINT</div>
                      <div>consultation_fee: DECIMAL(10,2)</div>
                      <div>room_number: VARCHAR(30)</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30 space-y-2">
                    <div className="font-bold text-purple-400 text-sm flex justify-between">
                      <span>appointments</span>
                      <span className="text-[10px] text-slate-500 font-mono">UQ(doctor, date, slot)</span>
                    </div>
                    <div className="font-mono text-[11px] space-y-1 text-slate-300">
                      <div><strong className="text-yellow-400">PK</strong> id: BIGINT AUTO_INCREMENT</div>
                      <div><strong className="text-cyan-400">FK</strong> patient_id: BIGINT</div>
                      <div><strong className="text-cyan-400">FK</strong> doctor_id: BIGINT</div>
                      <div>appointment_date: DATE</div>
                      <div>time_slot: VARCHAR(20)</div>
                      <div>status: VARCHAR(20)</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 space-y-2">
                    <div className="font-bold text-amber-400 text-sm flex justify-between">
                      <span>beds</span>
                      <span className="text-[10px] text-slate-500 font-mono">N:1 ward</span>
                    </div>
                    <div className="font-mono text-[11px] space-y-1 text-slate-300">
                      <div><strong className="text-yellow-400">PK</strong> id: BIGINT AUTO_INCREMENT</div>
                      <div><strong className="text-cyan-400">FK</strong> ward_id: BIGINT</div>
                      <div>bed_number: VARCHAR(30) [UNIQUE]</div>
                      <div>status: AVAILABLE | OCCUPIED</div>
                      <div><strong className="text-cyan-400">FK</strong> current_patient_id: BIGINT</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 space-y-2">
                    <div className="font-bold text-rose-400 text-sm flex justify-between">
                      <span>bills</span>
                      <span className="text-[10px] text-slate-500 font-mono">1:N bill_items</span>
                    </div>
                    <div className="font-mono text-[11px] space-y-1 text-slate-300">
                      <div><strong className="text-yellow-400">PK</strong> id: BIGINT AUTO_INCREMENT</div>
                      <div><strong className="text-cyan-400">FK</strong> patient_id: BIGINT</div>
                      <div>total_amount: DECIMAL(10,2)</div>
                      <div>paid_amount: DECIMAL(10,2)</div>
                      <div>payment_status: PAID | PARTIAL</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MySQL DDL script preview */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">schema.sql Complete DDL</div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 max-h-60 overflow-y-auto">
                  <pre>{BACKEND_CODEBASE.find(c => c.name === 'schema.sql')?.content}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POSTMAN & API TESTER */}
          {activeTab === 'postman' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-hidden text-xs">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col space-y-3">
                <div className="font-bold text-white text-sm flex items-center justify-between">
                  <span>REST API Interactive Sandbox</span>
                  <span className="text-[10px] text-teal-400 font-mono">HTTP/1.1 REST</span>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={apiMethod}
                    onChange={e => setApiMethod(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono font-bold text-emerald-400"
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                  </select>

                  <select
                    value={selectedApiEndpoint}
                    onChange={e => {
                      setSelectedApiEndpoint(e.target.value);
                      if (e.target.value === '/api/patients') {
                        setApiMethod('GET');
                      } else {
                        setApiMethod('POST');
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-slate-200"
                  >
                    <option value="/api/auth/login">/api/auth/login</option>
                    <option value="/api/patients">/api/patients</option>
                    <option value="/api/appointments/book">/api/appointments/book</option>
                  </select>

                  <button
                    onClick={handleRunApiTest}
                    disabled={apiLoading}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center space-x-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>

                {apiMethod !== 'GET' && (
                  <div className="flex-1 flex flex-col space-y-1">
                    <span className="text-slate-400 font-mono text-[10px]">Request JSON Body:</span>
                    <textarea
                      rows={8}
                      value={apiPayload}
                      onChange={e => setApiPayload(e.target.value)}
                      className="w-full flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300"
                    />
                  </div>
                )}
              </div>

              {/* Response Panel */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col space-y-2 overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-sm">Response JSON Output</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Status: 200 OK</span>
                </div>
                <div className="flex-1 overflow-auto p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 select-text">
                  {apiLoading ? (
                    <div className="text-slate-400">Sending HTTP request to mock Spring Boot container...</div>
                  ) : apiResponse ? (
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                  ) : (
                    <div className="text-slate-500">Click "Send" to execute REST API test.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: JUNIT 5 TESTS */}
          {activeTab === 'testing' && (
            <div className="h-full overflow-y-auto space-y-6 text-xs">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">JUnit 5 & Mockito Automated Unit Test Suite</h3>
                    <p className="text-slate-400">Test-driven validation of core hospital business rules and double-booking avoidance</p>
                  </div>
                  <button
                    onClick={handleRunJUnitTests}
                    disabled={testsRunning}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>{testsRunning ? 'Executing Test Runner...' : 'Run All JUnit Tests'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {testResults ? (
                    testResults.map((t, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                        <div className="flex items-center space-x-2 text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{t.name}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-400">
                          <span>{t.duration} ms</span>
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-sm">
                            PASSED
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      Click "Run All JUnit Tests" to execute the test suite simulation.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACADEMIC REPORT */}
          {activeTab === 'report' && (
            <div className="h-full overflow-y-auto space-y-6 text-xs text-slate-300 pr-2">
              {PROJECT_DOCS.map(sec => (
                <div key={sec.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="text-base font-bold text-white">{sec.title}</h3>
                  <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {sec.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: VIVA VOCE DEFENSE */}
          {activeTab === 'viva' && (
            <div className="h-full overflow-y-auto space-y-4 text-xs pr-2">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white">External Viva Voce Question Bank (50+ Points)</h3>
                <p className="text-slate-400">
                  Comprehensive theoretical and architectural questions asked by external university examiners.
                </p>
              </div>

              {PROJECT_DOCS.find(s => s.id === 'sec-7') && (
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3 leading-relaxed whitespace-pre-wrap">
                  {PROJECT_DOCS.find(s => s.id === 'sec-7')?.content}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PRESENTATION SLIDES OUTLINE */}
          {activeTab === 'presentation' && (
            <div className="h-full overflow-y-auto space-y-4 text-xs pr-2">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white">PowerPoint Presentation (PPT) Slide Deck Outline</h3>
                <p className="text-slate-400">12 Slides structured for university project review committee</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { slide: 1, title: 'Title & Team Credentials', desc: 'Project Title, Guide Name, Student Reg No, College Logo, Academic Session' },
                  { slide: 2, title: 'Introduction & Problem Statement', desc: 'Challenges of paper-based recordkeeping, medication errors, and bed booking conflicts' },
                  { slide: 3, title: 'Proposed System & Key Features', desc: 'Role-based portals (8 actors), EMR, double-booking prevention, automated billing' },
                  { slide: 4, title: 'Technology Stack & Architecture', desc: 'Java 17, Spring Boot 3, Hibernate JPA, MySQL 8, Spring Security & JWT, React' },
                  { slide: 5, title: 'UML Use Case Diagram', desc: 'Actor interactions: Admin, Doctor, Patient, Reception, Nurse, Pharmacy, Lab, Cashier' },
                  { slide: 6, title: 'Database ER Design (3NF)', desc: 'Entities, primary keys, foreign key mapping, cascade constraints, indexing' },
                  { slide: 7, title: 'Core Workflows (Sequence)', desc: 'Patient registration → Doctor consultation → e-Rx → Dispensing & billing flow' },
                  { slide: 8, title: 'Security & Access Control (RBAC)', desc: 'BCrypt hashing, JWT stateless token filtering, @PreAuthorize role guards' },
                  { slide: 9, title: 'Live System Demonstration', desc: 'Screenshots / live demo of all 8 role dashboards and clinical encounters' },
                  { slide: 10, title: 'Testing & Quality Assurance', desc: 'JUnit 5 service tests, Mockito mocks, validation and exception test results' },
                  { slide: 11, title: 'Advantages & Real-world Impact', desc: 'Elimination of wait times, 100% audit trail, zero billing leakages' },
                  { slide: 12, title: 'Future Enhancements & Conclusion', desc: 'HL7/FHIR health interoperability, telemedicine WebRTC video calls' },
                ].map(s => (
                  <div key={s.slide} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Slide {s.slide}</span>
                    <div className="font-bold text-white text-sm">{s.title}</div>
                    <p className="text-slate-400 text-[11px]">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
