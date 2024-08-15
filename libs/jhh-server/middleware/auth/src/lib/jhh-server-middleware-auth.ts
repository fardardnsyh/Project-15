import jwt from 'jsonwebtoken';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

export function JhhServerMiddlewareAuth(req, res, next): void {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return respondWithError(res, HttpStatusCode.Unauthorized, 'Not authorized');
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    return respondWithError(
      res,
      HttpStatusCode.Unauthorized,
      'Not valid token'
    );
  }

  try {
    const user: string | jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    return respondWithError(
      res,
      HttpStatusCode.Unauthorized,
      'Not valid token'
    );
  }
}
