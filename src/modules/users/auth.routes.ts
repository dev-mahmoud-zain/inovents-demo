import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema } from './dto/auth.schema';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), (req, res, next) => authController.register(req, res, next));

// POST /api/auth/login
router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next));

export default router;
