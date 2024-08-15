import editNote from '.';

import { HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    note: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 1) {
          return Promise.resolve({
            id: 1,
            name: 'ExistingNote',
            slug: 'existing-note',
            content: 'Existing content',
            groupId: 1,
            userId: 1,
          });
        }
        return Promise.resolve(null);
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        return Promise.resolve({
          id: where.id,
          ...data,
        });
      }),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(null);
      }),
    },
    notesGroup: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 1) {
          return Promise.resolve({
            id: 1,
            userId: 1,
          });
        }
        return Promise.resolve(null);
      }),
    },
  }),
}));

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  respondWithError: jest.fn(),
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('editNote', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        noteId: 1,
        name: 'Updated Note Name',
        slug: 'updated-note-name',
        content: 'Updated content',
        groupId: 1,
      },
      user: { id: 1 },
    };
    res = mockRes();
  });

  it('should require a note ID', async () => {
    delete req.body.noteId;
    await editNote(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Note ID is required.'
    );
  });

  it('should not allow a note name with consecutive spaces', async () => {
    req.body.name = 'Invalid  Name';
    await editNote(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Name and slug cannot have consecutive spaces.'
    );
  });

  it('should not allow a note slug with leading or trailing spaces', async () => {
    req.body.slug = ' updated-note-name ';
    await editNote(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Name and slug cannot have leading or trailing spaces.'
    );
  });

  it('should successfully edit a note', async () => {
    await editNote(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        updatedNote: expect.objectContaining({
          id: 1,
          name: 'Updated Note Name',
          slug: 'updated-note-name',
          content: 'Updated content',
          updatedAt: expect.any(Date),
        }),
      },
    });
  });
});
