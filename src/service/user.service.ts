import { omit } from 'lodash';
import { DocumentDefinition, FilterQuery } from 'mongoose';
import { IUserDocument } from '../interface/model';
import UserModel from '../model/user.model';

export async function createUser(
  input: DocumentDefinition<
    Omit<
      IUserDocument,
      'passwordConfirmation' | 'comparePassword' | 'createdAt' | 'updatedAt'
    >
  >
) {
  try {
    return await UserModel.create(input);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return false;
  }

  const isPasswordMatch: boolean = await user.comparePassword(password);
  return isPasswordMatch ? omit(user.toJSON(), 'password') : false;
}

export async function findUser(query: FilterQuery<IUserDocument>) {
  return await UserModel.findById(query).lean();
}
