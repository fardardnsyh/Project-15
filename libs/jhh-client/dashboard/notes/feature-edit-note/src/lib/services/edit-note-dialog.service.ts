import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Note } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class EditNoteDialogService {
  private _noteToEdit$: Subject<Note | undefined> = new Subject<
    Note | undefined
  >();
  noteToEdit$: Observable<Note | undefined> = this._noteToEdit$.asObservable();

  openDialog(noteToEdit: Note): void {
    this._noteToEdit$.next(noteToEdit);
  }

  clearNoteToEdit(): void {
    this._noteToEdit$.next(undefined);
  }
}
