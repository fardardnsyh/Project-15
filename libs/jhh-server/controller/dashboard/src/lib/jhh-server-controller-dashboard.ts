import { Offer, PrismaClient, Quiz, ScheduleEvent } from '@prisma/client';

import { createJWT, respondWithError } from '@jhh/jhh-server/shared/utils';

import {
  BoardColumn,
  HttpStatusCode,
  NotesGroup,
  User,
} from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

export function JhhServerControllerDashboard() {
  const prisma: PrismaClient = JhhServerDb();
  const loadAssignedData = async (req: any, res: any): Promise<void> => {
    try {
      const userId = req.user.id;

      const existingUser: User | null = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return respondWithError(
          res,
          HttpStatusCode.NotFound,
          'User not found.'
        );
      }

      const unsavedBoardRequestId = existingUser.unsavedBoardRequestId;

      const notesGroups: NotesGroup[] = await prisma.notesGroup.findMany({
        where: {
          userId: userId,
        },
        include: {
          notes: true,
        },
      });

      const boardColumns: BoardColumn[] = await prisma.boardColumn.findMany({
        where: {
          userId: userId,
          isTemporary: false,
        },
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

      const offers: Offer[] = await prisma.offer.findMany({
        where: {
          userId: userId,
        },
      });

      const scheduleEvents: ScheduleEvent[] =
        await prisma.scheduleEvent.findMany({
          where: {
            userId: userId,
          },
        });

      const practiceQuizzes: Quiz[] = await prisma.quiz.findMany({
        where: {
          userId: userId,
        },
        include: {
          results: true,
        },
      });

      const newToken: string = createJWT(existingUser, process.env.JWT_SECRET);

      delete existingUser['password'];
      res.status(HttpStatusCode.OK).json({
        data: {
          user: existingUser,
          newToken,
          notesGroups,
          boardColumns,
          offers,
          scheduleEvents,
          practiceQuizzes,
          unsavedBoardRequestId,
        },
      });
    } catch (error) {
      console.error(error);
      return respondWithError(
        res,
        HttpStatusCode.InternalServerError,
        'Internal Server Error'
      );
    }
  };

  return {
    loadAssignedData,
  };
}
