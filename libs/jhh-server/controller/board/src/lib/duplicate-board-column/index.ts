import { BoardColumn, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { BoardColumnFieldLength, HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const duplicateBoardColumn = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { columnId, items } = req.body;
    const userId = req.user.id;

    if (!columnId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column ID is required.'
      );
    }

    if (!items) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board items array is required.'
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
        'User is not the owner of the board column.'
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

    const duplicatedBoardColumnWithoutItems: BoardColumn =
      await prisma.boardColumn.create({
        data: {
          name: existingColumn.name + ' - copy',
          color: existingColumn.color,
          order: newOrder,
          userId: userId,
        } as BoardColumn,
      });

    if (items.length) {
      for (const item of items) {
        if (item.content.length > BoardColumnFieldLength.MaxColumnItemLength) {
          return respondWithError(
            res,
            HttpStatusCode.BadRequest,
            `Content too long for item with ID ${item.id}. Maximum length is ${BoardColumnFieldLength.MaxColumnItemLength} characters.`
          );
        }

        if (item.columnId !== existingColumn.id) {
          return respondWithError(
            res,
            HttpStatusCode.NotFound,
            'Invalid column ID of column item.'
          );
        }

        await prisma.boardColumnItem.create({
          data: {
            content: item.content,
            columnId: duplicatedBoardColumnWithoutItems.id,
            order: item.order,
          },
        });
      }
    }

    const duplicatedBoardColumn: BoardColumn =
      (await prisma.boardColumn.findUnique({
        where: { id: duplicatedBoardColumnWithoutItems.id },
        include: {
          items: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      })) as BoardColumn;

    res.status(HttpStatusCode.OK).json({ data: { duplicatedBoardColumn } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default duplicateBoardColumn;
