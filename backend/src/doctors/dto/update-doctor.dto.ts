import { IsEmail, IsOptional, IsString, IsEnum, IsObject, IsArray, IsBoolean } from 'class-validator';
import { DoctorSpecialization, DoctorGender } from '../../entities/doctor.entity';

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(DoctorSpecialization, { message: 'Please provide a valid specialization' })
  specialization?: DoctorSpecialization;

  @IsOptional()
  @IsEnum(DoctorGender, { message: 'Please provide a valid gender' })
  gender?: DoctorGender;

  @IsOptional()
  @IsString()
  location?: string;

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
  @IsBoolean()
  isActive?: boolean;
} 