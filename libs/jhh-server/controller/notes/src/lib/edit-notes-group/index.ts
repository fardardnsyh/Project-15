import slugify from 'slugify';
import { NotesGroup, PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode, NotesGroupFieldLength } from '@jhh/shared/domain';

const editNotesGroup = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { groupId, name, slug } = req.body;
    const userId = req.user.id;

    if (!groupId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group ID is required.'
      );
    }

    if (!name || !slug) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Both group name and slug are required.'
      );
    }

    if (/[\s]{2,}/.test(name) || /[\s]{2,}/.test(slug)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group name and slug cannot have consecutive spaces.'
      );
    }

    if (name !== name.trim() || slug !== slug.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group name and slug cannot have leading or trailing spaces.'
      );
    }

    if (
      name.length < NotesGroupFieldLength.MinNameLength ||
      name.length > NotesGroupFieldLength.MaxNameLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Group name must be between ${NotesGroupFieldLength.MinNameLength} and ${NotesGroupFieldLength.MaxNameLength} characters`
      );
    }

    const minSlugLength: NotesGroupFieldLength =
      NotesGroupFieldLength.MinNameLength;
    const maxSlugLength: number =
      NotesGroupFieldLength.MaxNameLength +
      NotesGroupFieldLength.MaxNameAndSlugLengthDiff;

    if (slug.length < minSlugLength || slug.length > maxSlugLength) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Group slug must be between ${minSlugLength} and ${maxSlugLength} characters`
      );
    }

    const slugLengthDifference: number =
      NotesGroupFieldLength.MaxNameAndSlugLengthDiff;
    if (Math.abs(name.length - slug.length) > slugLengthDifference) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `The length of the slug should be within ${slugLengthDifference} characters of the name length.`
      );
    }

    const existingGroup: NotesGroup | null = await prisma.notesGroup.findUnique(
      {
        where: { id: groupId },
      }
    );

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
        'User is not the owner of the notes group'
      );
    }

    const isNameUnique: boolean = !(await prisma.notesGroup.findFirst({
      where: {
        name,
        userId,
        NOT: { id: groupId },
      },
    }));

    if (!isNameUnique) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group name already exists.'
      );
    }

    let updatedSlug: string = slugify(slug, { lower: true, strict: true });
    let suffix: number = 2;
    const originalSlug: string = updatedSlug;

    while (
      await prisma.notesGroup.findFirst({
        where: {
          slug: updatedSlug,
          userId,
          NOT: { id: groupId },
        },
      })
    ) {
      updatedSlug = `${originalSlug}-${suffix}`;
      suffix++;
    }

    const editedNotesGroup = await prisma.notesGroup.update({
      where: { id: groupId },
      data: {
        name,
        slug: updatedSlug,
      },
      include: {
        notes: true,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { editedNotesGroup } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default editNotesGroup;
