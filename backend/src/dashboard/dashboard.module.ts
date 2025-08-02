import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Patient, Doctor, Appointment, Queue } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, Doctor, Appointment, Queue]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 