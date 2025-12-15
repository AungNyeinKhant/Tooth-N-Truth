import { createZodDto } from 'nestjs-zod';
import { loginSchema, registerSchema } from '@shared/schemas/auth.schema';

// Create DTO classes from Zod schemas
export class LoginDto extends createZodDto(loginSchema) {}
export class RegisterDto extends createZodDto(registerSchema) {}
