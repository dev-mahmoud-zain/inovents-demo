import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Routes
import authRoutes from './modules/users/auth.routes';
import eventRoutes from './modules/events/event.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import ticketRoutes from './modules/tickets/ticket.routes';

// Middleware
import { errorMiddleware } from './middleware/error.middleware';

const createApp = (): Application => {
  const app = express();

  // ─── Security & Parsing Middleware ───────────────────────────────────────
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Welcome / Server Info ──────────────────────────────────────────────
  app.get(["/", "/api"], (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to the inovents API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      healthCheck: '/api/health',
      project: 'inovents - Event Ticketing System',
      description: 'A modern platform for event discovery, secure booking, and scannable digital ticket management.',
      purpose: 'Technical demonstration of a scalable event management backend.'
    });
  });

  // ─── Health Check ─────────────────────────────────────────────────────────
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
  });

  // ─── API Routes ───────────────────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/tickets', ticketRoutes);

  // ─── 404 Handler ─────────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
  });

  // ─── Global Error Handler ────────────────────────────────────────────────
  app.use(errorMiddleware);

  return app;
};

export default createApp;
