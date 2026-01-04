import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  JwtPayload,
  AuthenticatedUser,
} from 'src/utils/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // Stateless validation: trust the payload content
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // Ensure it is an Access Token (must have permissions and role data)
    if (!payload.permissions || !payload.baseRole) {
      throw new Error('Invalid Access Token: missing permissions or role');
    }

    return {
      id: payload.sub,
      email: payload.email!,
      baseRole: payload.baseRole,
      isOriginal: payload.isOriginal!,
      parentId: payload.parentId!,
      branchId: payload.branchId!,
      permissions: payload.permissions,
    };
  }
}
