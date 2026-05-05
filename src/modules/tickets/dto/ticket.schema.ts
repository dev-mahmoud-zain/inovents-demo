import { z } from 'zod';

export const ticketTransferSchema = z.object({
  body: z.object({
    ticketId: z.string().uuid('Invalid Ticket ID format'),
    newOwnerId: z.string().uuid('Invalid New Owner ID format'),
  }),
});

export const ticketVerifySchema = z.object({
  body: z.object({
    ticketCode: z.string().min(1, 'Ticket code is required'),
    eventId: z.string().uuid('Invalid Event ID format'),
  }),
});
