import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Quiz } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class RemovePracticeQuizDialogService {
  private _quizToRemove$: Subject<Quiz | undefined> = new Subject<
    Quiz | undefined
  >();
  quizToRemove$: Observable<Quiz | undefined> =
    this._quizToRemove$.asObservable();

  openDialog(quizToRemove: Quiz): void {
    this._quizToRemove$.next(quizToRemove);
  }

  clearQuizToRemove(): void {
    this._quizToRemove$.next(undefined);
  }
}
