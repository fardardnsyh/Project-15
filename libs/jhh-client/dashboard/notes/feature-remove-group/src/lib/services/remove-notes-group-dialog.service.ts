import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { NotesGroup } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class RemoveNotesGroupDialogService {
  private _notesGroupToRemove$: Subject<NotesGroup | undefined> = new Subject<
    NotesGroup | undefined
  >();
  notesGroupToRemove$: Observable<NotesGroup | undefined> =
    this._notesGroupToRemove$.asObservable();

  openDialog(notesGroupToRemove: NotesGroup): void {
    this._notesGroupToRemove$.next(notesGroupToRemove);
  }

  clearNotesGroupToRemove(): void {
    this._notesGroupToRemove$.next(undefined);
  }
}
