import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogComponent } from './dialog.component';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';
import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockOffersFacade: Partial<OffersFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockOffersFacade = {
      editOfferInProgress$: of(false),
      editOfferError$: of(null),
      editOfferSuccess$: of(false),
      editOffer: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DialogComponent, NoopAnimationsModule],
      providers: [{ provide: OffersFacade, useValue: mockOffersFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
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

  it('should open the dialog on ngAfterViewInit', () => {
    const openSpy = jest.spyOn(component['dialog'], 'open');
    component.ngAfterViewInit();
    expect(openSpy).toHaveBeenCalledWith(component['dialogContent']);
  });

  it('should call editOffer on form submit if form is valid', () => {
    component.formGroup.setValue({
      slug: 'backend-developer',
      position: 'Backend Developer',
      link: 'http://example.com/backend',
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
    });

    component.onSubmit();

    expect(mockOffersFacade.editOffer).toHaveBeenCalled();
  });

  it('should not call editOffer if form is invalid', () => {
    component.formGroup.setValue({
      slug: 'frontend-developer',
      position: 'Frontend Developer',
      link: 'http://example.com/frontend',
      company: 'Tech Solutions',
      companyType: OfferCompanyType.SoftwareHouse,
      location: OfferLocation.Remote,
      status: OfferStatus.Applied,
      priority: OfferPriority.High,
      minSalary: 115004434344343432423234234234,
      maxSalary: 16000234234234234234234324234234,
      salaryCurrency: OfferSalaryCurrency.PLN,
      email: 'hr@example.com',
      description: 'description',
    });

    component.onSubmit();

    expect(mockOffersFacade.editOffer).not.toHaveBeenCalled();
  });
});
