import mongoose from 'mongoose';
import { IUserDocument } from './model';

export interface IProductDocument {
  user: IUserDocument['_id'];
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
