import { QuizItem } from '@jhh/shared/domain';

export interface AddQuizPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  items: QuizItem[];
}
