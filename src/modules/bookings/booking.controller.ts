import { Request, Response } from 'express';
import { bookingService } from './booking.service';
import { sendSuccess } from '../../common/utils';
import { AuthRequest } from '../../common/types';
import { catchAsync } from '../../common/utils/catch-async';

export class BookingController {
  // POST /api/bookings
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user!;
    const { eventId, ticketsCount } = req.body;
    const booking = await bookingService.createBooking({
      attendeeId: user.id,
      eventId,
      quantity: Number(ticketsCount),
    });
    sendSuccess(res, booking, 'Booking confirmed and tickets generated.', 201);
  });

  // GET /api/bookings
  getMyBookings = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user!;
    const bookings = await bookingService.findByAttendee(user.id);
    sendSuccess(res, bookings, 'Bookings fetched.');
  });
}

export const bookingController = new BookingController();
