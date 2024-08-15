import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardFooterComponent } from './jhh-client-dashboard-footer.component';

describe('JhhClientDashboardFooterComponent', () => {
  let component: JhhClientDashboardFooterComponent;
  let fixture: ComponentFixture<JhhClientDashboardFooterComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
