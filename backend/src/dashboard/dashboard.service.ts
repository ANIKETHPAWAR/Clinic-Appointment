import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Doctor } from '../entities/doctor.entity';
import { Appointment } from '../entities/appointment.entity';
import { Queue, QueueStatus } from '../entities/queue.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
  ) {}

  async getDashboardStats() {
    try {
      const [
        totalPatients,
        totalDoctors,
        totalAppointments,
        queueLength
      ] = await Promise.all([
        this.patientRepository.count(),
        this.doctorRepository.count(),
        this.appointmentRepository.count(),
        this.queueRepository.count({ where: { status: QueueStatus.WAITING } })
      ]);

      return {
        totalPatients,
        totalDoctors,
        totalAppointments,
        queueLength
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
} 