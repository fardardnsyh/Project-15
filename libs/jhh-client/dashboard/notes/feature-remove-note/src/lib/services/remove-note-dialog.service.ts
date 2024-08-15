import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Note } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class RemoveNoteDialogService {
  private _noteToRemove$: Subject<Note | undefined> = new Subject<
    Note | undefined
  >();
  noteToRemove$: Observable<Note | undefined> =
    this._noteToRemove$.asObservable();

  openDialog(noteToRemove: Note): void {
    this._noteToRemove$.next(noteToRemove);
  }

  clearNoteToRemove(): void {
    this._noteToRemove$.next(undefined);
  }
}
