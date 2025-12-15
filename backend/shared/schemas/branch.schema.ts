import { z } from "zod";

export const createBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required").max(100),
  address: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
  email: z.email().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateBranchSchema = createBranchSchema.partial();

export const assignManagerSchema = z.object({
  managerId: z.uuid("Invalid manager ID"),
});

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
