import addOffer from '.';
import {
  HttpStatusCode,
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';
import { respondWithError } from '@jhh/jhh-server/shared/utils';
import slugify from 'slugify';

const mockCreateOffer = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    offer: {
      create: mockCreateOffer,
      findFirst: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(null);
      }),
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

describe('addOffer', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        position: 'Software Engineer',
        link: 'https://example.com/job',
        company: 'Example Inc',
        companyType: OfferCompanyType.Product,
        location: OfferLocation.Remote,
        status: OfferStatus.Accepted,
        priority: OfferPriority.Medium,
        salaryCurrency: OfferSalaryCurrency.USD,
        email: 'contact@example.com',
        description: 'Job description here',
        minSalary: 50000,
        maxSalary: 70000,
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require all mandatory fields', async () => {
    delete req.body.position;
    await addOffer(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'These fields are required: position, link, company, companyType, location, status, priority'
    );
  });

  it('should not allow position with consecutive spaces', async () => {
    req.body.position = 'Software  Engineer';
    await addOffer(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Position, link and company cannot have consecutive spaces.'
    );
  });

  it('should validate link format', async () => {
    req.body.link = 'invalid-link';
    await addOffer(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid link format.'
    );
  });

  it('should validate email format', async () => {
    req.body.email = 'invalidemail.com';
    await addOffer(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid email format.'
    );
  });

  it('should require salary currency when specifying a salary', async () => {
    req.body.salaryCurrency = null;
    await addOffer(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Salary currency is required when specifying a salary.'
    );
  });

  it('should ensure maxSalary does not exceed allowed maximum', async () => {
    req.body.maxSalary = 1000001;
    await addOffer(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      expect.any(String)
    );
  });

  it('should successfully add an offer', async () => {
    mockCreateOffer.mockResolvedValueOnce({
      id: 1,
      ...req.body,
      userId: req.user.id,
      slug: slugify(req.body.position),
      statusUpdates: [{ date: expect.any(Date), status: req.body.status }],
    });

    await addOffer(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });
});
