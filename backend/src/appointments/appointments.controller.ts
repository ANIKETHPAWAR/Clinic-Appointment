import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { QueryAppointmentDto } from './dto/query-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {
    console.log('🔧 AppointmentsController initialized');
  }

  @Post('test')
  @HttpCode(HttpStatus.CREATED)
  async testCreate(@Body() createAppointmentDto: CreateAppointmentDto) {
    console.log('🧪 TEST endpoint called');
    console.log('🧪 Request body:', createAppointmentDto);
    return {
      message: 'Test endpoint working',
      data: createAppointmentDto
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    console.log('🚀 POST /appointments endpoint called');
    try {
      console.log('📝 Received appointment creation request:', createAppointmentDto);
      console.log('📝 Request body type:', typeof createAppointmentDto);
      console.log('📝 Request body keys:', Object.keys(createAppointmentDto));
      console.log('📝 doctorId type:', typeof createAppointmentDto.doctorId);
      console.log('📝 doctorId value:', createAppointmentDto.doctorId);
      
      // Validate and format the date if needed
      if (createAppointmentDto.appointmentDate) {
        // Check if it's already in YYYY-MM-DD format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(createAppointmentDto.appointmentDate)) {
          console.log('⚠️ Date format validation failed, attempting conversion...');
          // Try to convert from DD-MM-YYYY to YYYY-MM-DD
          const dateParts = createAppointmentDto.appointmentDate.split('-');
          if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            createAppointmentDto.appointmentDate = `${year}-${month}-${day}`;
            console.log(`📅 Backend date conversion: ${dateParts.join('-')} -> ${createAppointmentDto.appointmentDate}`);
          }
        }
      }
      
      const appointment = await this.appointmentsService.create(createAppointmentDto);
      return {
        message: 'Appointment created successfully',
        appointment,
      };
    } catch (error) {
      console.error('❌ Error in appointment controller:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as is
      } else if (error instanceof ConflictException) {
        throw error; // Re-throw ConflictException as is
      } else {
        console.error('❌ Unexpected error details:', {
          message: error.message,
          stack: error.stack,
          code: error.code
        });
        throw new Error(`Failed to create appointment: ${error.message}`);
      }
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findAll(@Query() queryDto: QueryAppointmentDto) {
    return this.appointmentsService.findAll(queryDto);
  }

  @Get('today')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getTodayAppointments() {
    const appointments = await this.appointmentsService.getTodayAppointments();
    return {
      message: 'Today\'s appointments retrieved successfully',
      appointments,
    };
  }

  @Get('upcoming')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getUpcomingAppointments(@Query('days') days: number = 7) {
    const appointments = await this.appointmentsService.getUpcomingAppointments(days);
    return {
      message: 'Upcoming appointments retrieved successfully',
      appointments,
    };
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getStats() {
    const stats = await this.appointmentsService.getAppointmentStats();
    return {
      message: 'Appointment statistics retrieved successfully',
      stats,
    };
  }

  @Get('available-slots/:doctorId/:date')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getAvailableSlots(
    @Param('doctorId', ParseIntPipe) doctorId: number,
    @Param('date') date: string,
  ) {
    const slots = await this.appointmentsService.getAvailableSlots(doctorId, date);
    return {
      message: 'Available slots retrieved successfully',
      slots,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const appointment = await this.appointmentsService.findOne(id);
    return {
      message: 'Appointment retrieved successfully',
      appointment,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.appointmentsService.update(id, updateAppointmentDto);
    return {
      message: 'Appointment updated successfully',
      appointment,
    };
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { cancellationReason: string },
  ) {
    const appointment = await this.appointmentsService.cancel(id, body.cancellationReason);
    return {
      message: 'Appointment cancelled successfully',
      appointment,
    };
  }

  @Patch(':id/reschedule')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { newDate: string; newTime: string },
  ) {
    const appointment = await this.appointmentsService.reschedule(id, body.newDate, body.newTime);
    return {
      message: 'Appointment rescheduled successfully',
      appointment,
    };
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async complete(@Param('id', ParseIntPipe) id: number) {
    const appointment = await this.appointmentsService.complete(id);
    return {
      message: 'Appointment completed successfully',
      appointment,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.appointmentsService.remove(id);
    return {
      message: 'Appointment deleted successfully',
    };
  }
} 