import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { Queue } from '../entities/queue.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Queue]),
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {} 