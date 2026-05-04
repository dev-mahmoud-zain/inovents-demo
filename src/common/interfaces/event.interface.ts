import { Document, Types } from 'mongoose';

export interface IVenueLocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface IEvent extends Document {
  title: string;
  description: string;
  organizer: Types.ObjectId;
  gallery: string[];
  venue: IVenueLocation;
  dateTime: Date;
  refundPolicy: string;
  rules: string;
  totalCapacity: number;
  availableTickets: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
