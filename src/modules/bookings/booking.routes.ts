import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { Role } from '../../common/enums';

const router = Router();

// POST /api/bookings  →  create booking (Attendee only)
router.post(
  '/',
  authenticate,
  authorizeRoles(Role.Attendee),
  (req, res) => bookingController.create(req, res),
);

// GET /api/bookings  →  my bookings history (Attendee)
router.get(
  '/',
  authenticate,
  authorizeRoles(Role.Attendee),
  (req, res) => bookingController.getMyBookings(req, res),
);

export default router;
