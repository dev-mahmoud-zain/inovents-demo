import { Router } from 'express';
import { eventController } from './event.controller';
import { ticketController } from '../tickets/ticket.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { Role } from '../../common/enums';

const router = Router();

// ─── Public / Attendee ──────────────────────────────────────────────────────
// GET /api/events
router.get('/', (req, res) => eventController.getAll(req, res));

// GET /api/events/:eventId
router.get('/:eventId', (req, res) => eventController.getOne(req, res));

// ─── Organizer ───────────────────────────────────────────────────────────────
// POST /api/events/organizer  →  create event
router.post(
  '/create',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  (req, res) => eventController.create(req, res),
);

// GET /api/events/organizer/mine  →  list organizer's own events
router.get(
  '/my-events',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  (req, res) => eventController.getMyEvents(req, res),
);

// PUT /api/events/organizer/:eventId  →  update event
router.put(
  '/update/:eventId',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  (req, res) => eventController.update(req, res),
);

// GET /api/events/organizer/:eventId/attendees  →  attendee list
router.get(
  '/attendees/:eventId',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  (req, res) => ticketController.getEventAttendees(req, res),
);

export default router;
