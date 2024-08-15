import removeOffers from '.';
import { HttpStatusCode } from '@jhh/shared/domain';
import { respondWithError } from '@jhh/jhh-server/shared/utils';

const mockFindManyOffers = jest.fn();
const mockDeleteManyOffers = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    offer: {
      findMany: mockFindManyOffers,
      deleteMany: mockDeleteManyOffers,
    },
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

describe('removeOffers', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      query: {
        offersId: ['1', '2'],
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require an array of offers ID', async () => {
    req.query.offersId = [];
    await removeOffers(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Array of offers ID is required.'
    );
  });

  it('should handle non-existent or unauthorized offers', async () => {
    mockFindManyOffers.mockResolvedValueOnce([{ id: '1', userId: 1 }]);
    await removeOffers(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'One or more offers not found or not owned by the user'
    );
  });

  it('should successfully remove multiple offers', async () => {
    mockFindManyOffers.mockResolvedValueOnce([
      { id: '1', userId: 1 },
      { id: '2', userId: 1 },
    ]);
    await removeOffers(req, res);
    expect(mockDeleteManyOffers).toHaveBeenCalledWith({
      where: { id: { in: ['1', '2'] }, userId: 1 },
    });
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: { removedOffers: expect.any(Array) },
    });
  });
});
