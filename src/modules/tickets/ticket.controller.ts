import { Request, Response } from 'express';
import { ticketService } from './ticket.service';
import { sendSuccess, sendError } from '../../common/utils';
import { AuthRequest } from '../../common/types';

export class TicketController {
  // GET /api/tickets
  async getMyTickets(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as AuthRequest).user!;
      const tickets = await ticketService.findByAttendee(user._id);
      sendSuccess(res, tickets, 'Tickets fetched.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch tickets.';
      sendError(res, msg, 500);
    }
  }

  // GET /api/tickets/:ticketId
  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const ticket = await ticketService.findById(req.params.ticketId as string);
      if (!ticket) {
        sendError(res, 'Ticket not found.', 404);
        return;
      }
      sendSuccess(res, ticket, 'Ticket fetched.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch ticket.';
      sendError(res, msg, 500);
    }
  }

  // POST /api/check-in
  async checkIn(req: Request, res: Response): Promise<void> {
    try {
      const { ticketToken, eventId } = req.body;
      const result = await ticketService.checkIn(ticketToken, eventId);
      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json({ success: result.success, message: result.message, checkedInAt: result.checkedInAt });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Check-in failed.';
      sendError(res, msg, 500);
    }
  }

  // GET /api/organizer/events/:eventId/attendees
  async getEventAttendees(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await ticketService.findEventAttendees(req.params.eventId as string);
      sendSuccess(res, tickets, 'Attendees fetched.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch attendees.';
      sendError(res, msg, 500);
    }
  }
}

export const ticketController = new TicketController();
