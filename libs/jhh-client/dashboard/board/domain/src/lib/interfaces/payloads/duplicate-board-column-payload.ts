import { BoardColumnItem } from '@jhh/shared/domain';

export interface DuplicateBoardColumnPayload {
  columnId: string;
  items: BoardColumnItem[];
}
