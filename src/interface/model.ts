import mongoose from 'mongoose';

interface IUser {
  email: string;
  name: string;
  password: string;
}

export interface IUserDocument extends IUser, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}
