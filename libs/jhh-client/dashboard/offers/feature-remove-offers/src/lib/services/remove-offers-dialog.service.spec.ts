import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { RemoveOffersDialogService } from '../services/remove-offers-dialog.service';
import { take } from 'rxjs';

describe('RemoveOfferDialogService', () => {
  let service: RemoveOffersDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveOffersDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit offer when openDialog is called', (done) => {
    const mockOffers = [
      {
        id: '1',
        position: 'Frontend developer',
      },
      {
        id: '2',
        position: 'Backend developer',
      },
    ] as any;
    service.offersToRemove$.pipe(take(1)).subscribe((offers) => {
      expect(offers).toEqual(mockOffers);
      done();
    });

    service.openDialog(mockOffers);
  });

  it('should clear offers when clearQuizToRemove is called', (done) => {
    service.offersToRemove$.pipe(take(1)).subscribe((offers) => {
      expect(offers).toBeUndefined();
      done();
    });

    service.clearOffersToRemove();
  });
});
