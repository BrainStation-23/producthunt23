
import { z } from 'zod';

// Define common schema fields
export const baseSchema = {
  email: z.string().email({ message: 'Please enter a valid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  role: z.enum(['admin', 'user']),
};

// Define form schema based on whether it's for creating or editing
export const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const editSchema = z.object(baseSchema);

// Define our form types
export type CreateFormValues = z.infer<typeof createSchema>;
export type EditFormValues = z.infer<typeof editSchema>;
