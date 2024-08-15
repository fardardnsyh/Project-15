import '@angular/compiler';

import * as OffersSelectors from './offers.selectors';
import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

const mockOffersInitialState = {
  offers: {
    ids: ['1', '2'],
    entities: {
      '1': {
        id: '1',
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
      },
      '2': {
        id: '2',
        slug: 'backend-developer',
        position: 'Backend Developer',
        link: 'http://example.com/backend',
        company: 'Tech Solutions',
        companyType: OfferCompanyType.Product,
        location: OfferLocation.Remote,
        status: OfferStatus.Rejected,
        priority: OfferPriority.Medium,
        minSalary: 11500,
        maxSalary: 16000,
        salaryCurrency: OfferSalaryCurrency.PLN,
        email: 'hr@example.com',
        description: 'description',
      },
    },
    addOffer: { inProgress: false, error: 'Error', success: true },
    editOffer: { inProgress: true, error: null, success: false },
    removeOffers: { inProgress: false, error: 'Error', success: true },
  } as any,
};

describe('Offers Selectors', () => {
  it('should select the addOffer inProgress state', () => {
    const result = OffersSelectors.selectAddOfferInProgress.projector(
      mockOffersInitialState.offers
    );
    expect(result).toBe(false);
  });

  it('should select the addOffer error state', () => {
    const result = OffersSelectors.selectAddOfferError.projector(
      mockOffersInitialState.offers
    );
    expect(result).toBe('Error');
  });

  it('should select the addOffer success state', () => {
    const result = OffersSelectors.selectAddOfferSuccess.projector(
      mockOffersInitialState.offers
    );
    expect(result).toBe(true);
  });

  it('should select the editOffer inProgress state', () => {
    const result = OffersSelectors.selectEditOfferInProgress.projector(
      mockOffersInitialState.offers
    );
    expect(result).toBe(true);
  });

  it('should select the editOffer error state', () => {
    const result = OffersSelectors.selectEditOfferError.projector(
      mockOffersInitialState.offers
    );
    expect(result).toBe(null);
  });

  it('should select the editOffer success state', () => {
    const result = OffersSelectors.selectEditOfferSuccess.projector(
      mockOffersInitialState.offers
    );
    expect(result).toBe(false);
  });

  it('should select the removeOffers inProgress state', () => {
    const result = OffersSelectors.selectRemoveOffersInProgress.projector(
      mockOffersInitialState.offers
    );
    expect(result).toBe(false);
  });

  it('should select the removeOffers error state', () => {
    const result = OffersSelectors.selectRemoveOffersError.projector(
      mockOffersInitialState.offers
    );
    expect(result).toBe('Error');
  });

  it('should select the removeOffers success state', () => {
    const result = OffersSelectors.selectRemoveOffersSuccess.projector(
      mockOffersInitialState.offers
    );
    expect(result).toBe(true);
  });

  it('should select an offer by slug', () => {
    const slug = 'frontend-developer';
    const result = OffersSelectors.selectOfferBySlug.projector(
      Object.values(mockOffersInitialState.offers.entities),
      slug
    );
    expect(result).toBeDefined();
    expect(result!.id).toBe('1');
  });

  it('should select an offer slug by id', () => {
    const offerId = '2';
    const result = OffersSelectors.selectOfferSlugById.projector(
      Object.values(mockOffersInitialState.offers.entities),
      { offerId }
    );
    expect(result).toBe('backend-developer');
  });

  it('should select limited offers', () => {
    const length = 1;
    const result = OffersSelectors.selectLimitedOffers.projector(
      Object.values(mockOffersInitialState.offers.entities),
      { length }
    );
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });
});
