import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { ControlsComponent } from './controls.component';

import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';
import { EditOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';
import { RemoveOffersDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';

describe('ControlsComponent', () => {
  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;
  let mockOffersFacade: Partial<OffersFacade>;
  let mockEditOfferDialogService: Partial<EditOfferDialogService>;
  let mockRemoveOffersDialogService: Partial<RemoveOffersDialogService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockOffersFacade = {
      editOfferSuccess$: of(false),
      removeOffersSuccess$: of(false),
    };

    mockEditOfferDialogService = { openDialog: jest.fn() };
    mockRemoveOffersDialogService = { openDialog: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ControlsComponent],
      providers: [
        provideMockStore(),
        {
          provide: EditOfferDialogService,
          useValue: mockEditOfferDialogService,
        },
        {
          provide: RemoveOffersDialogService,
          useValue: mockRemoveOffersDialogService,
        },
        { provide: OffersFacade, useValue: mockOffersFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlsComponent);
    component = fixture.componentInstance;
    component.offer = {
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
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openDialog on editOfferDialogService when openEditOfferDialog is called', () => {
    component.openEditOfferDialog();
    expect(mockEditOfferDialogService.openDialog).toHaveBeenCalledWith(
      component.offer
    );
  });

  it('should call openDialog on removeOffersDialogService when openRemoveOffersDialog is called', () => {
    component.openRemoveOffersDialog();
    expect(mockRemoveOffersDialogService.openDialog).toHaveBeenCalledWith([
      component.offer,
    ]);
  });
});
