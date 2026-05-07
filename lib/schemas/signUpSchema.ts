import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(5, 'Username must be at least 5 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signUpSchema = z
  .object({
    name: usernameValidation,
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    organization: z.string().min(2, { message: 'Organization is required' }),
  });
