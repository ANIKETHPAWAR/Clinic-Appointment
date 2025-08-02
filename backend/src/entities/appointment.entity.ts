import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  ROUTINE_CHECKUP = 'routine_checkup',
  SPECIALIST_VISIT = 'specialist_visit'
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Patient ID is required' })
  patientId: number;

  @Column()
  @IsNotEmpty({ message: 'Doctor ID is required' })
  doctorId: number;

  @Column({ type: 'datetime' })
  @IsDateString()
  @IsNotEmpty({ message: 'Appointment date and time is required' })
  appointmentDateTime: Date;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.CONSULTATION
  })
  @IsNotEmpty({ message: 'Appointment type is required' })
  type: AppointmentType;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  reason: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes: string;

  @Column({ type: 'int', default: 30 })
  duration: number; // Duration in minutes

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @IsOptional()
  cost: number;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  cancellationReason: string;

  @Column({ nullable: true })
  @IsOptional()
  cancelledBy: string; // User who cancelled the appointment

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Patient, patient => patient.appointments)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  // Virtual properties
  get isUpcoming(): boolean {
    return this.appointmentDateTime > new Date() && this.status === AppointmentStatus.SCHEDULED;
  }

  get isPast(): boolean {
    return this.appointmentDateTime < new Date();
  }

  get canBeCancelled(): boolean {
    const now = new Date();
    const appointmentTime = new Date(this.appointmentDateTime);
    const hoursDifference = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return this.status === AppointmentStatus.SCHEDULED && hoursDifference > 24;
  }
} 