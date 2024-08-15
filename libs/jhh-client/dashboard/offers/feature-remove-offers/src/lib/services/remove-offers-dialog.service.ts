import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Offer } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class RemoveOffersDialogService {
  private _offersToRemove$: Subject<Offer[] | undefined> = new Subject<
    Offer[] | undefined
  >();
  offersToRemove$: Observable<Offer[] | undefined> =
    this._offersToRemove$.asObservable();

  openDialog(offersToRemove: Offer[]): void {
    this._offersToRemove$.next(offersToRemove);
  }

  clearOffersToRemove(): void {
    this._offersToRemove$.next(undefined);
  }
}
