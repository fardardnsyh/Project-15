import { PrismaClient, ScheduleEvent } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { regex } from '@jhh/shared/regex';

import { EventFieldLength, HttpStatusCode } from '@jhh/shared/domain';

const editEvent = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { eventId, start, end, title, color, description } = req.body;
    const userId = req.user.id;

    if (!eventId || !start || !end || !title || !color) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'These fields are required: eventID, startDate, endDate, title, color'
      );
    }

    if (/[\s]{2,}/.test(title)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Title cannot have consecutive spaces.'
      );
    }

    if (title !== title.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Title cannot have leading or trailing spaces.'
      );
    }

    if (
      title.length < EventFieldLength.MinTitleLength ||
      title.length > EventFieldLength.MaxTitleLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Title must be between ${EventFieldLength.MinTitleLength} and ${EventFieldLength.MaxTitleLength} characters`
      );
    }

    if (
      description &&
      description.length > EventFieldLength.MaxDescriptionLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Description can have max ${EventFieldLength.MaxDescriptionLength} characters`
      );
    }

    if (!regex.color.test(color)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid color format. Color should be a valid hex code.'
      );
    }

    const startDate: Date = new Date(start);
    const endDate: Date = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid date format. Please provide valid startDate and endDate.'
      );
    }

    if (endDate <= startDate) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'endDate must be later than startDate.'
      );
    }

    const existingEvent: ScheduleEvent | null =
      await prisma.scheduleEvent.findUnique({
        where: { id: eventId },
      });

    if (!existingEvent) {
      return respondWithError(res, HttpStatusCode.NotFound, 'Event not found');
    }

    if (existingEvent.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the event'
      );
    }

    const editedEvent: ScheduleEvent = await prisma.scheduleEvent.update({
      where: { id: eventId },
      data: {
        start: startDate,
        end: endDate,
        title: title,
        color: color,
        description: description,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { editedEvent } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default editEvent;
