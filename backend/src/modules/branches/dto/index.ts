import { createZodDto } from 'nestjs-zod';
import {
  createBranchSchema,
  updateBranchSchema,
} from '@shared/schemas/branch.schema';

export class CreateBranchDto extends createZodDto(createBranchSchema) {}
export class UpdateBranchDto extends createZodDto(updateBranchSchema) {}
