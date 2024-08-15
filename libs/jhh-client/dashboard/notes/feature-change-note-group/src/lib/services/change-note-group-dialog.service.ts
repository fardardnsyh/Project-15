import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Note } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class ChangeNoteGroupDialogService {
  private _noteToMove$: Subject<Note | undefined> = new Subject<
    Note | undefined
  >();
  noteToMove$: Observable<Note | undefined> = this._noteToMove$.asObservable();

  openDialog(noteToMove: Note): void {
    this._noteToMove$.next(noteToMove);
  }

  clearNoteToMove(): void {
    this._noteToMove$.next(undefined);
  }
}
