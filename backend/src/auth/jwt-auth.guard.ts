import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🔐 JWT Guard - canActivate called');
    const request = context.switchToHttp().getRequest();
    console.log('🔐 JWT Guard - Request headers:', request.headers);
    console.log('🔐 JWT Guard - Authorization header:', request.headers.authorization);
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🔐 JWT Guard - handleRequest called');
    console.log('🔐 JWT Guard - Error:', err);
    console.log('🔐 JWT Guard - User:', user);
    console.log('🔐 JWT Guard - Info:', info);
    
    if (err || !user) {
      console.log('🔐 JWT Guard - Authentication failed');
      throw err || new UnauthorizedException('Authentication failed');
    }
    
    console.log('🔐 JWT Guard - Authentication successful');
    return user;
  }
} 