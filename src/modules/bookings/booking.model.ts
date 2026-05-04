import { Schema, model } from 'mongoose';
import { IBooking } from '../../common/interfaces';
import { BookingStatus } from '../../common/enums';

const BookingSchema = new Schema<IBooking>(
  {
    attendee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Pending,
    },
  },
  { timestamps: true },
);

export const BookingModel = model<IBooking>('Booking', BookingSchema);
