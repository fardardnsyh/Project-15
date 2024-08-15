import { BoardColumn } from '@jhh/shared/domain';

export interface UpdateBoardColumnsPayload {
  columnsToUpdate: Partial<BoardColumn | null>[];
  removedItemIds: string[];
  unsavedBoardRequestId?: string;
}
