import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';

import { DialogComponent } from './dialog.component';

import { RemoveOffersDialogService } from '../../services/remove-offers-dialog.service';
import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockOffersFacade: any, mockRemoveOffersDialogService: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockOffersFacade = {
      removeOffersInProgress$: of(false),
      removeOffersError$: of(null),
      removeOffers: jest.fn(),
    };

    mockRemoveOffersDialogService = {
      clearOffersToRemove: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: [
        { provide: OffersFacade, useValue: mockOffersFacade },
        {
          provide: RemoveOffersDialogService,
          useValue: mockRemoveOffersDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.offers = [
      {
        id: '1',
        position: 'Backend Developer',
      },
      {
        id: '2',
        position: 'Frontend Developer',
      },
    ] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog on ngAfterViewInit', () => {
    const openSpy = jest.spyOn(component['dialog'], 'open');
    component.ngAfterViewInit();
    expect(openSpy).toHaveBeenCalledWith(component['dialogContent']);
  });

  it('should handle remove correctly', () => {
    component.handleRemove();
    expect(mockOffersFacade.removeOffers).toHaveBeenCalledWith([
      component.offers[0].id,
      component.offers[1].id,
    ]);
  });
});
