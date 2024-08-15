import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardNotesGroupOutletComponent } from './jhh-client-dashboard-notes-group-outlet.component';

describe('JhhClientDashboardNotesGroupOutletComponent', () => {
  let component: JhhClientDashboardNotesGroupOutletComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesGroupOutletComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesGroupOutletComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardNotesGroupOutletComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
