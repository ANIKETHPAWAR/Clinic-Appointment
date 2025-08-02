import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString, IsArray } from 'class-validator';
import { PatientGender } from '../../entities/patient.entity';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;

  @IsEnum(PatientGender, { message: 'Please provide a valid gender' })
  gender: PatientGender;

  @IsDateString()
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];
} 