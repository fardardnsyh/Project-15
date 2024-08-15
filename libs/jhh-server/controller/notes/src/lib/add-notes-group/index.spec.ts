import { JhhServerDb } from '@jhh/jhh-server/db';

import addNotesGroup from '.';

import { HttpStatusCode, NotesGroupFieldLength } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    notesGroup: {
      findUnique: jest.fn().mockResolvedValue(null),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: 1,
          name: 'group',
        })
      ),
    },
  }),
}));

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  respondWithError: jest.fn(),
}));

jest.mock('slugify', () => jest.fn((name) => `slugified-${name}`));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('addNotesGroup', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require a group name', async () => {
    delete req.body.name;
    await addNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Group name is required.'
    );
  });

  it('should enforce name length constraints', async () => {
    req.body.name = 'Sh';
    await addNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      `Group name must be between ${NotesGroupFieldLength.MinNameLength} and ${NotesGroupFieldLength.MaxNameLength} characters`
    );
  });

  it('should not allow consecutive spaces in the group name', async () => {
    req.body.name = 'Valid  Group Name';
    await addNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Group name cannot have consecutive spaces.'
    );
  });

  it('should not allow leading or trailing spaces in the group name', async () => {
    req.body.name = ' Valid Group Name ';
    await addNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Group name cannot have leading or trailing spaces.'
    );
  });

  it('should successfully add a new notes group', async () => {
    req.body.name = 'group';
    await addNotesGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    expect(JhhServerDb().notesGroup.create).toHaveBeenCalledWith(
      expect.any(Object)
    );
  });
});
