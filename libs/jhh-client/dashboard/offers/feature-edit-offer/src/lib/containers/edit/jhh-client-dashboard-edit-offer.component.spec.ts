import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardEditOfferComponent } from './jhh-client-dashboard-edit-offer.component';

describe('JhhClientDashboardEditOfferComponentComponent', () => {
  let component: JhhClientDashboardEditOfferComponent;
  let fixture: ComponentFixture<JhhClientDashboardEditOfferComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardEditOfferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardEditOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
