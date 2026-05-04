import { Request, Response } from 'express';
import { eventService } from './event.service';
import { sendSuccess, sendError } from '../../common/utils';
import { AuthRequest } from '../../common/types';

export class EventController {
  // GET /api/events
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { keyword, date, price_min, price_max, availability } = req.query;
      const events = await eventService.findAll({
        keyword: keyword as string,
        date: date as string,
        price_min: price_min ? Number(price_min) : undefined,
        price_max: price_max ? Number(price_max) : undefined,
        availability: availability === 'true',
      });
      sendSuccess(res, events, 'Events fetched.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch events.';
      sendError(res, msg, 500);
    }
  }

  // GET /api/events/:eventId
  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.findById(req.params.eventId as string);
      if (!event) {
        sendError(res, 'Event not found.', 404);
        return;
      }
      sendSuccess(res, event, 'Event fetched.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch event.';
      sendError(res, msg, 500);
    }
  }

  // POST /api/organizer/events
  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as AuthRequest).user!;
      const event = await eventService.create({ ...req.body, organizer: user._id });
      sendSuccess(res, event, 'Event created.', 201);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create event.';
      sendError(res, msg, 400);
    }
  }

  // PUT /api/organizer/events/:eventId
  async update(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as AuthRequest).user!;
      const event = await eventService.update(req.params.eventId as string, user._id, req.body);
      if (!event) {
        sendError(res, 'Event not found or unauthorized.', 404);
        return;
      }
      sendSuccess(res, event, 'Event updated.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update event.';
      sendError(res, msg, 400);
    }
  }

  // GET /api/organizer/events
  async getMyEvents(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as AuthRequest).user!;
      const events = await eventService.findByOrganizer(user._id);
      sendSuccess(res, events, 'Your events fetched.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch events.';
      sendError(res, msg, 500);
    }
  }
}

export const eventController = new EventController();
