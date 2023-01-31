import config from 'config';
import { CookieOptions, Request, Response } from 'express';
import mongoose from 'mongoose';

import {
  createUserSession,
  findSessions,
  updateSession,
} from '../service/session.service';
import {
  findAndUpdateUser,
  getGoogleOAuthToken,
  getGoogleUser,
  validatePassword,
} from '../service/user.service';
import { IGoogleUserResult, IUserDocumentResult } from '../interface/model';
import { signJwt } from '../utils/jwt.utils';

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate user password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).json({ msg: 'invalid email or password' });
  }

  const { accessToken, refreshToken } = await setUserTokensCookie(
    req,
    res,
    user
  );

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

export async function googleOAuthHandler(req: Request, res: Response) {
  // get code from qs sent by google
  const code = req.query.code as string;

  // get id and access token using retrieved code
  const { id_token, access_token } = await getGoogleOAuthToken(code);

  // get user with retrieved tokens
  const googleUser: IGoogleUserResult = await getGoogleUser(
    id_token,
    access_token
  );

  // upsert googleUser to user database
  if (!googleUser.verified_email) {
    return res.status(403).json({
      message: 'Email not verified',
    });
  }

  const user: IUserDocumentResult = await findAndUpdateUser(
    { email: googleUser.email },
    {
      email: googleUser.email,
      name: googleUser.name,
    },
    { upsert: true, new: true }
  );

  // create session and set cookie
  await setUserTokensCookie(req, res, user);

  // redirect back to client
  return res.redirect(config.get('origin'));
}

async function setUserTokensCookie(
  req: Request,
  res: Response,
  user: IUserDocumentResult
) {
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
  const tokenOptions: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    secure: false,
  };

  res.cookie('accessToken', accessToken, tokenOptions);
  res.cookie('refreshToken', refreshToken, tokenOptions);

  return { accessToken, refreshToken };
}
