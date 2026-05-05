import { AppDataSource } from '../../config/database';
import { Event } from './event.entity';
import { IEvent } from '../../common/interfaces';
import { Between, ILike, MoreThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

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
  private eventRepository = AppDataSource.getRepository(Event);

  async create(dto: CreateEventDto): Promise<IEvent> {
    const event = this.eventRepository.create({
      ...dto,
      availableTickets: dto.totalCapacity,
    });
    return this.eventRepository.save(event);
  }

  async findAll(filters: EventFilterQuery): Promise<IEvent[]> {
    const where: any = {};

    if (filters.keyword) {
      // Basic implementation of search
      where.title = ILike(`%${filters.keyword}%`);
      // For more complex search across multiple fields, you might need a QueryBuilder
    }

    if (filters.date) {
      const day = new Date(filters.date);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      where.dateTime = Between(day, nextDay);
    }

    if (filters.price_min !== undefined && filters.price_max !== undefined) {
      where.price = Between(filters.price_min, filters.price_max);
    } else if (filters.price_min !== undefined) {
      where.price = MoreThanOrEqual(filters.price_min);
    } else if (filters.price_max !== undefined) {
      where.price = LessThanOrEqual(filters.price_max);
    }

    if (filters.availability) {
      where.availableTickets = MoreThan(0);
    }

    return this.eventRepository.find({
      where,
      relations: ['organizerEntity'],
    });
  }

  async findById(id: string): Promise<IEvent | null> {
    return this.eventRepository.findOne({
      where: { id },
      relations: ['organizerEntity'],
    });
  }

  async update(
    id: string,
    organizerId: string,
    updates: Partial<CreateEventDto>,
  ): Promise<IEvent | null> {
    const event = await this.eventRepository.findOne({
      where: { id, organizer: organizerId },
    });

    if (!event) return null;

    Object.assign(event, updates);
    return this.eventRepository.save(event);
  }

  async findByOrganizer(organizerId: string): Promise<IEvent[]> {
    return this.eventRepository.find({
      where: { organizer: organizerId },
    });
  }
}

export const eventService = new EventService();
