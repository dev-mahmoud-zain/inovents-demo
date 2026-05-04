import { Document } from 'mongoose';
import { Role } from '../enums';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
