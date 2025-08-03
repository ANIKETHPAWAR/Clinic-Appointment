import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://localhost:5175', 
      'http://localhost:5176',
      'https://clinicms-frontend.vercel.app',
      'https://clinicms-frontend-git-main.vercel.app',
      'https://clinicms-frontend-*.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe - automatically validates all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Add a simple health check endpoint
  app.getHttpAdapter().get('/api', (req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Front Desk System API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Get port from environment or use default
  const port = process.env.PORT || 3001;

  // Start the application first
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Front Desk System API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api`);

  // Try to seed data, but don't fail if it doesn't work
  try {
    const seedService = app.get(SeedService);
    await seedService.seed();
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('⚠️ Database seeding failed, but application is still running:', error.message);
  }
}

// Start the application
bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
}); 