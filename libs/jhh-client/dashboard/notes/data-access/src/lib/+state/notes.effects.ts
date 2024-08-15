import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { mergeMap, tap } from 'rxjs/operators';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

import * as NotesActions from './notes.actions';
import { NotesService } from '../services/notes.service';
import { EditNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-note';
import { RemoveNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-note';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { ChangeNoteGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-change-note-group';
import { EditNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';
import { RemoveNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-group';

import {
  AddNotesGroupSuccessPayload,
  AddNoteSuccessPayload,
  ChangeNoteGroupSuccessPayload,
  DuplicateNotesGroupSuccessPayload,
  DuplicateNoteSuccessPayload,
  EditNotesGroupSuccessPayload,
  EditNoteSuccessPayload,
  RemoveNotesGroupSuccessPayload,
  RemoveNoteSuccessPayload,
} from '@jhh/jhh-client/dashboard/notes/domain';

@Injectable()
export class NotesEffects {
  private readonly actions$ = inject(Actions);
  private readonly notesService: NotesService = inject(NotesService);
  private readonly editNoteDialogService: EditNoteDialogService = inject(
    EditNoteDialogService
  );
  private readonly changeNoteGroupDialogService: ChangeNoteGroupDialogService =
    inject(ChangeNoteGroupDialogService);
  private readonly removeNoteDialogService: RemoveNoteDialogService = inject(
    RemoveNoteDialogService
  );
  private readonly editNotesGroupDialogService: EditNotesGroupDialogService =
    inject(EditNotesGroupDialogService);
  private readonly removeNotesGroupDialogService: RemoveNotesGroupDialogService =
    inject(RemoveNotesGroupDialogService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  addNotesGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.addNotesGroup),
      fetch({
        run: (action) =>
          this.notesService.addNotesGroup(action.payload).pipe(
            mergeMap((res: AddNotesGroupSuccessPayload) => [
              NotesActions.addNotesGroupSuccess({ payload: res }),
              NotesActions.resetAddNotesGroupSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Group added successfully!');
            })
          ),
        onError: (action, error) =>
          NotesActions.addNotesGroupFail({ payload: error }),
      })
    )
  );

  editNotesGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.editNotesGroup),
      fetch({
        run: (action) =>
          this.notesService.editNotesGroup(action.payload).pipe(
            mergeMap((res: EditNotesGroupSuccessPayload) => [
              NotesActions.editNotesGroupSuccess({ payload: res }),
              NotesActions.resetEditNotesGroupSuccess(),
            ]),
            tap(() => {
              this.editNotesGroupDialogService.clearNotesGroupToEdit();
              this.snackbarService.open('Group edited successfully!');
            })
          ),
        onError: (action, error) =>
          NotesActions.editNotesGroupFail({ payload: error }),
      })
    )
  );

  duplicateNotesGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.duplicateNotesGroup),
      fetch({
        run: (action) => {
          const snackbarRef: MatSnackBarRef<TextOnlySnackBar> =
            this.snackbarService.openIndefinite('Duplicating group...');
          return this.notesService.duplicateNotesGroup(action.payload).pipe(
            mergeMap((res: DuplicateNotesGroupSuccessPayload) => [
              NotesActions.duplicateNotesGroupSuccess({ payload: res }),
              NotesActions.resetDuplicateNotesGroupSuccess(),
            ]),
            tap(() => {
              snackbarRef.dismiss();
              this.snackbarService.open('Group duplicated successfully!');
            })
          );
        },
        onError: (action, error) => {
          this.snackbarService.open(
            'Something went wrong when duplicating a group. Try it again'
          );
          return NotesActions.duplicateNotesGroupFail({ payload: error });
        },
      })
    )
  );

  removeNotesGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.removeNotesGroup),
      fetch({
        run: (action) =>
          this.notesService.removeNotesGroup(action.payload).pipe(
            mergeMap((res: RemoveNotesGroupSuccessPayload) => [
              NotesActions.removeNotesGroupSuccess({ payload: res }),
              NotesActions.resetRemoveNotesGroupSuccess(),
            ]),
            tap(() => {
              this.removeNotesGroupDialogService.clearNotesGroupToRemove();
              this.snackbarService.open('Group removed successfully!');
            })
          ),
        onError: (action, error) =>
          NotesActions.removeNotesGroupFail({ payload: error }),
      })
    )
  );

  addNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.addNote),
      fetch({
        run: (action) =>
          this.notesService.addNote(action.payload).pipe(
            mergeMap((res: AddNoteSuccessPayload) => [
              NotesActions.addNoteSuccess({ payload: res }),
              NotesActions.resetAddNoteSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Note added successfully!');
            })
          ),
        onError: (action, error) =>
          NotesActions.addNoteFail({ payload: error }),
      })
    )
  );

  editNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.editNote),
      fetch({
        run: (action) =>
          this.notesService.editNote(action.payload).pipe(
            mergeMap((res: EditNoteSuccessPayload) => [
              NotesActions.editNoteSuccess({ payload: res }),
              NotesActions.resetEditNoteSuccess(),
            ]),
            tap(() => {
              this.editNoteDialogService.clearNoteToEdit();
              this.snackbarService.open('Note edited successfully!');
            })
          ),
        onError: (action, error) =>
          NotesActions.editNoteFail({ payload: error }),
      })
    )
  );

  duplicateNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.duplicateNote),
      fetch({
        run: (action) => {
          const snackbarRef: MatSnackBarRef<TextOnlySnackBar> =
            this.snackbarService.openIndefinite('Duplicating note...');
          return this.notesService.duplicateNote(action.payload).pipe(
            mergeMap((res: DuplicateNoteSuccessPayload) => [
              NotesActions.duplicateNoteSuccess({ payload: res }),
              NotesActions.resetDuplicateNoteSuccess(),
            ]),
            tap(() => {
              snackbarRef.dismiss();
              this.snackbarService.open('Note duplicated successfully!');
            })
          );
        },
        onError: (action, error) => {
          this.snackbarService.open(
            'Something went wrong when duplicating a note. Try it again'
          );
          return NotesActions.duplicateNoteFail({ payload: error });
        },
      })
    )
  );

  changeNoteGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.changeNoteGroup),
      fetch({
        run: (action) =>
          this.notesService.changeNoteGroup(action.payload).pipe(
            mergeMap((res: ChangeNoteGroupSuccessPayload) => [
              NotesActions.changeNoteGroupSuccess({ payload: res }),
              NotesActions.resetChangeNoteGroupSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open(
                'Note successfully moved to another group!'
              );
              this.changeNoteGroupDialogService.clearNoteToMove();
            })
          ),
        onError: (action, error) =>
          NotesActions.changeNoteGroupFail({ payload: error }),
      })
    )
  );

  removeNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.removeNote),
      fetch({
        run: (action) =>
          this.notesService.removeNote(action.payload).pipe(
            mergeMap((res: RemoveNoteSuccessPayload) => [
              NotesActions.removeNoteSuccess({ payload: res }),
              NotesActions.resetRemoveNoteSuccess(),
            ]),
            tap(() => {
              this.removeNoteDialogService.clearNoteToRemove();
              this.snackbarService.open('Note removed successfully!');
            })
          ),
        onError: (action, error) =>
          NotesActions.removeNoteFail({ payload: error }),
      })
    )
  );
}
