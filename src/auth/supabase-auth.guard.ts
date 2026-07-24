import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Request } from 'express';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    const client = this.supabaseService.getClient();
    const response = await client.auth.getUser(token);
    const data = response.data as Record<string, unknown>;
    const error = response.error as any;

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Attach user to request
    Object.assign(request, { user: data.user });
    return true;
  }
}
