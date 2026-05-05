import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ITicket } from '../../common/interfaces';
import { TicketStatus } from '../../common/enums';
import { Booking } from '../bookings/booking.entity';
import { Event } from '../events/event.entity';

@Entity('tickets')
export class Ticket implements ITicket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  uniqueTicketId!: string;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'bookingId' })
  bookingEntity!: Booking;

  @Column({ name: 'bookingId' })
  booking!: string;

  @Column({ type: 'varchar' })
  attendeeName!: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  eventEntity!: Event;

  @Column({ name: 'eventId' })
  event!: string;

  @Column({ type: 'varchar', default: 'Standard' })
  ticketType!: string;

  @Column({ type: 'varchar', unique: true, select: false })
  validationToken!: string;

  @Column({ type: 'text' })
  qrCode!: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    enumName: 'ticket_status_enum',
    default: TicketStatus.Valid,
  })
  status!: TicketStatus;

  @Column({ type: 'timestamp', nullable: true })
  checkedInAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
