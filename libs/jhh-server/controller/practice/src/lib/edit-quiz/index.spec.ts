import editQuiz from '.';
import { HttpStatusCode } from '@jhh/shared/domain';
import { respondWithError } from '@jhh/jhh-server/shared/utils';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    quiz: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

jest.mock('slugify', () =>
  jest
    .fn()
    .mockImplementation((input) => input.toLowerCase().replace(/\s+/g, '-'))
);

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  respondWithError: jest.fn(),
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockFindFirstQuiz = jest.fn();

describe('editQuiz', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFindFirstQuiz.mockResolvedValue({
      id: 1,
      userId: 1,
      slug: 'test-quiz',
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
    });

    req = {
      body: {
        quizId: 1,
        slug: 'test-quiz',
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

  it('should require all mandatory fields', async () => {
    delete req.body.slug;
    delete req.body.name;
    delete req.body.items;
    await editQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'These fields are required: quizID, slug, name, items'
    );
  });

  it('should reject consecutive spaces in name and slug', async () => {
    req.body.slug = 'test  quiz';
    req.body.name = 'Test  Quiz';
    await editQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Slug and name cannot have consecutive spaces.'
    );
  });

  it('should reject consecutive spaces in name and slug', async () => {
    req.body.slug = 'test  quiz';
    req.body.name = 'Test  Quiz';
    await editQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.BadRequest,
      'Slug and name cannot have consecutive spaces.'
    );
  });

  it('should handle non-existent quiz', async () => {
    mockFindFirstQuiz.mockResolvedValueOnce(null);
    await editQuiz(req, res);
    expect(respondWithError).toHaveBeenCalledWith(
      res,
      HttpStatusCode.NotFound,
      'Quiz not found'
    );
  });
});
