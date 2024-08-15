import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AddComponent } from './add.component';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let mockOffersFacade: Partial<OffersFacade>;
  let mockDialog: jest.Mocked<MatDialog>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn(),
      afterClosed: jest.fn().mockReturnValue(of(null)),
    } as unknown as jest.Mocked<MatDialog>;

    mockOffersFacade = {
      addOfferInProgress$: of(false),
      addOfferError$: of(null),
      addOfferSuccess$: of(false),
    };

    await TestBed.configureTestingModule({
      imports: [AddComponent],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: OffersFacade, useValue: mockOffersFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display spinner when addOfferInProgress$ emits true', (done) => {
    mockOffersFacade.addOfferInProgress$ = of(true);
    component.ngOnInit();
    component.addOfferInProgress$.subscribe((isInProgress) => {
      expect(isInProgress).toBe(true);
      done();
    });
  });

  it('should display error message when addOfferError$ emits value', (done) => {
    const errorMessage = 'Error occurred';
    mockOffersFacade.addOfferError$ = of(errorMessage);
    component.ngOnInit();
    component.addOfferError$.subscribe((error) => {
      expect(error).toBe(errorMessage);
      done();
    });
  });
});
