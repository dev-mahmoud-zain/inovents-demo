import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { Role } from '../../common/enums';
import { validate } from '../../middleware/validate.middleware';
import { createBookingSchema } from './dto/booking.schema';

const router = Router();

// POST /api/bookings  →  create booking (Attendee only)
router.post(
  '/',
  authenticate,
  authorizeRoles(Role.Attendee),
  validate(createBookingSchema),
  (req, res, next) => bookingController.create(req, res, next),
);

// GET /api/bookings  →  my bookings history (Attendee)
router.get(
  '/',
  authenticate,
  authorizeRoles(Role.Attendee),
  (req, res, next) => bookingController.getMyBookings(req, res, next),
);

export default router;
