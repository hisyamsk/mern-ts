import mongoose from 'mongoose';

interface IUser {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, mongoose.Document {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}
