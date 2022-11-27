import { IUserDocument } from './model';

export interface IProductInput {
  title: string;
  description: string;
  price: number;
  image: string;
  user: IUserDocument['_id'];
}

export interface IProductDocument extends IProductInput {
  createdAt: Date;
  updatedAt: Date;
}
