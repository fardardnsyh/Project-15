import { BoardColumn, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const removeBoardColumn = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { columnId, unsavedBoardRequestId } = req.query;
    const userId = req.user.id;

    if (!columnId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column ID is required.'
      );
    }

    const boardColumn: BoardColumn | null = await prisma.boardColumn.findUnique(
      {
        where: { id: columnId },
      }
    );

    if (!boardColumn) {
      return respondWithError(
        res,
        HttpStatusCode.NotFound,
        'Board column not found'
      );
    }

    if (boardColumn.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the board column'
      );
    }

    const tempColumn: BoardColumn = await prisma.boardColumn.create({
      data: {
        name: 'Temporary Column',
        color: '',
        isTemporary: true,
        order: 1337,
        userId: userId,
      },
    });

    await prisma.boardColumnItem.updateMany({
      where: { columnId: columnId },
      data: { columnId: tempColumn.id },
    });

    const removedBoardColumn: BoardColumn = await prisma.boardColumn.delete({
      where: { id: columnId },
    });

    if (unsavedBoardRequestId) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          unsavedBoardRequestId: unsavedBoardRequestId,
        },
      });
    }

    res.status(HttpStatusCode.OK).json({ data: { removedBoardColumn } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default removeBoardColumn;
