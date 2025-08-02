import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Doctor, DoctorSpecialization, DoctorGender } from '../entities/doctor.entity';
import { Patient, PatientGender } from '../entities/patient.entity';
import { Appointment, AppointmentStatus, AppointmentType } from '../entities/appointment.entity';
import { Queue, QueueStatus, QueuePriority } from '../entities/queue.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
  ) {}

  async seed() {
    try {
      // Check if admin user already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { username: 'admin' }
      });

      if (!existingAdmin) {
        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = this.userRepository.create({
          username: 'admin',
          email: 'admin@clinic.com',
          password: hashedPassword,
          role: UserRole.ADMIN,
          isActive: true,
        });

        await this.userRepository.save(adminUser);
        console.log('✅ Admin user created successfully');
      } else {
        console.log('ℹ️ Admin user already exists');
      }

      // Seed sample data for testing
      await this.seedSampleData();
    } catch (error) {
      console.error('Error during seeding:', error);
    }
  }

  private async seedSampleData() {
    try {
      // Seed sample doctors
      const existingDoctors = await this.doctorRepository.count();
      if (existingDoctors === 0) {
        const doctors = [
          {
            firstName: 'Dr. Sarah',
            lastName: 'Smith',
            email: 'sarah.smith@clinic.com',
            phone: '+1234567890',
            specialization: DoctorSpecialization.CARDIOLOGY,
            gender: DoctorGender.FEMALE,
            location: '123 Medical Center Dr',
            isActive: true,
          },
          {
            firstName: 'Dr. John',
            lastName: 'Wilson',
            email: 'john.wilson@clinic.com',
            phone: '+1234567891',
            specialization: DoctorSpecialization.DERMATOLOGY,
            gender: DoctorGender.MALE,
            location: '456 Health Ave',
            isActive: true,
          },
          {
            firstName: 'Dr. Emily',
            lastName: 'Brown',
            email: 'emily.brown@clinic.com',
            phone: '+1234567892',
            specialization: DoctorSpecialization.PEDIATRICS,
            gender: DoctorGender.FEMALE,
            location: '789 Care Street',
            isActive: true,
          }
        ];

        for (const doctorData of doctors) {
          const doctor = this.doctorRepository.create(doctorData);
          await this.doctorRepository.save(doctor);
        }
        console.log('✅ Sample doctors created successfully');
      }

      // Seed sample patients
      const existingPatients = await this.patientRepository.count();
      if (existingPatients === 0) {
        const patients = [
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1234567893',
            gender: PatientGender.MALE,
            dateOfBirth: new Date('1990-01-15'),
            address: '123 Main St, City, State',
            isActive: true,
          },
          {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@email.com',
            phone: '+1234567894',
            gender: PatientGender.FEMALE,
            dateOfBirth: new Date('1985-05-20'),
            address: '456 Oak Ave, City, State',
            isActive: true,
          },
          {
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@email.com',
            phone: '+1234567895',
            gender: PatientGender.MALE,
            dateOfBirth: new Date('1988-12-03'),
            address: '789 Pine Rd, City, State',
            isActive: true,
          }
        ];

        for (const patientData of patients) {
          const patient = this.patientRepository.create(patientData);
          await this.patientRepository.save(patient);
        }
        console.log('✅ Sample patients created successfully');
      }

      // Seed sample appointments
      const existingAppointments = await this.appointmentRepository.count();
      if (existingAppointments === 0) {
        const doctors = await this.doctorRepository.find();
        const patients = await this.patientRepository.find();
        
        if (doctors.length > 0 && patients.length > 0) {
          const appointments = [
            {
              doctorId: doctors[0].id,
              patientId: patients[0].id,
              appointmentDateTime: new Date('2024-01-15T10:00:00'),
              type: AppointmentType.CONSULTATION,
              status: AppointmentStatus.SCHEDULED,
              notes: 'Regular checkup',
            },
            {
              doctorId: doctors[1].id,
              patientId: patients[1].id,
              appointmentDateTime: new Date('2024-01-16T14:30:00'),
              type: AppointmentType.CONSULTATION,
              status: AppointmentStatus.SCHEDULED,
              notes: 'Skin consultation',
            }
          ];

          for (const appointmentData of appointments) {
            const appointment = this.appointmentRepository.create(appointmentData);
            await this.appointmentRepository.save(appointment);
          }
          console.log('✅ Sample appointments created successfully');
        }
      }

      // Seed sample queue entries
      const existingQueue = await this.queueRepository.count();
      if (existingQueue === 0) {
        const patients = await this.patientRepository.find();
        
        if (patients.length > 0) {
          const queueEntries = [
            {
              patientName: patients[0].firstName + ' ' + patients[0].lastName,
              queueNumber: 1,
              status: QueueStatus.WAITING,
              priority: QueuePriority.NORMAL,
              reason: 'General checkup',
              notes: 'Regular patient',
            },
            {
              patientName: patients[1].firstName + ' ' + patients[1].lastName,
              queueNumber: 2,
              status: QueueStatus.WAITING,
              priority: QueuePriority.URGENT,
              reason: 'Emergency consultation',
              notes: 'Urgent case',
            }
          ];

          for (const queueData of queueEntries) {
            const queueEntry = this.queueRepository.create(queueData);
            await this.queueRepository.save(queueEntry);
          }
          console.log('✅ Sample queue entries created successfully');
        }
      }

      console.log('📊 Sample data seeding completed');
    } catch (error) {
      console.error('Error seeding sample data:', error);
    }
  }
} 