import config from 'config';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import {
  createUserSession,
  findSessions,
  updateSession,
} from '../service/session.service';
import { validatePassword } from '../service/user.service';
import { signJwt } from '../utils/jwt.utils';

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate user password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).json({ msg: 'invalid email or password' });
  }

  // create a session
  const session = await createUserSession(
    user._id,
    req.get('user-agent') || ''
  );

  // create an access & refresh token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('accessTokenTtl') }
  );

  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('refreshTokenTtl') }
  );

  // cookie expires in one year, but the value(accessToken) itself will only lasts for 15 min
  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    secure: false,
  });

  res.cookie('refreshToken', refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    secure: false,
  });

  // return acess & refresh token
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = new mongoose.Types.ObjectId(res.locals.user._id);

  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}

export async function updateUserSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.json({
    accessToken: null,
    refreshToken: null,
  });
}
