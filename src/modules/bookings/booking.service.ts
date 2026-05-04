import mongoose from 'mongoose';
import { BookingModel } from './booking.model';
import { EventModel } from '../events/event.model';
import { TicketModel } from '../tickets/ticket.model';
import { UserModel } from '../users/user.model';
import { IBooking } from '../../common/interfaces';
import { BookingStatus, TicketStatus } from '../../common/enums';
import { generateQrCode, generateSecureToken, generateTicketId } from '../../common/utils';

interface CreateBookingDto {
  attendeeId: string;
  eventId: string;
  quantity: number;
}

export class BookingService {
  async createBooking(dto: CreateBookingDto): Promise<IBooking> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Fetch event inside transaction
      const event = await EventModel.findById(dto.eventId).session(session);
      if (!event) throw new Error('Event not found.');

      // 2. Check availability
      if (event.availableTickets < dto.quantity) {
        throw new Error(
          `Only ${event.availableTickets} ticket(s) remaining.`,
        );
      }

      // 3. Deduct tickets atomically
      event.availableTickets -= dto.quantity;
      await event.save({ session });

      // 4. Create booking
      const totalPrice = event.price * dto.quantity;
      const [booking] = await BookingModel.create(
        [
          {
            attendee: dto.attendeeId,
            event: dto.eventId,
            quantity: dto.quantity,
            totalPrice,
            status: BookingStatus.Confirmed,
          },
        ],
        { session },
      );

      // 5. Generate individual tickets
      const attendee = await UserModel.findById(dto.attendeeId).session(session);
      const tickets = [];

      for (let i = 0; i < dto.quantity; i++) {
        const validationToken = generateSecureToken();
        const uniqueTicketId = generateTicketId();
        const qrCode = await generateQrCode(
          JSON.stringify({ token: validationToken, eventId: dto.eventId }),
        );

        tickets.push({
          uniqueTicketId,
          booking: booking._id,
          attendeeName: attendee?.name ?? 'Guest',
          event: dto.eventId,
          ticketType: 'Standard',
          validationToken,
          qrCode,
          status: TicketStatus.Valid,
        });
      }

      await TicketModel.insertMany(tickets, { session });

      await session.commitTransaction();
      return booking;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async findByAttendee(attendeeId: string): Promise<IBooking[]> {
    return BookingModel.find({ attendee: attendeeId })
      .populate('event', 'title dateTime venue price')
      .lean();
  }
}

export const bookingService = new BookingService();
