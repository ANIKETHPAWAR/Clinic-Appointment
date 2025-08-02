import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { QueueStatus, QueuePriority } from '../entities/queue.entity';

import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';

@Controller('queue')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createQueueDto: CreateQueueDto) {
    const queue = await this.queueService.create(createQueueDto);
    return {
      message: 'Patient added to queue successfully',
      queue,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findAll() {
    const queue = await this.queueService.findAll();
    return {
      message: 'Queue retrieved successfully',
      queue,
    };
  }

  @Get('active')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findActive() {
    const queue = await this.queueService.findActive();
    return {
      message: 'Active queue retrieved successfully',
      queue,
    };
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getStats() {
    const stats = await this.queueService.getQueueStats();
    return {
      message: 'Queue statistics retrieved successfully',
      stats,
    };
  }

  @Get('next')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getNextPatient() {
    const nextPatient = await this.queueService.getNextPatient();
    return {
      message: 'Next patient retrieved successfully',
      nextPatient,
    };
  }

  @Get('status/:status')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getByStatus(@Param('status') status: QueueStatus) {
    const queue = await this.queueService.getByStatus(status);
    return {
      message: `Queue by status ${status} retrieved successfully`,
      queue,
    };
  }

  @Get('priority/:priority')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getByPriority(@Param('priority') priority: QueuePriority) {
    const queue = await this.queueService.getByPriority(priority);
    return {
      message: `Queue by priority ${priority} retrieved successfully`,
      queue,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const queue = await this.queueService.findOne(id);
    return {
      message: 'Queue entry retrieved successfully',
      queue,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQueueDto: UpdateQueueDto,
  ) {
    const queue = await this.queueService.update(id, updateQueueDto);
    return {
      message: 'Queue entry updated successfully',
      queue,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: QueueStatus },
  ) {
    const queue = await this.queueService.updateStatus(id, body.status);
    return {
      message: 'Queue status updated successfully',
      queue,
    };
  }

  @Patch(':id/assign-doctor')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async assignDoctor(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { doctorId: number },
  ) {
    const queue = await this.queueService.assignDoctor(id, body.doctorId);
    return {
      message: 'Doctor assigned successfully',
      queue,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.queueService.remove(id);
    return {
      message: 'Queue entry removed successfully',
    };
  }
} 