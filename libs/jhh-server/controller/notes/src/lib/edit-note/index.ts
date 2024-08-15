import slugify from 'slugify';
import { Note, NotesGroup, PrismaClient } from '@prisma/client';
import createDOMPurify, { DOMPurifyI } from 'dompurify';
import { JSDOM } from 'jsdom';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode, NoteFieldLength, NoteSize } from '@jhh/shared/domain';

import { domPurifyConfig } from '@jhh/shared/dom-purify-config';

import { JhhServerDb } from '@jhh/jhh-server/db';

const window = new JSDOM('').window;

const DOMPurify: DOMPurifyI = createDOMPurify(window);

const editNote = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    let { noteId, name, slug, content, groupId } = req.body;
    const userId = req.user.id;

    if (!noteId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Note ID is required.'
      );
    }

    if (!name) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Note name is required.'
      );
    }

    if (!slug) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Note slug is required.'
      );
    }

    if (!groupId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Group ID is required.'
      );
    }

    if (/[\s]{2,}/.test(name) || /[\s]{2,}/.test(slug)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Name and slug cannot have consecutive spaces.'
      );
    }

    if (name !== name.trim() || slug !== slug.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Name and slug cannot have leading or trailing spaces.'
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

    const minSlugLength: NoteFieldLength = NoteFieldLength.MinNameLength;
    const maxSlugLength: number =
      NoteFieldLength.MaxNameLength + NoteFieldLength.MaxNameAndSlugLengthDiff;

    if (slug.length < minSlugLength || slug.length > maxSlugLength) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Note slug must be between ${minSlugLength} and ${maxSlugLength} characters`
      );
    }

    const slugLengthDifference: number =
      NoteFieldLength.MaxNameAndSlugLengthDiff;
    if (Math.abs(name.length - slug.length) > slugLengthDifference) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `The length of the slug should be within ${slugLengthDifference} characters of the name length.`
      );
    }

    const existingNote: Note | null = await prisma.note.findUnique({
      where: { id: noteId },
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

    if (content && Buffer.from(content).length > NoteSize.MaxNoteSize) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Note content exceeds the maximum allowed size of ${
          NoteSize.MaxNoteSize / (1024 * 1024)
        } MB.`
      );
    }

    content = DOMPurify.sanitize(content, domPurifyConfig);

    let updatedSlug: string = slugify(slug, { lower: true, strict: true });
    let suffix: number = 2;
    const originalSlug: string = updatedSlug;

    while (true) {
      const existingNoteWithSlug = await prisma.note.findFirst({
        where: {
          slug: updatedSlug,
          groupId: groupId,
          id: {
            not: noteId,
          },
        },
      });

      if (!existingNoteWithSlug) {
        break;
      } else {
        updatedSlug = `${originalSlug}-${suffix++}`;
      }
    }

    const updateNote = async () => {
      if (
        existingNote.name !== name ||
        existingNote.content !== content ||
        existingNote.slug !== updatedSlug
      ) {
        return await prisma.note.update({
          where: { id: noteId },
          data: {
            name: name,
            slug: updatedSlug,
            content: content,
            updatedAt: new Date(),
          },
        });
      } else {
        return existingNote;
      }
    };

    const updatedNote: Note = await updateNote();

    res.status(HttpStatusCode.OK).json({ data: { updatedNote } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default editNote;
