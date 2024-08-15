import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { NotesGroup } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class EditNotesGroupDialogService {
  private _notesGroupToEdit$: Subject<NotesGroup | undefined> = new Subject<
    NotesGroup | undefined
  >();
  notesGroupToEdit$: Observable<NotesGroup | undefined> =
    this._notesGroupToEdit$.asObservable();

  openDialog(notesGroupToEdit: NotesGroup): void {
    this._notesGroupToEdit$.next(notesGroupToEdit);
  }

  clearNotesGroupToEdit(): void {
    this._notesGroupToEdit$.next(undefined);
  }
}
