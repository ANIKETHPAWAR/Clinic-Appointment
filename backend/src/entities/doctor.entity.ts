import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { Appointment } from './appointment.entity';

export enum DoctorSpecialization {
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  ENDOCRINOLOGY = 'endocrinology',
  GASTROENTEROLOGY = 'gastroenterology',
  GENERAL_MEDICINE = 'general_medicine',
  GYNECOLOGY = 'gynecology',
  NEUROLOGY = 'neurology',
  ONCOLOGY = 'oncology',
  ORTHOPEDICS = 'orthopedics',
  PEDIATRICS = 'pediatrics',
  PSYCHIATRY = 'psychiatry',
  RADIOLOGY = 'radiology',
  SURGERY = 'surgery',
  UROLOGY = 'urology'
}

export enum DoctorGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @Column()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Column()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @Column({
    type: 'enum',
    enum: DoctorSpecialization
  })
  @IsNotEmpty({ message: 'Specialization is required' })
  specialization: DoctorSpecialization;

  @Column({
    type: 'enum',
    enum: DoctorGender
  })
  @IsNotEmpty({ message: 'Gender is required' })
  gender: DoctorGender;

  @Column()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  bio: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  availability: {
    monday?: { start: string; end: string; available: boolean };
    tuesday?: { start: string; end: string; available: boolean };
    wednesday?: { start: string; end: string; available: boolean };
    thursday?: { start: string; end: string; available: boolean };
    friday?: { start: string; end: string; available: boolean };
    saturday?: { start: string; end: string; available: boolean };
    sunday?: { start: string; end: string; available: boolean };
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];

  // Virtual property for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
} 