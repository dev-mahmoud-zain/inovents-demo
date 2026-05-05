import { Request, Response } from 'express';
import { eventService } from './event.service';
import { sendSuccess } from '../../common/utils';
import { AuthRequest } from '../../common/types';
import { catchAsync } from '../../common/utils/catch-async';
import { AppError } from '../../common/utils/app-error';

export class EventController {
  // GET /api/events
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { keyword, date, price_min, price_max, availability } = req.query;
    const events = await eventService.findAll({
      keyword: keyword as string,
      date: date as string,
      price_min: price_min ? Number(price_min) : undefined,
      price_max: price_max ? Number(price_max) : undefined,
      availability: availability === 'true',
    });
    sendSuccess(res, events, 'Events fetched.');
  });

  // GET /api/events/:eventId
  getOne = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const event = await eventService.findById(req.params.eventId as string);
    if (!event) {
      throw new AppError('Event not found.', 404);
    }
    sendSuccess(res, event, 'Event fetched.');
  });

  // POST /api/organizer/events
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user!;
    const event = await eventService.create({ ...req.body, organizer: user.id });
    sendSuccess(res, event, 'Event created.', 201);
  });

  // PUT /api/organizer/events/:eventId
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user!;
    const event = await eventService.update(req.params.eventId as string, user.id, req.body);
    if (!event) {
      throw new AppError('Event not found or unauthorized.', 404);
    }
    sendSuccess(res, event, 'Event updated.');
  });

  // GET /api/organizer/events
  getMyEvents = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user!;
    const events = await eventService.findByOrganizer(user.id);
    sendSuccess(res, events, 'Your events fetched.');
  });
}

export const eventController = new EventController();
