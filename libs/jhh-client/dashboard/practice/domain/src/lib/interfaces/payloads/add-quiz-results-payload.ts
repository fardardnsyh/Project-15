import { QuizResult } from '@jhh/shared/domain';

export interface AddQuizResultsPayload {
  quizId: string;
  items: QuizResult[];
  totalScore: number;
  percentage: number;
}
