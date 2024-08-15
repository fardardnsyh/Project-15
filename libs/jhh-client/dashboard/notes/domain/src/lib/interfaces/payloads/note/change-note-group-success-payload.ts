import { Note, NotesGroup } from '@jhh/shared/domain';

export interface ChangeNoteGroupSuccessPayload {
  movedNote: Note;
  previousGroup: NotesGroup;
  newGroup: NotesGroup;
}
