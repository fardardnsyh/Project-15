import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { MenuComponent } from './menu.component';

import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

import { EditOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';
import { RemoveOffersDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mockEditOfferDialogService: any;
  let mockRemoveOffersDialogService: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockEditOfferDialogService = { openDialog: jest.fn() };
    mockRemoveOffersDialogService = { openDialog: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        {
          provide: EditOfferDialogService,
          useValue: mockEditOfferDialogService,
        },
        {
          provide: RemoveOffersDialogService,
          useValue: mockRemoveOffersDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    component.offer = {
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
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openDialog on EditOfferDialogService with the offer', () => {
    component.openEditOfferDialog();
    expect(mockEditOfferDialogService.openDialog).toHaveBeenCalledWith(
      component.offer
    );
  });

  it('should call openDialog on RemoveOffersDialogService with the offer', () => {
    component.openRemoveOfferDialog();
    expect(mockRemoveOffersDialogService.openDialog).toHaveBeenCalledWith([
      component.offer,
    ]);
  });
});
