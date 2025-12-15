import { createZodDto } from 'nestjs-zod';
import {
  createDoctorSchema,
  updateDoctorSchema,
} from '@shared/schemas/doctor.schema';

export class CreateDoctorDto extends createZodDto(createDoctorSchema) {}
export class UpdateDoctorDto extends createZodDto(updateDoctorSchema) {}
