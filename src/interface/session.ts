import mongoose from 'mongoose';
import { IUserDocument } from './model';

export interface ISessionDocument {
  user: IUserDocument['_id'];
  valid: boolean;
  userAgent: string;
}
