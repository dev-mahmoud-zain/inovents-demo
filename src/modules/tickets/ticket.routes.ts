import { Router } from 'express';
import { ticketController } from './ticket.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { Role } from '../../common/enums';
import { validate } from '../../middleware/validate.middleware';
import { ticketVerifySchema } from './dto/ticket.schema';

const router = Router();

// GET /api/tickets  →  my tickets (Attendee)
router.get(
  '/',
  authenticate,
  authorizeRoles(Role.Attendee),
  (req, res, next) => ticketController.getMyTickets(req, res, next),
);

// GET /api/tickets/:ticketId  →  specific ticket with QR (Attendee)
router.get(
  '/:ticketId',
  authenticate,
  authorizeRoles(Role.Attendee),
  (req, res, next) => ticketController.getOne(req, res, next),
);

// POST /api/check-in  →  scan & validate (Organizer / Admin)
router.post(
  '/check-in',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  validate(ticketVerifySchema),
  (req, res, next) => ticketController.checkIn(req, res, next),
);

export default router;
