import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { Appointment } from './appointment.entity';

export enum PatientGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

@Entity('patients')
export class Patient {
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
    enum: PatientGender
  })
  @IsNotEmpty({ message: 'Gender is required' })
  gender: PatientGender;

  @Column({ type: 'date' })
  @IsDateString()
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: Date;

  @Column({ nullable: true })
  @IsOptional()
  address: string;

  @Column({ nullable: true })
  @IsOptional()
  emergencyContact: string;

  @Column({ nullable: true })
  @IsOptional()
  emergencyPhone: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  medicalHistory: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  allergies: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];

  // Virtual property for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Virtual property for age
  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
} 