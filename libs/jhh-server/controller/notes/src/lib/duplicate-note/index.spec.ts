import duplicateNote from '.';
import { respondWithError } from '@jhh/jhh-server/shared/utils';
import { HttpStatusCode } from '@jhh/shared/domain';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn(() => ({
    note: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    notesGroup: {
      findUnique: jest.fn(),
    },
  })),
}));

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  respondWithError: jest.fn(),
}));

jest.mock('slugify', () => jest.fn().mockImplementation((input) => input));

const mockFindUniqueNote = jest.fn();
const mockCreateNote = jest.fn();
const mockFindUniqueNotesGroup = jest.fn();
const mockFindFirst = jest.fn();
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      note: {
        findUnique: mockFindUniqueNote,
        create: mockCreateNote,
        findFirst: mockFindFirst,
      },
      notesGroup: {
        findUnique: mockFindUniqueNotesGroup,
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

describe('duplicateNote', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        noteId: 1,
        groupId: 1,
      },
      user: { id: 1 },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should handle missing noteId error', async () => {
    const req = {
      body: {
        groupId: 1,
      },
      user: { id: 1 },
    };
    const res = mockRes();

    await duplicateNote(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Note ID is required.'
    );
  });

  it('should handle missing groupId error', async () => {
    const req = {
      body: {
        noteId: 1,
      },
      user: { id: 1 },
    };
    const res = mockRes();

    await duplicateNote(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Group ID is required.'
    );
  });

  it('should handle non-existent note', async () => {
    mockFindUniqueNote.mockResolvedValueOnce(null);

    await duplicateNote(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Note not found'
    );
  });

  it('should handle existingNote not found error', async () => {
    const req = {
      body: {
        noteId: 1,
        groupId: 1,
      },
      user: { id: 1 },
    };
    const res = mockRes();

    jest.mock('@prisma/client', () => ({
      PrismaClient: jest.fn().mockReturnValue({
        note: {
          findUnique: jest.fn().mockResolvedValueOnce(null),
        },
      }),
    }));

    await duplicateNote(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Note not found'
    );
  });
});
