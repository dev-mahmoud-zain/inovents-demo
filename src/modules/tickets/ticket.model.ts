import { Schema, model } from 'mongoose';
import { ITicket } from '../../common/interfaces';
import { TicketStatus } from '../../common/enums';

const TicketSchema = new Schema<ITicket>(
  {
    uniqueTicketId: { type: String, required: true, unique: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    attendeeName: { type: String, required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketType: { type: String, default: 'Standard' },
    validationToken: { type: String, required: true, unique: true, select: false },
    qrCode: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.Valid,
    },
    checkedInAt: { type: Date },
  },
  { timestamps: true },
);

export const TicketModel = model<ITicket>('Ticket', TicketSchema);
