import { QuizItem } from '@jhh/shared/domain';

export interface EditQuizPayload {
  quizId: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  items: QuizItem[];
}
