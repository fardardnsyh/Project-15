import slugify from 'slugify';

import addQuiz from '.';

import { HttpStatusCode, QuizFieldLength } from '@jhh/shared/domain';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

const mockCreateQuiz = jest.fn();
const mockFindFirstQuiz = jest.fn();

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockImplementation(() => ({
    quiz: {
      create: mockCreateQuiz,
      findFirst: mockFindFirstQuiz,
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

describe('addQuiz', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        name: 'Test Quiz',
        description: 'A description of the test quiz.',
        imageUrl: 'http://example.com/image.png',
        items: [
          {
            question: 'What is 2 + 2?',
            answers: [
              { text: '4', isCorrect: true },
              { text: '3', isCorrect: false },
            ],
          },
        ],
      },
      user: { id: 1 },
    };

    res = mockRes();
  });

  it('should require name and items fields', async () => {
    delete req.body.name;
    await addQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'These fields are required: name, items'
    );
  });

  it('should not allow quiz name to be duplicated', async () => {
    mockFindFirstQuiz.mockResolvedValueOnce({ id: 'existingId', userId: 1 });
    await addQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Quiz name already exists.'
    );
  });

  it('should enforce quiz name length constraints', async () => {
    req.body.name = 'N'.repeat(101);
    await addQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      expect.stringContaining('Name must be between')
    );
  });

  it('should validate image URL format', async () => {
    req.body.imageUrl = 'invalid-url';
    await addQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Invalid image URL.'
    );
  });

  it('should enforce number of questions constraints', async () => {
    req.body.items = [];
    await addQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      `Number of questions must be between 1 and ${QuizFieldLength.MaxQuestions}`
    );
  });

  it('should ensure unique answers within a question', async () => {
    req.body.items[0].answers.push({ text: '4', isCorrect: false });
    await addQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Each question must have unique answers'
    );
  });

  it('should require at least one correct and one incorrect answer per question', async () => {
    req.body.items[0].answers.forEach(
      (answer: any) => (answer.isCorrect = true)
    );
    await addQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Each question must have at least one correct and one incorrect answer'
    );
  });

  it('should successfully add a new quiz', async () => {
    mockFindFirstQuiz.mockResolvedValueOnce(null);
    mockCreateQuiz.mockResolvedValueOnce({
      id: 'newId',
      ...req.body,
      userId: req.user.id,
      slug: slugify(req.body.name, { lower: true, strict: true }),
    });
    await addQuiz(req, res);
    expect(mockCreateQuiz).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.anything());
  });
});
