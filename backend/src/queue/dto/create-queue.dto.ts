import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { QueueStatus, QueuePriority } from '../../entities/queue.entity';

export class CreateQueueDto {
  @IsNotEmpty({ message: 'Patient name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority = QueuePriority.NORMAL;

  @IsOptional()
  @IsEnum(QueueStatus)
  status?: QueueStatus = QueueStatus.WAITING;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
} 