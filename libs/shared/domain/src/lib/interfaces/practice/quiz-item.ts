import { QuizItemAnswer } from './quiz-item-answer';

export interface QuizItem {
  question: string;
  answers: QuizItemAnswer[];
}
