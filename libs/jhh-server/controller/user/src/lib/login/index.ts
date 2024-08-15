import { HttpStatusCode, User } from '@jhh/shared/domain';

import { PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { createJWT, respondWithError } from '@jhh/jhh-server/shared/utils';
import validateUserPassword from '../utils/validate-user-password';

const login = async (req, res): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { username, password } = req.body;

    if (!username && !password) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Username and password are required.'
      );
    }

    if (!username) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Username is required.'
      );
    }

    if (!password) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Password is required.'
      );
    }

    const user: User | null = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return respondWithError(res, HttpStatusCode.NotFound, 'User not found.');
    }

    const isValidPassword: boolean = await validateUserPassword(
      password,
      user['password']
    );

    if (!isValidPassword) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'Invalid password.'
      );
    }

    const token: string = createJWT(user, process.env.JWT_SECRET);
    delete user['password'];
    delete user['unsavedBoardRequestId'];
    res.status(HttpStatusCode.OK).json({ data: { token, user } });
  } catch (error) {
    console.error(error);

    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default login;
