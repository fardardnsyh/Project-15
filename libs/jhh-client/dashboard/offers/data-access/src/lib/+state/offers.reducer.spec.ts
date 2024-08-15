import '@angular/compiler';
import { initialOffersState, offersReducer } from './offers.reducer';
import { HttpErrorResponse } from '@angular/common/http';

import * as OffersActions from './offers.actions';

describe('OffersReducer', () => {
  describe('addOffer actions', () => {
    it('should set addOffer inProgress to true on addOffer', () => {
      const action = OffersActions.addOffer({
        payload: {
          position: 'Frontend developer',
        } as any,
      });
      const state = offersReducer(initialOffersState, action);

      expect(state.addOffer.inProgress).toBe(true);
      expect(state.addOffer.error).toBeNull();
      expect(state.addOffer.success).toBe(false);
    });

    it('should add a new offer and set addOffer success to true on addOfferSuccess', () => {
      const addedOffer = {
        id: '1',
        position: 'Frontend developer',
      };
      const action = OffersActions.addOfferSuccess({
        payload: { addedOffer } as any,
      });
      const state = offersReducer(initialOffersState, action);

      expect(state.entities[addedOffer.id]).toEqual(addedOffer);
      expect(state.addOffer.inProgress).toBe(false);
      expect(state.addOffer.success).toBe(true);
    });

    it('should update state with error information on addOfferFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to add offer' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = OffersActions.addOfferFail({
        payload: errorResponse,
      });
      const state = offersReducer(initialOffersState, action);

      expect(state.addOffer.error).toBe('Failed to add offer');
      expect(state.addOffer.inProgress).toBe(false);
      expect(state.addOffer.success).toBe(false);
    });
  });

  describe('editOffer actions', () => {
    it('should set editOffer inProgress to true on editOffer', () => {
      const action = OffersActions.editOffer({
        payload: {
          offerId: '1337',
          position: 'Backend developer',
        } as any,
      });
      const state = offersReducer(initialOffersState, action);

      expect(state.editOffer.inProgress).toBe(true);
      expect(state.editOffer.error).toBeNull();
      expect(state.editOffer.success).toBe(false);
    });

    it('should update an offer and set editOffer success to true on editOfferSuccess', () => {
      const editedOffer = {
        id: '1',
        position: 'Backend developer',
      } as any;
      const action = OffersActions.editOfferSuccess({
        payload: { editedOffer },
      });
      const state = offersReducer(initialOffersState, action);

      expect(state.entities[editedOffer.id]).toEqual(
        expect.objectContaining(editedOffer)
      );
      expect(state.editOffer.inProgress).toBe(false);
      expect(state.editOffer.success).toBe(true);
    });

    it('should update state with error information on editOfferFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to edit offer' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = OffersActions.editOfferFail({
        payload: errorResponse,
      });
      const state = offersReducer(initialOffersState, action);

      expect(state.editOffer.error).toBe('Failed to edit offer');
      expect(state.editOffer.inProgress).toBe(false);
      expect(state.editOffer.success).toBe(false);
    });
  });

  describe('removeOffers actions', () => {
    it('should set removeOffers inProgress to true on removeOffers', () => {
      const action = OffersActions.removeOffers({
        payload: {
          offersId: ['1'],
        },
      });
      const state = offersReducer(initialOffersState, action);

      expect(state.removeOffers.inProgress).toBe(true);
      expect(state.removeOffers.error).toBeNull();
      expect(state.removeOffers.success).toBe(false);
    });

    it('should remove offers and set removeOffers success to true on removeOffersSuccess', () => {
      const removedOffers = [{ id: '1337' }] as any;
      const action = OffersActions.removeOffersSuccess({
        payload: { removedOffers },
      });
      const state = offersReducer(initialOffersState, action);

      expect(state.entities['1337']).toBeUndefined();
      expect(state.removeOffers.inProgress).toBe(false);
      expect(state.removeOffers.success).toBe(true);
    });

    it('should update state with error information on removeOffersFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to remove offers' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = OffersActions.removeOffersFail({
        payload: errorResponse,
      });
      const state = offersReducer(initialOffersState, action);

      expect(state.removeOffers.error).toBe('Failed to remove offers');
      expect(state.removeOffers.inProgress).toBe(false);
      expect(state.removeOffers.success).toBe(false);
    });
  });
});
