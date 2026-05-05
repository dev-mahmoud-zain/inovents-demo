import { DataSource } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Event } from '../modules/events/event.entity';
import { Booking } from '../modules/bookings/booking.entity';
import { Ticket } from '../modules/tickets/ticket.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Event, Booking, Ticket],
  migrations: [],
  subscribers: [],
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
});

const connectDB = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅  PostgreSQL connected successfully with TypeORM.');
  } catch (error) {
    console.error('❌  PostgreSQL connection failed:', error);
    throw error;
  }
};

export default connectDB;
