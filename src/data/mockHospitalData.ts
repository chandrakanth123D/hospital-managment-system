import {
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
  User,
  HospitalNotification
} from '../types/hospital';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Cardiology',
    code: 'CARD',
    description: 'Comprehensive adult & pediatric heart care, advanced echocardiography and catheterization.',
    headDoctorName: 'Dr. Sarah Jenkins, MD',
    doctorCount: 4,
    location: 'Building A, 3rd Floor'
  },
  {
    id: 'dept-2',
    name: 'Neurology',
    code: 'NEUR',
    description: 'Specialized diagnosis and treatment of brain, spinal cord, and peripheral nervous system disorders.',
    headDoctorName: 'Dr. Robert Vance, DM',
    doctorCount: 3,
    location: 'Building B, 2nd Floor'
  },
  {
    id: 'dept-3',
    name: 'Pediatrics',
    code: 'PED',
    description: 'General infant, child, and adolescent healthcare, immunizations, and developmental milestones.',
    headDoctorName: 'Dr. Emily Thornton, MD',
    doctorCount: 5,
    location: 'Building A, 1st Floor'
  },
  {
    id: 'dept-4',
    name: 'Orthopedics',
    code: 'ORTH',
    description: 'Joint reconstruction, spine surgery, sports trauma, and bone density management.',
    headDoctorName: 'Dr. David Marcus, MS',
    doctorCount: 4,
    location: 'Building C, Ground Floor'
  },
  {
    id: 'dept-5',
    name: 'General Medicine',
    code: 'GEN',
    description: 'Internal medicine, chronic illness management, preventive health checks, and OPD triage.',
    headDoctorName: 'Dr. Anita Desai, MD',
    doctorCount: 6,
    location: 'Main OPD Block'
  },
  {
    id: 'dept-6',
    name: 'Obstetrics & Gynecology',
    code: 'OBGYN',
    description: 'Maternal health, prenatal care, high-risk obstetrics, and laparoscopic gynecological procedures.',
    headDoctorName: 'Dr. Lisa Wong, MD',
    doctorCount: 3,
    location: 'Building A, 4th Floor'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'user-doc-1',
    fullName: 'Dr. Sarah Jenkins',
    email: 'dr.jenkins@medicare.org',
    phone: '+1 (555) 234-8901',
    departmentId: 'dept-1',
    departmentName: 'Cardiology',
    specialization: 'Interventional Cardiology',
    qualification: 'MD, DM (Cardiology), FACC',
    experienceYears: 14,
    consultationFee: 120,
    roomNumber: 'OPD-302',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:30 PM'],
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
    bio: 'Senior Interventional Cardiologist with over 1,500 successful angioplasties and clinical trials in coronary artery disease.'
  },
  {
    id: 'doc-2',
    userId: 'user-doc-2',
    fullName: 'Dr. Robert Vance',
    email: 'dr.vance@medicare.org',
    phone: '+1 (555) 345-6789',
    departmentId: 'dept-2',
    departmentName: 'Neurology',
    specialization: 'Neurovascular & Stroke Medicine',
    qualification: 'MD, DM (Neurology)',
    experienceYears: 12,
    consultationFee: 140,
    roomNumber: 'OPD-204',
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
    bio: 'Expert in clinical stroke management, epilepsy evaluation, and advanced electroencephalogram interpretation.'
  },
  {
    id: 'doc-3',
    userId: 'user-doc-3',
    fullName: 'Dr. Anita Desai',
    email: 'dr.desai@medicare.org',
    phone: '+1 (555) 456-7890',
    departmentId: 'dept-5',
    departmentName: 'General Medicine',
    specialization: 'Internal Medicine & Diabetology',
    qualification: 'MBBS, MD (Medicine)',
    experienceYears: 16,
    consultationFee: 80,
    roomNumber: 'OPD-101',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '03:00 PM', '04:00 PM'],
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813515-56291a92e106?auto=format&fit=crop&q=80&w=256',
    bio: 'Dedicated primary care physician focusing on metabolic syndrome, hypertension control, and geriatric wellness.'
  },
  {
    id: 'doc-4',
    userId: 'user-doc-4',
    fullName: 'Dr. David Marcus',
    email: 'dr.marcus@medicare.org',
    phone: '+1 (555) 567-8901',
    departmentId: 'dept-4',
    departmentName: 'Orthopedics',
    specialization: 'Joint Replacement & Sports Injury',
    qualification: 'MS (Orthopedics), MCh',
    experienceYears: 11,
    consultationFee: 110,
    roomNumber: 'OPD-012',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:30 PM', '03:00 PM'],
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256',
    bio: 'Pioneer in minimally invasive knee and hip arthroplasty with dedicated rehabilitation pathways.'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    userId: 'user-pat-1',
    mrn: 'MRN-2026-0814',
    fullName: 'James Alexander Miller',
    email: 'james.miller@gmail.com',
    phone: '+1 (555) 678-1122',
    dateOfBirth: '1984-06-15',
    age: 42,
    gender: 'MALE',
    bloodGroup: 'O+',
    address: '742 Evergreen Terrace, Springfield, OR',
    emergencyContact: {
      name: 'Clara Miller',
      relationship: 'Spouse',
      phone: '+1 (555) 678-1123'
    },
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Hypertension', 'Mild Hyperlipidemia'],
    status: 'ACTIVE',
    registeredAt: '2025-11-10T09:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'pat-2',
    userId: 'user-pat-2',
    mrn: 'MRN-2026-0922',
    fullName: 'Eleanor Sophia Bennett',
    email: 'eleanor.b@yahoo.com',
    phone: '+1 (555) 789-3344',
    dateOfBirth: '1992-03-24',
    age: 34,
    gender: 'FEMALE',
    bloodGroup: 'A+',
    address: '128 Willow Creek Way, Portland, OR',
    emergencyContact: {
      name: 'Thomas Bennett',
      relationship: 'Brother',
      phone: '+1 (555) 789-3345'
    },
    allergies: ['Aspirin'],
    chronicConditions: ['Asthma (moderate)'],
    status: 'ADMITTED',
    registeredAt: '2026-01-14T11:20:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'pat-3',
    userId: 'user-pat-3',
    mrn: 'MRN-2026-1045',
    fullName: 'Marcus Aurelius Hayes',
    email: 'm.hayes@outlook.com',
    phone: '+1 (555) 890-5566',
    dateOfBirth: '1961-09-08',
    age: 65,
    gender: 'MALE',
    bloodGroup: 'B+',
    address: '450 Oak Ridge Lane, Eugene, OR',
    emergencyContact: {
      name: 'Evelyn Hayes',
      relationship: 'Daughter',
      phone: '+1 (555) 890-5567'
    },
    allergies: ['None known'],
    chronicConditions: ['Type 2 Diabetes', 'Coronary Artery Disease'],
    status: 'ACTIVE',
    registeredAt: '2026-02-02T14:10:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    email: 'admin@medicare.org',
    fullName: 'System Administrator',
    role: 'ADMIN',
    phone: '+1 (555) 000-1111',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'user-doc-1',
    username: 'dr.jenkins',
    email: 'dr.jenkins@medicare.org',
    fullName: 'Dr. Sarah Jenkins',
    role: 'DOCTOR',
    phone: '+1 (555) 234-8901',
    active: true,
    createdAt: '2025-01-15T00:00:00Z',
    doctorId: 'doc-1',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'user-pat-1',
    username: 'james.miller',
    email: 'james.miller@gmail.com',
    fullName: 'James Alexander Miller',
    role: 'PATIENT',
    phone: '+1 (555) 678-1122',
    active: true,
    createdAt: '2025-11-10T09:30:00Z',
    patientId: 'pat-1',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'user-recep',
    username: 'receptionist',
    email: 'reception@medicare.org',
    fullName: 'Hannah Scott',
    role: 'RECEPTIONIST',
    phone: '+1 (555) 123-4567',
    active: true,
    createdAt: '2025-02-01T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'user-nurse',
    username: 'nurse.maria',
    email: 'nurse.maria@medicare.org',
    fullName: 'Maria Rodriguez, RN',
    role: 'NURSE',
    phone: '+1 (555) 987-6543',
    active: true,
    createdAt: '2025-02-10T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'user-pharm',
    username: 'pharmacist.john',
    email: 'pharmacy@medicare.org',
    fullName: 'Johnathan Cole, PharmD',
    role: 'PHARMACIST',
    phone: '+1 (555) 321-7654',
    active: true,
    createdAt: '2025-02-15T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'user-lab',
    username: 'lab.tech',
    email: 'lab@medicare.org',
    fullName: 'Alex Chen, MLT',
    role: 'LAB_TECHNICIAN',
    phone: '+1 (555) 654-9870',
    active: true,
    createdAt: '2025-03-01T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'user-account',
    username: 'accountant',
    email: 'accounts@medicare.org',
    fullName: 'Victoria Sterling, CPA',
    role: 'ACCOUNTANT',
    phone: '+1 (555) 789-0123',
    active: true,
    createdAt: '2025-03-05T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    appointmentNumber: 'APT-2026-1001',
    patientId: 'pat-1',
    patientName: 'James Alexander Miller',
    patientPhone: '+1 (555) 678-1122',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    departmentName: 'Cardiology',
    date: '2026-09-25',
    timeSlot: '09:00 AM',
    reason: 'Quarterly cardiac stress follow-up & chest tightness review',
    status: 'CONFIRMED',
    notes: 'Prior ECG was normal; patient reports occasional palpitations upon exertion.',
    consultationFee: 120,
    paid: true,
    createdAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'apt-2',
    appointmentNumber: 'APT-2026-1002',
    patientId: 'pat-3',
    patientName: 'Marcus Aurelius Hayes',
    patientPhone: '+1 (555) 890-5566',
    doctorId: 'doc-3',
    doctorName: 'Dr. Anita Desai',
    departmentName: 'General Medicine',
    date: '2026-09-25',
    timeSlot: '10:30 AM',
    reason: 'HbA1c diabetes evaluation & glycemic control review',
    status: 'BOOKED',
    consultationFee: 80,
    paid: true,
    createdAt: '2026-09-21T14:30:00Z'
  },
  {
    id: 'apt-3',
    appointmentNumber: 'APT-2026-0994',
    patientId: 'pat-2',
    patientName: 'Eleanor Sophia Bennett',
    patientPhone: '+1 (555) 789-3344',
    doctorId: 'doc-2',
    doctorName: 'Dr. Robert Vance',
    departmentName: 'Neurology',
    date: '2026-09-24',
    timeSlot: '11:30 AM',
    reason: 'Persistent migraine with visual aura',
    status: 'COMPLETED',
    notes: 'Consultation completed. Prescribed Sumatriptan & recommended MRI Brain.',
    consultationFee: 140,
    paid: true,
    createdAt: '2026-09-18T08:00:00Z'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    prescriptionNumber: 'RX-2026-0451',
    patientId: 'pat-1',
    patientName: 'James Alexander Miller',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-09-24',
    diagnosis: 'Essential Hypertension Stage 1 with Mild Palpitations',
    status: 'PENDING',
    items: [
      {
        id: 'rx-item-1',
        medicineName: 'Amlodipine',
        dosage: '5 mg',
        frequency: 'Once daily (Morning)',
        duration: '30 Days',
        instructions: 'Take with or without food. Monitor BP weekly.'
      },
      {
        id: 'rx-item-2',
        medicineName: 'Atorvastatin',
        dosage: '10 mg',
        frequency: 'Once daily (Night)',
        duration: '30 Days',
        instructions: 'Take after dinner.'
      }
    ]
  },
  {
    id: 'rx-2',
    prescriptionNumber: 'RX-2026-0442',
    patientId: 'pat-2',
    patientName: 'Eleanor Sophia Bennett',
    doctorId: 'doc-2',
    doctorName: 'Dr. Robert Vance',
    date: '2026-09-22',
    diagnosis: 'Acute Migraine Episode',
    status: 'DISPENSED',
    dispensedAt: '2026-09-22T13:45:00Z',
    pharmacistNotes: 'Medication dispensed and explained clearly to patient.',
    items: [
      {
        id: 'rx-item-3',
        medicineName: 'Sumatriptan',
        dosage: '50 mg',
        frequency: 'As needed at onset of headache',
        duration: '5 Days',
        instructions: 'Do not exceed 100 mg in 24 hours.',
        dispensed: true
      },
      {
        id: 'rx-item-4',
        medicineName: 'Paracetamol',
        dosage: '650 mg',
        frequency: 'Twice daily as needed',
        duration: '5 Days',
        instructions: 'Take after food.',
        dispensed: true
      }
    ]
  }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'mr-1',
    patientId: 'pat-1',
    patientName: 'James Alexander Miller',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    visitDate: '2026-09-24',
    chiefComplaint: 'Mild retrosternal heaviness after climbing stairs.',
    symptoms: ['Chest tightness', 'Occasional breathlessness', 'Mild fatigue'],
    diagnosis: 'Class I Angina with Stage 1 Hypertension',
    clinicalNotes: 'Heart sounds S1/S2 audible, no murmurs. ECG shows normal sinus rhythm. Advised lifestyle modifications and low sodium diet.',
    treatmentPlan: 'Initiate calcium channel blocker therapy. Schedule exercise stress test (TMT) and follow-up in 4 weeks.',
    vitals: {
      temperature: 98.4,
      bloodPressure: '136/88',
      pulse: 78,
      spo2: 99,
      weight: 82
    },
    prescriptions: [
      {
        id: 'rx-1-p1',
        medicineName: 'Amlodipine',
        dosage: '5 mg',
        frequency: 'Once daily (Morning)',
        duration: '30 Days',
        instructions: 'Take with or without food'
      }
    ],
    labRequests: ['Lipid Profile', 'Troponin-I', 'ECG 12-Lead'],
    followUpDate: '2026-10-24',
    createdAt: '2026-09-24T11:45:00Z'
  }
];

export const INITIAL_WARDS: Ward[] = [
  {
    id: 'ward-1',
    name: 'General Medical Ward (North Wing)',
    type: 'GENERAL',
    totalBeds: 12,
    availableBeds: 8,
    dailyRate: 150,
    floor: '2nd Floor'
  },
  {
    id: 'ward-2',
    name: 'Cardiac Intensive Care Unit (CICU)',
    type: 'ICU',
    totalBeds: 6,
    availableBeds: 2,
    dailyRate: 650,
    floor: '3rd Floor'
  },
  {
    id: 'ward-3',
    name: 'Surgical Recovery Ward',
    type: 'SURGICAL',
    totalBeds: 8,
    availableBeds: 5,
    dailyRate: 250,
    floor: '1st Floor'
  },
  {
    id: 'ward-4',
    name: 'Pediatric Care Unit',
    type: 'PEDIATRIC',
    totalBeds: 6,
    availableBeds: 4,
    dailyRate: 180,
    floor: '1st Floor'
  }
];

export const INITIAL_BEDS: Bed[] = [
  {
    id: 'bed-101',
    bedNumber: 'GEN-201',
    wardId: 'ward-1',
    wardName: 'General Medical Ward (North Wing)',
    roomNumber: 'Room 201-A',
    type: 'STANDARD',
    status: 'AVAILABLE',
    dailyRate: 150
  },
  {
    id: 'bed-102',
    bedNumber: 'GEN-202',
    wardId: 'ward-1',
    wardName: 'General Medical Ward (North Wing)',
    roomNumber: 'Room 201-B',
    type: 'STANDARD',
    status: 'OCCUPIED',
    currentPatientId: 'pat-2',
    currentPatientName: 'Eleanor Sophia Bennett',
    dailyRate: 150
  },
  {
    id: 'bed-103',
    bedNumber: 'GEN-203',
    wardId: 'ward-1',
    wardName: 'General Medical Ward (North Wing)',
    roomNumber: 'Room 202-A',
    type: 'STANDARD',
    status: 'AVAILABLE',
    dailyRate: 150
  },
  {
    id: 'bed-104',
    bedNumber: 'ICU-301',
    wardId: 'ward-2',
    wardName: 'Cardiac Intensive Care Unit (CICU)',
    roomNumber: 'CICU Pod 1',
    type: 'VENTILATOR',
    status: 'OCCUPIED',
    dailyRate: 650
  },
  {
    id: 'bed-105',
    bedNumber: 'ICU-302',
    wardId: 'ward-2',
    wardName: 'Cardiac Intensive Care Unit (CICU)',
    roomNumber: 'CICU Pod 2',
    type: 'ICU',
    status: 'AVAILABLE',
    dailyRate: 650
  },
  {
    id: 'bed-106',
    bedNumber: 'SURG-101',
    wardId: 'ward-3',
    wardName: 'Surgical Recovery Ward',
    roomNumber: 'Post-Op 1',
    type: 'OXYGEN',
    status: 'AVAILABLE',
    dailyRate: 250
  }
];

export const INITIAL_ADMISSIONS: Admission[] = [
  {
    id: 'adm-1',
    admissionNumber: 'ADM-2026-0089',
    patientId: 'pat-2',
    patientName: 'Eleanor Sophia Bennett',
    patientAge: 34,
    patientGender: 'FEMALE',
    wardId: 'ward-1',
    wardName: 'General Medical Ward (North Wing)',
    bedId: 'bed-102',
    bedNumber: 'GEN-202',
    roomNumber: 'Room 201-B',
    attendingDoctorId: 'doc-3',
    attendingDoctorName: 'Dr. Anita Desai',
    admissionDate: '2026-09-23T15:30:00Z',
    admittingDiagnosis: 'Acute Bronchospasm secondary to Upper Respiratory Tract Infection',
    treatmentDetails: 'Nebulization therapy with Salbutamol/Ipratropium q6h, IV Hydrocortisone, supplemental oxygen.',
    status: 'ADMITTED',
    assignedNurse: 'Maria Rodriguez, RN'
  }
];

export const INITIAL_VITALS: VitalSignsRecord[] = [
  {
    id: 'vit-1',
    admissionId: 'adm-1',
    patientId: 'pat-2',
    patientName: 'Eleanor Sophia Bennett',
    bedNumber: 'GEN-202',
    temperature: 99.1,
    bloodPressureSys: 118,
    bloodPressureDia: 76,
    pulse: 82,
    spo2: 97,
    respiratoryRate: 18,
    weight: 63,
    recordedByNurse: 'Maria Rodriguez, RN',
    recordedAt: '2026-09-25T07:30:00Z',
    nurseNotes: 'Patient resting comfortably. Wheezing has diminished noticeably post-nebulization.'
  },
  {
    id: 'vit-2',
    admissionId: 'adm-1',
    patientId: 'pat-2',
    patientName: 'Eleanor Sophia Bennett',
    bedNumber: 'GEN-202',
    temperature: 100.2,
    bloodPressureSys: 122,
    bloodPressureDia: 80,
    pulse: 94,
    spo2: 94,
    respiratoryRate: 22,
    weight: 63,
    recordedByNurse: 'Maria Rodriguez, RN',
    recordedAt: '2026-09-24T18:00:00Z',
    nurseNotes: 'Low grade fever recorded; administered Paracetamol 650mg IV as prescribed.'
  }
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    code: 'MED-001',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesics',
    form: 'Tablet',
    strength: '650 mg',
    batchNumber: 'BT-2026-90',
    manufacturer: 'Pfizer / GSK',
    expiryDate: '2027-11-30',
    stockQuantity: 420,
    minStockLevel: 100,
    unitPrice: 0.25,
    supplier: 'Metro Health Distributors'
  },
  {
    id: 'med-2',
    code: 'MED-002',
    name: 'Amoxicillin / Clavulanate',
    genericName: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
    category: 'Antibiotics',
    form: 'Tablet',
    strength: '625 mg',
    batchNumber: 'AMX-2025-14',
    manufacturer: 'Novartis',
    expiryDate: '2026-10-15', // Near expiry alert
    stockQuantity: 45, // Low stock alert
    minStockLevel: 80,
    unitPrice: 1.40,
    supplier: 'Apex Pharma Supply'
  },
  {
    id: 'med-3',
    code: 'MED-003',
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    category: 'Cardiovascular',
    form: 'Tablet',
    strength: '5 mg',
    batchNumber: 'AML-2026-88',
    manufacturer: 'Sun Pharmaceuticals',
    expiryDate: '2028-02-28',
    stockQuantity: 310,
    minStockLevel: 50,
    unitPrice: 0.45,
    supplier: 'Global Med Corp'
  },
  {
    id: 'med-4',
    code: 'MED-004',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    category: 'Cardiovascular',
    form: 'Tablet',
    strength: '10 mg',
    batchNumber: 'ATV-2026-31',
    manufacturer: 'AstraZeneca',
    expiryDate: '2027-08-15',
    stockQuantity: 180,
    minStockLevel: 60,
    unitPrice: 0.85,
    supplier: 'Global Med Corp'
  },
  {
    id: 'med-5',
    code: 'MED-005',
    name: 'Metformin Hydrochloride',
    genericName: 'Metformin HCl',
    category: 'Antidiabetic',
    form: 'Tablet',
    strength: '500 mg',
    batchNumber: 'MET-2026-02',
    manufacturer: 'Merck Healthcare',
    expiryDate: '2028-05-30',
    stockQuantity: 550,
    minStockLevel: 120,
    unitPrice: 0.30,
    supplier: 'Prime Med Logistics'
  },
  {
    id: 'med-6',
    code: 'MED-006',
    name: 'Ceftriaxone Injection',
    genericName: 'Ceftriaxone Sodium',
    category: 'Antibiotics',
    form: 'Injection',
    strength: '1 g / Vial',
    batchNumber: 'CFT-2025-09',
    manufacturer: 'Roche Diagnostics',
    expiryDate: '2026-04-10', // Expired / critical
    stockQuantity: 18, // Critical low
    minStockLevel: 50,
    unitPrice: 6.50,
    supplier: 'Apex Pharma Supply'
  }
];

export const INITIAL_LAB_TESTS: LaboratoryTest[] = [
  {
    id: 'test-1',
    code: 'LAB-CBC',
    name: 'Complete Blood Count (CBC) with Differential',
    category: 'Hematology',
    sampleType: 'Whole Blood (EDTA)',
    price: 35,
    turnaroundHours: 3,
    normalRange: 'WBC: 4.5-11.0 k/uL, Hb: 13.5-17.5 g/dL (M) / 12.0-15.5 g/dL (F)'
  },
  {
    id: 'test-2',
    code: 'LAB-LIPID',
    name: 'Lipid Profile Comprehensive',
    category: 'Biochemistry',
    sampleType: 'Serum (Fasting 12h)',
    price: 45,
    turnaroundHours: 4,
    normalRange: 'Cholesterol: <200 mg/dL, HDL: >40 mg/dL, LDL: <100 mg/dL'
  },
  {
    id: 'test-3',
    code: 'LAB-HBA1C',
    name: 'Hemoglobin A1c (Glycated Hb)',
    category: 'Biochemistry',
    sampleType: 'Whole Blood',
    price: 40,
    turnaroundHours: 4,
    normalRange: 'Non-diabetic: 4.0 - 5.6%, Pre-diabetes: 5.7 - 6.4%, Diabetic: >= 6.5%'
  },
  {
    id: 'test-4',
    code: 'LAB-XRAY-CHEST',
    name: 'Chest X-Ray (PA View)',
    category: 'Radiology',
    sampleType: 'Imaging',
    price: 60,
    turnaroundHours: 2,
    normalRange: 'Normal lung fields, clear costophrenic angles, normal cardiac silhouette'
  },
  {
    id: 'test-5',
    code: 'LAB-LFT',
    name: 'Liver Function Test (LFT Panel)',
    category: 'Biochemistry',
    sampleType: 'Serum',
    price: 50,
    turnaroundHours: 5,
    normalRange: 'ALT: 7-56 U/L, AST: 10-40 U/L, Bilirubin: 0.1-1.2 mg/dL'
  }
];

export const INITIAL_LAB_REPORTS: LabReport[] = [
  {
    id: 'rep-1',
    reportNumber: 'REP-2026-8801',
    patientId: 'pat-1',
    patientName: 'James Alexander Miller',
    patientAge: 42,
    patientGender: 'MALE',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    testId: 'test-2',
    testName: 'Lipid Profile Comprehensive',
    testCategory: 'Biochemistry',
    requestDate: '2026-09-24T10:15:00Z',
    completedDate: '2026-09-24T14:30:00Z',
    status: 'COMPLETED',
    technicianName: 'Alex Chen, MLT',
    criticalAlert: false,
    pathologistImpression: 'Borderline elevated total cholesterol with mild hypertriglyceridemia. Recommend dietary moderation and statin therapy.',
    results: [
      {
        parameter: 'Total Cholesterol',
        value: '228',
        unit: 'mg/dL',
        referenceRange: '< 200',
        status: 'HIGH'
      },
      {
        parameter: 'HDL Cholesterol',
        value: '42',
        unit: 'mg/dL',
        referenceRange: '> 40',
        status: 'NORMAL'
      },
      {
        parameter: 'LDL Cholesterol',
        value: '144',
        unit: 'mg/dL',
        referenceRange: '< 100',
        status: 'HIGH'
      },
      {
        parameter: 'Triglycerides',
        value: '190',
        unit: 'mg/dL',
        referenceRange: '< 150',
        status: 'HIGH'
      }
    ]
  },
  {
    id: 'rep-2',
    reportNumber: 'REP-2026-8802',
    patientId: 'pat-2',
    patientName: 'Eleanor Sophia Bennett',
    patientAge: 34,
    patientGender: 'FEMALE',
    doctorId: 'doc-3',
    doctorName: 'Dr. Anita Desai',
    testId: 'test-1',
    testName: 'Complete Blood Count (CBC) with Differential',
    testCategory: 'Hematology',
    requestDate: '2026-09-24T16:00:00Z',
    completedDate: '2026-09-24T19:00:00Z',
    status: 'COMPLETED',
    technicianName: 'Alex Chen, MLT',
    criticalAlert: false,
    pathologistImpression: 'Mild leukocytosis consistent with active respiratory tract inflammatory response.',
    results: [
      {
        parameter: 'Hemoglobin',
        value: '13.2',
        unit: 'g/dL',
        referenceRange: '12.0 - 15.5',
        status: 'NORMAL'
      },
      {
        parameter: 'Total Leukocyte Count (WBC)',
        value: '12.8',
        unit: 'k/uL',
        referenceRange: '4.5 - 11.0',
        status: 'HIGH'
      },
      {
        parameter: 'Platelet Count',
        value: '265',
        unit: 'k/uL',
        referenceRange: '150 - 450',
        status: 'NORMAL'
      },
      {
        parameter: 'Neutrophils',
        value: '76',
        unit: '%',
        referenceRange: '40 - 70',
        status: 'HIGH'
      }
    ]
  },
  {
    id: 'rep-3',
    reportNumber: 'REP-2026-8803',
    patientId: 'pat-3',
    patientName: 'Marcus Aurelius Hayes',
    patientAge: 65,
    patientGender: 'MALE',
    doctorId: 'doc-3',
    doctorName: 'Dr. Anita Desai',
    testId: 'test-3',
    testName: 'Hemoglobin A1c (Glycated Hb)',
    testCategory: 'Biochemistry',
    requestDate: '2026-09-25T08:15:00Z',
    status: 'IN_ANALYSIS',
    technicianName: 'Alex Chen, MLT',
    results: []
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bill-1',
    invoiceNumber: 'INV-2026-3001',
    patientId: 'pat-1',
    patientName: 'James Alexander Miller',
    patientPhone: '+1 (555) 678-1122',
    date: '2026-09-24',
    dueDate: '2026-09-24',
    items: [
      {
        id: 'bi-1',
        description: 'Specialist Cardiology Consultation (Dr. Sarah Jenkins)',
        category: 'CONSULTATION',
        quantity: 1,
        unitPrice: 120,
        totalPrice: 120
      },
      {
        id: 'bi-2',
        description: 'Lipid Profile Comprehensive Lab Analysis',
        category: 'LAB_TEST',
        quantity: 1,
        unitPrice: 45,
        totalPrice: 45
      }
    ],
    subtotal: 165,
    discountPercentage: 0,
    discountAmount: 0,
    taxPercentage: 5,
    taxAmount: 8.25,
    totalAmount: 173.25,
    paidAmount: 173.25,
    balanceAmount: 0,
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    transactionReference: 'TXN-VISA-9921',
    notes: 'Payment collected at outpatient cashier counter.'
  },
  {
    id: 'bill-2',
    invoiceNumber: 'INV-2026-3002',
    patientId: 'pat-2',
    patientName: 'Eleanor Sophia Bennett',
    patientPhone: '+1 (555) 789-3344',
    date: '2026-09-24',
    dueDate: '2026-09-28',
    items: [
      {
        id: 'bi-3',
        description: 'Inpatient General Medical Ward (Room 201-B, 2 Days)',
        category: 'ROOM_CHARGE',
        quantity: 2,
        unitPrice: 150,
        totalPrice: 300
      },
      {
        id: 'bi-4',
        description: 'Complete Blood Count (CBC) Differential',
        category: 'LAB_TEST',
        quantity: 1,
        unitPrice: 35,
        totalPrice: 35
      },
      {
        id: 'bi-5',
        description: 'Oxygen & Nebulization Clinical Therapy Consumables',
        category: 'PROCEDURE',
        quantity: 1,
        unitPrice: 85,
        totalPrice: 85
      },
      {
        id: 'bi-6',
        description: 'Inpatient Nursing Care Services',
        category: 'NURSING',
        quantity: 2,
        unitPrice: 40,
        totalPrice: 80
      }
    ],
    subtotal: 500,
    discountPercentage: 5,
    discountAmount: 25,
    taxPercentage: 5,
    taxAmount: 23.75,
    totalAmount: 498.75,
    paidAmount: 200,
    balanceAmount: 298.75,
    paymentStatus: 'PARTIAL',
    paymentMethod: 'UPI',
    transactionReference: 'UPI-7782190',
    notes: 'Advance deposit received upon admission. Final balance due on discharge.'
  }
];

export const INITIAL_NOTIFICATIONS: HospitalNotification[] = [
  {
    id: 'notif-1',
    title: 'Lab Report Ready',
    message: 'Lipid Profile report for James Miller (MRN-2026-0814) has been completed and verified.',
    type: 'LAB',
    targetRole: 'DOCTOR',
    createdAt: '2026-09-24T14:35:00Z',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert',
    message: 'Amoxicillin / Clavulanate stock (45 units) is below reorder threshold (80 units).',
    type: 'STOCK',
    targetRole: 'PHARMACIST',
    createdAt: '2026-09-24T16:00:00Z',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Bed Allocation Updated',
    message: 'Bed GEN-202 in General Ward assigned to Eleanor Bennett.',
    type: 'SYSTEM',
    targetRole: 'NURSE',
    createdAt: '2026-09-23T15:35:00Z',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Appointment Confirmed',
    message: 'Appointment APT-2026-1001 with Dr. Sarah Jenkins confirmed for today at 09:00 AM.',
    type: 'APPOINTMENT',
    targetRole: 'PATIENT',
    createdAt: '2026-09-24T08:00:00Z',
    read: false
  }
];
