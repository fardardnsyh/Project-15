import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';

import { JhhClientDashboardOffersComponent } from './jhh-client-dashboard-offers.component';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';

describe('JhhClientDashboardOffersComponent', () => {
  let component: JhhClientDashboardOffersComponent;
  let fixture: ComponentFixture<JhhClientDashboardOffersComponent>;
  let mockOffersFacade: Partial<OffersFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockOffersFacade = {
      offers$: of([]),
      addOfferSuccess$: of(false),
    };

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardOffersComponent],
      providers: [{ provide: OffersFacade, useValue: mockOffersFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
