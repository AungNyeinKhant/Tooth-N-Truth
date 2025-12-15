import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import {
  JwtPayload,
  AuthenticatedUser,
} from 'src/utils/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // ✅ TypeScript knows it's string
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: { include: { role: true } },
        staffBranch: true,
        managedBranch: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Flatten permissions from all roles
    const permissions = user.userRoles.flatMap(
      (ur) => ur.role.permissions,
    ) as string[];

    // Get branchId (staff or manager)
    const branchId =
      user.staffBranch?.branchId || user.managedBranch?.id || null;

    return {
      id: user.id,
      email: user.email,
      baseRole: user.baseRole,
      isOriginal: user.isOriginal,
      parentId: user.parentId,
      branchId,
      permissions: [...new Set(permissions)],
    };
  }
}
