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
  ParseIntPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    const doctor = await this.doctorsService.create(createDoctorDto);
    return {
      message: 'Doctor created successfully',
      doctor,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findAll(@Query() queryDto: QueryDoctorDto) {
    return this.doctorsService.findAll(queryDto);
  }

  @Get('available')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getAvailableDoctors() {
    const doctors = await this.doctorsService.getAvailableDoctors();
    return {
      message: 'Available doctors retrieved successfully',
      doctors,
    };
  }

  @Get('specializations')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getSpecializations() {
    const specializations = await this.doctorsService.getSpecializations();
    return {
      message: 'Specializations retrieved successfully',
      specializations,
    };
  }

  @Get('genders')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getGenders() {
    const genders = await this.doctorsService.getGenders();
    return {
      message: 'Genders retrieved successfully',
      genders,
    };
  }

  @Get('specialization/:specialization')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findBySpecialization(@Param('specialization') specialization: string) {
    const doctors = await this.doctorsService.findBySpecialization(specialization as any);
    return {
      message: 'Doctors by specialization retrieved successfully',
      doctors,
    };
  }

  @Get('location/:location')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findByLocation(@Param('location') location: string) {
    const doctors = await this.doctorsService.findByLocation(location);
    return {
      message: 'Doctors by location retrieved successfully',
      doctors,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const doctor = await this.doctorsService.findOne(id);
    return {
      message: 'Doctor retrieved successfully',
      doctor,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    const doctor = await this.doctorsService.update(id, updateDoctorDto);
    return {
      message: 'Doctor updated successfully',
      doctor,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.doctorsService.remove(id);
    return {
      message: 'Doctor deleted successfully',
    };
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.ADMIN)
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    const doctor = await this.doctorsService.toggleActive(id);
    return {
      message: `Doctor ${doctor.isActive ? 'activated' : 'deactivated'} successfully`,
      doctor,
    };
  }
} 