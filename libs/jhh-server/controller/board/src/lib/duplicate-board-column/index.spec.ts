import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import duplicateBoardColumn from '.';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    boardColumn: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 1) {
          return Promise.resolve({
            id: 1,
            name: 'OriginalName',
            color: '#FFFFFF',
            order: 1,
            userId: 1,
          });
        } else if (where.id === 2) {
          return Promise.resolve({
            id: 2,
            name: 'OriginalName - copy',
            color: '#FFFFFF',
            order: 2,
            userId: 1,
          });
        }
        return Promise.resolve(null);
      }),
      aggregate: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ _max: { order: 1 } })),
      create: jest.fn().mockImplementation((data) =>
        Promise.resolve({
          ...data.data,
          id: 2,
          items: [],
        })
      ),
    },
    boardColumnItem: {
      create: jest
        .fn()
        .mockImplementation((data) => Promise.resolve(data.data)),
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

describe('duplicateBoardColumn', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      headers: {},
      body: {
        columnId: 1,
        items: [],
      },
      user: { id: 1 },
    };
    res = mockRes();
  });

  it('should require a board column ID', async () => {
    delete req.body.columnId;
    await duplicateBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column ID is required.'
    );
  });

  it('should require board items array', async () => {
    delete req.body.items;
    await duplicateBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board items array is required.'
    );
  });

  it('should handle non-existent board column', async () => {
    req.body.columnId = 999;
    await duplicateBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Board column not found'
    );
  });

  it('should validate user ownership of the board column', async () => {
    req.user.id = 999;
    await duplicateBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the board column.'
    );
  });

  it('should successfully duplicate a board column with items', async () => {
    const req = {
      body: {
        columnId: 1,
        items: [],
      },
      user: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const prisma = {
      boardColumn: {
        findUnique: jest.fn().mockResolvedValue({
          id: 1,
          name: 'columnName',
          color: 'columnColor',
          userId: 1,
        }),
        create: jest.fn().mockResolvedValue({ id: 'duplicatedColumnId' }),
      },
      boardColumnItem: {
        create: jest.fn(),
      },
    };
    jest.mock('@prisma/client', () => ({
      PrismaClient: jest.fn(() => prisma),
    }));

    await duplicateBoardColumn(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        duplicatedBoardColumn: {
          id: 2,
          name: 'OriginalName - copy',
          color: '#FFFFFF',
          order: 2,
          userId: 1,
        },
      },
    });
  });
});
