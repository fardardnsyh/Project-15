import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { EditOfferDialogService } from './edit-offer-dialog.service';

describe('EditOfferDialogService', () => {
  let service: EditOfferDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditOfferDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the correct Offer when openDialog is called', (done) => {
    const testOffer = {
      position: 'Offer',
      items: [] as any,
    } as any;

    service.offerToEdit$.subscribe((value) => {
      expect(value).toEqual(testOffer);
      done();
    });

    service.openDialog(testOffer);
  });

  it('should emit undefined when clearOfferToEdit is called', (done) => {
    service.offerToEdit$.subscribe((value) => {
      expect(value).toBeUndefined();
      done();
    });

    service.clearOfferToEdit();
  });
});
