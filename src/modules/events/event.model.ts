import { Schema, model } from 'mongoose';
import { IEvent } from '../../common/interfaces';

const VenueLocationSchema = new Schema(
  {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { _id: false },
);

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gallery: [{ type: String }],
    venue: { type: VenueLocationSchema, required: true },
    dateTime: { type: Date, required: true },
    refundPolicy: { type: String, default: '' },
    rules: { type: String, default: '' },
    totalCapacity: { type: Number, required: true, min: 1 },
    availableTickets: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

// Text index for keyword search
EventSchema.index({ title: 'text', description: 'text' });

export const EventModel = model<IEvent>('Event', EventSchema);
