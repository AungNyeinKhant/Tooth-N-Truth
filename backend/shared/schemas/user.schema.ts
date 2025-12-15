import { z } from "zod";

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().max(20).optional(),
  gender: genderEnum.optional(),
  dateOfBirth: z.coerce.date().optional(),
});

export const createSubAdminSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().max(20).optional(),
  roleId: z.uuid("Invalid role ID"),
});

export const createBranchStaffSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().max(20).optional(),
  roleId: z.uuid("Invalid role ID"),
  position: z.string().max(50).optional(),
});

// Types
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateSubAdminInput = z.infer<typeof createSubAdminSchema>;
export type CreateBranchStaffInput = z.infer<typeof createBranchStaffSchema>;
