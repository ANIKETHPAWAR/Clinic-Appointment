// Test database connection script
const mysql = require('mysql2/promise');

async function testConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'aws.connect.psdb.cloud',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Testing database connection...');
    
    // Test basic connection
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    
    // Test tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));
    
    // Test users table
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('👥 Users count:', users[0].count);
    
    // Test doctors table
    const [doctors] = await connection.execute('SELECT COUNT(*) as count FROM doctors');
    console.log('👨‍⚕️ Doctors count:', doctors[0].count);
    
    // Test patients table
    const [patients] = await connection.execute('SELECT COUNT(*) as count FROM patients');
    console.log('🏥 Patients count:', patients[0].count);
    
    console.log('🎉 Database is ready for ClinicMS!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await connection.end();
  }
}

// Load environment variables
require('dotenv').config();

// Run test
testConnection(); 