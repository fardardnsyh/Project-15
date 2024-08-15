import { Note, NotesGroup, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const removeNote = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { noteId } = req.query;
    const userId = req.user.id;

    if (!noteId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Note ID is required.'
      );
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      select: {
        groupId: true,
      },
    });

    if (!note) {
      return respondWithError(res, HttpStatusCode.NotFound, 'Note not found');
    }

    const notesGroup: NotesGroup | null = await prisma.notesGroup.findUnique({
      where: { id: note.groupId },
    });

    if (!notesGroup) {
      return respondWithError(
        res,
        HttpStatusCode.NotFound,
        'Group of note not found'
      );
    }

    if (notesGroup.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the notes group'
      );
    }

    const removedNote: Note = await prisma.note.delete({
      where: { id: noteId },
    });

    res.status(HttpStatusCode.OK).json({ data: { removedNote } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default removeNote;
