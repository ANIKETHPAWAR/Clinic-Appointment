import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { QueueStatus, QueuePriority } from '../../entities/queue.entity';

export class UpdateQueueDto {
  @IsOptional()
  @IsEnum(QueueStatus)
  status?: QueueStatus;

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  assignedDoctorId?: number;
} 