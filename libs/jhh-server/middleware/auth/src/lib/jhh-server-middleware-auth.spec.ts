import jwt from 'jsonwebtoken';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerMiddlewareAuth } from './jhh-server-middleware-auth';

jest.mock('jsonwebtoken');
jest.mock('@jhh/jhh-server/shared/utils');

describe('JhhServerMiddlewareAuth', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
      user: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should respond with Unauthorized if no authorization header is present', () => {
    JhhServerMiddlewareAuth(req, res, next);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'Not authorized'
    );
  });

  it('should respond with Unauthorized if token is not valid', () => {
    req.headers.authorization = 'Bearer ';
    JhhServerMiddlewareAuth(req, res, next);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'Not valid token'
    );
  });

  it('should call next() if token is valid', () => {
    req.headers.authorization = 'Bearer someValidToken';
    (jwt.verify as jest.Mock).mockReturnValue({ some: 'payload' });

    JhhServerMiddlewareAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ some: 'payload' });
  });

  it('should respond with Unauthorized if token verification fails', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    req.headers.authorization = 'Bearer someInvalidToken';
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    JhhServerMiddlewareAuth(req, res, next);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'Not valid token'
    );

    consoleErrorSpy.mockRestore();
  });
});
