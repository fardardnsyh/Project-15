import { respondWithError } from '@jhh/jhh-server/shared/utils';

import removeQuiz from '.';

import { HttpStatusCode } from '@jhh/shared/domain';

const mockFindUniqueQuiz = jest.fn();
const mockDeleteQuiz = jest.fn();
const mockDeleteManyQuizResults = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    quiz: {
      findUnique: mockFindUniqueQuiz,
      delete: mockDeleteQuiz,
    },
    quizResults: {
      deleteMany: mockDeleteManyQuizResults,
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

describe('removeQuiz', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      query: {
        quizId: '1',
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require a quiz ID', async () => {
    delete req.query.quizId;
    await removeQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Quiz ID is required.'
    );
  });

  it('should handle non-existent quiz', async () => {
    mockFindUniqueQuiz.mockResolvedValueOnce(null);
    await removeQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Quiz not found'
    );
  });

  it('should handle unauthorized user attempt', async () => {
    mockFindUniqueQuiz.mockResolvedValueOnce({ id: '1', userId: 999 });
    await removeQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the quiz'
    );
  });

  it('should successfully remove a quiz', async () => {
    mockFindUniqueQuiz.mockResolvedValueOnce({ id: '1', userId: 1 });
    mockDeleteManyQuizResults.mockResolvedValueOnce({ count: 5 });
    mockDeleteQuiz.mockResolvedValueOnce({ id: '1' });
    await removeQuiz(req, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        removedQuiz: {
          id: '1',
        },
      },
    });
  });
});
