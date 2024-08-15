import updateBoardColumns from '.';

import { HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    boardColumn: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 1) {
          return Promise.resolve({
            id: 1,
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
      findMany: jest.fn().mockResolvedValue([]),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    boardColumnItem: {
      deleteMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
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

describe('updateBoardColumns', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        columnsToUpdate: [{ id: 1, order: 2, items: [] }],
        removedItemIds: [],
        unsavedBoardRequestId: 'unsaved-request-id',
      },
      user: { id: 1 },
    };
    res = mockRes();
  });

  it('should validate columnsToUpdate as an array', async () => {
    req.body.columnsToUpdate = 'not-an-array';
    await updateBoardColumns(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid input format: columnsToUpdate should be an array.'
    );
  });

  it('should validate removedItemIds as an array', async () => {
    req.body.removedItemIds = 'not-an-array';
    await updateBoardColumns(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid input format: removedItemIds should be an array.'
    );
  });

  it('should successfully update board columns and remove specified items', async () => {
    await updateBoardColumns(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });
});
