export interface User {
  id: string;
  createdAt: Date;
  username: string;
  unsavedBoardRequestId?: string;
}
