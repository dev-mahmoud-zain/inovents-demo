import { TicketModel } from './ticket.model';
import { ITicket } from '../../common/interfaces';
import { TicketStatus } from '../../common/enums';

export class TicketService {
  async findByAttendee(attendeeId: string): Promise<ITicket[]> {
    const now = new Date();

    const tickets = await TicketModel.find({ status: { $ne: TicketStatus.Expired } })
      .populate({
        path: 'booking',
        match: { attendee: attendeeId },
      })
      .populate('event', 'title dateTime venue')
      .lean();

    // Filter out tickets where booking didn't match (null after populate match)
    const owned = tickets.filter((t) => t.booking !== null);

    return owned.map((t) => ({
      ...t,
      category: new Date((t.event as any).dateTime) > now ? 'upcoming' : 'past',
    })) as unknown as ITicket[];
  }

  async findById(ticketId: string): Promise<ITicket | null> {
    return TicketModel.findById(ticketId)
      .populate('event', 'title dateTime venue organizer')
      .lean();
  }

  /**
   * Validates and checks-in a ticket.
   * Returns an error payload with the first check-in timestamp on duplicate scans.
   */
  async checkIn(
    validationToken: string,
    eventId: string,
  ): Promise<{ success: boolean; message: string; checkedInAt?: Date }> {
    const ticket = await TicketModel.findOne({ validationToken }).select(
      '+validationToken',
    );

    if (!ticket) {
      return { success: false, message: 'Invalid ticket token.' };
    }

    if (ticket.event.toString() !== eventId) {
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
    await ticket.save();

    return { success: true, message: 'Check-in successful.', checkedInAt: ticket.checkedInAt };
  }

  async findEventAttendees(eventId: string): Promise<ITicket[]> {
    return TicketModel.find({ event: eventId })
      .populate({ path: 'booking', select: 'attendee status' })
      .lean();
  }
}

export const ticketService = new TicketService();
