import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';

export enum QueueStatus {
  WAITING = 'waiting',
  WITH_DOCTOR = 'with_doctor',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum QueuePriority {
  NORMAL = 'normal',
  URGENT = 'urgent',
  EMERGENCY = 'emergency'
}

@Entity('queue')
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsOptional()
  patientId: number;

  @Column({ nullable: true })
  @IsOptional()
  patientName: string;

  @Column({ unique: true })
  queueNumber: number; // Auto-generated queue number

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING
  })
  status: QueueStatus;

  @Column({
    type: 'enum',
    enum: QueuePriority,
    default: QueuePriority.NORMAL
  })
  priority: QueuePriority;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  reason: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes: string;

  @Column({ nullable: true })
  @IsOptional()
  assignedDoctorId: number; // Doctor assigned to this patient

  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  calledAt: Date; // When patient was called to see doctor

  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  completedAt: Date; // When consultation was completed

  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  cancelledAt: Date; // When appointment was cancelled

  @Column({ nullable: true })
  @IsOptional()
  cancelledBy: string; // User who cancelled the queue entry

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships removed since we're using patientName directly

  // Virtual properties
  get waitTime(): number {
    const now = new Date();
    const created = new Date(this.createdAt);
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60)); // Wait time in minutes
  }

  get isActive(): boolean {
    return this.status === QueueStatus.WAITING || this.status === QueueStatus.WITH_DOCTOR;
  }

  get canBeCancelled(): boolean {
    return this.status === QueueStatus.WAITING;
  }

  get canBeCompleted(): boolean {
    return this.status === QueueStatus.WITH_DOCTOR;
  }
} 