import { PrismaClient, Quiz } from '@prisma/client';
import slugify from 'slugify';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import {
  HttpStatusCode,
  QuizFieldLength,
  QuizItemAnswer,
} from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { regex } from '@jhh/shared/regex';

const editQuiz = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { quizId, slug, name, description, imageUrl, items } = req.body;
    const userId = req.user.id;

    if (!slug || !name || !items) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'These fields are required: quizID, slug, name, items'
      );
    }

    if (/[\s]{2,}/.test(name) || /[\s]{2,}/.test(slug)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Slug and name cannot have consecutive spaces.'
      );
    }

    if (name !== name.trim() || slug !== slug.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Slug and name cannot have leading or trailing spaces.'
      );
    }

    if (
      name.length < QuizFieldLength.MinNameLength ||
      name.length > QuizFieldLength.MaxNameLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Name must be between ${QuizFieldLength.MinNameLength} and ${QuizFieldLength.MaxNameLength} characters`
      );
    }

    const slugLengthDifference: number =
      QuizFieldLength.MaxNameAndSlugLengthDiff;
    if (Math.abs(name.length - slug.length) > slugLengthDifference) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `The length of the slug should be within ${slugLengthDifference} characters of the name length.`
      );
    }

    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
      },
    });

    if (!existingQuiz) {
      return respondWithError(res, HttpStatusCode.NotFound, 'Quiz not found');
    }
    if (existingQuiz.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the quiz'
      );
    }

    const isNameUnique: boolean = !(await prisma.quiz.findFirst({
      where: {
        name,
        userId,
        NOT: { id: quizId },
      },
    }));

    if (!isNameUnique) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Quiz name already exists.'
      );
    }

    if (
      description &&
      description.length > QuizFieldLength.MaxDescriptionLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Description can have max ${QuizFieldLength.MaxDescriptionLength} characters`
      );
    }

    if (imageUrl && imageUrl.length > QuizFieldLength.MaxImageUrlLength) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Image URL can have max ${QuizFieldLength.MaxImageUrlLength} characters`
      );
    }

    if (imageUrl && !regex.imageUrl.test(imageUrl)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid image URL.'
      );
    }

    if (items.length < 1 || items.length > QuizFieldLength.MaxQuestions) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Number of questions must be between 1 and ${QuizFieldLength.MaxQuestions}`
      );
    }

    for (const item of items) {
      if (
        item.question.length < QuizFieldLength.MinQuestionLength ||
        item.question.length > QuizFieldLength.MaxQuestionLength
      ) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          `Each question name must be between ${QuizFieldLength.MinQuestionLength} and ${QuizFieldLength.MaxQuestionLength} characters`
        );
      }

      if (
        item.answers.length < QuizFieldLength.MinAnswers ||
        item.answers.length > QuizFieldLength.MaxAnswers
      ) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          `Each question must have between ${QuizFieldLength.MinAnswers} and ${QuizFieldLength.MaxAnswers} answers`
        );
      }

      const correctAnswers = item.answers.filter(
        (a: QuizItemAnswer) => a.isCorrect
      ).length;
      if (correctAnswers === 0 || correctAnswers === item.answers.length) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Each question must have at least one correct and one incorrect answer'
        );
      }

      const answerTexts = item.answers.map((a: QuizItemAnswer) =>
        a.text.trim().toLowerCase()
      );
      const uniqueAnswers = new Set(answerTexts);

      if (answerTexts.length !== uniqueAnswers.size) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Each question must have unique answers'
        );
      }

      for (const answer of item.answers) {
        if (
          answer.text.length < QuizFieldLength.MinAnswerLength ||
          answer.text.length > QuizFieldLength.MaxAnswerLength
        ) {
          return respondWithError(
            res,
            HttpStatusCode.BadRequest,
            `Each answer must be between ${QuizFieldLength.MinAnswerLength} and ${QuizFieldLength.MaxAnswerLength} characters`
          );
        }
      }
    }

    let updatedSlug: string = slugify(slug, { lower: true, strict: true });
    let suffix: number = 2;
    const originalSlug: string = updatedSlug;

    while (
      await prisma.quiz.findFirst({
        where: {
          slug: updatedSlug,
          userId,
          NOT: { id: quizId },
        },
      })
    ) {
      updatedSlug = `${originalSlug}-${suffix}`;
      suffix++;
    }

    const editedQuiz: Quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        name: name,
        slug: updatedSlug,
        description: description,
        imageUrl: imageUrl,
        items: items,
      },
      include: {
        results: true,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { editedQuiz } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default editQuiz;
