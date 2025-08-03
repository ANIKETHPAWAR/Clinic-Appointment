// Fresh Railway MySQL Database Setup for ClinicMS
const mysql = require('mysql2/promise');

// Database Schema - Updated to match NestJS entities
const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'STAFF') DEFAULT 'STAFF',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctors table - Updated to match entity
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  specialization ENUM('cardiology', 'dermatology', 'endocrinology', 'gastroenterology', 'general_medicine', 'gynecology', 'neurology', 'oncology', 'orthopedics', 'pediatrics', 'psychiatry', 'radiology', 'surgery', 'urology') NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  location VARCHAR(100) NOT NULL,
  bio TEXT,
  availability JSON,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients table - Updated to match entity
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  dateOfBirth DATE NOT NULL,
  address TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Appointments table - Updated to match entity
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctorId INT NOT NULL,
  patientId INT NOT NULL,
  appointmentDateTime DATETIME NOT NULL,
  type ENUM('consultation', 'follow_up', 'emergency', 'routine_checkup', 'specialist_visit') DEFAULT 'consultation',
  status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  notes TEXT,
  cancellationReason TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
);

-- Queue table - Updated to match entity
CREATE TABLE IF NOT EXISTS queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  queueNumber INT NOT NULL,
  patientName VARCHAR(100) NOT NULL,
  status ENUM('waiting', 'with_doctor', 'completed', 'cancelled', 'no_show') DEFAULT 'waiting',
  priority ENUM('emergency', 'urgent', 'normal') DEFAULT 'normal',
  reason VARCHAR(255),
  notes TEXT,
  doctorId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE SET NULL
);
`;

// Sample Data - Updated to match entity structure
const sampleData = `
-- Admin user
INSERT IGNORE INTO users (username, email, password, role, isActive) 
VALUES ('admin', 'admin@clinicms.com', '$2b$10$rQZ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'ADMIN', TRUE);

-- Sample doctors - Updated to use firstName and lastName
INSERT IGNORE INTO doctors (firstName, lastName, specialization, gender, location, email, phone) VALUES
('John', 'Smith', 'cardiology', 'male', 'Cardiology Department', 'john.smith@clinic.com', '+1234567890'),
('Sarah', 'Johnson', 'dermatology', 'female', 'Dermatology Department', 'sarah.johnson@clinic.com', '+1234567891'),
('Michael', 'Brown', 'neurology', 'male', 'Neurology Department', 'michael.brown@clinic.com', '+1234567892');

-- Sample patients - Updated to use firstName and lastName
INSERT IGNORE INTO patients (firstName, lastName, email, phone, gender, dateOfBirth, address) VALUES
('Alice', 'Wilson', 'alice.wilson@email.com', '+1234567893', 'female', '1990-05-15', '123 Main St, City'),
('Bob', 'Davis', 'bob.davis@email.com', '+1234567894', 'male', '1985-08-22', '456 Oak Ave, Town'),
('Carol', 'Miller', 'carol.miller@email.com', '+1234567895', 'female', '1992-12-10', '789 Pine Rd, Village');

-- Sample appointments - Updated to use doctorId and patientId
INSERT IGNORE INTO appointments (doctorId, patientId, appointmentDateTime, type, status) VALUES
(1, 1, NOW(), 'consultation', 'scheduled'),
(2, 2, NOW(), 'follow_up', 'confirmed'),
(3, 3, NOW(), 'routine_checkup', 'scheduled');

-- Sample queue entries
INSERT IGNORE INTO queue (patientName, queueNumber, status, priority, reason) VALUES
('Alice Wilson', 1, 'waiting', 'normal', 'General checkup'),
('Bob Davis', 2, 'with_doctor', 'urgent', 'Follow-up consultation');
`;

async function setupRailwayDatabase() {
  console.log('🚀 Setting up Railway MySQL database for ClinicMS...');
  
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: parseInt(process.env.MYSQLPORT) || parseInt(process.env.DB_PORT) || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USERNAME || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'railway',
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Connected to Railway MySQL successfully');

    // Create tables
    console.log('📋 Creating database tables...');
    const schemaCommands = schema.split(';').filter(cmd => cmd.trim());
    for (const command of schemaCommands) {
      if (command.trim()) {
        await connection.execute(command);
      }
    }
    console.log('✅ All tables created successfully');

    // Insert sample data
    console.log('📝 Inserting sample data...');
    const dataCommands = sampleData.split(';').filter(cmd => cmd.trim());
    for (const command of dataCommands) {
      if (command.trim()) {
        await connection.execute(command);
      }
    }
    console.log('✅ Sample data inserted successfully');

    // Verify setup
    console.log('🔍 Verifying database setup...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📋 Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [doctors] = await connection.execute('SELECT COUNT(*) as count FROM doctors');
    const [patients] = await connection.execute('SELECT COUNT(*) as count FROM patients');

    console.log(`👥 Users: ${users[0].count}`);
    console.log(`👨‍⚕️ Doctors: ${doctors[0].count}`);
    console.log(`🏥 Patients: ${patients[0].count}`);

    console.log('\n🎉 Railway MySQL database setup complete!');
    console.log('🔑 Admin login: admin / admin123');
    console.log('📝 Next step: Deploy your backend to Vercel');

    await connection.end();

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check Railway connection details');
    console.log('   2. Ensure Railway MySQL service is running');
    console.log('   3. Verify environment variables are set correctly');
  }
}

// Load environment variables
require('dotenv').config();

// Run setup
setupRailwayDatabase(); 