import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';

import { JhhClientDashboardHomeComponent } from './jhh-client-dashboard-home.component';

import { DashboardFacade } from '@jhh/jhh-client/dashboard/data-access';

describe('JhhClientDashboardHomeComponent', () => {
  let component: JhhClientDashboardHomeComponent;
  let fixture: ComponentFixture<JhhClientDashboardHomeComponent>;
  let mockDashboardFacade: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockDashboardFacade = {
      getHomeData: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardHomeComponent],
      providers: [{ provide: DashboardFacade, useValue: mockDashboardFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch home data on init', () => {
    mockDashboardFacade.getHomeData.mockReturnValue(of([]));

    fixture.detectChanges();

    expect(mockDashboardFacade.getHomeData).toHaveBeenCalled();
  });
});
