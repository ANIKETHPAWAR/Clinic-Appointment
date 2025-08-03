import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';

import { Appointment, AppointmentStatus, AppointmentType } from '../entities/appointment.entity';
import { Patient } from '../entities/patient.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { QueryAppointmentDto } from './dto/query-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { patientName, doctorId, appointmentDate, appointmentTime } = createAppointmentDto;

    console.log(`🔍 Looking for patient: "${patientName}"`);

    // Find patient by name - improved logic
    let patient = null;
    
    try {
      // First, try to find by full name as firstName
      patient = await this.patientRepository.findOne({
        where: { firstName: patientName }
      });
      console.log(`🔍 Search 1 (firstName): ${patient ? 'Found' : 'Not found'}`);

      // If not found, try to find by full name as lastName
      if (!patient) {
        patient = await this.patientRepository.findOne({
          where: { lastName: patientName }
        });
        console.log(`🔍 Search 2 (lastName): ${patient ? 'Found' : 'Not found'}`);
      }

      // If not found, try to split the name and search
      if (!patient) {
        const nameParts = patientName.trim().split(' ');
        console.log(`🔍 Name parts:`, nameParts);
        if (nameParts.length >= 2) {
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');
          console.log(`🔍 Searching with firstName: "${firstName}", lastName: "${lastName}"`);
          
          patient = await this.patientRepository.findOne({
            where: { firstName, lastName }
          });
          console.log(`🔍 Search 3 (split name): ${patient ? 'Found' : 'Not found'}`);
        }
      }

      // If still not found, try case-insensitive search
      if (!patient) {
        console.log(`🔍 Performing case-insensitive search...`);
        const patients = await this.patientRepository.find();
        console.log(`🔍 Total patients in DB: ${patients.length}`);
        console.log(`🔍 Available patients:`, patients.map(p => `${p.firstName} ${p.lastName}`));
        
        patient = patients.find(p => 
          p.firstName.toLowerCase() === patientName.toLowerCase() ||
          p.lastName.toLowerCase() === patientName.toLowerCase() ||
          `${p.firstName} ${p.lastName}`.toLowerCase() === patientName.toLowerCase()
        );
        console.log(`🔍 Search 4 (case-insensitive): ${patient ? 'Found' : 'Not found'}`);
      }

      if (!patient) {
        console.log(`❌ Patient "${patientName}" not found in database`);
        console.log(`🔍 Available patients in database:`);
        const allPatients = await this.patientRepository.find();
        allPatients.forEach(p => console.log(`  - ${p.firstName} ${p.lastName}`));
        throw new NotFoundException(`Patient with name "${patientName}" not found. Available patients: ${allPatients.map(p => `${p.firstName} ${p.lastName}`).join(', ')}`);
      }

      console.log(`✅ Found patient: ${patient.firstName} ${patient.lastName} (ID: ${patient.id})`);
    } catch (error) {
      console.error('❌ Error in patient lookup:', error);
      throw error;
    }

    // Combine date and time into a single datetime
    console.log(`📅 Creating appointment for date: ${appointmentDate}, time: ${appointmentTime}`);
    
    // Convert 12-hour format to 24-hour format
    let formattedTime = appointmentTime;
    if (appointmentTime.includes('PM') || appointmentTime.includes('AM')) {
      const timeMatch = appointmentTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const period = timeMatch[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        
        formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
        console.log(`📅 Time conversion: ${appointmentTime} -> ${formattedTime}`);
      }
    }
    
    const appointmentDateTime = new Date(`${appointmentDate}T${formattedTime}`);
    console.log(`📅 Combined datetime: ${appointmentDateTime}`);
    
    // Validate that the datetime is valid
    if (isNaN(appointmentDateTime.getTime())) {
      throw new Error(`Invalid date/time combination: ${appointmentDate} ${appointmentTime}`);
    }

    // Check for scheduling conflicts
    console.log(`🔍 Checking for scheduling conflicts with doctor ID: ${doctorId}`);
    const conflictingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId,
        appointmentDateTime,
        status: AppointmentStatus.SCHEDULED,
      },
    });

    if (conflictingAppointment) {
      console.log(`❌ Scheduling conflict found`);
      throw new ConflictException('This time slot is already booked');
    }

    console.log(`✅ No scheduling conflicts found`);

    // Create new appointment
    try {
      console.log(`📝 Creating appointment with data:`, {
        patientId: patient.id,
        doctorId: createAppointmentDto.doctorId,
        appointmentDateTime,
        type: createAppointmentDto.type,
        status: AppointmentStatus.SCHEDULED,
        reason: createAppointmentDto.reason,
        notes: createAppointmentDto.notes,
        duration: parseInt(createAppointmentDto.duration) || 30,
        cost: createAppointmentDto.cost ? parseFloat(createAppointmentDto.cost) : null,
      });

      const appointment = this.appointmentRepository.create({
        patientId: patient.id,
        doctorId: createAppointmentDto.doctorId,
        appointmentDateTime,
        type: createAppointmentDto.type,
        status: AppointmentStatus.SCHEDULED,
        reason: createAppointmentDto.reason,
        notes: createAppointmentDto.notes,
        duration: parseInt(createAppointmentDto.duration) || 30,
        cost: createAppointmentDto.cost ? parseFloat(createAppointmentDto.cost) : null,
      });

      const savedAppointment = await this.appointmentRepository.save(appointment);
      console.log(`✅ Appointment created successfully for patient: ${patient.firstName} ${patient.lastName}`);
      return savedAppointment;
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  }

  async findAll(queryDto: QueryAppointmentDto) {
    const { patientId, doctorId, status, type, date, sortBy, sortOrder, page, limit } = queryDto;
    
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build query
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor');

    if (patientId) {
      queryBuilder.andWhere('appointment.patientId = :patientId', { patientId });
    }

    if (doctorId) {
      queryBuilder.andWhere('appointment.doctorId = :doctorId', { doctorId });
    }

    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('appointment.type = :type', { type });
    }

    if (date) {
      const startDate = new Date(`${date}T00:00:00`);
      const endDate = new Date(`${date}T23:59:59`);
      queryBuilder.andWhere('appointment.appointmentDateTime BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const appointments = await queryBuilder
      .orderBy(`appointment.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Check for scheduling conflicts if updating date/time
    if (updateAppointmentDto.appointmentDate || updateAppointmentDto.appointmentTime) {
      const newDate = updateAppointmentDto.appointmentDate || appointment.appointmentDateTime.toISOString().split('T')[0];
      const newTime = updateAppointmentDto.appointmentTime || appointment.appointmentDateTime.toTimeString().split(' ')[0];
      const doctorId = updateAppointmentDto.doctorId || appointment.doctorId;
      const newDateTime = new Date(`${newDate}T${newTime}`);

      const conflictingAppointment = await this.appointmentRepository.findOne({
        where: {
          doctorId,
          appointmentDateTime: newDateTime,
          status: AppointmentStatus.SCHEDULED,
          id: Not(id),
        },
      });

      if (conflictingAppointment) {
        throw new ConflictException('This time slot is already booked');
      }
    }

    // Update appointment
    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  async cancel(id: number, cancellationReason: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancellationReason = cancellationReason;
    appointment.cancelledBy = 'system'; // In a real app, this would be the current user

    return await this.appointmentRepository.save(appointment);
  }

  async reschedule(id: number, newDate: string, newTime: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Cannot reschedule a cancelled appointment');
    }

    // Check for conflicts
    const newDateTime = new Date(`${newDate}T${newTime}`);
    const conflictingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId: appointment.doctorId,
        appointmentDateTime: newDateTime,
        status: AppointmentStatus.SCHEDULED,
        id: Not(id),
      },
    });

    if (conflictingAppointment) {
      throw new ConflictException('This time slot is already booked');
    }

    appointment.appointmentDateTime = newDateTime;

    return await this.appointmentRepository.save(appointment);
  }

  async complete(id: number): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.COMPLETED;
    return await this.appointmentRepository.save(appointment);
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return await this.appointmentRepository.find({
      where: {
        appointmentDateTime: Between(startOfDay, endOfDay),
        status: AppointmentStatus.SCHEDULED,
      },
      relations: ['patient', 'doctor'],
      order: { appointmentDateTime: 'ASC' },
    });
  }

  async getUpcomingAppointments(days: number = 7): Promise<Appointment[]> {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);

    return await this.appointmentRepository.find({
      where: {
        appointmentDateTime: Between(today, endDate),
        status: AppointmentStatus.SCHEDULED,
      },
      relations: ['patient', 'doctor'],
      order: { appointmentDateTime: 'ASC' },
    });
  }

  async getAvailableSlots(doctorId: number, date: string): Promise<string[]> {
    // This is a simplified implementation
    // In a real application, you'd check doctor availability and existing appointments
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);
    
    const bookedSlots = await this.appointmentRepository.find({
      where: {
        doctorId,
        appointmentDateTime: Between(startOfDay, endOfDay),
        status: AppointmentStatus.SCHEDULED,
      },
      select: ['appointmentDateTime'],
    });

    const bookedTimes = bookedSlots.map(slot => 
      slot.appointmentDateTime.toTimeString().split(' ')[0].substring(0, 5)
    );
    
    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const availableSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (!bookedTimes.includes(time)) {
          availableSlots.push(time);
        }
      }
    }

    return availableSlots;
  }

  async getAppointmentStats() {
    const total = await this.appointmentRepository.count();
    const scheduled = await this.appointmentRepository.count({ where: { status: AppointmentStatus.SCHEDULED } });
    const completed = await this.appointmentRepository.count({ where: { status: AppointmentStatus.COMPLETED } });
    const cancelled = await this.appointmentRepository.count({ where: { status: AppointmentStatus.CANCELLED } });

    return {
      total,
      scheduled,
      completed,
      cancelled,
    };
  }
} 