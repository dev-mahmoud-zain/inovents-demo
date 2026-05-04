import { Schema, model } from 'mongoose';
import { IUser } from '../../common/interfaces';
import { Role } from '../../common/enums';

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.Attendee,
    },
  },
  { timestamps: true },
);

export const UserModel = model<IUser>('User', UserSchema);
