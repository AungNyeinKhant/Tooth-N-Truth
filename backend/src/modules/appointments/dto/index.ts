import { createZodDto } from 'nestjs-zod';
import {
  createAppointmentSchema,
  createWalkinSchema,
  updateAppointmentStatusSchema,
} from '@shared/schemas/appointment.schema';

export class CreateAppointmentDto extends createZodDto(
  createAppointmentSchema,
) {}
export class CreateWalkinDto extends createZodDto(createWalkinSchema) {}
export class UpdateAppointmentStatusDto extends createZodDto(
  updateAppointmentStatusSchema,
) {}
