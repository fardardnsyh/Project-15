import {
  BoardColumn,
  NotesGroup,
  Offer,
  Quiz,
  ScheduleEvent,
} from '@jhh/shared/domain';

export interface HomeData {
  offers: Offer[];
  scheduleEvents: ScheduleEvent[];
  boardColumns: BoardColumn[];
  quizzes: Quiz[];
  notesGroups: NotesGroup[];
}
