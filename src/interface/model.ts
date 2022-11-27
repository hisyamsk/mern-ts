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
