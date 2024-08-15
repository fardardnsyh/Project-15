import { respondWithError } from '@jhh/jhh-server/shared/utils';

import removeNotesGroup from '.';

import { HttpStatusCode } from '@jhh/shared/domain';

const mockFindUniqueNotesGroup = jest.fn();
const mockDeleteNotesGroup = jest.fn();
const mockDeleteManyNotes = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    notesGroup: {
      findUnique: mockFindUniqueNotesGroup,
      delete: mockDeleteNotesGroup,
    },
    note: {
      deleteMany: mockDeleteManyNotes,
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

describe('removeNotesGroup', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      query: {
        groupId: '1',
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require a group ID', async () => {
    delete req.query.groupId;
    await removeNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Group ID is required.'
    );
  });

  it('should handle non-existent notes group', async () => {
    mockFindUniqueNotesGroup.mockResolvedValueOnce(null);
    await removeNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Notes group not found'
    );
  });

  it('should handle unauthorized user attempt', async () => {
    mockFindUniqueNotesGroup.mockResolvedValueOnce({ id: '1', userId: 999 });
    await removeNotesGroup(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the notes group'
    );
  });

  it('should successfully remove a notes group', async () => {
    mockFindUniqueNotesGroup.mockResolvedValueOnce({ id: '1', userId: 1 });
    mockDeleteManyNotes.mockResolvedValueOnce({ count: 5 });
    mockDeleteNotesGroup.mockResolvedValueOnce({ id: '1' });
    await removeNotesGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        removedNotesGroup: {
          id: '1',
        },
      },
    });
  });
});
