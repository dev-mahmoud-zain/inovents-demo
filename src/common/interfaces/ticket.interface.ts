import { TicketStatus } from '../enums';

export interface ITicket {
  id: string;
  uniqueTicketId: string;
  booking: string;
  attendeeName: string;
  event: string;
  ticketType: string;
  validationToken: string;
  qrCode: string;
  status: TicketStatus;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
