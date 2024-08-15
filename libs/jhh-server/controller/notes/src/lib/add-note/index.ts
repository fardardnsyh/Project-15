import slugify from 'slugify';
import createDOMPurify, { DOMPurifyI } from 'dompurify';
import { Note, NotesGroup, PrismaClient } from '@prisma/client';
import { JSDOM } from 'jsdom';

import { HttpStatusCode, NoteFieldLength, NoteSize } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { domPurifyConfig } from '@jhh/shared/dom-purify-config';
import { JhhServerDb } from '@jhh/jhh-server/db';

const window = new JSDOM('').window;

const DOMPurify: DOMPurifyI = createDOMPurify(window);

const addNote = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    let { name, content, groupId } = req.body;
    const userId = req.user.id;

    if (!name) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Note name is required.'
      );
    }

    if (!groupId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group ID is required.'
      );
    }

    if (/[\s]{2,}/.test(name)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Note name cannot have consecutive spaces.'
      );
    }

    if (name !== name.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Note name cannot have leading or trailing spaces.'
      );
    }

    if (
      name.length < NoteFieldLength.MinNameLength ||
      name.length > NoteFieldLength.MaxNameLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Note name must be between ${NoteFieldLength.MinNameLength} and ${NoteFieldLength.MaxNameLength} characters`
      );
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

    if (content && Buffer.from(content).length > NoteSize.MaxNoteSize) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Note content exceeds the maximum allowed size of ${
          NoteSize.MaxNoteSize / (1024 * 1024)
        } MB.`
      );
    }

    let slug: string = slugify(name, { lower: true, strict: true });
    let suffix: number = 2;
    const originalSlug: string = slug;

    while (await prisma.note.findFirst({ where: { slug, groupId } })) {
      slug = `${originalSlug}-${suffix}`;
      suffix++;
    }

    content = DOMPurify.sanitize(content, domPurifyConfig);

    const newNote: Note = await prisma.note.create({
      data: {
        name,
        slug,
        content,
        groupId,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { newNote } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default addNote;
