import { AppDataSource } from '../../config/database';
import { Ticket } from './ticket.entity';
import { ITicket } from '../../common/interfaces';
import { TicketStatus } from '../../common/enums';
import { Not } from 'typeorm';

export class TicketService {
  private ticketRepository = AppDataSource.getRepository(Ticket);

  async findByAttendee(attendeeId: string): Promise<ITicket[]> {
    const now = new Date();

    const tickets = await this.ticketRepository.find({
      where: {
        status: Not(TicketStatus.Expired),
        bookingEntity: { attendee: attendeeId },
      },
      relations: ['eventEntity', 'bookingEntity'],
    });

    return tickets.map((t) => ({
      ...t,
      category: new Date(t.eventEntity.dateTime) > now ? 'upcoming' : 'past',
    })) as any;
  }

  async findById(ticketId: string): Promise<ITicket | null> {
    return this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['eventEntity'],
    });
  }

  async checkIn(
    validationToken: string,
    eventId: string,
  ): Promise<{ success: boolean; message: string; checkedInAt?: Date }> {
    const ticket = await this.ticketRepository.findOne({
      where: { validationToken },
      select: ['id', 'status', 'checkedInAt', 'event', 'validationToken'],
    });

    if (!ticket) {
      return { success: false, message: 'Invalid ticket token.' };
    }

    if (ticket.event !== eventId) {
      return { success: false, message: 'Ticket does not belong to this event.' };
    }

    if (ticket.status === TicketStatus.CheckedIn) {
      return {
        success: false,
        message: 'Ticket already used.',
        checkedInAt: ticket.checkedInAt,
      };
    }

    ticket.status = TicketStatus.CheckedIn;
    ticket.checkedInAt = new Date();
    await this.ticketRepository.save(ticket);

    return { success: true, message: 'Check-in successful.', checkedInAt: ticket.checkedInAt };
  }

  async findEventAttendees(eventId: string): Promise<ITicket[]> {
    return this.ticketRepository.find({
      where: { event: eventId },
      relations: ['bookingEntity'],
    });
  }
}

export const ticketService = new TicketService();
