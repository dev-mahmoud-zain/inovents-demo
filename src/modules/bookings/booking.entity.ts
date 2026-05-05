import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IBooking } from '../../common/interfaces';
import { BookingStatus } from '../../common/enums';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

@Entity('bookings')
export class Booking implements IBooking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'attendeeId' })
  attendeeEntity!: User;

  @Column({ name: 'attendeeId' })
  attendee!: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  eventEntity!: Event;

  @Column({ name: 'eventId' })
  event!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    enumName: 'booking_status_enum',
    default: BookingStatus.Pending,
  })
  status!: BookingStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
