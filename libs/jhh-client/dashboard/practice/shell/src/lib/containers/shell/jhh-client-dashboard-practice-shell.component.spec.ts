import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardPracticeShellComponent } from './jhh-client-dashboard-practice-shell.component';

describe('JhhClientDashboardPracticeShellComponent', () => {
  let component: JhhClientDashboardPracticeShellComponent;
  let fixture: ComponentFixture<JhhClientDashboardPracticeShellComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardPracticeShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardPracticeShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
