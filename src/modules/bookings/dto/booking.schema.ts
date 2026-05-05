import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    eventId: z.string().uuid('Invalid Event ID format'),
    ticketsCount: z.number().int().positive('Tickets count must be at least 1'),
  }),
});
