import { IUserDocument } from './model';

export interface ISessionDocument {
  name: IUserDocument['_id'];
  valid: boolean;
  userAgent: string;
}
