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

import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPatientDto: CreatePatientDto) {
    const patient = await this.patientsService.create(createPatientDto);
    return {
      message: 'Patient created successfully',
      patient,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findAll(@Query() queryDto: QueryPatientDto) {
    return this.patientsService.findAll(queryDto);
  }

  @Get('active')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getActivePatients() {
    const patients = await this.patientsService.getActivePatients();
    return {
      message: 'Active patients retrieved successfully',
      patients,
    };
  }

  @Get('genders')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async getGenders() {
    const genders = await this.patientsService.getGenders();
    return {
      message: 'Genders retrieved successfully',
      genders,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const patient = await this.patientsService.findOne(id);
    return {
      message: 'Patient retrieved successfully',
      patient,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    const patient = await this.patientsService.update(id, updatePatientDto);
    return {
      message: 'Patient updated successfully',
      patient,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.patientsService.remove(id);
    return {
      message: 'Patient deleted successfully',
    };
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.ADMIN)
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    const patient = await this.patientsService.toggleActive(id);
    return {
      message: `Patient ${patient.isActive ? 'activated' : 'deactivated'} successfully`,
      patient,
    };
  }
} 