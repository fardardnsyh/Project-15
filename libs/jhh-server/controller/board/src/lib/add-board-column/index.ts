import { BoardColumn, PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { regex } from '@jhh/shared/regex';

import { BoardColumnFieldLength, HttpStatusCode } from '@jhh/shared/domain';

const addBoardColumn = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { name, color } = req.body;
    const userId = req.user.id;

    if (!name) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column name is required.'
      );
    }

    if (/[\s]{2,}/.test(name)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column name cannot have consecutive spaces.'
      );
    }

    if (name !== name.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column name cannot have leading or trailing spaces.'
      );
    }

    if (
      name.length < BoardColumnFieldLength.MinColumnNameLength ||
      name.length > BoardColumnFieldLength.MaxColumnNameLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Board column name must be between ${BoardColumnFieldLength.MinColumnNameLength} and ${BoardColumnFieldLength.MaxColumnNameLength} characters`
      );
    }

    if (!color) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column color is required.'
      );
    }

    if (!regex.color.test(color)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid color format. Color should be a valid hex code.'
      );
    }

    const maxOrderColumn = await prisma.boardColumn.aggregate({
      _max: {
        order: true,
      },
      where: {
        userId,
      },
    });
    const newOrder: number = (maxOrderColumn._max.order ?? 0) + 1;

    const newBoardColumn: BoardColumn = await prisma.boardColumn.create({
      data: {
        name,
        color,
        order: newOrder,
        userId,
      },
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { newBoardColumn } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default addBoardColumn;
