import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import * as OffersActions from './offers.actions';
import { OffersEffects } from './offers.effects';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { OffersService } from '../services/offers.service';
import { EditOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';
import { RemoveOffersDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';

describe('OffersEffects', () => {
  let actions$: Observable<any>;
  let effects: OffersEffects;
  let offersService: any;
  let snackbarService: any;
  let editOfferDialogService: any;
  let removeOffersDialogService: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    offersService = {
      addOffer: jest.fn(),
      editOffer: jest.fn(),
      removeOffers: jest.fn(),
    };

    snackbarService = {
      open: jest.fn(),
    };

    editOfferDialogService = {
      clearOfferToEdit: jest.fn(),
    };

    removeOffersDialogService = {
      clearOffersToRemove: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        OffersEffects,
        provideMockActions(() => actions$),
        { provide: OffersService, useValue: offersService },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: EditOfferDialogService, useValue: editOfferDialogService },
        {
          provide: RemoveOffersDialogService,
          useValue: removeOffersDialogService,
        },
      ],
    });

    effects = TestBed.inject(OffersEffects);
  });

  it('should dispatch addOfferSuccess and resetAddOfferSuccess actions on successful addition', () => {
    const offerPayload = { title: 'New Offer' };
    const successPayload = { id: '123', title: 'New Offer' };

    offersService.addOffer.mockReturnValue(of(successPayload));
    actions$ = of(OffersActions.addOffer({ payload: offerPayload } as any));

    effects.addOffer$.subscribe((action) => {
      if (action.type === OffersActions.addOfferSuccess.type) {
        expect(action).toEqual(
          OffersActions.addOfferSuccess({ payload: successPayload } as any)
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Offer added successfully!'
        );
      } else if (action.type === OffersActions.resetAddOfferSuccess.type) {
        expect(action).toEqual(OffersActions.resetAddOfferSuccess());
      }
    });
  });

  it('should dispatch editOfferSuccess and resetEditOfferSuccess actions on successful edit', () => {
    const offerPayload = { id: '123', title: 'Updated Offer' };
    const successPayload = { id: '123', title: 'Updated Offer' };

    offersService.editOffer.mockReturnValue(of(successPayload));
    actions$ = of(OffersActions.editOffer({ payload: offerPayload } as any));

    effects.editOffer$.subscribe((action) => {
      if (action.type === OffersActions.editOfferSuccess.type) {
        expect(action).toEqual(
          OffersActions.editOfferSuccess({ payload: successPayload } as any)
        );
        expect(editOfferDialogService.clearOfferToEdit).toHaveBeenCalled();
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Offer edited successfully!'
        );
      } else if (action.type === OffersActions.resetEditOfferSuccess.type) {
        expect(action).toEqual(OffersActions.resetEditOfferSuccess());
      }
    });
  });

  it('should dispatch removeOffersSuccess and resetRemoveOffersSuccess actions on successful removal', () => {
    const offerIdsPayload = ['123'];
    const successPayload = { ids: ['123'] };

    offersService.removeOffers.mockReturnValue(of(successPayload));
    actions$ = of(
      OffersActions.removeOffers({ payload: offerIdsPayload } as any)
    );

    effects.removeOffers$.subscribe((action) => {
      if (action.type === OffersActions.removeOffersSuccess.type) {
        expect(action).toEqual(
          OffersActions.removeOffersSuccess({ payload: successPayload } as any)
        );
        expect(
          removeOffersDialogService.clearOffersToRemove
        ).toHaveBeenCalled();
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Offer(s) removed successfully!'
        );
      } else if (action.type === OffersActions.resetRemoveOffersSuccess.type) {
        expect(action).toEqual(OffersActions.resetRemoveOffersSuccess());
      }
    });
  });
});
