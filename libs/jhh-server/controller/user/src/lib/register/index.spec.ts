import register from '.';

import { HttpStatusCode } from '@jhh/shared/domain';
import hashPassword from '../utils/hash-password';
import assignDefaultData from '../utils/assign-default-data';

import { createJWT, respondWithError } from '@jhh/jhh-server/shared/utils';

const mockCreate = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    user: {
      create: mockCreate,
      findUnique: mockFindUnique,
    },
  })),
}));

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  respondWithError: jest.fn(),
  createJWT: jest.fn(() => 'mockToken'),
}));

jest.mock('../utils/hash-password', () => jest.fn(() => 'hashedPassword'));
jest.mock('../utils/assign-default-data', () => jest.fn());

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('register', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        username: 'testUser',
        password: 'testPassword',
        confirmPassword: 'testPassword',
      },
    };
    res = mockRes();
  });

  it('should require all fields', async () => {
    delete req.body.username;
    await register(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'All fields are required.'
    );
  });

  it('should not allow whitespace in username and password', async () => {
    req.body.username = 'test User';
    req.body.password = 'test Password';
    await register(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Username should not contain whitespace'
    );
  });

  it('should enforce username length constraints', async () => {
    req.body.username = 'us';
    await register(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      expect.any(String)
    );
  });

  it('passwords do not match', async () => {
    req.body.confirmPassword = 'differentPassword';
    await register(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Passwords do not match'
    );
  });

  it('should reject registration if username already exists', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: '1', username: 'testUser' });
    await register(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Username already exists'
    );
  });

  it('should successfully register a new user', async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValueOnce({
      id: '1',
      username: 'testUser',
    });

    await register(req, res);

    expect(hashPassword).toHaveBeenCalledWith('testPassword');
    expect(assignDefaultData).toHaveBeenCalledWith('1');
    expect(createJWT).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything()
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          token: 'mockToken',
        }),
      })
    );
  });
});
