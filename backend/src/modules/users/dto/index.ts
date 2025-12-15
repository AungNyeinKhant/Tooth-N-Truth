import { createZodDto } from 'nestjs-zod';
import {
  updateProfileSchema,
  createSubAdminSchema,
  createBranchStaffSchema,
} from '@shared/schemas/user.schema';
import {
  changePasswordSchema,
  changeEmailSchema,
} from '@shared/schemas/auth.schema';

export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
export class CreateSubAdminDto extends createZodDto(createSubAdminSchema) {}
export class CreateBranchStaffDto extends createZodDto(
  createBranchStaffSchema,
) {}
export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
export class ChangeEmailDto extends createZodDto(changeEmailSchema) {}
