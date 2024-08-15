import { Note, NotesGroup, PrismaClient } from '@prisma/client';
import slugify from 'slugify';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const changeNoteGroup = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { noteId, newGroupId } = req.body;
    const userId = req.user.id;

    if (!noteId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Note ID is required.'
      );
    }

    if (!newGroupId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'New group ID is required.'
      );
    }

    const existingNote: Note | null = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (existingNote?.groupId === newGroupId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Both provided groups are same.'
      );
    }

    if (!existingNote) {
      return respondWithError(res, HttpStatusCode.NotFound, 'Note not found');
    }

    const previousGroup: NotesGroup | null = await prisma.notesGroup.findUnique(
      {
        where: { id: existingNote.groupId },
        include: {
          notes: true,
        },
      }
    );

    if (!previousGroup) {
      return respondWithError(
        res,
        HttpStatusCode.NotFound,
        'Group of note not found'
      );
    }

    if (previousGroup.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the notes group'
      );
    }

    const newGroup: NotesGroup | null = await prisma.notesGroup.findUnique({
      where: { id: newGroupId },
      include: {
        notes: true,
      },
    });

    if (!newGroup) {
      return respondWithError(
        res,
        HttpStatusCode.NotFound,
        'New group of note not found'
      );
    }

    if (newGroup.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the new notes group'
      );
    }

    await prisma.note.update({
      where: { id: noteId },
      data: {
        groupId: newGroupId,
      },
    });

    let movedNote: Note | null = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (movedNote) {
      const isSlugUnique: boolean =
        (await prisma.note.findFirst({
          where: {
            slug: movedNote.slug,
            groupId: newGroupId,
            NOT: {
              id: noteId,
            },
          },
        })) === null;

      if (!isSlugUnique) {
        let newSlug: string = slugify(movedNote.name, {
          lower: true,
          strict: true,
        });
        let suffix: number = 1;
        let uniqueSlugFound: boolean = false;

        while (!uniqueSlugFound) {
          const existingNoteWithSlug = await prisma.note.findFirst({
            where: {
              slug: newSlug,
              groupId: newGroupId,
            },
          });

          if (existingNoteWithSlug) {
            suffix++;
            newSlug = `${newSlug}-${suffix}`;
          } else {
            uniqueSlugFound = true;
          }
        }

        await prisma.note.update({
          where: { id: noteId },
          data: { slug: newSlug },
        });

        movedNote = await prisma.note.findUnique({
          where: { id: noteId },
        });
      }
    }

    const updatedPreviousGroup: NotesGroup | null =
      await prisma.notesGroup.findUnique({
        where: { id: existingNote.groupId },
        include: {
          notes: true,
        },
      });

    const updatedNewGroup: NotesGroup | null =
      await prisma.notesGroup.findUnique({
        where: { id: newGroupId },
        include: {
          notes: true,
        },
      });

    res.status(HttpStatusCode.OK).json({
      data: {
        movedNote: movedNote,
        previousGroup: updatedPreviousGroup,
        newGroup: updatedNewGroup,
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

export default changeNoteGroup;
