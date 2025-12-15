import { z } from "zod";

export const appointmentTypeEnum = z.enum(["ONLINE", "WALKIN", "PHONE"]);
export const appointmentStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const createAppointmentSchema = z.object({
  branchId: z.uuid("Invalid branch ID"),
  doctorId: z.uuid("Invalid doctor ID"),
  serviceId: z.uuid("Invalid service ID"),
  date: z.coerce.date(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  patientNotes: z.string().max(500).optional(),
});

export const createWalkinSchema = z.object({
  patientId: z.uuid("Invalid patient ID").optional(),
  // For new patient
  patientEmail: z.email().optional(),
  patientFirstName: z.string().optional(),
  patientLastName: z.string().optional(),
  patientPhone: z.string().optional(),
  // Appointment details
  doctorId: z.uuid("Invalid doctor ID"),
  serviceId: z.uuid("Invalid service ID"),
  staffNotes: z.string().max(500).optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: appointmentStatusEnum,
  staffNotes: z.string().max(500).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CreateWalkinInput = z.infer<typeof createWalkinSchema>;
export type UpdateAppointmentStatusInput = z.infer<
  typeof updateAppointmentStatusSchema
>;
