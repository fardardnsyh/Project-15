import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { OffersService } from './offers.service';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute, Offer } from '@jhh/shared/domain';
import { EditOfferPayload } from '@jhh/jhh-client/dashboard/offers/domain';

describe('OffersService', () => {
  let service: OffersService;
  let httpTestingController: HttpTestingController;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OffersService],
    });
    service = TestBed.inject(OffersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add an offer and return success payload', () => {
    const mockPayload = {
      position: 'Developer',
    } as Offer;
    const mockResponse = {
      data: {
        addedOffer: {
          id: '1',
          position: 'Developer',
        },
      },
    };

    service.addOffer(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.AddOffer}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should edit an offer and return success payload', () => {
    const mockPayload = {
      offerId: '1',
      position: 'Senior Developer',
    };
    const mockResponse = {
      data: {
        editedOffer: {
          id: '1',
          position: 'Senior Developer',
        },
      },
    };

    service.editOffer(mockPayload as EditOfferPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.EditOffer}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should remove offers and return success payload', () => {
    const mockPayload = {
      offersId: ['1', '2'],
    };
    const mockResponse = {
      data: {
        removedOffersIds: ['1', '2'],
      },
    };

    service.removeOffers(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      (request) =>
        request.url ===
          `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.RemoveOffers}` &&
        request.method === 'DELETE'
    );
    req.flush(mockResponse);
  });
});
