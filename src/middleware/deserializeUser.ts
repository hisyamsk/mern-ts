import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../service/session.service';
import { validateJwt } from '../utils/jwt.utils';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken: string =
    get(req, 'cookies.accessToken', '') ||
    get(req, 'headers.authorization', '') ||
    get(req, 'headers.x-access-token', '');

  let refreshToken: string =
    get(req, 'cookies.refreshToken') || get(req, 'headers.x-refresh', '');

  if (!accessToken) {
    return next();
  }

  accessToken = accessToken.replace(/^Bearer\s/, '');
  const decodedToken = validateJwt(accessToken);

  if (decodedToken.valid && decodedToken.decoded) {
    res.locals.user = decodedToken.decoded;
  } else if (decodedToken.expired && refreshToken) {
    const newAccessToken: string | boolean = await reIssueAccessToken(
      refreshToken
    );
    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
      res.cookie('accessToken', newAccessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        secure: false,
      });
      const result = validateJwt(newAccessToken);
      res.locals.user = result.decoded;
    }
  }

  return next();
};
