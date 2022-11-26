import mongoose from 'mongoose';
import { IUserDocument } from './model';

export interface ISessionDocument extends mongoose.Document {
  user: IUserDocument['_id'];
  valid: boolean;
  userAgent: string;
}
