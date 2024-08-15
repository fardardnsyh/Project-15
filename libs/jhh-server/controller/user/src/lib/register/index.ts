import { PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { createJWT, respondWithError } from '@jhh/jhh-server/shared/utils';
import hashPassword from '../utils/hash-password';
import assignDefaultData from '../utils/assign-default-data';

import { HttpStatusCode, RegisterFieldLength, User } from '@jhh/shared/domain';

const register = async (req, res): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'All fields are required.'
      );
    }

    if (/\s/.test(username)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Username should not contain whitespace'
      );
    }

    if (/\s/.test(password)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Password should not contain whitespace'
      );
    }

    if (
      username.length < RegisterFieldLength.MinUsernameLength ||
      username.length > RegisterFieldLength.MaxUsernameLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Username must be between ${RegisterFieldLength.MinUsernameLength} and ${RegisterFieldLength.MaxUsernameLength} characters`
      );
    }

    if (
      password.length < RegisterFieldLength.MinPasswordLength ||
      password.length > RegisterFieldLength.MaxPasswordLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Password must be between ${RegisterFieldLength.MinPasswordLength} and ${RegisterFieldLength.MaxPasswordLength} characters`
      );
    }

    if (password !== confirmPassword) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Passwords do not match'
      );
    }

    const existingUser: User = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Username already exists'
      );
    }

    const user: User = await prisma.user.create({
      data: {
        username: username,
        password: await hashPassword(password),
        unsavedBoardRequestId: '',
      },
    });

    await assignDefaultData(user.id);

    const token: string = createJWT(user, process.env.JWT_SECRET);
    delete user['password'];
    delete user['unsavedBoardRequestId'];
    res.status(HttpStatusCode.OK).json({ data: { token, user } });
  } catch (err) {
    console.error(err);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default register;
