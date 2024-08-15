import { QuizResult } from './quiz-result';

export interface QuizResults {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  items: QuizResult[];
  totalScore: number;
  percentage: number;
}
