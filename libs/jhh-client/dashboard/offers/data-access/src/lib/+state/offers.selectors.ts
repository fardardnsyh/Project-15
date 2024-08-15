import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, OFFERS_STATE_KEY, OffersState } from './offers.reducer';

import { Offer } from '@jhh/shared/domain';

export const selectOffersState =
  createFeatureSelector<OffersState>(OFFERS_STATE_KEY);

export const {
  selectIds: selectOffersIds,
  selectEntities: selectColumnEntities,
  selectAll: selectAllOffers,
  selectTotal: selectTotalOffers,
} = adapter.getSelectors(selectOffersState);

export const selectOffers = createSelector(
  selectAllOffers,
  (offers: Offer[]) => offers
);

export const selectAddOfferInProgress = createSelector(
  selectOffersState,
  (state: OffersState) => state.addOffer.inProgress
);

export const selectAddOfferError = createSelector(
  selectOffersState,
  (state: OffersState) => state.addOffer.error
);

export const selectAddOfferSuccess = createSelector(
  selectOffersState,
  (state: OffersState) => state.addOffer.success!
);

export const selectEditOfferInProgress = createSelector(
  selectOffersState,
  (state: OffersState) => state.editOffer.inProgress
);

export const selectEditOfferError = createSelector(
  selectOffersState,
  (state: OffersState) => state.editOffer.error
);

export const selectEditOfferSuccess = createSelector(
  selectOffersState,
  (state: OffersState) => state.editOffer.success!
);

export const selectRemoveOffersInProgress = createSelector(
  selectOffersState,
  (state: OffersState) => state.removeOffers.inProgress
);

export const selectRemoveOffersError = createSelector(
  selectOffersState,
  (state: OffersState) => state.removeOffers.error
);

export const selectRemoveOffersSuccess = createSelector(
  selectOffersState,
  (state: OffersState) => state.removeOffers.success!
);

export const selectOfferBySlug = createSelector(
  selectAllOffers,
  (offers: Offer[], slug: string) => offers.find((offer) => offer.slug === slug)
);

export const selectOfferSlugById = createSelector(
  selectAllOffers,
  (offers: Offer[], props: { offerId: string }) => {
    if (!props.offerId) {
      return null;
    }

    const offer: Offer | undefined = offers.find(
      (offer) => offer.id === props.offerId
    );

    return offer ? offer.slug : null;
  }
);

export const selectLimitedOffers = createSelector(
  selectAllOffers,
  (offers: Offer[], props: { length: number }) => offers.slice(0, props.length)
);
