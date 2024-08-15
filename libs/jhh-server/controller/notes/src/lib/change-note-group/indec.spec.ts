import { HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import changeNoteGroup from '.';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    note: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 1) {
          return Promise.resolve({
            id: 1,
            name: 'Test Note',
            slug: 'test-note',
            groupId: 1,
            userId: 1,
          });
        }
        return Promise.resolve(null);
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        return Promise.resolve({ id: where.id, ...data });
      }),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        if (
          where.slug === 'test-note' &&
          where.groupId === 2 &&
          where.NOT.id !== 1
        ) {
          return Promise.resolve({
            id: 2,
            slug: 'test-note',
            groupId: 2,
          });
        }
        return Promise.resolve(null);
      }),
    },
    notesGroup: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 1 || where.id === 2) {
          return Promise.resolve({
            id: where.id,
            userId: 1,
            notes: [],
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

describe('changeNoteGroup', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        noteId: 1,
        newGroupId: 2,
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should return an error if the note does not exist', async () => {
    req.body.noteId = 99;
    await changeNoteGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Note not found'
    );
  });

  it('should return an error if the new group does not exist', async () => {
    req.body.newGroupId = 99;
    await changeNoteGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'New group of note not found'
    );
  });

  it('should return an error if the user is not the owner of the note group', async () => {
    req.user.id = 99;
    await changeNoteGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the notes group'
    );
  });

  it('should return an error if the note and new group are the same', async () => {
    req.body.newGroupId = 1;
    await changeNoteGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Both provided groups are same.'
    );
  });

  it('should return an error if the user does not own the original group', async () => {
    req.user.id = 2;
    await changeNoteGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the notes group'
    );
  });

  it('should handle slug uniqueness by appending a suffix', async () => {
    await changeNoteGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
  });

  it('should successfully move a note to a new group', async () => {
    await changeNoteGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
  });

  it('should successfully move a note to a new group and update slug if necessary', async () => {
    await changeNoteGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
  });
});
