import removeNote from '.';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

const mockFindUniqueNote = jest.fn();
const mockDeleteNote = jest.fn();
const mockFindUniqueNotesGroup = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    note: {
      findUnique: mockFindUniqueNote,
      delete: mockDeleteNote,
    },
    notesGroup: {
      findUnique: mockFindUniqueNotesGroup,
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

describe('removeNote', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      query: {
        noteId: '1',
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require a note ID', async () => {
    delete req.query.noteId;
    await removeNote(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Note ID is required.'
    );
  });

  it('should handle non-existent note', async () => {
    mockFindUniqueNote.mockResolvedValueOnce(null);

    await removeNote(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Note not found'
    );
  });

  it('should handle unauthorized user attempt', async () => {
    mockFindUniqueNote.mockResolvedValueOnce({ groupId: '1' });
    mockFindUniqueNotesGroup.mockResolvedValueOnce({
      id: '1',
      userId: 999,
    });

    await removeNote(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the notes group'
    );
  });

  it('should successfully remove a note', async () => {
    mockFindUniqueNote.mockResolvedValueOnce({ groupId: '1' });
    mockFindUniqueNotesGroup.mockResolvedValueOnce({ id: '1', userId: 1 });
    mockDeleteNote.mockResolvedValueOnce({ id: '1' });

    await removeNote(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        removedNote: {
          id: '1',
        },
      },
    });
  });
});
