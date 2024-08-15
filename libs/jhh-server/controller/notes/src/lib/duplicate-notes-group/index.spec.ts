import duplicateNotesGroup from '.';
import { respondWithError } from '@jhh/jhh-server/shared/utils';
import { HttpStatusCode } from '@jhh/shared/domain';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    note: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    notesGroup: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  }),
}));

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  respondWithError: jest.fn(),
}));

jest.mock('slugify', () =>
  jest
    .fn()
    .mockImplementation((input) => input.toLowerCase().replace(/\s+/g, '-'))
);

const mockFindUniqueNotesGroup = jest.fn();
const mockCreateNotesGroup = jest.fn();
const mockFindFirstNotesGroup = jest.fn();
const mockFindFirstNote = jest.fn();
const mockCreateNote = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      note: {
        findUnique: jest.fn(),
        create: mockCreateNote,
        findFirst: mockFindFirstNote,
      },
      notesGroup: {
        findUnique: mockFindUniqueNotesGroup,
        create: mockCreateNotesGroup,
        findFirst: mockFindFirstNotesGroup,
      },
    })),
  };
});

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('duplicateNotesGroup', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        groupId: 1,
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require a notes group ID', async () => {
    delete req.body.groupId;

    await duplicateNotesGroup(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Notes group ID is required.'
    );
  });

  it('should handle non-existent notes group', async () => {
    mockFindUniqueNotesGroup.mockResolvedValueOnce(null);

    await duplicateNotesGroup(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Notes group not found'
    );
  });
});
