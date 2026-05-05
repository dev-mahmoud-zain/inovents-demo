import { Request, Response } from 'express';
import { bookingService } from './booking.service';
import { sendSuccess, sendError } from '../../common/utils';
import { AuthRequest } from '../../common/types';

export class BookingController {
  // POST /api/bookings
  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as AuthRequest).user!;
      const { eventId, quantity } = req.body;
      const booking = await bookingService.createBooking({
        attendeeId: user.id,
        eventId,
        quantity: Number(quantity),
      });
      sendSuccess(res, booking, 'Booking confirmed and tickets generated.', 201);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Booking failed.';
      sendError(res, msg, 400);
    }
  }

  // GET /api/bookings
  async getMyBookings(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as AuthRequest).user!;
      const bookings = await bookingService.findByAttendee(user.id);
      sendSuccess(res, bookings, 'Bookings fetched.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch bookings.';
      sendError(res, msg, 500);
    }
  }
}

export const bookingController = new BookingController();
