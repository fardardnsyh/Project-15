import { BoardColumn, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { BoardColumnFieldLength, HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const updateBoardColumns = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { columnsToUpdate, removedItemIds, unsavedBoardRequestId } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(columnsToUpdate)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid input format: columnsToUpdate should be an array.'
      );
    }

    if (!Array.isArray(removedItemIds)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid input format: removedItemIds should be an array.'
      );
    }

    if (removedItemIds && removedItemIds.length) {
      await prisma.boardColumnItem.deleteMany({
        where: {
          id: {
            in: removedItemIds,
          },
        },
      });
    }

    for (const column of columnsToUpdate) {
      const existingColumn: BoardColumn | null =
        await prisma.boardColumn.findUnique({
          where: { id: column.id },
          include: {
            items: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        });

      if (!existingColumn) {
        return respondWithError(
          res,
          HttpStatusCode.NotFound,
          `Board column with ID ${column.id} not found.`
        );
      }

      if (existingColumn.userId !== userId) {
        return respondWithError(
          res,
          HttpStatusCode.Unauthorized,
          'User is not the owner of the board column.'
        );
      }

      await prisma.boardColumn.update({
        where: { id: column.id },
        data: {
          order: column.order,
        },
      });

      if (column.items.length) {
        for (const item of column.items) {
          if (
            item.content.length > BoardColumnFieldLength.MaxColumnItemLength
          ) {
            return respondWithError(
              res,
              HttpStatusCode.BadRequest,
              `Content too long for item with ID ${item.id}. Maximum length is ${BoardColumnFieldLength.MaxColumnItemLength} characters.`
            );
          }

          if (item.id.startsWith('temp-')) {
            await prisma.boardColumnItem.create({
              data: {
                content: item.content,
                columnId: column.id,
                order: item.order,
              },
            });
          } else {
            await prisma.boardColumnItem.update({
              where: { id: item.id },
              data: {
                content: item.content,
                columnId: column.id,
                order: item.order,
              },
            });
          }
        }
      }
    }

    const tempColumns: BoardColumn[] = await prisma.boardColumn.findMany({
      where: { userId: userId, isTemporary: true },
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (tempColumns?.length) {
      for (const tempColumn of tempColumns) {
        await prisma.boardColumnItem.deleteMany({
          where: {
            columnId: tempColumn.id,
          },
        });

        await prisma.boardColumn.delete({
          where: { id: tempColumn.id },
        });
      }
    }

    const updatedColumns: BoardColumn[] = await prisma.boardColumn.findMany({
      where: { id: { in: columnsToUpdate.map((c) => c.id) } },
      orderBy: {
        order: 'asc',
      },
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
      },
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

    res.status(HttpStatusCode.OK).json({ data: { updatedColumns } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default updateBoardColumns;
