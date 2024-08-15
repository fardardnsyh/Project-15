import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardBreadcrumbsComponent } from './jhh-client-dashboard-breadcrumbs.component';

describe('JhhDashboardBreadcrumbsComponent', () => {
  let component: JhhClientDashboardBreadcrumbsComponent;
  let fixture: ComponentFixture<JhhClientDashboardBreadcrumbsComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardBreadcrumbsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
