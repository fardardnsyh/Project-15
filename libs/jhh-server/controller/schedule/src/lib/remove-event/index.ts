import { PrismaClient, ScheduleEvent } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const removeEvent = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { eventId } = req.query;
    const userId = req.user.id;

    if (!eventId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Event ID is required.'
      );
    }

    const event: ScheduleEvent | null = await prisma.scheduleEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return respondWithError(res, HttpStatusCode.NotFound, 'Event not found');
    }

    if (event.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the event'
      );
    }

    const removedEvent: ScheduleEvent = await prisma.scheduleEvent.delete({
      where: { id: eventId },
    });

    res.status(HttpStatusCode.OK).json({ data: { removedEvent } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default removeEvent;
