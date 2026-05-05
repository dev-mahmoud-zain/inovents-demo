export interface IVenueLocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface IEvent {
  id: string;
  title: string;
  description: string;
  organizer: string;
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
