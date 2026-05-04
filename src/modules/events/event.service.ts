import { EventModel } from './event.model';
import { IEvent } from '../../common/interfaces';
import { Types } from 'mongoose';

interface CreateEventDto {
  title: string;
  description: string;
  organizer: string;
  gallery?: string[];
  venue: { address: string; coordinates: { lat: number; lng: number } };
  dateTime: Date;
  refundPolicy?: string;
  rules?: string;
  totalCapacity: number;
  price: number;
}

interface EventFilterQuery {
  keyword?: string;
  date?: string;
  price_min?: number;
  price_max?: number;
  availability?: boolean;
}

export class EventService {
  async create(dto: CreateEventDto): Promise<IEvent> {
    return EventModel.create({ ...dto, availableTickets: dto.totalCapacity });
  }

  async findAll(filters: EventFilterQuery): Promise<IEvent[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (filters.keyword) {
      query.$text = { $search: filters.keyword };
    }
    if (filters.date) {
      const day = new Date(filters.date);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      query.dateTime = { $gte: day, $lt: nextDay };
    }
    if (filters.price_min !== undefined || filters.price_max !== undefined) {
      query.price = {};
      if (filters.price_min !== undefined) query.price.$gte = filters.price_min;
      if (filters.price_max !== undefined) query.price.$lte = filters.price_max;
    }
    if (filters.availability) {
      query.availableTickets = { $gt: 0 };
    }

    return EventModel.find(query).populate('organizer', 'name email').lean();
  }

  async findById(id: string): Promise<IEvent | null> {
    return EventModel.findById(id).populate('organizer', 'name email').lean();
  }

  async update(
    id: string,
    organizerId: string,
    updates: Partial<CreateEventDto>,
  ): Promise<IEvent | null> {
    return EventModel.findOneAndUpdate(
      { _id: id, organizer: new Types.ObjectId(organizerId) },
      updates,
      { new: true, runValidators: true },
    );
  }

  async findByOrganizer(organizerId: string): Promise<IEvent[]> {
    return EventModel.find({ organizer: new Types.ObjectId(organizerId) }).lean();
  }
}

export const eventService = new EventService();
