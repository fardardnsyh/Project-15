import slugify from 'slugify';
import { Note, NotesGroup, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const duplicateNote = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { noteId, groupId } = req.body;
    const userId = req.user.id;

    if (!noteId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Note ID is required.'
      );
    }

    if (!groupId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group ID is required.'
      );
    }

    const existingNote: Note | null = await prisma.note.findUnique({
      where: { id: noteId, groupId: groupId },
    });

    if (!existingNote) {
      return respondWithError(res, HttpStatusCode.NotFound, 'Note not found');
    }

    const notesGroup: NotesGroup | null = await prisma.notesGroup.findUnique({
      where: { id: groupId },
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

    let slug: string = slugify(existingNote.name, {
      lower: true,
      strict: true,
    });
    let suffix: number = 2;
    const originalSlug: string = slug;

    while (await prisma.note.findFirst({ where: { slug, groupId } })) {
      slug = `${originalSlug}-${suffix}`;
      suffix++;
    }

    const duplicatedNote: Note = await prisma.note.create({
      data: {
        name: existingNote.name + ' - copy',
        slug,
        content: existingNote.content,
        groupId,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { duplicatedNote } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default duplicateNote;
