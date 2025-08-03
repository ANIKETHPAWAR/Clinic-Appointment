const mysql = require('mysql2/promise');

async function checkRailwayConnection() {
  console.log('🔍 Checking Railway database connection...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: parseInt(process.env.MYSQLPORT) || parseInt(process.env.DB_PORT) || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USERNAME || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'railway',
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Successfully connected to Railway MySQL');
    
    // Check if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📋 Found ${tables.length} tables in database`);
    
    if (tables.length === 0) {
      console.log('⚠️ No tables found. The application will create them automatically.');
    } else {
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }

    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Railway database:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Railway Deployment Check');
  console.log('========================');
  
  // Check environment variables
  console.log('\n📋 Environment Variables:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT}`);
  console.log(`   PORT: ${process.env.PORT}`);
  console.log(`   MYSQLHOST: ${process.env.MYSQLHOST ? 'Set' : 'Not set'}`);
  console.log(`   MYSQLDATABASE: ${process.env.MYSQLDATABASE ? 'Set' : 'Not set'}`);
  
  // Check database connection
  const dbConnected = await checkRailwayConnection();
  
  if (dbConnected) {
    console.log('\n✅ Railway deployment check completed successfully');
    console.log('🎉 Your application should be ready to deploy!');
  } else {
    console.log('\n❌ Railway deployment check failed');
    console.log('💡 Please check your Railway environment variables and database setup');
  }
}

// Run the check
main().catch(console.error); 