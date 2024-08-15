import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardBoardShellComponent } from './jhh-client-dashboard-board-shell.component';

describe('JhhClientDashboardBoardShellComponentComponent', () => {
  let component: JhhClientDashboardBoardShellComponent;
  let fixture: ComponentFixture<JhhClientDashboardBoardShellComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardBoardShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardBoardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
