import { omit } from 'lodash';
import { DocumentDefinition } from 'mongoose';
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
    const user = await UserModel.create(input);
    return omit(user.toJSON(), 'password');
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

  if (!isPasswordMatch) return false;

  return omit(user.toJSON(), 'password');
}
