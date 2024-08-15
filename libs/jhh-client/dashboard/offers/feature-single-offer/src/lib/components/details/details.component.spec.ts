import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { Clipboard } from '@angular/cdk/clipboard';

import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

import { DetailsComponent } from './details.component';

import { GetOfferStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-offer-status-icon';
import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

jest.mock('@angular/cdk/clipboard', () => ({
  Clipboard: jest.fn().mockImplementation(() => ({
    copy: jest.fn(),
  })),
}));

jest.mock('@jhh/jhh-client/shared/util-snackbar', () => ({
  SnackbarService: jest.fn().mockImplementation(() => ({
    open: jest.fn(),
  })),
}));

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let mockClipboard: any;
  let mockSnackbarService: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockClipboard = { copy: jest.fn() };
    mockSnackbarService = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [DetailsComponent],
      providers: [
        { provide: Clipboard, useValue: mockClipboard },
        { provide: SnackbarService, useValue: mockSnackbarService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
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
    component.breakpoint = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update statusIcon when offer changes', () => {
    const newOffer = { status: 'Accepted', email: 'test@example.com' } as any;
    component.offer = newOffer;

    component.ngOnChanges({
      offer: new SimpleChange(null, newOffer, false),
    });

    fixture.detectChanges();

    expect(component.statusIcon).toEqual(GetOfferStatusIcon(newOffer.status));
  });

  it('should copy email to clipboard and show snackbar on copyEmail call', () => {
    const testEmail = 'test@example.com';
    component.offer = { email: testEmail } as any;

    component.copyEmail();

    expect(mockClipboard.copy).toHaveBeenCalledWith(testEmail);
    expect(mockSnackbarService.open).toHaveBeenCalledWith(
      'E-mail copied to clipboard.'
    );
  });
});
