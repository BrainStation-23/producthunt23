
import { z } from 'zod';

// Define common schema fields
export const baseSchema = {
  email: z.string().email({ message: 'Please enter a valid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  role: z.enum(['admin', 'user', 'judge']),
};

// Social profile schema fields
export const socialSchema = {
  website: z.string().url({ message: 'Please enter a valid URL' }).or(z.literal('')).optional(),
  twitter: z.string().url({ message: 'Please enter a valid URL' }).or(z.literal('')).optional(),
  linkedin: z.string().url({ message: 'Please enter a valid URL' }).or(z.literal('')).optional(),
  github: z.string().url({ message: 'Please enter a valid URL' }).or(z.literal('')).optional(),
};

// Define form schema based on whether it's for creating or editing
export const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const editSchema = z.object({
  ...baseSchema,
  ...socialSchema,
});

// Define our form types
export type CreateFormValues = z.infer<typeof createSchema>;
export type EditFormValues = z.infer<typeof editSchema>;
