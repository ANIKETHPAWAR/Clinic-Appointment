import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient, PatientGender } from '../entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { email } = createPatientDto;

    // Check if patient already exists
    const existingPatient = await this.patientRepository.findOne({
      where: { email },
    });

    if (existingPatient) {
      throw new ConflictException('Patient with this email already exists');
    }

    // Convert dateOfBirth string to Date object
    const patientData = {
      ...createPatientDto,
      dateOfBirth: new Date(createPatientDto.dateOfBirth)
    };

    // Create new patient
    const patient = this.patientRepository.create(patientData);

    // Save patient to database
    return await this.patientRepository.save(patient);
  }

  async findAll(queryDto: QueryPatientDto) {
    const { search, gender, sortBy, sortOrder, page, limit } = queryDto;
    
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build query
    const queryBuilder = this.patientRepository.createQueryBuilder('patient');

    if (search) {
      queryBuilder.where(
        '(patient.firstName LIKE :search OR patient.lastName LIKE :search OR patient.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (gender) {
      queryBuilder.andWhere('patient.gender = :gender', { gender });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const patients = await queryBuilder
      .orderBy(`patient.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async findByEmail(email: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { email },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with email ${email} not found`);
    }

    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);

    // Check for email conflicts if updating
    if (updatePatientDto.email && updatePatientDto.email !== patient.email) {
      const existingPatient = await this.patientRepository.findOne({
        where: { email: updatePatientDto.email },
      });
      if (existingPatient) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update patient
    Object.assign(patient, updatePatientDto);
    return await this.patientRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    
    // Check if patient has appointments
    const appointmentCount = await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.appointments', 'appointments')
      .where('patient.id = :id', { id })
      .getCount();
    
    if (appointmentCount > 0) {
      throw new ConflictException('Cannot delete patient with existing appointments. Please cancel all appointments first.');
    }
    
    await this.patientRepository.remove(patient);
  }

  async toggleActive(id: number): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.isActive = !patient.isActive;
    return await this.patientRepository.save(patient);
  }

  async getGenders(): Promise<PatientGender[]> {
    return Object.values(PatientGender);
  }

  async getActivePatients(): Promise<Patient[]> {
    return await this.patientRepository.find({
      where: { isActive: true },
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
  }
} 