import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { BaseRole } from '@prisma/client';
import { LoginInput, RegisterInput } from '@shared/schemas/auth.schema';
import {
  AuthenticatedUser,
  JwtPayload,
} from 'src/utils/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const userContext = await this.getUserContext(user.id);
    return this.generateTokens(userContext);
  }

  async register(dto: RegisterInput) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Get patient role
    const patientRole = await this.prisma.role.findFirst({
      where: { name: 'Patient', branchId: null },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        baseRole: BaseRole.PATIENT,
        isOriginal: true,
        parentId: null,
        userRoles: patientRole
          ? { create: { roleId: patientRole.id } }
          : undefined,
        patientProfile: { create: {} },
      },
    });

    // Re-fetch to get full context (e.g. default permissions from role)
    const userContext = await this.getUserContext(user.id);
    return this.generateTokens(userContext);
  }

  async refreshToken(userId: string) {
    const userContext = await this.getUserContext(userId);
    return this.generateTokens(userContext);
  }

  /**
   * Fetches the user and all relations needed for the JWT context.
   * This logic was previously in JwtStrategy.validate.
   */
  private async getUserContext(userId: string): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
    const permissions = user.userRoles.flatMap((ur) => ur.role.permissions);

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

  private generateTokens(user: AuthenticatedUser) {
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      baseRole: user.baseRole,
      isOriginal: user.isOriginal,
      parentId: user.parentId,
      branchId: user.branchId,
      permissions: user.permissions,
    };

    const refreshTokenPayload = {
      sub: user.id,
    };

    return {
      accessToken: this.jwtService.sign(accessTokenPayload, { expiresIn: '45m' }),
      refreshToken: this.jwtService.sign(refreshTokenPayload, { expiresIn: '7d' }),
    };
  }
}