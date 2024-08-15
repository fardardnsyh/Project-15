import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardEditNotesGroupComponent } from '../../containers/edit/jhh-client-dashboard-edit-notes-group.component';

describe('JhhClientDashboardNotesEditNotesGroupComponent', () => {
  let component: JhhClientDashboardEditNotesGroupComponent;
  let fixture: ComponentFixture<JhhClientDashboardEditNotesGroupComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardEditNotesGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardEditNotesGroupComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
