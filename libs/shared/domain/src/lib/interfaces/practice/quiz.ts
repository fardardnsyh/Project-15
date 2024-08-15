import { QuizItem } from './quiz-item';
import { QuizResults } from './quiz-results';

export interface Quiz {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  items: QuizItem[];
  results: QuizResults[];
}
