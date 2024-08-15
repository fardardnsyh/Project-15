import {
  BoardColumn,
  NotesGroup,
  Offer,
  Quiz,
  ScheduleEvent,
  User,
} from '@jhh/shared/domain';

export interface LoadAssignedDataSuccessPayload {
  user: User;
  newToken: string;
  notesGroups: NotesGroup[];
  boardColumns: BoardColumn[];
  offers: Offer[];
  scheduleEvents: ScheduleEvent[];
  practiceQuizzes: Quiz[];
  unsavedBoardRequestId?: string;
}
