import { BoardColumn, PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { regex } from '@jhh/shared/regex';

import { BoardColumnFieldLength, HttpStatusCode } from '@jhh/shared/domain';

const editBoardColumn = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { columnId, name, color } = req.body;
    const userId = req.user.id;

    if (!columnId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column ID is required.'
      );
    }

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

    const existingColumn: BoardColumn | null =
      await prisma.boardColumn.findUnique({
        where: { id: columnId },
      });

    if (!existingColumn) {
      return respondWithError(
        res,
        HttpStatusCode.NotFound,
        'Board column not found'
      );
    }

    if (existingColumn.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the board column'
      );
    }

    const editedBoardColumn: BoardColumn = await prisma.boardColumn.update({
      where: { id: columnId },
      data: {
        name,
        color,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { editedBoardColumn } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default editBoardColumn;
