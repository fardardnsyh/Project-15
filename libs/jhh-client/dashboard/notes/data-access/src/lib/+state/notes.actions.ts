import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { NotesGroup } from '@jhh/shared/domain';
import {
  AddNotePayload,
  AddNotesGroupPayload,
  AddNotesGroupSuccessPayload,
  AddNoteSuccessPayload,
  ChangeNoteGroupPayload,
  ChangeNoteGroupSuccessPayload,
  DuplicateNotePayload,
  DuplicateNotesGroupPayload,
  DuplicateNotesGroupSuccessPayload,
  DuplicateNoteSuccessPayload,
  EditNotePayload,
  EditNotesGroupPayload,
  EditNotesGroupSuccessPayload,
  EditNoteSuccessPayload,
  RemoveNotePayload,
  RemoveNotesGroupPayload,
  RemoveNotesGroupSuccessPayload,
  RemoveNoteSuccessPayload,
} from '@jhh/jhh-client/dashboard/notes/domain';

export enum Type {
  SetNotes = '[Notes] Set Notes',
  AddNotesGroup = '[Notes] Add Notes Group',
  AddNotesGroupFail = '[Notes] Add Notes Group Fail',
  AddNotesGroupSuccess = '[Notes] Add Notes Group Success',
  ResetAddNotesGroupSuccess = '[Notes] Reset Add Notes Group Success',
  EditNotesGroup = '[Notes] Edit Notes Group',
  EditNotesGroupFail = '[Notes] Edit Notes Group Fail',
  EditNotesGroupSuccess = '[Notes] Edit Notes Group Success',
  ResetEditNotesGroupSuccess = '[Notes] Reset Edit Notes Group Success',
  DuplicateNotesGroup = '[Notes] Duplicate Notes Group',
  DuplicateNotesGroupFail = '[Notes] Duplicate Notes Group Fail',
  DuplicateNotesGroupSuccess = '[Notes] Duplicate Notes Group Success',
  ResetDuplicateNotesGroupSuccess = '[Notes] Reset Duplicate Notes Group Success',
  RemoveNotesGroup = '[Notes] Remove Notes Group',
  RemoveNotesGroupFail = '[Notes] Remove Notes Group Fail',
  RemoveNotesGroupSuccess = '[Notes] Remove Notes Group Success',
  ResetRemoveNotesGroupSuccess = '[Notes] Reset Remove Notes Group Success',
  AddNote = '[Notes] Add Note',
  AddNoteFail = '[Notes] Add Note Fail',
  AddNoteSuccess = '[Notes] Add Note Success',
  ResetAddNoteSuccess = '[Notes] Reset Add Note Success',
  EditNote = '[Notes] Edit Note',
  EditNoteFail = '[Notes] Edit Note Fail',
  EditNoteSuccess = '[Notes] Edit Note Success',
  ResetEditNoteSuccess = '[Notes] Reset Edit Note Success',
  DuplicateNote = '[Notes] Duplicate Note',
  DuplicateNoteFail = '[Notes] Duplicate Note Fail',
  DuplicateNoteSuccess = '[Notes] Duplicate Note Success',
  ResetDuplicateNoteSuccess = '[Notes] Reset Duplicate Note Success',
  ChangeNoteGroup = '[Notes] Change Note Group',
  ChangeNoteGroupFail = '[Notes] Change Note Group Fail',
  ChangeNoteGroupSuccess = '[Notes] Change Note Group Success',
  ResetChangeNoteGroupSuccess = '[Notes] Reset Change Note Group Success',
  RemoveNote = '[Notes] Remove Note',
  RemoveNoteFail = '[Notes] Remove Note Fail',
  RemoveNoteSuccess = '[Notes] Remove Note Success',
  ResetRemoveNoteSuccess = '[Notes] Reset Remove Note Success',
  ResetErrors = '[Notes] Reset Errors',
}

export const setNotes = createAction(
  Type.SetNotes,
  props<{ notesGroups: NotesGroup[] }>()
);

export const addNotesGroup = createAction(
  Type.AddNotesGroup,
  props<{ payload: AddNotesGroupPayload }>()
);

export const addNotesGroupFail = createAction(
  Type.AddNotesGroupFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addNotesGroupSuccess = createAction(
  Type.AddNotesGroupSuccess,
  props<{ payload: AddNotesGroupSuccessPayload }>()
);

export const resetAddNotesGroupSuccess = createAction(
  Type.ResetAddNotesGroupSuccess
);

export const editNotesGroup = createAction(
  Type.EditNotesGroup,
  props<{ payload: EditNotesGroupPayload }>()
);

export const editNotesGroupFail = createAction(
  Type.EditNotesGroupFail,
  props<{ payload: HttpErrorResponse }>()
);

export const editNotesGroupSuccess = createAction(
  Type.EditNotesGroupSuccess,
  props<{ payload: EditNotesGroupSuccessPayload }>()
);

export const resetEditNotesGroupSuccess = createAction(
  Type.ResetEditNotesGroupSuccess
);

export const duplicateNotesGroup = createAction(
  Type.DuplicateNotesGroup,
  props<{ payload: DuplicateNotesGroupPayload }>()
);

export const duplicateNotesGroupFail = createAction(
  Type.DuplicateNotesGroupFail,
  props<{ payload: HttpErrorResponse }>()
);

export const duplicateNotesGroupSuccess = createAction(
  Type.DuplicateNotesGroupSuccess,
  props<{ payload: DuplicateNotesGroupSuccessPayload }>()
);

export const resetDuplicateNotesGroupSuccess = createAction(
  Type.ResetDuplicateNotesGroupSuccess
);

export const removeNotesGroup = createAction(
  Type.RemoveNotesGroup,
  props<{ payload: RemoveNotesGroupPayload }>()
);

export const removeNotesGroupFail = createAction(
  Type.RemoveNotesGroupFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeNotesGroupSuccess = createAction(
  Type.RemoveNotesGroupSuccess,
  props<{ payload: RemoveNotesGroupSuccessPayload }>()
);

export const resetRemoveNotesGroupSuccess = createAction(
  Type.ResetRemoveNotesGroupSuccess
);

export const addNote = createAction(
  Type.AddNote,
  props<{ payload: AddNotePayload }>()
);

export const addNoteFail = createAction(
  Type.AddNoteFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addNoteSuccess = createAction(
  Type.AddNoteSuccess,
  props<{ payload: AddNoteSuccessPayload }>()
);

export const resetAddNoteSuccess = createAction(Type.ResetAddNoteSuccess);

export const editNote = createAction(
  Type.EditNote,
  props<{ payload: EditNotePayload }>()
);

export const editNoteFail = createAction(
  Type.EditNoteFail,
  props<{ payload: HttpErrorResponse }>()
);

export const editNoteSuccess = createAction(
  Type.EditNoteSuccess,
  props<{ payload: EditNoteSuccessPayload }>()
);

export const resetEditNoteSuccess = createAction(Type.ResetEditNoteSuccess);

export const duplicateNote = createAction(
  Type.DuplicateNote,
  props<{ payload: DuplicateNotePayload }>()
);

export const duplicateNoteFail = createAction(
  Type.DuplicateNoteFail,
  props<{ payload: HttpErrorResponse }>()
);

export const duplicateNoteSuccess = createAction(
  Type.DuplicateNoteSuccess,
  props<{ payload: DuplicateNoteSuccessPayload }>()
);

export const resetDuplicateNoteSuccess = createAction(
  Type.ResetDuplicateNoteSuccess
);

export const changeNoteGroup = createAction(
  Type.ChangeNoteGroup,
  props<{ payload: ChangeNoteGroupPayload }>()
);

export const changeNoteGroupFail = createAction(
  Type.ChangeNoteGroupFail,
  props<{ payload: HttpErrorResponse }>()
);

export const changeNoteGroupSuccess = createAction(
  Type.ChangeNoteGroupSuccess,
  props<{ payload: ChangeNoteGroupSuccessPayload }>()
);

export const resetChangeNoteGroupSuccess = createAction(
  Type.ResetChangeNoteGroupSuccess
);

export const removeNote = createAction(
  Type.RemoveNote,
  props<{ payload: RemoveNotePayload }>()
);

export const removeNoteFail = createAction(
  Type.RemoveNoteFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeNoteSuccess = createAction(
  Type.RemoveNoteSuccess,
  props<{ payload: RemoveNoteSuccessPayload }>()
);

export const resetRemoveNoteSuccess = createAction(Type.ResetRemoveNoteSuccess);

export const resetErrors = createAction(Type.ResetErrors);
