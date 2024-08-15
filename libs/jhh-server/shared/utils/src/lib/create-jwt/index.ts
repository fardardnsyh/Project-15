import jwt from 'jsonwebtoken';

import { User } from '@jhh/shared/domain';

export function createJWT(user: User, secret: string): string {
  const token: string = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    secret,
    { expiresIn: '3d' }
  );

  return token;
}
