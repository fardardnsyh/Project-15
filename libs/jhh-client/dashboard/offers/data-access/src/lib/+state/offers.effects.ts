import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { mergeMap, tap } from 'rxjs/operators';

import * as OffersActions from './offers.actions';
import { OffersService } from '../services/offers.service';

import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { EditOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';
import { RemoveOffersDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';

import {
  AddOfferSuccessPayload,
  EditOfferSuccessPayload,
  RemoveOffersSuccessPayload,
} from '@jhh/jhh-client/dashboard/offers/domain';

@Injectable()
export class OffersEffects {
  private readonly actions$ = inject(Actions);
  private readonly offersService: OffersService = inject(OffersService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly editOfferDialogService: EditOfferDialogService = inject(
    EditOfferDialogService
  );
  private readonly removeOffersDialogService: RemoveOffersDialogService =
    inject(RemoveOffersDialogService);

  addOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.addOffer),
      fetch({
        run: (action) =>
          this.offersService.addOffer(action.payload).pipe(
            mergeMap((res: AddOfferSuccessPayload) => [
              OffersActions.addOfferSuccess({ payload: res }),
              OffersActions.resetAddOfferSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Offer added successfully!');
            })
          ),
        onError: (action, error) =>
          OffersActions.addOfferFail({ payload: error }),
      })
    )
  );

  editOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.editOffer),
      fetch({
        run: (action) =>
          this.offersService.editOffer(action.payload).pipe(
            mergeMap((res: EditOfferSuccessPayload) => [
              OffersActions.editOfferSuccess({ payload: res }),
              OffersActions.resetEditOfferSuccess(),
            ]),
            tap(() => {
              this.editOfferDialogService.clearOfferToEdit();
              this.snackbarService.open('Offer edited successfully!');
            })
          ),
        onError: (action, error) =>
          OffersActions.editOfferFail({ payload: error }),
      })
    )
  );

  removeOffers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.removeOffers),
      fetch({
        run: (action) =>
          this.offersService.removeOffers(action.payload).pipe(
            mergeMap((res: RemoveOffersSuccessPayload) => [
              OffersActions.removeOffersSuccess({ payload: res }),
              OffersActions.resetRemoveOffersSuccess(),
            ]),
            tap(() => {
              this.removeOffersDialogService.clearOffersToRemove();
              this.snackbarService.open('Offer(s) removed successfully!');
            })
          ),
        onError: (action, error) =>
          OffersActions.removeOffersFail({ payload: error }),
      })
    )
  );
}
