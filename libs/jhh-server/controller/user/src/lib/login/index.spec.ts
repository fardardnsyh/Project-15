import login from '.';
import { HttpStatusCode } from '@jhh/shared/domain';
import { createJWT, respondWithError } from '@jhh/jhh-server/shared/utils';
import validateUserPassword from '../utils/validate-user-password';

const mockFindUnique = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: mockFindUnique,
    },
  })),
}));

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  respondWithError: jest.fn(),
  createJWT: jest.fn(() => 'mockToken'),
}));

jest.mock('../utils/validate-user-password');

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('login', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {
        username: 'testUser',
        password: 'testPassword',
      },
    };

    res = mockRes();
  });

  it('should require username and password', async () => {
    delete req.body.username;
    delete req.body.password;
    await login(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Username and password are required.'
    );
  });

  it('should handle user not found', async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    await login(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'User not found.'
    );
  });

  it('should reject invalid password', async () => {
    mockFindUnique.mockResolvedValueOnce({
      username: 'testUser',
      password: 'hashedPassword',
    });
    (validateUserPassword as jest.Mock).mockResolvedValue(false);

    await login(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'Invalid password.'
    );
  });

  it('should successfully login and return a token', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: 1,
      username: 'testUser',
      password: 'hashedPassword',
    });
    (validateUserPassword as jest.Mock).mockResolvedValue(true);

    await login(req, res);

    expect(createJWT).toHaveBeenCalledWith(
      expect.anything(),
      process.env.JWT_SECRET
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
