import { Document, Types } from 'mongoose';
import { TicketStatus } from '../enums';

export interface ITicket extends Document {
  uniqueTicketId: string;
  booking: Types.ObjectId;
  attendeeName: string;
  event: Types.ObjectId;
  ticketType: string;
  validationToken: string;
  qrCode: string;
  status: TicketStatus;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
