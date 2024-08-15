import { PrismaClient, Quiz } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const addQuizResults = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { quizId, items, totalScore, percentage } = req.body;
    const userId = req.user.id;

    if (
      !quizId ||
      !items ||
      totalScore === null ||
      totalScore === undefined ||
      percentage === null ||
      percentage === undefined
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'These fields are required: ID, items, totalScore, percentage'
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Items must be a non-empty array.'
      );
    }

    if (typeof totalScore !== 'number' || totalScore < 0) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Total score must be a non-negative number.'
      );
    }

    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Percentage must be a number between 0 and 100.'
      );
    }

    const existingQuiz: Quiz | null = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!existingQuiz) {
      return respondWithError(res, HttpStatusCode.NotFound, 'Quiz not found');
    }

    if (existingQuiz.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the quiz.'
      );
    }

    for (const item of items) {
      if (
        typeof item.question !== 'string' ||
        !Array.isArray(item.userAnswers) ||
        !Array.isArray(item.correctAnswers) ||
        typeof item.isCorrect !== 'boolean'
      ) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Invalid structure for quiz result items.'
        );
      }
    }

    const addedResults = await prisma.quizResults.create({
      data: {
        quizId,
        items,
        totalScore,
        percentage,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { quizId, addedResults } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default addQuizResults;
