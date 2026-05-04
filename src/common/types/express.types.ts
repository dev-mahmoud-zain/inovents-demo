import { Request } from 'express';
import { IUser } from '../interfaces';

// Augment Express Request to include the authenticated user
export interface AuthRequest extends Request {
  user?: Omit<IUser, 'password'> & { _id: string };
}
