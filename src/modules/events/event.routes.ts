import { Router } from 'express';
import { eventController } from './event.controller';
import { ticketController } from '../tickets/ticket.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { Role } from '../../common/enums';
import { validate } from '../../middleware/validate.middleware';
import { createEventSchema, updateEventSchema, filterEventSchema } from './dto/event.schema';

const router = Router();

// ─── Public / Attendee ──────────────────────────────────────────────────────
// GET /api/events
router.get('/', validate(filterEventSchema), (req, res, next) => eventController.getAll(req, res, next));

// GET /api/events/:eventId
router.get('/:eventId', (req, res, next) => eventController.getOne(req, res, next));

// ─── Organizer ───────────────────────────────────────────────────────────────
// POST /api/events/organizer  →  create event
router.post(
  '/create',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  validate(createEventSchema),
  (req, res, next) => eventController.create(req, res, next),
);

// GET /api/events/organizer/mine  →  list organizer's own events
router.get(
  '/my-events',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  (req, res, next) => eventController.getMyEvents(req, res, next),
);

// PUT /api/events/organizer/:eventId  →  update event
router.put(
  '/update/:eventId',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  validate(updateEventSchema),
  (req, res, next) => eventController.update(req, res, next),
);

// GET /api/events/organizer/:eventId/attendees  →  attendee list
router.get(
  '/attendees/:eventId',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  (req, res, next) => ticketController.getEventAttendees(req, res, next),
);

export default router;
