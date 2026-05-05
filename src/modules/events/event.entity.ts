import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IEvent, IVenueLocation } from '../../common/interfaces';
import { User } from '../users/user.entity';

@Entity('events')
export class Event implements IEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'organizerId' })
  organizerEntity!: User;

  @Column({ name: 'organizerId' })
  organizer!: string;

  @Column({ type: 'jsonb', default: [] })
  gallery!: string[];

  @Column({ type: 'jsonb' })
  venue!: IVenueLocation;

  @Column({ type: 'timestamp' })
  dateTime!: Date;

  @Column({ type: 'text', default: '' })
  refundPolicy!: string;

  @Column({ type: 'text', default: '' })
  rules!: string;

  @Column({ type: 'int' })
  totalCapacity!: number;

  @Column({ type: 'int' })
  availableTickets!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
