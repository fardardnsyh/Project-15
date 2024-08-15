import addQuizResults from '.';

import { HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

const mockCreateQuizResults = jest.fn();
const mockFindUniqueQuiz = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    quiz: {
      findUnique: mockFindUniqueQuiz,
    },
    quizResults: {
      create: mockCreateQuizResults,
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

describe('addQuizResults', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        quizId: '1',
        items: [
          {
            question: "What's the capital of France?",
            userAnswers: ['Paris'],
            correctAnswers: ['Paris'],
            isCorrect: true,
          },
        ],
        totalScore: 100,
        percentage: 100,
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require all mandatory fields', async () => {
    delete req.body.quizId;
    await addQuizResults(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'These fields are required: ID, items, totalScore, percentage'
    );
  });

  it('should validate the structure of items', async () => {
    mockFindUniqueQuiz.mockResolvedValueOnce({ id: '1', userId: 1 });

    req.body.items[0].userAnswers = 'Not an array';

    await addQuizResults(req, res);

    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid structure for quiz result items.'
    );
  });

  it('should check quiz ownership', async () => {
    mockFindUniqueQuiz.mockResolvedValueOnce({ id: '1', userId: 999 });
    await addQuizResults(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the quiz.'
    );
  });

  it('should validate that total score is a non-negative number', async () => {
    req.body.totalScore = -1;
    await addQuizResults(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Total score must be a non-negative number.'
    );
  });

  it('should validate that percentage is between 0 and 100', async () => {
    req.body.percentage = 105;
    await addQuizResults(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Percentage must be a number between 0 and 100.'
    );
  });

  it('should not accept an empty items array', async () => {
    req.body.items = [];
    await addQuizResults(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Items must be a non-empty array.'
    );
  });

  it('should not add results for a non-existent quiz', async () => {
    mockFindUniqueQuiz.mockResolvedValueOnce(null);
    await addQuizResults(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Quiz not found'
    );
  });

  it('should reject unauthorized attempts to add results', async () => {
    mockFindUniqueQuiz.mockResolvedValueOnce({ id: '1', userId: 999 });
    await addQuizResults(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.Unauthorized,
      'User is not the owner of the quiz.'
    );
  });

  it('should successfully add quiz results', async () => {
    mockFindUniqueQuiz.mockResolvedValueOnce({ id: '1', userId: 1 });
    mockCreateQuizResults.mockResolvedValueOnce({
      quizId: '1',
      items: req.body.items,
      totalScore: 100,
      percentage: 100,
    });
    await addQuizResults(req, res);
    expect(mockCreateQuizResults).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.anything());
  });
});
