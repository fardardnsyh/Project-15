import editOffer from '.';

import {
  HttpStatusCode,
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

const mockFindUniqueOffer = jest.fn();
const mockUpdateOffer = jest.fn();
const mockFindFirstOffer = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    offer: {
      findUnique: mockFindUniqueOffer,
      update: mockUpdateOffer,
      findFirst: mockFindFirstOffer,
    },
  })),
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

describe('editOffer', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        offerId: '1',
        slug: 'updated-position',
        position: 'Updated Position',
        link: 'https://example.com/updated-job',
        company: 'Updated Example Inc',
        companyType: OfferCompanyType.Product,
        location: OfferLocation.Remote,
        status: OfferStatus.OfferReceived,
        priority: OfferPriority.Medium,
        salaryCurrency: OfferSalaryCurrency.PLN,
        email: 'updatedcontact@example.com',
        description: 'Updated job description here',
        minSalary: 60000,
        maxSalary: 80000,
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require all mandatory fields', async () => {
    delete req.body.position;
    await editOffer(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'These fields are required: ID, slug, position, link, company, companyType, location, status, priority'
    );
  });

  it('should handle non-existent offer', async () => {
    mockFindUniqueOffer.mockResolvedValueOnce(null);
    await editOffer(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Offer not found'
    );
  });

  it('should handle unauthorized user attempt', async () => {
    mockFindUniqueOffer.mockResolvedValueOnce({ id: '1', userId: 999 });
    await editOffer(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the offer'
    );
  });

  it('should successfully update an offer', async () => {
    mockFindUniqueOffer.mockResolvedValueOnce({
      id: '1',
      userId: 1,
      statusUpdates: [],
    });
    mockFindFirstOffer.mockResolvedValueOnce(null);
    mockUpdateOffer.mockResolvedValueOnce({
      id: '1',
      ...req.body,
      statusUpdates: expect.any(Array),
    });

    await editOffer(req, res);

    expect(mockUpdateOffer).toHaveBeenCalledWith(expect.anything());
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.anything());
  });
});
