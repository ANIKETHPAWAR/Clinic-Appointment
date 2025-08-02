import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { Doctor, DoctorSpecialization, DoctorGender } from '../entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const { email } = createDoctorDto;

    // Check if doctor already exists
    const existingDoctor = await this.doctorRepository.findOne({
      where: { email },
    });

    if (existingDoctor) {
      throw new ConflictException('Doctor with this email already exists');
    }

    // Create new doctor
    const doctor = this.doctorRepository.create(createDoctorDto);

    // Save doctor to database
    return await this.doctorRepository.save(doctor);
  }

  async findAll(queryDto: QueryDoctorDto) {
    const { search, specialization, gender, location, sortBy, sortOrder, page, limit } = queryDto;
    
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build query
    const queryBuilder = this.doctorRepository.createQueryBuilder('doctor');

    if (search) {
      queryBuilder.where(
        '(doctor.firstName LIKE :search OR doctor.lastName LIKE :search OR doctor.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (specialization) {
      queryBuilder.andWhere('doctor.specialization = :specialization', { specialization });
    }

    if (gender) {
      queryBuilder.andWhere('doctor.gender = :gender', { gender });
    }

    if (location) {
      queryBuilder.andWhere('doctor.location LIKE :location', { location: `%${location}%` });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const doctors = await queryBuilder
      .orderBy(`doctor.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return doctor;
  }

  async findBySpecialization(specialization: DoctorSpecialization): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: { specialization, isActive: true },
    });
  }

  async findByLocation(location: string): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: { location: Like(`%${location}%`), isActive: true },
    });
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);

    // Check for email conflicts if updating
    if (updateDoctorDto.email && updateDoctorDto.email !== doctor.email) {
      const existingDoctor = await this.doctorRepository.findOne({
        where: { email: updateDoctorDto.email },
      });
      if (existingDoctor) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update doctor
    Object.assign(doctor, updateDoctorDto);
    return await this.doctorRepository.save(doctor);
  }

  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.remove(doctor);
  }

  async toggleActive(id: number): Promise<Doctor> {
    const doctor = await this.findOne(id);
    doctor.isActive = !doctor.isActive;
    return await this.doctorRepository.save(doctor);
  }

  async getSpecializations(): Promise<DoctorSpecialization[]> {
    return Object.values(DoctorSpecialization);
  }

  async getGenders(): Promise<DoctorGender[]> {
    return Object.values(DoctorGender);
  }

  async getAvailableDoctors(): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: { isActive: true },
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
  }
} 