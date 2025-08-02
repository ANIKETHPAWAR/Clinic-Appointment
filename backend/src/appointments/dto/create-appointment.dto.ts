import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, IsDateString, IsNumberString } from 'class-validator';
import { AppointmentStatus, AppointmentType } from '../../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'Patient ID is required' })
  @IsNumber()
  patientId: number;

  @IsNotEmpty({ message: 'Doctor ID is required' })
  @IsNumber()
  doctorId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Appointment date is required' })
  appointmentDate: string;

  @IsNotEmpty({ message: 'Appointment time is required' })
  @IsString()
  appointmentTime: string;

  @IsEnum(AppointmentType, { message: 'Please provide a valid appointment type' })
  type: AppointmentType;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumberString()
  duration?: string = '30';

  @IsOptional()
  @IsNumberString()
  cost?: string;
} 