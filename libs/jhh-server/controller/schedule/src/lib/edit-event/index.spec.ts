import editEvent from '.';

import { EventFieldLength, HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

const mockUpdateEvent = jest.fn();
const mockFindUniqueEvent = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    scheduleEvent: {
      update: mockUpdateEvent,
      findUnique: mockFindUniqueEvent,
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

describe('editEvent', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        eventId: '1',
        start: '2023-03-10T10:00:00.000Z',
        end: '2023-03-10T12:00:00.000Z',
        title: 'Updated Event',
        color: '#FF5733',
        description: 'Updated Description',
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require all mandatory fields', async () => {
    delete req.body.start;
    await editEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'These fields are required: eventID, startDate, endDate, title, color'
    );
  });

  it('should enforce title length constraints', async () => {
    mockFindUniqueEvent.mockResolvedValueOnce({ id: '1', userId: 1 });

    req.body.title = 'A';
    await editEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      `Title must be between ${EventFieldLength.MinTitleLength} and ${EventFieldLength.MaxTitleLength} characters`
    );

    jest.clearAllMocks();
    mockFindUniqueEvent.mockResolvedValueOnce({ id: '1', userId: 1 });

    req.body.title = 'B'.repeat(EventFieldLength.MaxTitleLength + 1);
    await editEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      `Title must be between ${EventFieldLength.MinTitleLength} and ${EventFieldLength.MaxTitleLength} characters`
    );
  });

  it('should validate color format', async () => {
    mockFindUniqueEvent.mockResolvedValueOnce({ id: '1', userId: 1 });

    req.body.color = 'ZZZZZZ';
    await editEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid color format. Color should be a valid hex code.'
    );
  });

  it('should validate date format and logic', async () => {
    mockFindUniqueEvent.mockResolvedValueOnce({ id: '1', userId: 1 });

    req.body.start = 'not-a-date';
    await editEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid date format. Please provide valid startDate and endDate.'
    );

    jest.clearAllMocks();
    mockFindUniqueEvent.mockResolvedValueOnce({ id: '1', userId: 1 });

    req.body.start = '2023-03-10T12:00:00.000Z';
    req.body.end = '2023-03-10T10:00:00.000Z';
    await editEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'endDate must be later than startDate.'
    );
  });

  it('should validate description length', async () => {
    mockFindUniqueEvent.mockResolvedValueOnce({ id: '1', userId: 1 });

    req.body.description = 'D'.repeat(
      EventFieldLength.MaxDescriptionLength + 1
    );
    await editEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      `Description can have max ${EventFieldLength.MaxDescriptionLength} characters`
    );
  });

  it('should successfully edit an event', async () => {
    mockFindUniqueEvent.mockResolvedValueOnce({ id: '1', userId: 1 });
    mockUpdateEvent.mockResolvedValueOnce({
      ...req.body,
      userId: req.user.id,
    });

    await editEvent(req, res);

    expect(mockUpdateEvent).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.anything());
  });
});
