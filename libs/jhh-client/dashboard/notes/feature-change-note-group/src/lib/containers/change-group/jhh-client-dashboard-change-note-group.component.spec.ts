import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardChangeNoteGroupComponent } from './jhh-client-dashboard-change-note-group.component';

describe('JhhClientDashboardChangeNoteGroupComponent', () => {
  let component: JhhClientDashboardChangeNoteGroupComponent;
  let fixture: ComponentFixture<JhhClientDashboardChangeNoteGroupComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardChangeNoteGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardChangeNoteGroupComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
