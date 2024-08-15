import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as OffersActions from './offers.actions';

import { Offer } from '@jhh/shared/domain';
import { OperationState } from '@jhh/jhh-client/shared/domain';

import { ResetOperationStateError } from '@jhh/jhh-client/shared/util-reset-operation-state-error';

export const OFFERS_STATE_KEY = 'offers';

export interface OffersState extends EntityState<Offer> {
  addOffer: OperationState;
  editOffer: OperationState;
  removeOffers: OperationState;
}

export const adapter: EntityAdapter<Offer> = createEntityAdapter<Offer>();

export const initialOffersState: OffersState = adapter.getInitialState({
  addOffer: {
    inProgress: false,
    error: null,
    success: false,
  },
  editOffer: {
    inProgress: false,
    error: null,
    success: false,
  },
  removeOffers: {
    inProgress: false,
    error: null,
    success: false,
  },
});

const reducer: ActionReducer<OffersState> = createReducer(
  initialOffersState,
  on(OffersActions.setOffers, (state, { offers }) =>
    adapter.setAll(offers, state)
  ),
  on(OffersActions.addOffer, (state) => ({
    ...state,
    addOffer: {
      ...state.addOffer,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(OffersActions.addOfferFail, (state, { payload }) => ({
    ...state,
    addOffer: {
      ...state.addOffer,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(OffersActions.addOfferSuccess, (state, { payload }) => {
    return adapter.addOne(payload.addedOffer, {
      ...state,
      addOffer: {
        ...state.addOffer,
        inProgress: false,
        success: true,
        error: null,
      },
    });
  }),
  on(OffersActions.resetAddOfferSuccess, (state) => ({
    ...state,
    addOffer: {
      ...state.addOffer,
      success: false,
    },
  })),
  on(OffersActions.editOffer, (state) => ({
    ...state,
    editOffer: {
      ...state.editOffer,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(OffersActions.editOfferFail, (state, { payload }) => ({
    ...state,
    editOffer: {
      ...state.editOffer,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(OffersActions.editOfferSuccess, (state, { payload }) => ({
    ...adapter.upsertOne(payload.editedOffer, state),
    editOffer: {
      ...state.editOffer,
      inProgress: false,
      success: true,
    },
  })),
  on(OffersActions.resetEditOfferSuccess, (state) => ({
    ...state,
    editOffer: {
      ...state.editOffer,
      success: false,
    },
  })),
  on(OffersActions.removeOffers, (state) => ({
    ...state,
    removeOffers: {
      ...state.removeOffers,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(OffersActions.removeOffersFail, (state, { payload }) => ({
    ...state,
    removeOffers: {
      ...state.removeOffers,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(OffersActions.removeOffersSuccess, (state, { payload }) => {
    return adapter.removeMany(
      payload.removedOffers.map((offer) => offer.id),
      {
        ...state,
        removeOffers: {
          ...state.removeOffers,
          inProgress: false,
          success: true,
        },
      }
    );
  }),
  on(OffersActions.resetRemoveOffersSuccess, (state) => ({
    ...state,
    removeOffers: {
      ...state.removeOffers,
      success: false,
    },
  })),
  on(OffersActions.resetErrors, (state) => {
    return {
      ...state,
      addOffer: ResetOperationStateError(state.addOffer),
      editOffer: ResetOperationStateError(state.editOffer),
      removeOffers: ResetOperationStateError(state.removeOffers),
    };
  })
);

export function offersReducer(state: OffersState | undefined, action: Action) {
  return reducer(state, action);
}
