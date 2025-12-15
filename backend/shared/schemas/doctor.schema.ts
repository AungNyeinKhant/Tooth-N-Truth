import { z } from "zod";
import { genderEnum } from "./user.schema";

export const createDoctorSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().max(20).optional(),
  email: z.email().optional(),
  gender: genderEnum.optional(),
  licenseNumber: z.string().max(50).optional(),
  specialization: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  experience: z.number().int().min(0).max(70).optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
