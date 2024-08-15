import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

import { JhhClientDashboardOffersSingleOfferComponent } from './jhh-client-dashboard-offers-single-offer.component';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

describe('JhhClientDashboardOffersSingleOfferComponent', () => {
  let component: JhhClientDashboardOffersSingleOfferComponent;
  let fixture: ComponentFixture<JhhClientDashboardOffersSingleOfferComponent>;
  let mockActivatedRoute;
  let mockActionResolverService: Partial<ActionResolverService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({}),
    };

    mockActionResolverService = {
      executeAndWatch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardOffersSingleOfferComponent],
      providers: [
        provideMockStore(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardOffersSingleOfferComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
