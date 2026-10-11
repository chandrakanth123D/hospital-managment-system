export interface CodeFile {
  name: string;
  path: string;
  language: string;
  category: 'Entity' | 'Repository' | 'Service' | 'Controller' | 'Security' | 'DTO' | 'Config' | 'Exception' | 'Testing' | 'Database' | 'Maven';
  description: string;
  content: string;
}

export const BACKEND_CODEBASE: CodeFile[] = [
  {
    name: 'pom.xml',
    path: 'backend/pom.xml',
    language: 'xml',
    category: 'Maven',
    description: 'Maven Project Object Model with Spring Boot 3.2, Java 17, Spring Security, JWT (jjwt), Spring Data JPA, MySQL Connector, Lombok, and Bean Validation.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.4</version>
        <relativePath/>
    </parent>
    <groupId>com.hospital</groupId>
    <artifactId>hospital-management-system</artifactId>
    <version>1.0.0-RELEASE</version>
    <name>Hospital Management System</name>
    <description>Enterprise Grade Hospital Management System - Spring Boot Backend</description>

    <properties>
        <java.version>17</java.version>
        <jwt.version>0.11.5</jwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starter Web (RESTful APIs, MVC, Embedded Tomcat) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA & Hibernate ORM -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Bean Validation (Hibernate Validator) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MySQL Database Connector Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Project Lombok (Boilerplate reduction: getters, setters, constructors) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- JSON Web Token (JWT) Library: jjwt-api, impl, and jackson -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Boot Testing (JUnit 5, Mockito, AssertJ) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    name: 'application.yml',
    path: 'backend/src/main/resources/application.yml',
    language: 'yaml',
    category: 'Config',
    description: 'Spring Boot configuration: Server port, MySQL datasource, JPA Hibernate DDL settings, and JWT secret key configuration.',
    content: `server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: hospital-management-system
  datasource:
    url: jdbc:mysql://localhost:3306/hospital_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect

# JWT Configuration
app:
  jwt:
    secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
    expiration-ms: 86400000 # 24 Hours validity

# Logging Configuration
logging:
  level:
    com.hospital: DEBUG
    org.springframework.security: INFO
    org.hibernate.SQL: DEBUG`
  },
  {
    name: 'HospitalManagementApplication.java',
    path: 'backend/src/main/java/com/hospital/HospitalManagementApplication.java',
    language: 'java',
    category: 'Config',
    description: 'Main Spring Boot application entry point.',
    content: `package com.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HospitalManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  Medicare Pro - Hospital Management System Online");
        System.out.println("  API Base URL: http://localhost:8080/api         ");
        System.out.println("==================================================");
    }
}`
  },
  {
    name: 'User.java',
    path: 'backend/src/main/java/com/hospital/entity/User.java',
    language: 'java',
    category: 'Entity',
    description: 'JPA Entity representing system users across all roles (Admin, Doctor, Patient, Nurse, Receptionist, Pharmacist, Lab Tech, Accountant).',
    content: `package com.hospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "username"),
    @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    @Column(nullable = false, length = 50)
    private String username;

    @NotBlank
    @Email
    @Column(nullable = false, length = 100)
    private String email;

    @NotBlank
    @Size(min = 6, max = 120)
    @Column(nullable = false)
    private String password;

    @NotBlank
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RoleType role;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum RoleType {
        ROLE_ADMIN,
        ROLE_DOCTOR,
        ROLE_PATIENT,
        ROLE_RECEPTIONIST,
        ROLE_NURSE,
        ROLE_PHARMACIST,
        ROLE_LAB_TECHNICIAN,
        ROLE_ACCOUNTANT
    }
}`
  },
  {
    name: 'Doctor.java',
    path: 'backend/src/main/java/com/hospital/entity/Doctor.java',
    language: 'java',
    category: 'Entity',
    description: 'JPA Entity representing doctors with department link, consultation fee, specialization, and availability.',
    content: `package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false, length = 100)
    private String specialization;

    @Column(nullable = false, length = 100)
    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "consultation_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(name = "room_number", length = 30)
    private String roomNumber;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ElementCollection
    @CollectionTable(name = "doctor_available_days", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "available_day")
    private List<String> availableDays;

    @ElementCollection
    @CollectionTable(name = "doctor_time_slots", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "time_slot")
    private List<String> timeSlots;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE";
}`
  },
  {
    name: 'Patient.java',
    path: 'backend/src/main/java/com/hospital/entity/Patient.java',
    language: 'java',
    category: 'Entity',
    description: 'JPA Entity for patient demographics, unique Medical Record Number (MRN), emergency contacts, blood group, and medical history.',
    content: `package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients", uniqueConstraints = {
    @UniqueConstraint(columnNames = "mrn")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false, unique = true, length = 50)
    private String mrn; // e.g. MRN-2026-0814

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 10)
    private String gender;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @Column(name = "emergency_contact_relation", length = 50)
    private String emergencyContactRelation;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "chronic_conditions", columnDefinition = "TEXT")
    private String chronicConditions;

    @Column(length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, ADMITTED, INACTIVE

    @CreationTimestamp
    @Column(name = "registered_at", updatable = false)
    private LocalDateTime registeredAt;
}`
  },
  {
    name: 'Appointment.java',
    path: 'backend/src/main/java/com/hospital/entity/Appointment.java',
    language: 'java',
    category: 'Entity',
    description: 'JPA Entity representing OPD appointments with doctor, patient, date, slot, status, and fee tracking.',
    content: `package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments", indexes = {
    @Index(name = "idx_doctor_date_slot", columnList = "doctor_id, appointment_date, time_slot", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_number", unique = true, nullable = false, length = 50)
    private String appointmentNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "time_slot", nullable = false, length = 20)
    private String timeSlot;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.BOOKED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(nullable = false)
    @Builder.Default
    private boolean paid = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum AppointmentStatus {
        BOOKED,
        CONFIRMED,
        COMPLETED,
        CANCELLED,
        RESCHEDULED,
        NO_SHOW
    }
}`
  },
  {
    name: 'MedicalRecord.java',
    path: 'backend/src/main/java/com/hospital/entity/MedicalRecord.java',
    language: 'java',
    category: 'Entity',
    description: 'JPA Entity for Electronic Medical Records (EMR), diagnosis, symptoms, clinical notes, and follow-ups.',
    content: `package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "chief_complaint", columnDefinition = "TEXT")
    private String chiefComplaint;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "clinical_notes", columnDefinition = "TEXT")
    private String clinicalNotes;

    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}`
  },
  {
    name: 'Prescription.java',
    path: 'backend/src/main/java/com/hospital/entity/Prescription.java',
    language: 'java',
    category: 'Entity',
    description: 'JPA Entity representing medical prescriptions with one-to-many PrescriptionItem relationships.',
    content: `package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prescription_number", unique = true, nullable = false, length = 50)
    private String prescriptionNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "prescription_date", nullable = false)
    private LocalDate prescriptionDate;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PrescriptionStatus status = PrescriptionStatus.PENDING;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PrescriptionItem> items = new ArrayList<>();

    @Column(name = "dispensed_at")
    private LocalDateTime dispensedAt;

    @Column(name = "pharmacist_notes", columnDefinition = "TEXT")
    private String pharmacistNotes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum PrescriptionStatus {
        PENDING,
        DISPENSED,
        PARTIALLY_DISPENSED
    }

    public void addItem(PrescriptionItem item) {
        items.add(item);
        item.setPrescription(this);
    }
}`
  },
  {
    name: 'Medicine.java',
    path: 'backend/src/main/java/com/hospital/entity/Medicine.java',
    language: 'java',
    category: 'Entity',
    description: 'JPA Entity for pharmacy medicine inventory, batches, stock control, and unit pricing.',
    content: `package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "generic_name", length = 150)
    private String genericName;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 30)
    private String form; // Tablet, Syrup, Injection

    @Column(length = 50)
    private String strength;

    @Column(name = "batch_number", length = 50)
    private String batchNumber;

    @Column(length = 100)
    private String manufacturer;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "min_stock_level", nullable = false)
    private Integer minStockLevel;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(length = 100)
    private String supplier;
}`
  },
  {
    name: 'Bed.java',
    path: 'backend/src/main/java/com/hospital/entity/Bed.java',
    language: 'java',
    category: 'Entity',
    description: 'JPA Entity for hospital ward and bed occupancy management.',
    content: `package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "beds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bed_number", unique = true, nullable = false, length = 30)
    private String bedNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;

    @Column(name = "room_number", length = 30)
    private String roomNumber;

    @Column(length = 30)
    @Builder.Default
    private String type = "STANDARD"; // STANDARD, ICU, VENTILATOR

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BedStatus status = BedStatus.AVAILABLE;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_patient_id")
    private Patient currentPatient;

    @Column(name = "daily_rate", precision = 10, scale = 2)
    private BigDecimal dailyRate;

    public enum BedStatus {
        AVAILABLE,
        OCCUPIED,
        MAINTENANCE
    }
}`
  },
  {
    name: 'Bill.java',
    path: 'backend/src/main/java/com/hospital/entity/Bill.java',
    language: 'java',
    category: 'Entity',
    description: 'JPA Entity representing hospital bills, line items, taxes, discounts, and payment settlements.',
    content: `package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BillItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "tax_percentage", precision = 5, scale = 2)
    private BigDecimal taxPercentage;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal paidAmount;

    @Column(name = "balance_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_method", length = 30)
    private String paymentMethod;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum PaymentStatus {
        PAID,
        PARTIAL,
        PENDING,
        CANCELLED
    }
}`
  },
  {
    name: 'UserRepository.java',
    path: 'backend/src/main/java/com/hospital/repository/UserRepository.java',
    language: 'java',
    category: 'Repository',
    description: 'Spring Data JPA Repository for User operations with username and email queries.',
    content: `package com.hospital.repository;

import com.hospital.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}`
  },
  {
    name: 'AppointmentRepository.java',
    path: 'backend/src/main/java/com/hospital/repository/AppointmentRepository.java',
    language: 'java',
    category: 'Repository',
    description: 'Spring Data JPA Repository with double-booking prevention query and doctor schedule lookups.',
    content: `package com.hospital.repository;

import com.hospital.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);
    List<Appointment> findByPatientId(Long patientId);
    
    // Critical Query: Check if doctor already has an active appointment at that time slot (prevents double-booking)
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date AND a.timeSlot = :slot AND a.status NOT IN ('CANCELLED')")
    boolean existsByDoctorIdAndAppointmentDateAndTimeSlot(
        @Param("doctorId") Long doctorId,
        @Param("date") LocalDate date,
        @Param("slot") String slot
    );
}`
  },
  {
    name: 'PatientService.java',
    path: 'backend/src/main/java/com/hospital/service/PatientService.java',
    language: 'java',
    category: 'Service',
    description: 'Business logic for patient registration, MRN auto-generation, update, and search.',
    content: `package com.hospital.service;

import com.hospital.dto.PatientDto;
import com.hospital.entity.Patient;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    public Patient getPatientByMrn(String mrn) {
        return patientRepository.findByMrn(mrn)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with MRN: " + mrn));
    }

    @Transactional
    public Patient registerPatient(PatientDto dto) {
        String generatedMrn = "MRN-" + Year.now().getValue() + "-" + (1000 + (int)(Math.random() * 9000));
        
        Patient patient = Patient.builder()
            .mrn(generatedMrn)
            .fullName(dto.getFullName())
            .dateOfBirth(dto.getDateOfBirth())
            .gender(dto.getGender())
            .bloodGroup(dto.getBloodGroup())
            .phone(dto.getPhone())
            .email(dto.getEmail())
            .address(dto.getAddress())
            .emergencyContactName(dto.getEmergencyContactName())
            .emergencyContactPhone(dto.getEmergencyContactPhone())
            .emergencyContactRelation(dto.getEmergencyContactRelation())
            .allergies(dto.getAllergies())
            .chronicConditions(dto.getChronicConditions())
            .status("ACTIVE")
            .build();

        return patientRepository.save(patient);
    }
}`
  },
  {
    name: 'AppointmentService.java',
    path: 'backend/src/main/java/com/hospital/service/AppointmentService.java',
    language: 'java',
    category: 'Service',
    description: 'Business logic for appointment booking, double booking prevention, and status workflows.',
    content: `package com.hospital.service;

import com.hospital.dto.AppointmentRequestDto;
import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public Appointment bookAppointment(AppointmentRequestDto request) {
        // 1. Validate Doctor exists
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        // 2. Validate Patient exists
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        // 3. Prevent double booking of the same doctor at the same slot
        boolean alreadyBooked = appointmentRepository.existsByDoctorIdAndAppointmentDateAndTimeSlot(
            request.getDoctorId(), request.getAppointmentDate(), request.getTimeSlot()
        );

        if (alreadyBooked) {
            throw new BadRequestException("Doctor " + doctor.getUser().getFullName() + 
                " is already booked at " + request.getTimeSlot() + " on " + request.getAppointmentDate());
        }

        Appointment appointment = Appointment.builder()
            .appointmentNumber("APT-" + System.currentTimeMillis() % 100000)
            .doctor(doctor)
            .patient(patient)
            .appointmentDate(request.getAppointmentDate())
            .timeSlot(request.getTimeSlot())
            .reason(request.getReason())
            .consultationFee(doctor.getConsultationFee())
            .status(Appointment.AppointmentStatus.CONFIRMED)
            .paid(false)
            .build();

        return appointmentRepository.save(appointment);
    }
}`
  },
  {
    name: 'SecurityConfig.java',
    path: 'backend/src/main/java/com/hospital/security/SecurityConfig.java',
    language: 'java',
    category: 'Security',
    description: 'Spring Security 6 configuration with BCryptPasswordEncoder, stateless JWT session, and role-based path security.',
    content: `package com.hospital.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthEntryPointJwt unauthorizedHandler;
    private final AuthTokenFilter authTokenFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/doctor/**").hasAnyRole("DOCTOR", "ADMIN")
                .requestMatchers("/api/patient/**").hasAnyRole("PATIENT", "ADMIN", "DOCTOR", "RECEPTIONIST")
                .requestMatchers("/api/pharmacy/**").hasAnyRole("PHARMACIST", "ADMIN")
                .requestMatchers("/api/lab/**").hasAnyRole("LAB_TECHNICIAN", "DOCTOR", "ADMIN")
                .requestMatchers("/api/billing/**").hasAnyRole("ACCOUNTANT", "ADMIN", "RECEPTIONIST")
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}`
  },
  {
    name: 'JwtUtils.java',
    path: 'backend/src/main/java/com/hospital/security/JwtUtils.java',
    language: 'java',
    category: 'Security',
    description: 'Utility for generating, parsing, and validating JSON Web Tokens (JWT) using HMAC SHA-256.',
    content: `package com.hospital.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("\${app.jwt.secret}")
    private String jwtSecret;

    @Value("\${app.jwt.expiration-ms}")
    private int jwtExpirationMs;

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }
}`
  },
  {
    name: 'GlobalExceptionHandler.java',
    path: 'backend/src/main/java/com/hospital/exception/GlobalExceptionHandler.java',
    language: 'java',
    category: 'Exception',
    description: 'Centralized exception handler using @RestControllerAdvice providing clean JSON error responses.',
    content: `package com.hospital.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequestException(BadRequestException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}`
  },
  {
    name: 'AuthController.java',
    path: 'backend/src/main/java/com/hospital/controller/AuthController.java',
    language: 'java',
    category: 'Controller',
    description: 'REST Controller for user registration, authentication, and JWT token issuance.',
    content: `package com.hospital.controller;

import com.hospital.dto.JwtResponse;
import com.hospital.dto.LoginRequest;
import com.hospital.dto.SignupRequest;
import com.hospital.entity.User;
import com.hospital.repository.UserRepository;
import com.hospital.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(
            jwt,
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name()
        ));
    }
}`
  },
  {
    name: 'PatientController.java',
    path: 'backend/src/main/java/com/hospital/controller/PatientController.java',
    language: 'java',
    category: 'Controller',
    description: 'REST API endpoints for patient records, profiles, and registration.',
    content: `package com.hospital.controller;

import com.hospital.dto.PatientDto;
import com.hospital.entity.Patient;
import com.hospital.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Patient> registerPatient(@Valid @RequestBody PatientDto patientDto) {
        return new ResponseEntity<>(patientService.registerPatient(patientDto), HttpStatus.CREATED);
    }
}`
  },
  {
    name: 'schema.sql',
    path: 'backend/src/main/resources/schema.sql',
    language: 'sql',
    category: 'Database',
    description: 'Complete MySQL DDL Database Schema with normalized tables, foreign keys, and indexes.',
    content: `-- ========================================================
-- MEDICARE PRO - HOSPITAL MANAGEMENT SYSTEM DATABASE SCHEMA
-- Target Database: MySQL 8.0+
-- ========================================================

DROP DATABASE IF EXISTS hospital_management;
CREATE DATABASE hospital_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_management;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Departments Table
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_doctor_name VARCHAR(100),
    location VARCHAR(100)
);

-- 3. Doctors Table
CREATE TABLE doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 0,
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    room_number VARCHAR(30),
    bio TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    CONSTRAINT fk_doctor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_doctor_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 4. Patients Table
CREATE TABLE patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    mrn VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    allergies TEXT,
    chronic_conditions TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Appointments Table
CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'BOOKED',
    notes TEXT,
    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_apt_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_apt_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    CONSTRAINT uq_doctor_slot UNIQUE (doctor_id, appointment_date, time_slot)
);

-- 6. Wards Table
CREATE TABLE wards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL,
    total_beds INT NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    floor VARCHAR(30)
);

-- 7. Beds Table
CREATE TABLE beds (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bed_number VARCHAR(30) NOT NULL UNIQUE,
    ward_id BIGINT NOT NULL,
    room_number VARCHAR(30),
    type VARCHAR(30) DEFAULT 'STANDARD',
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    current_patient_id BIGINT,
    daily_rate DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_bed_ward FOREIGN KEY (ward_id) REFERENCES wards(id),
    CONSTRAINT fk_bed_patient FOREIGN KEY (current_patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

-- 8. Inpatient Admissions Table
CREATE TABLE admissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admission_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL,
    bed_id BIGINT NOT NULL,
    attending_doctor_id BIGINT NOT NULL,
    admission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    discharge_date TIMESTAMP NULL,
    admitting_diagnosis TEXT,
    treatment_details TEXT,
    discharge_summary TEXT,
    status VARCHAR(20) DEFAULT 'ADMITTED',
    CONSTRAINT fk_adm_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_adm_bed FOREIGN KEY (bed_id) REFERENCES beds(id),
    CONSTRAINT fk_adm_doctor FOREIGN KEY (attending_doctor_id) REFERENCES doctors(id)
);

-- 9. Vital Signs Table
CREATE TABLE vital_signs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admission_id BIGINT,
    patient_id BIGINT NOT NULL,
    temperature DECIMAL(4,1),
    blood_pressure_sys INT,
    blood_pressure_dia INT,
    pulse INT,
    spo2 INT,
    respiratory_rate INT,
    weight DECIMAL(5,2),
    nurse_notes TEXT,
    recorded_by VARCHAR(100),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vitals_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_vitals_admission FOREIGN KEY (admission_id) REFERENCES admissions(id) ON DELETE SET NULL
);

-- 10. Medicines Table
CREATE TABLE medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    generic_name VARCHAR(150),
    category VARCHAR(50) NOT NULL,
    form VARCHAR(30) NOT NULL,
    strength VARCHAR(50),
    batch_number VARCHAR(50),
    manufacturer VARCHAR(100),
    expiry_date DATE NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 20,
    unit_price DECIMAL(10,2) NOT NULL,
    supplier VARCHAR(100)
);

-- 11. Prescriptions Table
CREATE TABLE prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    prescription_date DATE NOT NULL,
    diagnosis TEXT,
    status VARCHAR(30) DEFAULT 'PENDING',
    dispensed_at TIMESTAMP NULL,
    pharmacist_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rx_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_rx_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- 12. Prescription Items Table
CREATE TABLE prescription_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    instructions TEXT,
    dispensed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_item_prescription FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
);

-- 13. Bills Table
CREATE TABLE bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL,
    bill_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    balance_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    payment_method VARCHAR(30),
    transaction_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bill_patient FOREIGN KEY (patient_id) REFERENCES patients(id)
);`
  },
  {
    name: 'PatientServiceTest.java',
    path: 'backend/src/test/java/com/hospital/service/PatientServiceTest.java',
    language: 'java',
    category: 'Testing',
    description: 'JUnit 5 and Mockito Unit Tests for Patient registration and validation.',
    content: `package com.hospital.service;

import com.hospital.dto.PatientDto;
import com.hospital.entity.Patient;
import com.hospital.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    private PatientDto sampleDto;

    @BeforeEach
    void setUp() {
        sampleDto = new PatientDto();
        sampleDto.setFullName("Arthur Dent");
        sampleDto.setDateOfBirth(LocalDate.of(1982, 3, 11));
        sampleDto.setGender("MALE");
        sampleDto.setBloodGroup("A+");
        sampleDto.setPhone("+15551234567");
        sampleDto.setEmail("arthur@earth.org");
    }

    @Test
    @DisplayName("Should successfully register a patient with generated MRN")
    void registerPatient_Success() {
        Patient savedPatient = Patient.builder()
            .id(1L)
            .mrn("MRN-2026-9999")
            .fullName(sampleDto.getFullName())
            .build();

        when(patientRepository.save(any(Patient.class))).thenReturn(savedPatient);

        Patient result = patientService.registerPatient(sampleDto);

        assertNotNull(result);
        assertEquals("Arthur Dent", result.getFullName());
        assertNotNull(result.getMrn());
        verify(patientRepository, times(1)).save(any(Patient.class));
    }
}`
  }
];
