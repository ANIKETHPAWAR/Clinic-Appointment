import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'msclinic',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h', // Token expires in 24 hours
  },
};

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'msclinic',
}; 