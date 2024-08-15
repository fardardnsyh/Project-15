import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardRemoveOffersComponent } from './jhh-client-dashboard-remove-offers.component';

describe('JhhClientDashboardRemoveOfferComponent', () => {
  let component: JhhClientDashboardRemoveOffersComponent;
  let fixture: ComponentFixture<JhhClientDashboardRemoveOffersComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardRemoveOffersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardRemoveOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
