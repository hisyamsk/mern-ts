import config from 'config';
import axios from 'axios';
import qs from 'qs';
import { omit } from 'lodash';
import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import {
  IGoogleUserResult,
  IUserDocument,
  IUserDocumentResult,
  IUserInput,
} from '../interface/model';
import UserModel from '../model/user.model';
import log from '../utils/logger';
import { IGoogleTokensResult } from '../interface/session';

export async function createUser(input: DocumentDefinition<IUserInput>) {
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
  const userResult = omit(user.toJSON(), 'password') as IUserDocumentResult;

  return isPasswordMatch ? userResult : false;
}

export async function findUser(query: FilterQuery<IUserDocumentResult>) {
  return await UserModel.findById(query).select('-password').lean();
}

export async function getGoogleOAuthToken(
  code: string
): Promise<IGoogleTokensResult> {
  const googleTokenUrl = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: config.get('googleOAuthClientId'),
    client_secret: config.get('googleOAuthClientSecret'),
    redirect_uri: config.get('googleOAuthRedirectUrl'),
    grant_type: 'authorization_code',
  };

  try {
    const res = await axios.post<IGoogleTokensResult>(
      googleTokenUrl,
      qs.stringify(values),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.data;
  } catch (error: any) {
    log.error(error, 'Failed to fetch google oauth token');
    throw new Error(error.message);
  }
}

export async function getGoogleUser(
  id_token: string,
  access_token: string
): Promise<IGoogleUserResult> {
  try {
    const res = await axios.get<IGoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    log.error(error, 'Failed to get google user');
    throw new Error(error.message);
  }
}

export async function findAndUpdateUser(
  filter: FilterQuery<IUserDocument>,
  update: UpdateQuery<IUserDocument>,
  options: QueryOptions = {}
) {
  const user = await UserModel.findOneAndUpdate(filter, update, options)
    .select('-password')
    .lean<IUserDocumentResult>();

  return user;
}
