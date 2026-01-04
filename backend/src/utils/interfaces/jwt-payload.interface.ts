import { BaseRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  baseRole: BaseRole;
  isOriginal: boolean;
  parentId: string | null;
  branchId: string | null;
  permissions: string[];
}

// Payload now includes all user context
export interface JwtPayload extends Partial<Omit<AuthenticatedUser, 'id'>> {
  sub: string; // maps to id
  iat?: number;
  exp?: number;
}
