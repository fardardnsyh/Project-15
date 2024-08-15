import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Offer } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class EditOfferDialogService {
  private _offerToEdit$: Subject<Offer | undefined> = new Subject<
    Offer | undefined
  >();
  offerToEdit$: Observable<Offer | undefined> =
    this._offerToEdit$.asObservable();

  openDialog(offerToEdit: Offer): void {
    this._offerToEdit$.next(offerToEdit);
  }

  clearOfferToEdit(): void {
    this._offerToEdit$.next(undefined);
  }
}
