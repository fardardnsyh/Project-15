import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode, NotesGroupFieldLength } from '@jhh/shared/domain';

const addNotesGroup = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group name is required.'
      );
    }

    if (/[\s]{2,}/.test(name)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group name cannot have consecutive spaces.'
      );
    }

    if (name !== name.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group name cannot have leading or trailing spaces.'
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

    const existingGroup = await prisma.notesGroup.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (existingGroup) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group name already exists.'
      );
    }

    let slug: string = slugify(name, { lower: true, strict: true });
    let suffix: number = 2;
    const originalSlug: string = slug;

    while (await prisma.notesGroup.findFirst({ where: { slug, userId } })) {
      slug = `${originalSlug}-${suffix}`;
      suffix++;
    }

    const newNotesGroup = await prisma.notesGroup.create({
      data: {
        name,
        slug,
        userId,
      },
      include: {
        notes: true,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { newNotesGroup } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default addNotesGroup;
