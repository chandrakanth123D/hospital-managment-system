export type UserRole = 
  | 'ADMIN' 
  | 'DOCTOR' 
  | 'PATIENT' 
  | 'RECEPTIONIST' 
  | 'NURSE' 
  | 'PHARMACIST' 
  | 'LAB_TECHNICIAN' 
  | 'ACCOUNTANT';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  active: boolean;
  createdAt: string;
  departmentId?: string;
  doctorId?: string;
  patientId?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headDoctorName: string;
  doctorCount: number;
  location: string;
}

export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  roomNumber: string;
  availableDays: string[];
  timeSlots: string[];
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  avatarUrl: string;
  bio: string;
}

export interface Patient {
  id: string;
  userId?: string;
  mrn: string; // Medical Record Number
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'ADMITTED';
  registeredAt: string;
  avatarUrl?: string;
}

export type AppointmentStatus = 
  | 'BOOKED' 
  | 'CONFIRMED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'RESCHEDULED' 
  | 'NO_SHOW';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  departmentName: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  consultationFee: number;
  paid: boolean;
  createdAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "Twice a day (1-0-1)"
  duration: string; // e.g. "5 Days"
  instructions: string; // e.g. "Take after food with warm water"
  dispensed?: boolean;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  items: PrescriptionItem[];
  diagnosis: string;
  status: 'PENDING' | 'DISPENSED' | 'PARTIALLY_DISPENSED';
  dispensedAt?: string;
  pharmacistNotes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  visitDate: string;
  chiefComplaint: string;
  symptoms: string[];
  diagnosis: string;
  clinicalNotes: string;
  treatmentPlan: string;
  vitals?: {
    temperature: number; // °F
    bloodPressure: string; // e.g. "120/80"
    pulse: number; // bpm
    spo2: number; // %
    weight: number; // kg
  };
  prescriptions: PrescriptionItem[];
  labRequests: string[];
  followUpDate?: string;
  createdAt: string;
}

export interface Ward {
  id: string;
  name: string;
  type: 'GENERAL' | 'ICU' | 'SURGICAL' | 'PEDIATRIC' | 'MATERNITY';
  totalBeds: number;
  availableBeds: number;
  dailyRate: number;
  floor: string;
}

export interface Bed {
  id: string;
  bedNumber: string;
  wardId: string;
  wardName: string;
  roomNumber: string;
  type: 'STANDARD' | 'ICU' | 'OXYGEN' | 'VENTILATOR';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  currentPatientId?: string;
  currentPatientName?: string;
  dailyRate: number;
}

export interface VitalSignsRecord {
  id: string;
  admissionId?: string;
  patientId: string;
  patientName: string;
  bedNumber?: string;
  temperature: number; // in °F
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  pulse: number; // bpm
  spo2: number; // %
  respiratoryRate: number; // breaths/min
  weight: number; // kg
  recordedByNurse: string;
  recordedAt: string;
  nurseNotes: string;
}

export interface Admission {
  id: string;
  admissionNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  wardId: string;
  wardName: string;
  bedId: string;
  bedNumber: string;
  roomNumber: string;
  attendingDoctorId: string;
  attendingDoctorName: string;
  admissionDate: string;
  dischargeDate?: string;
  admittingDiagnosis: string;
  treatmentDetails: string;
  dischargeSummary?: string;
  status: 'ADMITTED' | 'DISCHARGED';
  assignedNurse?: string;
}

export interface Medicine {
  id: string;
  code: string;
  name: string;
  genericName: string;
  category: 'Antibiotics' | 'Analgesics' | 'Cardiovascular' | 'Antidiabetic' | 'Antihistamines' | 'Vitamins' | 'Respiratory' | 'GI Tract';
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'IV Fluid';
  strength: string;
  batchNumber: string;
  manufacturer: string;
  expiryDate: string;
  stockQuantity: number;
  minStockLevel: number;
  unitPrice: number;
  supplier: string;
}

export interface LaboratoryTest {
  id: string;
  code: string;
  name: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Radiology' | 'Cardiology' | 'Pathology';
  sampleType: string;
  price: number;
  turnaroundHours: number;
  normalRange: string;
}

export interface LabResultItem {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW';
}

export interface LabReport {
  id: string;
  reportNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  testId: string;
  testName: string;
  testCategory: string;
  requestDate: string;
  completedDate?: string;
  status: 'PENDING' | 'SAMPLE_COLLECTED' | 'IN_ANALYSIS' | 'COMPLETED';
  technicianName?: string;
  results: LabResultItem[];
  pathologistImpression?: string;
  criticalAlert?: boolean;
}

export interface BillItem {
  id: string;
  description: string;
  category: 'CONSULTATION' | 'ROOM_CHARGE' | 'MEDICINE' | 'LAB_TEST' | 'PROCEDURE' | 'NURSING' | 'OTHER';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Bill {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  dueDate: string;
  items: BillItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING' | 'CANCELLED';
  paymentMethod?: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'INSURANCE';
  transactionReference?: string;
  notes?: string;
}

export interface HospitalNotification {
  id: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'LAB' | 'PRESCRIPTION' | 'BILLING' | 'STOCK' | 'EMERGENCY' | 'SYSTEM';
  targetRole?: UserRole | 'ALL';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}
