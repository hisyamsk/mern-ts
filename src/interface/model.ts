import mongoose from 'mongoose';

export interface IUserInput {
  email: string;
  name: string;
  password: string;
}

export interface IUserDocument extends IUserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface IGoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export type IUserDocumentResult = Omit<
  IUserDocument,
  'password' | 'comparePassword'
>;
