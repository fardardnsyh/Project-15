import editBoardColumn from '.';

import { HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    boardColumn: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(
          where.id === 1
            ? {
                id: 1,
                name: 'ExistingName',
                color: '#000000',
                userId: 1,
              }
            : null
        );
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        return Promise.resolve({
          id: where.id,
          ...data,
        });
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

describe('editBoardColumn', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        columnId: 1,
        name: 'UpdatedName',
        color: '#FFFFFF',
      },
      user: { id: 1 },
    };
    res = mockRes();
  });

  it('should require a board column ID', async () => {
    delete req.body.columnId;
    await editBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column ID is required.'
    );
  });

  it('should not allow a board column name with consecutive spaces', async () => {
    req.body.name = 'Invalid  Name';
    await editBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column name cannot have consecutive spaces.'
    );
  });

  it('should not allow a board column name with leading or trailing spaces', async () => {
    req.body.name = ' ValidName ';
    await editBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column name cannot have leading or trailing spaces.'
    );
  });

  it('should require a board column color', async () => {
    delete req.body.color;
    await editBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Board column color is required.'
    );
  });

  it('should validate the board column color format', async () => {
    req.body.color = 'InvalidColor';
    await editBoardColumn(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid color format. Color should be a valid hex code.'
    );
  });

  it('should successfully edit a board column', async () => {
    await editBoardColumn(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        editedBoardColumn: {
          id: 1,
          name: 'UpdatedName',
          color: '#FFFFFF',
        },
      },
    });
  });
});
