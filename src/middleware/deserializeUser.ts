import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../service/session.service';
import { validateJwt } from '../utils/jwt.utils';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken: string = get(req, 'headers.authorization', '');
  let refreshToken: string | string[] = get(req, 'headers.x-refresh', '');

  if (!accessToken) {
    return next();
  }

  if (accessToken.startsWith('Bearer ')) {
    accessToken = accessToken.replace(/^Bearer\s/, '');
    const decodedToken = validateJwt(accessToken);

    if (decodedToken.valid && decodedToken.decoded) {
      res.locals.user = decodedToken.decoded;
    } else if (
      decodedToken.expired &&
      refreshToken &&
      typeof refreshToken === 'string'
    ) {
      const newAccessToken: string | boolean = await reIssueAccessToken(
        refreshToken
      );

      if (newAccessToken) {
        res.setHeader('x-access-token', newAccessToken);
        const result = validateJwt(newAccessToken);
        res.locals.user = result.decoded;
      }
    }
  }

  return next();
};
