import { PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

const removeAccount = async (req, res): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const userId = req.user.id;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return respondWithError(res, HttpStatusCode.NotFound, 'User not found.');
    }

    await prisma.$transaction(async (prisma) => {
      const notesGroups = await prisma.notesGroup.findMany({
        where: { userId },
        select: { id: true },
      });
      const notesGroupIds = notesGroups.map((group) => group.id);
      if (notesGroupIds.length) {
        await prisma.note.deleteMany({
          where: { groupId: { in: notesGroupIds } },
        });
      }

      await prisma.notesGroup.deleteMany({
        where: { userId },
      });

      const boardColumns: { id: string }[] = await prisma.boardColumn.findMany({
        where: { userId },
        select: { id: true },
      });
      const boardColumnIds: string[] = boardColumns.map((column) => column.id);

      if (boardColumnIds.length) {
        await prisma.boardColumnItem.deleteMany({
          where: { columnId: { in: boardColumnIds } },
        });
      }

      await prisma.boardColumn.deleteMany({
        where: { userId },
      });

      await prisma.offer.deleteMany({
        where: { userId },
      });

      await prisma.scheduleEvent.deleteMany({
        where: { userId },
      });

      const quizzes: { id: string }[] = await prisma.quiz.findMany({
        where: { userId },
        select: { id: true },
      });
      const quizzesIds: string[] = quizzes.map((quiz) => quiz.id);

      if (quizzesIds.length) {
        await prisma.quizResults.deleteMany({
          where: { quizId: { in: quizzesIds } },
        });
      }

      await prisma.quiz.deleteMany({
        where: { userId },
      });

      await prisma.user.delete({
        where: { id: userId },
      });
    });

    res.status(HttpStatusCode.OK).json({ data: { removedAccountId: userId } });
  } catch (error) {
    console.error(error);

    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default removeAccount;
