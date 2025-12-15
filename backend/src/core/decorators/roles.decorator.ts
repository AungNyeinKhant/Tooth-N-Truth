import { SetMetadata } from '@nestjs/common';
import { BaseRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: BaseRole[]) => SetMetadata(ROLES_KEY, roles);
