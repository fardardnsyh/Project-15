import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { Offer } from '@jhh/shared/domain';

import {
  AddOfferPayload,
  AddOfferSuccessPayload,
  EditOfferPayload,
  EditOfferSuccessPayload,
  RemoveOffersPayload,
  RemoveOffersSuccessPayload,
} from '@jhh/jhh-client/dashboard/offers/domain';

export enum Type {
  SetOffers = '[Offers] Set Offers',
  AddOffer = '[Offers] Add Offer',
  AddOfferFail = '[Offers] Add Offer Fail',
  AddOfferSuccess = '[Offers] Add Offer Success',
  ResetAddOfferSuccess = '[Offers] Reset Add Offer Success',
  EditOffer = '[Offers] Edit Offer',
  EditOfferFail = '[Offers] Edit Offer Fail',
  EditOfferSuccess = '[Offers] Edit Offer Success',
  ResetEditOfferSuccess = '[Offers] Reset Edit Offer Success',
  RemoveOffers = '[Offers] Remove Offers',
  RemoveOffersFail = '[Offers] Remove Offers Fail',
  RemoveOffersSuccess = '[Offers] Remove Offers Success',
  ResetRemoveOffersSuccess = '[Offers] Reset Remove Offers Success',
  ResetErrors = '[Offers] Reset Errors',
}

export const setOffers = createAction(
  Type.SetOffers,
  props<{ offers: Offer[] }>()
);

export const addOffer = createAction(
  Type.AddOffer,
  props<{ payload: AddOfferPayload }>()
);

export const addOfferFail = createAction(
  Type.AddOfferFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addOfferSuccess = createAction(
  Type.AddOfferSuccess,
  props<{ payload: AddOfferSuccessPayload }>()
);

export const resetAddOfferSuccess = createAction(Type.ResetAddOfferSuccess);

export const editOffer = createAction(
  Type.EditOffer,
  props<{ payload: EditOfferPayload }>()
);

export const editOfferFail = createAction(
  Type.EditOfferFail,
  props<{ payload: HttpErrorResponse }>()
);

export const editOfferSuccess = createAction(
  Type.EditOfferSuccess,
  props<{ payload: EditOfferSuccessPayload }>()
);

export const resetEditOfferSuccess = createAction(Type.ResetEditOfferSuccess);

export const removeOffers = createAction(
  Type.RemoveOffers,
  props<{ payload: RemoveOffersPayload }>()
);

export const removeOffersFail = createAction(
  Type.RemoveOffersFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeOffersSuccess = createAction(
  Type.RemoveOffersSuccess,
  props<{ payload: RemoveOffersSuccessPayload }>()
);

export const resetRemoveOffersSuccess = createAction(
  Type.ResetRemoveOffersSuccess
);

export const resetErrors = createAction(Type.ResetErrors);
