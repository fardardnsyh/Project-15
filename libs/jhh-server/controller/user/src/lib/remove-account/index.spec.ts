import removeAccount from '.';

import { HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

const mockFindUnique = jest.fn();
const mockDeleteMany = jest.fn();
const mockDelete = jest.fn();
const mockTransaction = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: mockFindUnique,
      delete: mockDelete,
    },
    notesGroup: {
      findMany: jest.fn(() => []),
      deleteMany: mockDeleteMany,
    },
    note: {
      deleteMany: mockDeleteMany,
    },
    boardColumn: {
      findMany: jest.fn(() => []),
      deleteMany: mockDeleteMany,
    },
    boardColumnItem: {
      deleteMany: mockDeleteMany,
    },
    offer: {
      deleteMany: mockDeleteMany,
    },
    scheduleEvent: {
      deleteMany: mockDeleteMany,
    },
    quiz: {
      findMany: jest.fn(() => []),
      deleteMany: mockDeleteMany,
    },
    quizResults: {
      deleteMany: mockDeleteMany,
    },
    $transaction: mockTransaction,
  })),
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

describe('removeAccount', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    req = {
      user: { id: 'userId' },
    };

    res = mockRes();
  });

  it('should handle user not found', async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    await removeAccount(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'User not found.'
    );
  });

  it('should handle errors during account removal', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'userId' });
    mockTransaction.mockRejectedValue(
      new Error('Simulated transaction failure')
    );

    await removeAccount(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  });

  it('should successfully remove an account and all associated data', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'userId' });

    mockTransaction.mockResolvedValueOnce(true);

    await removeAccount(req, res);

    expect(mockTransaction).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: { removedAccountId: 'userId' },
    });
  });
});
