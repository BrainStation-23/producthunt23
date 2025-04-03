
import * as z from 'zod';

// Form validation schema
export const productSchema = z.object({
  id: z.string().optional(), // Optional ID for editing
  name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }).max(50),
  tagline: z.string().min(5, { message: 'Tagline must be at least 5 characters.' }).max(150),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  website_url: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
  image_url: z.string().url({ message: 'Please enter a valid image URL.' }).or(z.literal('')),
  technologies: z.array(z.string()).min(1, { message: 'Please select at least one technology.' }),
  categories: z.array(z.string()).min(1, { message: 'Please select at least one category.' }),
  screenshots: z.array(z.object({
    title: z.string().optional(),
    image_url: z.string().url({ message: 'Please enter a valid URL.' }),
    description: z.string().optional(),
  })),
  videos: z.array(z.object({
    title: z.string().optional(),
    video_url: z.string().url({ message: 'Please enter a valid URL.' }),
  })),
  makers: z.array(z.object({
    id: z.string().nullable(),
    isCreator: z.boolean(),
    username: z.string().nullable(),
    avatar_url: z.string().nullable()
  }))
  .min(1, { message: 'Your product must have at least one maker.' })
  .refine((makers) => makers.some(maker => maker.isCreator), {
    message: 'Your product must have at least one maker marked as creator.',
  }),
  agreed_to_policies: z.boolean().refine(val => val === true, {
    message: 'You must agree to the policies before submitting.',
  }),
});
