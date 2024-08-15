import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { OffersFacade } from './offers.facade';
import * as OffersActions from './offers.actions';
import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';
import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

describe('OffersFacade', () => {
  let store: MockStore;
  let actions$: Observable<any>;
  let mockActionResolverService: Partial<ActionResolverService>;
  let facade: OffersFacade;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    mockActionResolverService = {
      executeAndWatch: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        OffersFacade,
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    });

    store = TestBed.inject(MockStore);
    facade = TestBed.inject(OffersFacade);
    jest.spyOn(store, 'dispatch');
  });

  it('should execute and watch addOffer action', () => {
    const offerDetails = {
      position: 'Frontend Developer',
      link: 'http://example.com/frontend',
      company: 'Tech Solutions',
      companyType: OfferCompanyType.SoftwareHouse,
      location: OfferLocation.Remote,
      status: OfferStatus.Applied,
      priority: OfferPriority.High,
      minSalary: 11500,
      maxSalary: 16000,
      salaryCurrency: OfferSalaryCurrency.PLN,
      email: 'hr@example.com',
      description: 'description',
    };

    facade.addOffer(
      offerDetails.position,
      offerDetails.link,
      offerDetails.company,
      offerDetails.companyType,
      offerDetails.location,
      offerDetails.status,
      offerDetails.priority,
      offerDetails.minSalary,
      offerDetails.maxSalary,
      offerDetails.salaryCurrency,
      offerDetails.email,
      offerDetails.description
    );

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      OffersActions.addOffer({ payload: offerDetails }),
      OffersActions.Type.AddOfferSuccess,
      OffersActions.Type.AddOfferFail
    );
  });

  it('should execute and watch editOffer action', () => {
    const offerDetails = {
      offerId: '1337',
      slug: 'frontend-developer',
      position: 'Frontend Developer',
      link: 'http://example.com/frontend',
      company: 'Tech Solutions',
      companyType: OfferCompanyType.SoftwareHouse,
      location: OfferLocation.Remote,
      status: OfferStatus.Applied,
      priority: OfferPriority.High,
      minSalary: 11500,
      maxSalary: 16000,
      salaryCurrency: OfferSalaryCurrency.PLN,
      email: 'hr@example.com',
      description: 'description',
    };

    facade.editOffer(
      offerDetails.offerId,
      offerDetails.slug,
      offerDetails.position,
      offerDetails.link,
      offerDetails.company,
      offerDetails.companyType,
      offerDetails.location,
      offerDetails.status,
      offerDetails.priority,
      offerDetails.minSalary,
      offerDetails.maxSalary,
      offerDetails.salaryCurrency,
      offerDetails.email,
      offerDetails.description
    );

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      OffersActions.editOffer({ payload: offerDetails }),
      OffersActions.Type.EditOfferSuccess,
      OffersActions.Type.EditOfferFail
    );
  });

  it('should execute and watch removeOffers action', () => {
    const offersId = ['123', '456'];

    facade.removeOffers(offersId);

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      OffersActions.removeOffers({ payload: { offersId } }),
      OffersActions.Type.RemoveOffersSuccess,
      OffersActions.Type.RemoveOffersFail
    );
  });

  it('should dispatch resetErrors action', () => {
    facade.resetErrors();
    expect(store.dispatch).toHaveBeenCalledWith(OffersActions.resetErrors());
  });
});
