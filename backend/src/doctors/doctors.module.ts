import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from '../entities/doctor.entity';

@Module({
  imports: [
    // Import Doctor entity for database operations
    TypeOrmModule.forFeature([Doctor]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService], // Export for use in other modules
})
export class DoctorsModule {} 