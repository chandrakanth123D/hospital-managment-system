export interface DocSection {
  id: string;
  title: string;
  category: 'Overview' | 'System Analysis' | 'UML Diagrams' | 'Architecture & DB' | 'Testing & Deployment' | 'Viva Voce';
  content: string;
}

export const PROJECT_DOCS: DocSection[] = [
  {
    id: 'sec-1',
    title: '1. Project Title & Abstract',
    category: 'Overview',
    content: `### Project Title
**MediCare Pro: Enterprise Hospital Management System (HMS)**
*A Full-Stack Distributed Clinical & Inpatient Automation Platform using Spring Boot 3, Hibernate/JPA, MySQL, and Modern Responsive Frontend.*

---

### Abstract
Hospital Management System (HMS) is an integrated, role-based healthcare informatics platform engineered to modernize outpatient care, inpatient bed management, electronic medical records (EMR), pharmacy inventory, clinical diagnostics, and automated billing.

Traditional paper-reliant workflows suffer from record fragmentation, medication scheduling discrepancies, bed allocation delays, and billing leakages. **MediCare Pro** resolves these bottlenecks by establishing an authoritative, normalized relational database backed by a high-throughput Java 17 Spring Boot micro-service architecture and responsive client interfaces.

The system enforces strict Role-Based Access Control (RBAC) across 8 key stakeholders:
1. **System Administrator**
2. **Attending Doctor / Specialist**
3. **Patient / OPD Client**
4. **Front-Desk Receptionist**
5. **Staff Nurse (Inpatient / Vitals)**
6. **Registered Pharmacist**
7. **Clinical Laboratory Technician**
8. **Hospital Accountant / Cashier**

Key technical implementations include stateless JWT authentication with BCrypt hashing, double-booking prevention algorithms for doctor schedules, automated bed status state transitions, and real-time inventory threshold monitors.`
  },
  {
    id: 'sec-2',
    title: '2. Problem Statement & Objectives',
    category: 'System Analysis',
    content: `### Problem Statement
Modern healthcare facilities encounter severe operational hurdles:
- **Disjointed Clinical Records**: Patient histories, laboratory findings, and diagnostic imaging are scattered across physical paper files, risking diagnostic delays and adverse drug interactions.
- **Appointment Scheduling Conflicts**: Double booking of physician consultation slots causes prolonged patient wait times and doctor burnout.
- **Inpatient Bed Blindspots**: Reception and triage teams lack real-time visibility into bed occupancy, discharge status, and ICU capacity.
- **Pharmacy & Laboratory Leakage**: Unverified dispensing and unbilled diagnostics create financial deficits and stockout of critical life-saving antibiotics.

### Project Objectives
1. **Centralize Patient Medical Records (EMR)**: Maintain an encrypted longitudinal medical history with ICD-compliant diagnoses, symptoms, and visit timelines.
2. **Automate Clinic Scheduling**: Provide conflict-free scheduling with algorithmic double-booking protection.
3. **Digitize Inpatient Care**: Enable real-time bed tracking across General, Surgical, Pediatric, and Intensive Care Units (ICU) alongside nursing vital signs monitoring.
4. **Unify Pharmacy & Diagnostics**: Implement automatic stock decrement upon prescription verification and automated flag calculation (High/Low) on laboratory reference values.
5. **Streamline Revenue Cycle Management**: Itemize consultations, room occupancy, pharmacy dispensation, and diagnostics into tamper-proof invoices with audit logs.`
  },
  {
    id: 'sec-3',
    title: '3. Scope & System Requirements',
    category: 'System Analysis',
    content: `### Functional Scope
- **User Authentication**: Secure JWT registration, login, logout, password reset, and active status control.
- **OPD Triage & Scheduling**: Doctor directory, slot selection, and status progression (\`BOOKED\` → \`CONFIRMED\` → \`COMPLETED\` / \`CANCELLED\`).
- **Electronic Medical Records**: Doctor consultation notes, vital signs capture, e-prescriptions, and laboratory orders.
- **Inpatient Management**: Ward admission, bed allocation, daily nursing chart, vital recording, and discharge summary generation.
- **Pharmacy Operations**: Batch tracking, near-expiry alerts (<30 days), low stock triggers, and prescription dispensing.
- **Diagnostic Laboratory**: Work order queuing, specimen analysis, abnormal value flagging, and pathologist verification.
- **Billing & Settlement**: Multi-channel payment recording (Cash, Card, UPI, Insurance) with PDF/print invoice generation.

### Non-Functional Requirements
- **Security**: Industry-standard BCrypt hashing with salt rounds = 10; stateless HMAC SHA-256 JWT tokens.
- **Performance**: Sub-100ms API response latency for search and schedule lookups.
- **Data Integrity**: Normalized MySQL 8 relational schema in Third Normal Form (3NF) with foreign key cascade rules.
- **High Availability & Scalability**: Layered architecture separating Web Presentation, Business Service, and Persistence layers.`
  },
  {
    id: 'sec-4',
    title: '4. System Architecture & UML Diagrams',
    category: 'UML Diagrams',
    content: `### Layered Backend Architecture
\`\`\`
   [ Web Browser / Mobile Frontend ]
                  │
          HTTPS / JSON REST
                  ▼
┌──────────────────────────────────────────────────┐
│  Spring Security & JWT Filter (Stateless Auth)   │
└──────────────────────────────────────────────────┘
                  │
┌──────────────────────────────────────────────────┐
│  Presentation Layer: REST Controllers (@RestController)
│  (AuthController, PatientController, DoctorController, etc.)
└──────────────────────────────────────────────────┘
                  │
┌──────────────────────────────────────────────────┐
│  Service Layer: Core Business Logic (@Service)   │
│  (Validation, Conflict Checks, Billing Calculation)
└──────────────────────────────────────────────────┘
                  │
┌──────────────────────────────────────────────────┐
│  Data Access Layer: Spring Data JPA Repositories │
│  (Hibernate ORM, JPQL Queries, Connection Pool)  │
└──────────────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  Persistence: MySQL 8.0 Relational Database      │
└──────────────────────────────────────────────────┘
\`\`\`

---

### Use Case Diagram (Actor Interaction Matrix)
- **Admin**: Manage Users, Configure Doctors, Define Wards & Rates, View Revenue & Footfall Reports.
- **Doctor**: View Daily Schedule, Record Vitals & EMR, Prescribe Medications, Order Lab Tests.
- **Patient**: Register, Browse Doctors, Book Appointments, View Diagnostic Reports, Pay Invoices.
- **Receptionist**: Onboard OPD Patients, Schedule Appointments, Check Bed Availability, Admit/Discharge Patients.
- **Nurse**: Track Inpatient Ward, Record Hourly Vital Signs (BP, SpO2, Pulse, Temp), Mark Meds Administered.
- **Pharmacist**: Monitor Inventory, Receive E-Prescriptions, Verify Dosages, Dispense & Deduct Stock.
- **Lab Technician**: Access Test Queue, Process Samples, Input Reference Ranges & Results, Authorize Reports.
- **Accountant**: Consolidate Charges, Apply Concessions/Taxes, Record Payments, Issue Invoices.`
  },
  {
    id: 'sec-5',
    title: '5. Database Design & Normalization',
    category: 'Architecture & DB',
    content: `### Database Normalization Analysis
The MediCare Pro database schema is strictly designed adhering to **Third Normal Form (3NF)**:

1. **First Normal Form (1NF)**:
   - Every column contains atomic values. Multi-valued attributes like \`available_days\` and \`time_slots\` are extracted into separate normalized join tables (\`doctor_available_days\`, \`doctor_time_slots\`).
   - Every table is assigned an unambiguous primary key (\`BIGINT AUTO_INCREMENT\` or UUID).

2. **Second Normal Form (2NF)**:
   - The database is in 1NF and all non-key attributes are fully functional dependent on the primary key.
   - For composite structures such as \`BillItem\` and \`PrescriptionItem\`, each line item links to its master record foreign key with individual sequence identifiers, preventing partial dependencies.

3. **Third Normal Form (3NF)**:
   - There are no transitive dependencies. Non-key columns depend solely on the primary key.
   - For example, Doctor consultation fee is maintained in the \`doctors\` table; when an appointment is confirmed, the snapshot fee is recorded on \`appointments.consultation_fee\` to preserve audit history even if the physician adjusts their rates in future quarters.`
  },
  {
    id: 'sec-6',
    title: '6. Testing Methodology & Test Cases',
    category: 'Testing & Deployment',
    content: `### Testing Strategy
- **Unit Testing**: JUnit 5 and Mockito mock service layer dependencies to test core calculations (e.g. tax and discount formulas, double-booking validation).
- **Integration Testing**: Spring Security Test verifies endpoint protection and authorization filters for unauthenticated vs role-restricted endpoints.
- **API Testing**: Postman collection verifies JSON schema, HTTP response codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found).

---

### Test Case Execution Table
| Test ID | Test Scenario | Input Data | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | Patient Registration | Valid Full Name, DOB, Gender, Phone | HTTP 201 Created, Unique MRN generated | PASS |
| TC-02 | Prevent Double Booking | Same Doctor, Same Date, Same Time Slot | HTTP 400 Bad Request, "Already booked" | PASS |
| TC-03 | JWT Authentication | Correct Username and BCrypt password | HTTP 200 OK, Signed JWT token returned | PASS |
| TC-04 | Unauthorized Access | Patient token requesting \`/api/admin/users\` | HTTP 403 Forbidden | PASS |
| TC-05 | Inpatient Bed State | Admit patient to Bed GEN-201 | Bed status toggles from AVAILABLE to OCCUPIED | PASS |
| TC-06 | Pharmacy Stock Deduction | Dispense 10 units of Paracetamol | Stock drops from 420 to 410 units | PASS |
| TC-07 | Lab Abnormal Value | Cholesterol = 228 mg/dL (Ref < 200) | Parameter flagged as 'HIGH' automatically | PASS |`
  },
  {
    id: 'sec-7',
    title: '7. Viva Voce Q&A (Academic Defense Preparation)',
    category: 'Viva Voce',
    content: `### Frequently Asked Questions by External Examiners

#### Q1: What architecture does this Hospital Management System follow?
**Answer**: MediCare Pro follows a 3-tier decoupled architecture:
1. Presentation Layer (Vite React SPA with Bootstrap & Tailwind responsive components)
2. Business Service & Security Layer (Spring Boot 3 REST controllers, services, and Spring Security 6)
3. Data Persistence Layer (Spring Data JPA, Hibernate ORM, and MySQL 8.0 relational database).

#### Q2: How does your system prevent two patients from booking the same doctor simultaneously?
**Answer**: The system enforces concurrency protection at both the database and service levels:
- At the database level: A unique composite constraint \`UNIQUE (doctor_id, appointment_date, time_slot)\` guarantees zero duplicate entries.
- At the service level: An JPQL query checks \`existsByDoctorIdAndAppointmentDateAndTimeSlot\` before persisting, returning a graceful 400 Bad Request with an informative error message.

#### Q3: How is authentication and authorization managed securely?
**Answer**:
- Passwords are encrypted before database insertion using \`BCryptPasswordEncoder\` with salt rounds.
- Upon successful authentication, the server generates a cryptographically signed HMAC SHA-256 JSON Web Token (JWT) with user claims and expiration timestamp.
- Every subsequent request passes through \`AuthTokenFilter\`, which validates the token signature and populates \`SecurityContextHolder\` with role authorities.
- Method-level security (\`@PreAuthorize("hasRole('ADMIN')")\`) protects sensitive REST endpoints.

#### Q4: How does the system handle inpatient bed allocation and discharge?
**Answer**:
- Wards contain multiple Beds with status \`AVAILABLE\`, \`OCCUPIED\`, or \`MAINTENANCE\`.
- When an admission record is created, a transaction assigns the bed to the patient and flips its status to \`OCCUPIED\`.
- When the doctor or receptionist initiates discharge, the discharge summary is logged, the bed status returns to \`AVAILABLE\`, and an inpatient room bill is automatically calculated based on duration and daily ward rates.

#### Q5: Explain the difference between JPA and Hibernate.
**Answer**: JPA (Java Persistence API / Jakarta Persistence) is a standardized specification that defines the rules, annotations, and interfaces for Object-Relational Mapping (ORM) in Java. Hibernate is the concrete implementation (ORM provider) that implements the JPA interfaces.`
  }
];
