import addEvent from '.';

import { EventFieldLength, HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

const mockCreateEvent = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    scheduleEvent: {
      create: mockCreateEvent,
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

describe('addEvent', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        start: '2023-03-10T10:00:00.000Z',
        end: '2023-03-10T12:00:00.000Z',
        title: 'Test Event',
        color: '#FF5733',
        description: 'Test Description',
      },
      user: { id: 1 },
    };
    res = mockRes();
  });

  it('should require all mandatory fields', async () => {
    delete req.body.title;
    await addEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'These fields are required: startDate, endDate, title, color'
    );
  });

  it('should validate title length', async () => {
    req.body.title = 'T';
    await addEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      `Title must be between ${EventFieldLength.MinTitleLength} and ${EventFieldLength.MaxTitleLength} characters`
    );
  });

  it('should enforce description length constraints', async () => {
    req.body.description = 'D'.repeat(
      EventFieldLength.MaxDescriptionLength + 1
    );

    await addEvent(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      `Description can have max ${EventFieldLength.MaxDescriptionLength} characters`
    );
  });

  it('should validate color format', async () => {
    req.body.color = '123456';
    await addEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid color format. Color should be a valid hex code.'
    );
  });

  it('should validate start and end date', async () => {
    req.body.start = 'invalid-date';
    req.body.end = 'invalid-date';
    await addEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid date format. Please provide valid startDate and endDate.'
    );
  });

  it('should successfully add an event', async () => {
    mockCreateEvent.mockResolvedValueOnce({
      id: 'newId',
      ...req.body,
      userId: req.user.id,
    });

    await addEvent(req, res);

    expect(mockCreateEvent).toHaveBeenCalledWith({
      data: {
        start: expect.any(Date),
        end: expect.any(Date),
        title: req.body.title,
        color: req.body.color,
        description: req.body.description,
        userId: req.user.id,
      },
    });

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.anything());
  });
});
