import { Router } from 'express';
import { ticketController } from './ticket.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { Role } from '../../common/enums';

const router = Router();

// GET /api/tickets  →  my tickets (Attendee)
router.get(
  '/',
  authenticate,
  authorizeRoles(Role.Attendee),
  (req, res) => ticketController.getMyTickets(req, res),
);

// GET /api/tickets/:ticketId  →  specific ticket with QR (Attendee)
router.get(
  '/:ticketId',
  authenticate,
  authorizeRoles(Role.Attendee),
  (req, res) => ticketController.getOne(req, res),
);

// POST /api/check-in  →  scan & validate (Organizer / Admin)
router.post(
  '/check-in',
  authenticate,
  authorizeRoles(Role.Organizer, Role.Admin),
  (req, res) => ticketController.checkIn(req, res),
);

export default router;
