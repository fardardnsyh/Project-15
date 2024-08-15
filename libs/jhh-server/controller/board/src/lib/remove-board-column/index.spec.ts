import removeBoardColumn from '.';

import { HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    boardColumn: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 1) {
          return Promise.resolve({
            id: 1,
            name: 'ExistingName',
            color: '#000000',
            userId: 1,
          });
        }
        return Promise.resolve(null);
      }),
      create: jest.fn().mockResolvedValue({
        id: 2,
        name: 'Temporary Column',
        color: '',
        isTemporary: true,
        order: 1337,
        userId: 1,
      }),
      updateMany: jest.fn(),
      delete: jest.fn().mockResolvedValue({
        id: 1,
      }),
    },
    boardColumnItem: {
      updateMany: jest.fn().mockResolvedValue({
        count: 1,
      }),
    },
    user: {
      update: jest.fn(),
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

describe('removeBoardColumn', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      query: {
        columnId: 1,
      },
      user: { id: 1 },
    };
    res = mockRes();
  });

  it('should require a board column ID', async () => {
    delete req.query.columnId;
    await removeBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column ID is required.'
    );
  });

  it('should not allow removal if the board column is not found', async () => {
    req.query.columnId = 999;
    await removeBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Board column not found'
    );
  });

  it('should not allow removal if the user is not the owner', async () => {
    req.user.id = 999;
    await removeBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the board column'
    );
  });

  it('should successfully remove a board column', async () => {
    await removeBoardColumn(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        removedBoardColumn: {
          id: 1,
        },
      },
    });
  });
});
