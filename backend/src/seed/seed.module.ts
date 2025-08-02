import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Doctor } from '../entities/doctor.entity';
import { Patient } from '../entities/patient.entity';
import { Appointment } from '../entities/appointment.entity';
import { Queue } from '../entities/queue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Doctor, Patient, Appointment, Queue])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {} 