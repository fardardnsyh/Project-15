import { NotesGroup, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const removeNotesGroup = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { groupId } = req.query;
    const userId = req.user.id;

    if (!groupId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group ID is required.'
      );
    }

    const notesGroup: NotesGroup | null = await prisma.notesGroup.findUnique({
      where: { id: groupId },
    });

    if (!notesGroup) {
      return respondWithError(
        res,
        HttpStatusCode.NotFound,
        'Notes group not found'
      );
    }

    if (notesGroup.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the notes group'
      );
    }

    await prisma.note.deleteMany({
      where: { groupId },
    });

    const removedNotesGroup: NotesGroup = await prisma.notesGroup.delete({
      where: { id: groupId },
    });

    res.status(HttpStatusCode.OK).json({ data: { removedNotesGroup } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default removeNotesGroup;
