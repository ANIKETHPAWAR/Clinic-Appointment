import { IsEmail, IsOptional, MinLength, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  username?: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either admin or staff' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 