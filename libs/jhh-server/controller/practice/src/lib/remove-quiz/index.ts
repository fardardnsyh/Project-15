import { PrismaClient, Quiz } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const removeQuiz = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { quizId } = req.query;
    const userId = req.user.id;

    if (!quizId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Quiz ID is required.'
      );
    }

    const quiz: Quiz | null = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return respondWithError(res, HttpStatusCode.NotFound, 'Quiz not found');
    }

    if (quiz.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the quiz'
      );
    }

    await prisma.quizResults.deleteMany({
      where: { quizId },
    });

    const removedQuiz: Quiz = await prisma.quiz.delete({
      where: { id: quizId },
      include: {
        results: true,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { removedQuiz } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default removeQuiz;
