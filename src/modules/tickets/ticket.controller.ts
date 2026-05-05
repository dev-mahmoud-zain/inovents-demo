import { Request, Response } from 'express';
import { ticketService } from './ticket.service';
import { sendSuccess } from '../../common/utils';
import { AuthRequest } from '../../common/types';
import { catchAsync } from '../../common/utils/catch-async';
import { AppError } from '../../common/utils/app-error';

export class TicketController {
  // GET /api/tickets
  getMyTickets = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user!;
    const tickets = await ticketService.findByAttendee(user.id);
    sendSuccess(res, tickets, 'Tickets fetched.');
  });

  // GET /api/tickets/:ticketId
  getOne = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const ticket = await ticketService.findById(req.params.ticketId as string);
    if (!ticket) {
      throw new AppError('Ticket not found.', 404);
    }
    sendSuccess(res, ticket, 'Ticket fetched.');
  });

  // POST /api/check-in
  checkIn = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { ticketCode, eventId } = req.body;
    const result = await ticketService.checkIn(ticketCode, eventId);
    
    if (!result.success) {
      throw new AppError(result.message, 400);
    }
    
    sendSuccess(res, { checkedInAt: result.checkedInAt }, result.message, 200);
  });

  // GET /api/organizer/events/:eventId/attendees
  getEventAttendees = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const tickets = await ticketService.findEventAttendees(req.params.eventId as string);
    sendSuccess(res, tickets, 'Attendees fetched.');
  });
}

export const ticketController = new TicketController();
