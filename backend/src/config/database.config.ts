import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Check if Railway MySQL variables are available (indicates Railway environment)
  const hasRailwayVars = process.env.MYSQLHOST && process.env.MYSQLHOST !== 'mysql.railway.internal';
  
  if (isProduction && hasRailwayVars) {
    // Production: Use external MySQL database (Railway, Render, etc.)
    return {
      type: 'mysql',
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: parseInt(process.env.MYSQLPORT) || parseInt(process.env.DB_PORT) || 3306,
      username: process.env.MYSQLUSER || process.env.DB_USERNAME || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'railway',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // Enable for production to auto-create tables
      ssl: {
        rejectUnauthorized: false,
      },
      logging: false,
      retryAttempts: 10,
      retryDelay: 3000,
      keepConnectionAlive: true,
    };
  } else {
    // Development: Use local MySQL Workbench
    console.log('🏠 Using local MySQL Workbench for development');
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'msclinic',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    };
  }
}; 