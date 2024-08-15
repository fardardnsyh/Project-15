import removeEvent from '.';

import { HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

const mockDeleteEvent = jest.fn();
const mockFindUniqueEvent = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    scheduleEvent: {
      delete: mockDeleteEvent,
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

describe('removeEvent', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      query: { eventId: '1' },
      user: { id: 1 },
    };
    res = mockRes();
  });

  it('should require event ID', async () => {
    delete req.query.eventId;
    await removeEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Event ID is required.'
    );
  });

  it('should handle non-existent event', async () => {
    mockFindUniqueEvent.mockResolvedValueOnce(null);
    await removeEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Event not found'
    );
  });

  it('should verify user is the owner of the event', async () => {
    mockFindUniqueEvent.mockResolvedValueOnce({ id: '1', userId: 2 });
    await removeEvent(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the event'
    );
  });

  it('should successfully remove an event', async () => {
    mockFindUniqueEvent.mockResolvedValueOnce({ id: '1', userId: 1 });
    mockDeleteEvent.mockResolvedValueOnce({ id: '1' });

    await removeEvent(req, res);

    expect(mockDeleteEvent).toHaveBeenCalledWith({
      where: { id: req.query.eventId },
    });

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.anything());
  });
});
