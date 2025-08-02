import { IsOptional, IsNumber, IsEnum, IsString, IsDateString, IsNumberString } from 'class-validator';
import { AppointmentStatus, AppointmentType } from '../../entities/appointment.entity';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsNumber()
  patientId?: number;

  @IsOptional()
  @IsNumber()
  doctorId?: number;

  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  appointmentTime?: string;

  @IsOptional()
  @IsEnum(AppointmentType, { message: 'Please provide a valid appointment type' })
  type?: AppointmentType;

  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'Please provide a valid appointment status' })
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumberString()
  duration?: string;

  @IsOptional()
  @IsNumberString()
  cost?: string;

  @IsOptional()
  @IsString()
  cancellationReason?: string;
} 