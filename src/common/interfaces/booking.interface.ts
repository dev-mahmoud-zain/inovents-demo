import { Document, Types } from 'mongoose';
import { BookingStatus } from '../enums';

export interface IBooking extends Document {
  attendee: Types.ObjectId;
  event: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
