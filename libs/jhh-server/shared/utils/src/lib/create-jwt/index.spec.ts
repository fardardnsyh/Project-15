// @ts-ignore
import jwt from 'jsonwebtoken';

import { createJWT } from '.';

// @ts-ignore
import { User } from '@jhh/shared/domain';

jest.mock('jsonwebtoken');

describe('createJWT', () => {
  const mockUser: User = {
    id: '1',
    username: 'username',
  } as User;

  const mockSecret = 'secret';
  process.env['JWT_SECRET'] = mockSecret;

  beforeEach(() => {
    (jwt.sign as jest.Mock).mockClear();
  });

  it('should return a JWT token', () => {
    const token = 'mockToken';
    (jwt.sign as jest.Mock).mockReturnValue(token);

    const result = createJWT(mockUser, mockSecret);
    expect(result).toBe(token);
  });

  it('should call jwt.sign with correct parameters', () => {
    createJWT(mockUser, mockSecret);

    expect(jwt.sign as jest.Mock).toHaveBeenCalledWith(
      {
        id: mockUser.id,
        username: mockUser.username,
      },
      mockSecret,
      { expiresIn: '3d' }
    );
  });
});
