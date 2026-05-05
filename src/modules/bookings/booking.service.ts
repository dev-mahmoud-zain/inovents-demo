import { AppDataSource } from '../../config/database';
import { Booking } from './booking.entity';
import { Event } from '../events/event.entity';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../users/user.entity';
import { IBooking } from '../../common/interfaces';
import { BookingStatus, TicketStatus } from '../../common/enums';
import { generateQrCode, generateSecureToken, generateTicketId } from '../../common/utils';
import { AppError } from '../../common/utils/app-error';

interface CreateBookingDto {
  attendeeId: string;
  eventId: string;
  quantity: number;
}

export class BookingService {
  private bookingRepository = AppDataSource.getRepository(Booking);

  async createBooking(dto: CreateBookingDto): Promise<IBooking> {
    return AppDataSource.transaction(async (manager) => {
      // 1. Fetch event inside transaction
      const event = await manager.findOne(Event, {
        where: { id: dto.eventId },
        lock: { mode: 'pessimistic_write' }, // Similar to session in Mongo for isolation
      });

      if (!event) throw new AppError('Event not found.', 404);

      // 2. Check availability
      if (event.availableTickets < dto.quantity) {
        throw new AppError(`Only ${event.availableTickets} ticket(s) remaining.`, 400);
      }

      // 3. Deduct tickets atomically
      event.availableTickets -= dto.quantity;
      await manager.save(event);

      // 4. Create booking
      const totalPrice = Number(event.price) * dto.quantity;
      const booking = manager.create(Booking, {
        attendee: dto.attendeeId,
        event: dto.eventId,
        quantity: dto.quantity,
        totalPrice,
        status: BookingStatus.Confirmed,
      });

      await manager.save(booking);

      // 5. Generate individual tickets
      const attendee = await manager.findOne(User, { where: { id: dto.attendeeId } });
      const tickets = [];

      for (let i = 0; i < dto.quantity; i++) {
        const validationToken = generateSecureToken();
        const uniqueTicketId = generateTicketId();
        const qrCode = await generateQrCode(
          JSON.stringify({ token: validationToken, eventId: dto.eventId }),
        );

        tickets.push(
          manager.create(Ticket, {
            uniqueTicketId,
            booking: booking.id,
            attendeeName: attendee?.name ?? 'Guest',
            event: dto.eventId,
            ticketType: 'Standard',
            validationToken,
            qrCode,
            status: TicketStatus.Valid,
          }),
        );
      }

      await manager.save(Ticket, tickets);

      return booking;
    });
  }

  async findByAttendee(attendeeId: string): Promise<IBooking[]> {
    return this.bookingRepository.find({
      where: { attendee: attendeeId },
      relations: ['eventEntity'],
    });
  }
}

export const bookingService = new BookingService();
