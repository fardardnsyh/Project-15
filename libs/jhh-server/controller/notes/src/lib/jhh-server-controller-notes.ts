import addNote from './add-note';
import addNotesGroup from './add-notes-group';
import duplicateNotesGroup from './duplicate-notes-group';
import editNotesGroup from './edit-notes-group';
import removeNotesGroup from './remove-notes-group';
import editNote from './edit-note';
import duplicateNote from './duplicate-note';
import changeNoteGroup from './change-note-group';
import removeNote from './remove-note';

export function JhhServerControllerNotes() {
  return {
    addNotesGroup,
    editNotesGroup,
    duplicateNotesGroup,
    removeNotesGroup,
    addNote,
    editNote,
    duplicateNote,
    changeNoteGroup,
    removeNote,
  };
}
