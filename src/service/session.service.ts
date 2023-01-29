import { get } from 'lodash';
import config from 'config';
import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';

import { ISessionDocument } from '../interface/session';
import SessionModel from '../model/session.model';
import { signJwt, validateJwt } from '../utils/jwt.utils';
import { findUser } from './user.service';

export async function createUserSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session;
}

export async function findSessions(query: FilterQuery<ISessionDocument>) {
  return await SessionModel.aggregate([{ $match: query }]);
}

export async function updateSession(
  query: FilterQuery<ISessionDocument>,
  update: UpdateQuery<ISessionDocument>
) {
  return await SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken(refreshToken: string) {
  const { decoded } = validateJwt(refreshToken);
  if (!decoded || !get(decoded, 'session', '')) return false;

  const session = await SessionModel.findById(get(decoded, 'session'));
  if (!session || !session.valid) return false;

  const user = await findUser(session.user);
  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('accessTokenTtl') }
  );

  return accessToken;
}
