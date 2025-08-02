import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Queue, QueueStatus, QueuePriority } from '../entities/queue.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
  ) {}

  async create(createQueueDto: CreateQueueDto): Promise<Queue> {
    // Get the next queue number
    const lastQueue = await this.queueRepository.findOne({
      where: {},
      order: { queueNumber: 'DESC' },
    });

    const nextQueueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;

    // Create new queue entry with patient name
    const queue = this.queueRepository.create({
      patientName: createQueueDto.name,
      priority: createQueueDto.priority || QueuePriority.NORMAL,
      status: createQueueDto.status || QueueStatus.WAITING,
      reason: createQueueDto.reason,
      notes: createQueueDto.notes,
      queueNumber: nextQueueNumber,
    });

    return await this.queueRepository.save(queue);
  }

  async findAll(): Promise<Queue[]> {
    return await this.queueRepository.find({
      order: { 
        priority: 'DESC', 
        queueNumber: 'ASC' 
      },
    });
  }

  async findActive(): Promise<Queue[]> {
    return await this.queueRepository.find({
      where: { status: QueueStatus.WAITING },
      order: { 
        priority: 'DESC', 
        queueNumber: 'ASC' 
      },
    });
  }

  async findOne(id: number): Promise<Queue> {
    const queue = await this.queueRepository.findOne({
      where: { id },
    });

    if (!queue) {
      throw new NotFoundException(`Queue entry with ID ${id} not found`);
    }

    return queue;
  }

  async update(id: number, updateQueueDto: UpdateQueueDto): Promise<Queue> {
    const queue = await this.findOne(id);
    Object.assign(queue, updateQueueDto);
    return await this.queueRepository.save(queue);
  }

  async remove(id: number): Promise<void> {
    const queue = await this.findOne(id);
    await this.queueRepository.remove(queue);
  }

  async updateStatus(id: number, status: QueueStatus): Promise<Queue> {
    const queue = await this.findOne(id);
    queue.status = status;
    return await this.queueRepository.save(queue);
  }

  async assignDoctor(id: number, doctorId: number): Promise<Queue> {
    const queue = await this.findOne(id);
    queue.assignedDoctorId = doctorId;
    return await this.queueRepository.save(queue);
  }

  async getNextPatient(): Promise<Queue | null> {
    return await this.queueRepository.findOne({
      where: { status: QueueStatus.WAITING },
      order: { 
        priority: 'DESC', 
        queueNumber: 'ASC' 
      },
    });
  }

  async getQueueStats() {
    const total = await this.queueRepository.count();
    const waiting = await this.queueRepository.count({ where: { status: QueueStatus.WAITING } });
    const withDoctor = await this.queueRepository.count({ where: { status: QueueStatus.WITH_DOCTOR } });
    const completed = await this.queueRepository.count({ where: { status: QueueStatus.COMPLETED } });

    return {
      total,
      waiting,
      withDoctor,
      completed,
    };
  }

  async getByStatus(status: QueueStatus): Promise<Queue[]> {
    return await this.queueRepository.find({
      where: { status },
      order: { 
        priority: 'DESC', 
        queueNumber: 'ASC' 
      },
    });
  }

  async getByPriority(priority: QueuePriority): Promise<Queue[]> {
    return await this.queueRepository.find({
      where: { priority },
      order: { queueNumber: 'ASC' },
    });
  }
} 