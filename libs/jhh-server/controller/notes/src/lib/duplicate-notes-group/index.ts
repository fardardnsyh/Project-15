import { PrismaClient } from '@prisma/client';
import { HttpStatusCode } from '@jhh/shared/domain';
import { respondWithError } from '@jhh/jhh-server/shared/utils';
import { JhhServerDb } from '@jhh/jhh-server/db';
import slugify from 'slugify';

const duplicateNotesGroup = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { groupId } = req.body;
    const userId = req.user.id;

    if (!groupId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Notes group ID is required.'
      );
    }

    const existingGroup = await prisma.notesGroup.findUnique({
      where: { id: groupId },
      include: { notes: true },
    });

    if (!existingGroup) {
      return respondWithError(
        res,
        HttpStatusCode.NotFound,
        'Notes group not found'
      );
    }

    if (existingGroup.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the notes group.'
      );
    }

    let newName: string = existingGroup.name + ' - copy';
    let nameSuffix: number = 2;

    while (
      await prisma.notesGroup.findFirst({ where: { name: newName, userId } })
    ) {
      newName = `${existingGroup.name} - copy ${nameSuffix}`;
      nameSuffix++;
    }

    let groupSlug: string = slugify(newName, {
      lower: true,
      strict: true,
    });
    let groupSuffix: number = 2;
    const groupOriginalSlug: string = groupSlug;

    while (
      await prisma.notesGroup.findFirst({ where: { slug: groupSlug, userId } })
    ) {
      groupSlug = `${groupOriginalSlug}-${groupSuffix}`;
      groupSuffix++;
    }

    const duplicatedGroupWithoutNotes = await prisma.notesGroup.create({
      data: {
        name: newName,
        slug: groupSlug,
        userId: userId,
      },
    });

    for (const note of existingGroup.notes) {
      let noteSlug: string = slugify(note.name, { lower: true, strict: true });
      let noteSuffix: number = 2;
      const noteOriginalSlug: string = noteSlug;

      while (
        await prisma.note.findFirst({
          where: { slug: noteSlug, groupId: duplicatedGroupWithoutNotes.id },
        })
      ) {
        noteSlug = `${noteOriginalSlug}-${noteSuffix}`;
        noteSuffix++;
      }

      await prisma.note.create({
        data: {
          name: note.name,
          slug: noteSlug,
          content: note.content,
          groupId: duplicatedGroupWithoutNotes.id,
        },
      });
    }

    const duplicatedNotesGroup = await prisma.notesGroup.findUnique({
      where: { id: duplicatedGroupWithoutNotes.id },
      include: {
        notes: true,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { duplicatedNotesGroup } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default duplicateNotesGroup;
