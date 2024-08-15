import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Quiz } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class EditPracticeQuizDialogService {
  private _quizToEdit$: Subject<Quiz | undefined> = new Subject<
    Quiz | undefined
  >();
  quizToEdit$: Observable<Quiz | undefined> = this._quizToEdit$.asObservable();

  openDialog(quizToEdit: Quiz): void {
    this._quizToEdit$.next(quizToEdit);
  }

  clearQuizToEdit(): void {
    this._quizToEdit$.next(undefined);
  }
}
