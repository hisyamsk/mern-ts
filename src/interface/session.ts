import { IUserDocument } from './model';

export interface ISessionDocument {
  user: IUserDocument['_id'];
  valid: boolean;
  userAgent: string;
}

export interface IGoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}
