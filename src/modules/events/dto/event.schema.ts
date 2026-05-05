import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    gallery: z.array(z.string().url('Invalid URL format for gallery images')).optional(),
    venue: z.object({
      address: z.string().min(5, 'Address must be at least 5 characters'),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    dateTime: z.string().datetime('Must be a valid ISO datetime string'),
    refundPolicy: z.string().optional(),
    rules: z.string().optional(),
    totalCapacity: z.number().positive('Total capacity must be a positive number'),
    price: z.number().min(0, 'Price cannot be negative'),
  }),
});

export const updateEventSchema = z.object({
  body: createEventSchema.shape.body.partial(),
});

export const filterEventSchema = z.object({
  query: z.object({
    keyword: z.string().optional(),
    date: z.string().datetime('Must be a valid ISO datetime string').optional(),
    price_min: z.string().regex(/^\d+$/).transform(Number).optional(),
    price_max: z.string().regex(/^\d+$/).transform(Number).optional(),
    availability: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  }),
});
