import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Department,
  Doctor,
  Patient,
  Appointment,
  Prescription,
  MedicalRecord,
  Ward,
  Bed,
  Admission,
  VitalSignsRecord,
  Medicine,
  LaboratoryTest,
  LabReport,
  Bill,
  HospitalNotification,
  AppointmentStatus,
  PrescriptionItem,
  LabResultItem
} from '../types/hospital';

import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_WARDS,
  INITIAL_BEDS,
  INITIAL_ADMISSIONS,
  INITIAL_VITALS,
  INITIAL_MEDICINES,
  INITIAL_LAB_TESTS,
  INITIAL_LAB_REPORTS,
  INITIAL_BILLS,
  INITIAL_NOTIFICATIONS
} from '../data/mockHospitalData';

interface HospitalContextType {
  currentUser: User | null;
  currentRole: UserRole;
  users: User[];
  departments: Department[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  medicalRecords: MedicalRecord[];
  wards: Ward[];
  beds: Bed[];
  admissions: Admission[];
  vitalSigns: VitalSignsRecord[];
  medicines: Medicine[];
  labTests: LaboratoryTest[];
  labReports: LabReport[];
  bills: Bill[];
  notifications: HospitalNotification[];
  unreadNotifsCount: number;

  // Actions
  login: (username: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Patients
  registerPatient: (data: Partial<Patient>) => Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Doctors & Users
  addDoctor: (data: Partial<Doctor>) => Doctor;
  updateDoctor: (id: string, data: Partial<Doctor>) => void;
  addUser: (data: Partial<User>) => User;
  toggleUserActive: (id: string) => void;

  // Appointments
  bookAppointment: (data: {
    patientId: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    reason: string;
  }) => { success: boolean; message: string; appointment?: Appointment };
  updateAppointmentStatus: (id: string, status: AppointmentStatus, notes?: string) => void;

  // EMR & Consultations
  recordConsultation: (data: {
    appointmentId?: string;
    patientId: string;
    doctorId: string;
    chiefComplaint: string;
    symptoms: string[];
    diagnosis: string;
    clinicalNotes: string;
    treatmentPlan: string;
    vitals?: { temperature: number; bloodPressure: string; pulse: number; spo2: number; weight: number };
    prescriptions: PrescriptionItem[];
    labRequests: string[];
    followUpDate?: string;
  }) => void;

  // Inpatient Admissions & Beds
  admitPatient: (data: {
    patientId: string;
    bedId: string;
    attendingDoctorId: string;
    admittingDiagnosis: string;
    treatmentDetails: string;
    assignedNurse?: string;
  }) => { success: boolean; message: string };
  dischargePatient: (admissionId: string, dischargeSummary: string) => void;
  recordVitals: (data: Omit<VitalSignsRecord, 'id' | 'recordedAt'>) => void;

  // Pharmacy
  addMedicine: (data: Partial<Medicine>) => void;
  updateMedicineStock: (id: string, delta: number) => void;
  dispensePrescription: (prescriptionId: string, notes?: string) => { success: boolean; message: string };

  // Laboratory
  orderLabTest: (patientId: string, doctorId: string, testId: string) => void;
  updateLabReportResults: (reportId: string, results: LabResultItem[], pathologistNotes: string) => void;

  // Billing
  createBill: (data: Partial<Bill>) => Bill;
  recordPayment: (billId: string, amount: number, paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'INSURANCE', reference?: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDatabase: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_PREFIX = 'medicare_hms_';

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = loadStored<User | null>('current_user', null);
    return saved || INITIAL_USERS[0]; // Default to Admin
  });
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(() => loadStored('doctors', INITIAL_DOCTORS));
  const [patients, setPatients] = useState<Patient[]>(() => loadStored('patients', INITIAL_PATIENTS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadStored('appointments', INITIAL_APPOINTMENTS));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => loadStored('prescriptions', INITIAL_PRESCRIPTIONS));
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => loadStored('medical_records', INITIAL_MEDICAL_RECORDS));
  const [wards] = useState<Ward[]>(INITIAL_WARDS);
  const [beds, setBeds] = useState<Bed[]>(() => loadStored('beds', INITIAL_BEDS));
  const [admissions, setAdmissions] = useState<Admission[]>(() => loadStored('admissions', INITIAL_ADMISSIONS));
  const [vitalSigns, setVitalSigns] = useState<VitalSignsRecord[]>(() => loadStored('vital_signs', INITIAL_VITALS));
  const [medicines, setMedicines] = useState<Medicine[]>(() => loadStored('medicines', INITIAL_MEDICINES));
  const [labTests] = useState<LaboratoryTest[]>(INITIAL_LAB_TESTS);
  const [labReports, setLabReports] = useState<LabReport[]>(() => loadStored('lab_reports', INITIAL_LAB_REPORTS));
  const [bills, setBills] = useState<Bill[]>(() => loadStored('bills', INITIAL_BILLS));
  const [notifications, setNotifications] = useState<HospitalNotification[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
      localStorage.setItem(STORAGE_PREFIX + 'current_user', JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_PREFIX + 'doctors', JSON.stringify(doctors));
      localStorage.setItem(STORAGE_PREFIX + 'patients', JSON.stringify(patients));
      localStorage.setItem(STORAGE_PREFIX + 'appointments', JSON.stringify(appointments));
      localStorage.setItem(STORAGE_PREFIX + 'prescriptions', JSON.stringify(prescriptions));
      localStorage.setItem(STORAGE_PREFIX + 'medical_records', JSON.stringify(medicalRecords));
      localStorage.setItem(STORAGE_PREFIX + 'beds', JSON.stringify(beds));
      localStorage.setItem(STORAGE_PREFIX + 'admissions', JSON.stringify(admissions));
      localStorage.setItem(STORAGE_PREFIX + 'vital_signs', JSON.stringify(vitalSigns));
      localStorage.setItem(STORAGE_PREFIX + 'medicines', JSON.stringify(medicines));
      localStorage.setItem(STORAGE_PREFIX + 'lab_reports', JSON.stringify(labReports));
      localStorage.setItem(STORAGE_PREFIX + 'bills', JSON.stringify(bills));
      localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [users, currentUser, doctors, patients, appointments, prescriptions, medicalRecords, beds, admissions, vitalSigns, medicines, labReports, bills, notifications]);

  const addNotification = (title: string, message: string, type: HospitalNotification['type'], targetRole?: UserRole) => {
    const newNotif: HospitalNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      targetRole,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const login = (username: string, role?: UserRole): boolean => {
    let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user && role) {
      user = users.find(u => u.role === role);
    }
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const userForRole = users.find(u => u.role === role);
    if (userForRole) {
      setCurrentUser(userForRole);
    } else {
      // Mock switch if not in list
      const tempUser: User = {
        id: 'usr-' + role.toLowerCase(),
        username: role.toLowerCase(),
        email: `${role.toLowerCase()}@medicare.org`,
        fullName: `${role.charAt(0) + role.slice(1).toLowerCase().replace('_', ' ')} Staff`,
        role: role,
        phone: '+1 (555) 000-0000',
        active: true,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(tempUser);
    }
  };

  const currentRole: UserRole = currentUser?.role || 'ADMIN';

  // Patient registration
  const registerPatient = (data: Partial<Patient>): Patient => {
    const newId = 'pat-' + Date.now();
    const newMrn = `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      id: newId,
      mrn: newMrn,
      fullName: data.fullName || 'Anonymous Patient',
      email: data.email || 'patient@example.com',
      phone: data.phone || '+1 (555) 000-0000',
      dateOfBirth: data.dateOfBirth || '1990-01-01',
      age: data.age || 35,
      gender: data.gender || 'MALE',
      bloodGroup: data.bloodGroup || 'O+',
      address: data.address || 'Address not provided',
      emergencyContact: data.emergencyContact || { name: 'Emergency Contact', relationship: 'Relative', phone: '+1 (555) 000-0001' },
      allergies: data.allergies || [],
      chronicConditions: data.chronicConditions || [],
      status: 'ACTIVE',
      registeredAt: new Date().toISOString(),
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'
    };
    setPatients(prev => [newPatient, ...prev]);
    addNotification('New Patient Registered', `${newPatient.fullName} registered with MRN: ${newMrn}`, 'SYSTEM', 'RECEPTIONIST');
    return newPatient;
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const addDoctor = (data: Partial<Doctor>): Doctor => {
    const newId = 'doc-' + Date.now();
    const newDoctor: Doctor = {
      id: newId,
      userId: 'usr-' + newId,
      fullName: data.fullName || 'Dr. Specialist',
      email: data.email || 'doctor@medicare.org',
      phone: data.phone || '+1 (555) 123-4567',
      departmentId: data.departmentId || 'dept-5',
      departmentName: data.departmentName || 'General Medicine',
      specialization: data.specialization || 'General Specialist',
      qualification: data.qualification || 'MBBS, MD',
      experienceYears: data.experienceYears || 5,
      consultationFee: data.consultationFee || 100,
      roomNumber: data.roomNumber || 'OPD-105',
      availableDays: data.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: data.timeSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
      status: 'ACTIVE',
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
      bio: data.bio || 'Consultant Specialist committed to high standard evidence-based care.'
    };
    setDoctors(prev => [newDoctor, ...prev]);
    return newDoctor;
  };

  const updateDoctor = (id: string, data: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  };

  const addUser = (data: Partial<User>): User => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      username: data.username || 'user' + Math.floor(Math.random() * 1000),
      email: data.email || 'user@medicare.org',
      fullName: data.fullName || 'System User',
      role: data.role || 'PATIENT',
      phone: data.phone || '+1 (555) 000-0000',
      active: true,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const toggleUserActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  // Appointment Booking with Double-Booking check
  const bookAppointment = (data: {
    patientId: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    reason: string;
  }) => {
    const doctor = doctors.find(d => d.id === data.doctorId);
    const patient = patients.find(p => p.id === data.patientId);

    if (!doctor || !patient) {
      return { success: false, message: 'Invalid doctor or patient selected.' };
    }

    // Double booking verification
    const doubleBooked = appointments.some(
      a => a.doctorId === data.doctorId &&
           a.date === data.date &&
           a.timeSlot === data.timeSlot &&
           a.status !== 'CANCELLED'
    );

    if (doubleBooked) {
      return {
        success: false,
        message: `Conflict Detected: ${doctor.fullName} already has an appointment booked at ${data.timeSlot} on ${data.date}. Please select an alternate slot.`
      };
    }

    const newAptNumber = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: Appointment = {
      id: 'apt-' + Date.now(),
      appointmentNumber: newAptNumber,
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      departmentName: doctor.departmentName,
      date: data.date,
      timeSlot: data.timeSlot,
      reason: data.reason,
      status: 'CONFIRMED',
      consultationFee: doctor.consultationFee,
      paid: true,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Create consultation bill automatically
    const newBillItem = {
      id: 'bi-' + Date.now(),
      description: `Consultation - ${doctor.fullName} (${doctor.specialization})`,
      category: 'CONSULTATION' as const,
      quantity: 1,
      unitPrice: doctor.consultationFee,
      totalPrice: doctor.consultationFee
    };

    const newBill: Bill = {
      id: 'bill-' + Date.now(),
      invoiceNumber: `INV-2026-${Math.floor(3000 + Math.random() * 6000)}`,
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      date: data.date,
      dueDate: data.date,
      items: [newBillItem],
      subtotal: doctor.consultationFee,
      discountPercentage: 0,
      discountAmount: 0,
      taxPercentage: 5,
      taxAmount: Number((doctor.consultationFee * 0.05).toFixed(2)),
      totalAmount: Number((doctor.consultationFee * 1.05).toFixed(2)),
      paidAmount: Number((doctor.consultationFee * 1.05).toFixed(2)),
      balanceAmount: 0,
      paymentStatus: 'PAID',
      paymentMethod: 'CARD',
      transactionReference: 'TXN-ONLINE-' + Math.floor(100000 + Math.random() * 900000),
      notes: 'Consultation booking fee paid in advance.'
    };

    setBills(prev => [newBill, ...prev]);

    addNotification(
      'New Appointment Scheduled',
      `Appointment ${newAptNumber} scheduled with ${doctor.fullName} for ${patient.fullName} on ${data.date} at ${data.timeSlot}.`,
      'APPOINTMENT'
    );

    return { success: true, message: 'Appointment successfully booked and confirmed.', appointment: newAppointment };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, notes?: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status, notes: notes || a.notes } : a));
  };

  // Clinical Consultation & EMR
  const recordConsultation = (data: {
    appointmentId?: string;
    patientId: string;
    doctorId: string;
    chiefComplaint: string;
    symptoms: string[];
    diagnosis: string;
    clinicalNotes: string;
    treatmentPlan: string;
    vitals?: { temperature: number; bloodPressure: string; pulse: number; spo2: number; weight: number };
    prescriptions: PrescriptionItem[];
    labRequests: string[];
    followUpDate?: string;
  }) => {
    const patient = patients.find(p => p.id === data.patientId);
    const doctor = doctors.find(d => d.id === data.doctorId);
    const nowStr = new Date().toISOString();

    const record: MedicalRecord = {
      id: 'mr-' + Date.now(),
      patientId: data.patientId,
      patientName: patient?.fullName || 'Patient',
      doctorId: data.doctorId,
      doctorName: doctor?.fullName || 'Doctor',
      appointmentId: data.appointmentId,
      visitDate: nowStr.split('T')[0],
      chiefComplaint: data.chiefComplaint,
      symptoms: data.symptoms,
      diagnosis: data.diagnosis,
      clinicalNotes: data.clinicalNotes,
      treatmentPlan: data.treatmentPlan,
      vitals: data.vitals,
      prescriptions: data.prescriptions,
      labRequests: data.labRequests,
      followUpDate: data.followUpDate,
      createdAt: nowStr
    };

    setMedicalRecords(prev => [record, ...prev]);

    // If prescriptions attached, generate Prescription in pharmacy queue
    if (data.prescriptions && data.prescriptions.length > 0) {
      const rx: Prescription = {
        id: 'rx-' + Date.now(),
        prescriptionNumber: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        appointmentId: data.appointmentId,
        patientId: data.patientId,
        patientName: patient?.fullName || 'Patient',
        doctorId: data.doctorId,
        doctorName: doctor?.fullName || 'Doctor',
        date: nowStr.split('T')[0],
        diagnosis: data.diagnosis,
        status: 'PENDING',
        items: data.prescriptions.map((it, idx) => ({ ...it, id: 'rx-it-' + Date.now() + '-' + idx }))
      };
      setPrescriptions(prev => [rx, ...prev]);
      addNotification('New Prescription Issued', `Dr. ${doctor?.fullName} issued Rx #${rx.prescriptionNumber} for ${patient?.fullName}`, 'PRESCRIPTION', 'PHARMACIST');
    }

    // If lab tests requested, create lab work orders in Lab queue
    if (data.labRequests && data.labRequests.length > 0) {
      data.labRequests.forEach((reqName, i) => {
        const matchingTest = labTests.find(t => t.name.toLowerCase().includes(reqName.toLowerCase())) || labTests[0];
        const newRep: LabReport = {
          id: 'rep-' + Date.now() + '-' + i,
          reportNumber: `REP-2026-${Math.floor(2000 + Math.random() * 7000)}`,
          patientId: data.patientId,
          patientName: patient?.fullName || 'Patient',
          patientAge: patient?.age || 40,
          patientGender: patient?.gender || 'MALE',
          doctorId: data.doctorId,
          doctorName: doctor?.fullName || 'Doctor',
          testId: matchingTest.id,
          testName: matchingTest.name,
          testCategory: matchingTest.category,
          requestDate: nowStr,
          status: 'PENDING',
          results: []
        };
        setLabReports(prev => [newRep, ...prev]);
      });
      addNotification('Diagnostic Lab Orders', `${data.labRequests.length} laboratory investigations ordered for ${patient?.fullName}`, 'LAB', 'LAB_TECHNICIAN');
    }

    // Update appointment status to COMPLETED if linked
    if (data.appointmentId) {
      updateAppointmentStatus(data.appointmentId, 'COMPLETED', `Consultation completed. Diagnosis: ${data.diagnosis}`);
    }
  };

  // Inpatient Admissions & Bed Management
  const admitPatient = (data: {
    patientId: string;
    bedId: string;
    attendingDoctorId: string;
    admittingDiagnosis: string;
    treatmentDetails: string;
    assignedNurse?: string;
  }) => {
    const patient = patients.find(p => p.id === data.patientId);
    const bed = beds.find(b => b.id === data.bedId);
    const doctor = doctors.find(d => d.id === data.attendingDoctorId);

    if (!patient || !bed || !doctor) {
      return { success: false, message: 'Invalid patient, bed, or doctor selection.' };
    }

    if (bed.status !== 'AVAILABLE') {
      return { success: false, message: `Bed ${bed.bedNumber} is currently ${bed.status}. Please choose an available bed.` };
    }

    const admNum = `ADM-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAdmission: Admission = {
      id: 'adm-' + Date.now(),
      admissionNumber: admNum,
      patientId: patient.id,
      patientName: patient.fullName,
      patientAge: patient.age,
      patientGender: patient.gender,
      wardId: bed.wardId,
      wardName: bed.wardName,
      bedId: bed.id,
      bedNumber: bed.bedNumber,
      roomNumber: bed.roomNumber,
      attendingDoctorId: doctor.id,
      attendingDoctorName: doctor.fullName,
      admissionDate: new Date().toISOString(),
      admittingDiagnosis: data.admittingDiagnosis,
      treatmentDetails: data.treatmentDetails,
      status: 'ADMITTED',
      assignedNurse: data.assignedNurse || 'Maria Rodriguez, RN'
    };

    setAdmissions(prev => [newAdmission, ...prev]);

    // Flip bed status to OCCUPIED
    setBeds(prev => prev.map(b => b.id === bed.id ? {
      ...b,
      status: 'OCCUPIED',
      currentPatientId: patient.id,
      currentPatientName: patient.fullName
    } : b));

    // Flip patient status to ADMITTED
    setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: 'ADMITTED' } : p));

    addNotification('Patient Admitted', `${patient.fullName} admitted to ${bed.wardName} (${bed.bedNumber})`, 'SYSTEM', 'NURSE');

    return { success: true, message: `Patient admitted successfully to Bed ${bed.bedNumber}.` };
  };

  const dischargePatient = (admissionId: string, dischargeSummary: string) => {
    const adm = admissions.find(a => a.id === admissionId);
    if (!adm) return;

    const dischargeTime = new Date().toISOString();

    // Calculate length of stay (days)
    const admDate = new Date(adm.admissionDate);
    const disDate = new Date(dischargeTime);
    const diffDays = Math.max(1, Math.ceil((disDate.getTime() - admDate.getTime()) / (1000 * 60 * 60 * 24)));

    const bed = beds.find(b => b.id === adm.bedId);
    const dailyRate = bed?.dailyRate || 150;
    const roomCost = diffDays * dailyRate;

    // Update admission record
    setAdmissions(prev => prev.map(a => a.id === admissionId ? {
      ...a,
      status: 'DISCHARGED',
      dischargeDate: dischargeTime,
      dischargeSummary: dischargeSummary || 'Patient stabilized and cleared for outpatient recovery.'
    } : a));

    // Free the bed
    setBeds(prev => prev.map(b => b.id === adm.bedId ? {
      ...b,
      status: 'AVAILABLE',
      currentPatientId: undefined,
      currentPatientName: undefined
    } : b));

    // Update patient status to ACTIVE
    setPatients(prev => prev.map(p => p.id === adm.patientId ? { ...p, status: 'ACTIVE' } : p));

    // Generate discharge invoice
    const bill: Bill = {
      id: 'bill-' + Date.now(),
      invoiceNumber: `INV-2026-${Math.floor(4000 + Math.random() * 5000)}`,
      patientId: adm.patientId,
      patientName: adm.patientName,
      patientPhone: '+1 (555) 000-0000',
      date: dischargeTime.split('T')[0],
      dueDate: dischargeTime.split('T')[0],
      items: [
        {
          id: 'bi-room-' + Date.now(),
          description: `Inpatient Bed Charge (${adm.wardName} - ${adm.bedNumber}) for ${diffDays} day(s)`,
          category: 'ROOM_CHARGE',
          quantity: diffDays,
          unitPrice: dailyRate,
          totalPrice: roomCost
        },
        {
          id: 'bi-nurse-' + Date.now(),
          description: 'Inpatient Nursing & Clinical Care',
          category: 'NURSING',
          quantity: diffDays,
          unitPrice: 35,
          totalPrice: diffDays * 35
        }
      ],
      subtotal: roomCost + (diffDays * 35),
      discountPercentage: 0,
      discountAmount: 0,
      taxPercentage: 5,
      taxAmount: Number(((roomCost + (diffDays * 35)) * 0.05).toFixed(2)),
      totalAmount: Number(((roomCost + (diffDays * 35)) * 1.05).toFixed(2)),
      paidAmount: 0,
      balanceAmount: Number(((roomCost + (diffDays * 35)) * 1.05).toFixed(2)),
      paymentStatus: 'PENDING',
      notes: `Discharge bill generated for admission ${adm.admissionNumber}.`
    };

    setBills(prev => [bill, ...prev]);

    addNotification('Discharge Completed', `${adm.patientName} discharged. Final invoice #${bill.invoiceNumber} generated.`, 'BILLING', 'ACCOUNTANT');
  };

  const recordVitals = (data: Omit<VitalSignsRecord, 'id' | 'recordedAt'>) => {
    const newRecord: VitalSignsRecord = {
      ...data,
      id: 'vit-' + Date.now(),
      recordedAt: new Date().toISOString()
    };
    setVitalSigns(prev => [newRecord, ...prev]);
  };

  // Pharmacy
  const addMedicine = (data: Partial<Medicine>) => {
    const newMed: Medicine = {
      id: 'med-' + Date.now(),
      code: data.code || 'MED-' + Math.floor(100 + Math.random() * 900),
      name: data.name || 'New Medicine',
      genericName: data.genericName || '',
      category: data.category || 'Analgesics',
      form: data.form || 'Tablet',
      strength: data.strength || '500 mg',
      batchNumber: data.batchNumber || 'BT-' + Math.floor(1000 + Math.random() * 9000),
      manufacturer: data.manufacturer || 'General Pharma',
      expiryDate: data.expiryDate || '2028-12-31',
      stockQuantity: data.stockQuantity || 100,
      minStockLevel: data.minStockLevel || 30,
      unitPrice: data.unitPrice || 1.5,
      supplier: data.supplier || 'Standard Distributor'
    };
    setMedicines(prev => [newMed, ...prev]);
  };

  const updateMedicineStock = (id: string, delta: number) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        const newQty = Math.max(0, m.stockQuantity + delta);
        if (newQty <= m.minStockLevel) {
          addNotification('Low Medicine Stock Alert', `${m.name} is running low (${newQty} units left).`, 'STOCK', 'PHARMACIST');
        }
        return { ...m, stockQuantity: newQty };
      }
      return m;
    }));
  };

  const dispensePrescription = (prescriptionId: string, notes?: string) => {
    const rx = prescriptions.find(r => r.id === prescriptionId);
    if (!rx) return { success: false, message: 'Prescription not found' };

    // Check stock for each item
    for (const item of rx.items) {
      const med = medicines.find(m => m.name.toLowerCase().includes(item.medicineName.toLowerCase()));
      if (med && med.stockQuantity < 10) {
        return {
          success: false,
          message: `Insufficient stock for ${item.medicineName}. Only ${med.stockQuantity} available.`
        };
      }
    }

    // Deduct stock
    rx.items.forEach(item => {
      const med = medicines.find(m => m.name.toLowerCase().includes(item.medicineName.toLowerCase()));
      if (med) {
        updateMedicineStock(med.id, -10);
      }
    });

    // Mark prescription dispensed
    setPrescriptions(prev => prev.map(r => r.id === prescriptionId ? {
      ...r,
      status: 'DISPENSED',
      dispensedAt: new Date().toISOString(),
      pharmacistNotes: notes || 'Dispensed and patient counselled.'
    } : r));

    // Create pharmacy invoice
    const billItems = rx.items.map((item, idx) => ({
      id: 'bi-rx-' + Date.now() + '-' + idx,
      description: `Pharmacy: ${item.medicineName} (${item.dosage}) - ${item.duration}`,
      category: 'MEDICINE' as const,
      quantity: 1,
      unitPrice: 12.50,
      totalPrice: 12.50
    }));

    const rxSubtotal = billItems.length * 12.50;
    const rxBill: Bill = {
      id: 'bill-' + Date.now(),
      invoiceNumber: `INV-RX-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: rx.patientId,
      patientName: rx.patientName,
      patientPhone: '+1 (555) 000-0000',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: billItems,
      subtotal: rxSubtotal,
      discountPercentage: 0,
      discountAmount: 0,
      taxPercentage: 5,
      taxAmount: Number((rxSubtotal * 0.05).toFixed(2)),
      totalAmount: Number((rxSubtotal * 1.05).toFixed(2)),
      paidAmount: Number((rxSubtotal * 1.05).toFixed(2)),
      balanceAmount: 0,
      paymentStatus: 'PAID',
      paymentMethod: 'CASH',
      notes: `Pharmacy dispensation for Prescription #${rx.prescriptionNumber}`
    };

    setBills(prev => [rxBill, ...prev]);

    addNotification('Prescription Dispensed', `Rx #${rx.prescriptionNumber} for ${rx.patientName} dispensed.`, 'PRESCRIPTION', 'PATIENT');

    return { success: true, message: 'Prescription successfully dispensed and billed.' };
  };

  // Laboratory
  const orderLabTest = (patientId: string, doctorId: string, testId: string) => {
    const patient = patients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);
    const test = labTests.find(t => t.id === testId);

    if (!patient || !doctor || !test) return;

    const rep: LabReport = {
      id: 'rep-' + Date.now(),
      reportNumber: `REP-2026-${Math.floor(3000 + Math.random() * 6000)}`,
      patientId: patient.id,
      patientName: patient.fullName,
      patientAge: patient.age,
      patientGender: patient.gender,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      testId: test.id,
      testName: test.name,
      testCategory: test.category,
      requestDate: new Date().toISOString(),
      status: 'PENDING',
      results: []
    };

    setLabReports(prev => [rep, ...prev]);
    addNotification('Lab Test Ordered', `${test.name} requisitioned for ${patient.fullName}`, 'LAB', 'LAB_TECHNICIAN');
  };

  const updateLabReportResults = (reportId: string, results: LabResultItem[], pathologistNotes: string) => {
    setLabReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          results,
          pathologistImpression: pathologistNotes,
          status: 'COMPLETED',
          completedDate: new Date().toISOString(),
          technicianName: 'Alex Chen, MLT'
        };
      }
      return rep;
    }));

    addNotification('Lab Report Completed', `Diagnostic results uploaded for Report #${reportId}`, 'LAB');
  };

  // Billing
  const createBill = (data: Partial<Bill>): Bill => {
    const newBill: Bill = {
      id: 'bill-' + Date.now(),
      invoiceNumber: data.invoiceNumber || `INV-2026-${Math.floor(5000 + Math.random() * 4000)}`,
      patientId: data.patientId || '',
      patientName: data.patientName || 'Walk-in Patient',
      patientPhone: data.patientPhone || '',
      date: data.date || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      items: data.items || [],
      subtotal: data.subtotal || 0,
      discountPercentage: data.discountPercentage || 0,
      discountAmount: data.discountAmount || 0,
      taxPercentage: data.taxPercentage || 5,
      taxAmount: data.taxAmount || 0,
      totalAmount: data.totalAmount || 0,
      paidAmount: data.paidAmount || 0,
      balanceAmount: data.balanceAmount || 0,
      paymentStatus: data.paymentStatus || 'PENDING',
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
      notes: data.notes
    };
    setBills(prev => [newBill, ...prev]);
    return newBill;
  };

  const recordPayment = (billId: string, amount: number, paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'INSURANCE', reference?: string) => {
    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        const newPaid = b.paidAmount + amount;
        const newBalance = Math.max(0, b.totalAmount - newPaid);
        const newStatus: Bill['paymentStatus'] = newBalance <= 0.01 ? 'PAID' : (newPaid > 0 ? 'PARTIAL' : 'PENDING');
        return {
          ...b,
          paidAmount: newPaid,
          balanceAmount: newBalance,
          paymentStatus: newStatus,
          paymentMethod,
          transactionReference: reference || 'TXN-' + Math.floor(100000 + Math.random() * 900000)
        };
      }
      return b;
    }));
  };

  // Notification management
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDatabase = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setDoctors(INITIAL_DOCTORS);
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setMedicalRecords(INITIAL_MEDICAL_RECORDS);
    setBeds(INITIAL_BEDS);
    setAdmissions(INITIAL_ADMISSIONS);
    setVitalSigns(INITIAL_VITALS);
    setMedicines(INITIAL_MEDICINES);
    setLabReports(INITIAL_LAB_REPORTS);
    setBills(INITIAL_BILLS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        departments,
        doctors,
        patients,
        appointments,
        prescriptions,
        medicalRecords,
        wards,
        beds,
        admissions,
        vitalSigns,
        medicines,
        labTests,
        labReports,
        bills,
        notifications,
        unreadNotifsCount,
        login,
        logout,
        switchRole,
        registerPatient,
        updatePatient,
        deletePatient,
        addDoctor,
        updateDoctor,
        addUser,
        toggleUserActive,
        bookAppointment,
        updateAppointmentStatus,
        recordConsultation,
        admitPatient,
        dischargePatient,
        recordVitals,
        addMedicine,
        updateMedicineStock,
        dispensePrescription,
        orderLabTest,
        updateLabReportResults,
        createBill,
        recordPayment,
        markNotificationRead,
        markAllNotificationsRead,
        resetDatabase
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
