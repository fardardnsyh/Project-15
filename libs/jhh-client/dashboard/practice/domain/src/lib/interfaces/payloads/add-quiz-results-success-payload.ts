import { QuizResults } from '@jhh/shared/domain';

export interface AddQuizResultsSuccessPayload {
  quizId: string;
  addedResults: QuizResults;
}
