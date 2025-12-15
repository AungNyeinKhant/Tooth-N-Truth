import { BaseRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  baseRole: BaseRole;
  isOriginal: boolean;
  parentId: string | null;
  branchId: string | null;
  permissions: string[];
}
