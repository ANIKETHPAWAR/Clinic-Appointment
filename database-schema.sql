-- ClinicMS Database Schema
-- Run this in your PlanetScale database

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'STAFF') DEFAULT 'STAFF',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization ENUM('CARDIOLOGY', 'DERMATOLOGY', 'NEUROLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 'PSYCHIATRY', 'RADIOLOGY', 'SURGERY', 'INTERNAL_MEDICINE', 'EMERGENCY_MEDICINE', 'GENERAL_PRACTICE') NOT NULL,
  gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
  location VARCHAR(100) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
  dateOfBirth DATE NOT NULL,
  address TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientName VARCHAR(100) NOT NULL,
  doctorId INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type ENUM('CONSULTATION', 'FOLLOW_UP', 'EMERGENCY', 'ROUTINE_CHECKUP', 'SPECIALIST_VISIT') DEFAULT 'CONSULTATION',
  status ENUM('BOOKED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'BOOKED',
  notes TEXT,
  cancellationReason TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Queue table
CREATE TABLE queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  queueNumber INT AUTO_INCREMENT,
  patientName VARCHAR(100) NOT NULL,
  status ENUM('WAITING', 'WITH_DOCTOR', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'WAITING',
  priority ENUM('EMERGENCY', 'URGENT', 'NORMAL') DEFAULT 'NORMAL',
  reason VARCHAR(255),
  notes TEXT,
  doctorId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE SET NULL
);

-- Insert default admin user
INSERT INTO users (username, email, password, role, isActive) 
VALUES ('admin', 'admin@clinicms.com', '$2b$10$rQZ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'ADMIN', TRUE);

-- Insert sample doctors
INSERT INTO doctors (name, specialization, gender, location, available, email, phone) VALUES
('Dr. John Smith', 'CARDIOLOGY', 'MALE', 'Cardiology Department', TRUE, 'john.smith@clinic.com', '+1234567890'),
('Dr. Sarah Johnson', 'DERMATOLOGY', 'FEMALE', 'Dermatology Department', TRUE, 'sarah.johnson@clinic.com', '+1234567891'),
('Dr. Michael Brown', 'NEUROLOGY', 'MALE', 'Neurology Department', TRUE, 'michael.brown@clinic.com', '+1234567892');

-- Insert sample patients
INSERT INTO patients (firstName, lastName, email, phone, gender, dateOfBirth, address) VALUES
('Alice', 'Wilson', 'alice.wilson@email.com', '+1234567893', 'FEMALE', '1990-05-15', '123 Main St, City'),
('Bob', 'Davis', 'bob.davis@email.com', '+1234567894', 'MALE', '1985-08-22', '456 Oak Ave, Town'),
('Carol', 'Miller', 'carol.miller@email.com', '+1234567895', 'FEMALE', '1992-12-10', '789 Pine Rd, Village');

-- Insert sample appointments
INSERT INTO appointments (patientName, doctorId, date, time, type, status) VALUES
('Alice Wilson', 1, CURDATE(), '09:00:00', 'CONSULTATION', 'BOOKED'),
('Bob Davis', 2, CURDATE(), '10:30:00', 'FOLLOW_UP', 'CONFIRMED'),
('Carol Miller', 3, CURDATE(), '14:00:00', 'ROUTINE_CHECKUP', 'BOOKED');

-- Insert sample queue entries
INSERT INTO queue (patientName, status, priority, reason) VALUES
('Alice Wilson', 'WAITING', 'NORMAL', 'General checkup'),
('Bob Davis', 'WITH_DOCTOR', 'URGENT', 'Follow-up consultation'); 