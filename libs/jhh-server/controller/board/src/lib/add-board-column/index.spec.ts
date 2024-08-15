import { HttpStatusCode } from '@jhh/shared/domain';

import addBoardColumn from '.';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    boardColumn: {
      aggregate: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ _max: { order: 0 } })),
      create: jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: 1,
          name: 'ValidName',
          color: '#FFFFFF',
          order: 1,
          userId: 1,
          items: [],
        })
      ),
    },
  }),
}));

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  respondWithError: jest.fn(),
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('addBoardColumn', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1 },
    };
    res = mockRes();
  });

  it('should require a board column name', async () => {
    await addBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column name is required.'
    );
  });

  it('should not allow consecutive spaces in the name', async () => {
    req.body.name = 'Invalid  Name';
    await addBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column name cannot have consecutive spaces.'
    );
  });

  it('should not allow leading or trailing spaces in the name', async () => {
    req.body.name = ' InvalidName ';
    await addBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column name cannot have leading or trailing spaces.'
    );
  });

  it('should validate name length', async () => {
    req.body.name = 'Sh';
    await addBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      expect.any(String)
    );
  });

  it('should require a board column color', async () => {
    req.body.name = 'ValidName';
    await addBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column color is required.'
    );
  });

  it('should validate color format', async () => {
    req.body.name = 'ValidName';
    req.body.color = 'InvalidColor';
    await addBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid color format. Color should be a valid hex code.'
    );
  });

  it('should successfully create a board column with valid inputs', async () => {
    req.body.name = 'ValidName';
    req.body.color = '#123ABC';
    await addBoardColumn(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          newBoardColumn: expect.objectContaining({
            color: '#FFFFFF',
            items: [],
            name: 'ValidName',
            order: 1,
            userId: 1,
          }),
        }),
      })
    );
  });
});
