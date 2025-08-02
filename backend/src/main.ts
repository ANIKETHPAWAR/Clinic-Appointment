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

  // Get port from environment or use default
  const port = process.env.PORT || 3001;

  // Seed default data
  const seedService = app.get(SeedService);
  await seedService.seed();

  // Start the application
  await app.listen(port);
  
  console.log(`🚀 Front Desk System API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api`);
}

// Start the application
bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
}); 