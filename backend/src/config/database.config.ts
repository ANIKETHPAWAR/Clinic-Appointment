import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT === 'production';
  
  if (isProduction) {
    // Production: Use Railway MySQL database
    return {
      type: 'mysql',
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'ballast.proxy.rlwy.net',
      port: parseInt(process.env.MYSQLPORT) || parseInt(process.env.DB_PORT) || 3306,
      username: process.env.MYSQLUSER || process.env.DB_USERNAME || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'huhSgzLfzxTFAeNHEIgrmDoewQaMOxBD',
      database: process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'railway',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, // Disable in production
      ssl: {
        rejectUnauthorized: false,
      },
      logging: false,
    };
  } else {
    // Development: Use local MySQL
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'clinicms',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    };
  }
}; 