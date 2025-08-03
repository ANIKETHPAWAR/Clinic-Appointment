import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsObject, IsArray } from 'class-validator';
import { DoctorSpecialization, DoctorGender } from '../../entities/doctor.entity';

export class CreateDoctorDto {
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

  @IsEnum(DoctorSpecialization, { message: 'Please provide a valid specialization' })
  specialization: DoctorSpecialization;

  @IsEnum(DoctorGender, { message: 'Please provide a valid gender' })
  gender: DoctorGender;

  @IsNotEmpty({ message: 'Location is required' })
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsObject()
  availability?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  isActive?: boolean = true;
} 