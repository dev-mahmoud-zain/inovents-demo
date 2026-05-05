import { BookingStatus } from '../enums';

export interface IBooking {
  id: string;
  attendee: string;
  event: string;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
