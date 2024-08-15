import editNotesGroup from '.';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    notesGroup: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 1) {
          return Promise.resolve({
            id: 1,
            name: 'ExistingGroup',
            slug: 'existing-group',
            userId: 1,
          });
        }
        return Promise.resolve(null);
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        return Promise.resolve({
          id: where.id,
          ...data,
          notes: [],
        });
      }),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        if (where.slug && where.slug === 'existing-group') {
          return Promise.resolve(null);
        } else if (where.name && where.name === 'ExistingGroup') {
          return Promise.resolve({ id: 2 });
        }
        return Promise.resolve(null);
      }),
    },
  }),
}));

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  respondWithError: jest.fn(),
}));

jest.mock('slugify', () =>
  jest
    .fn()
    .mockImplementation((input) => input.toLowerCase().replace(/\s+/g, '-'))
);

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('editNotesGroup', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        groupId: 1,
        name: 'Updated Group Name',
        slug: 'updated-group-name',
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require a group ID', async () => {
    delete req.body.groupId;
    await editNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Group ID is required.'
    );
  });

  it('should require both group name and slug', async () => {
    delete req.body.name;
    delete req.body.slug;
    await editNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Both group name and slug are required.'
    );
  });

  it('should not allow group name or slug with consecutive spaces', async () => {
    req.body.name = 'Invalid  Group';
    await editNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Group name and slug cannot have consecutive spaces.'
    );
  });

  it('should successfully edit a notes group', async () => {
    await editNotesGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        editedNotesGroup: expect.objectContaining({
          id: 1,
          name: 'Updated Group Name',
          slug: 'updated-group-name',
          notes: [],
        }),
      },
    });
  });
});
