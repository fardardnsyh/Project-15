import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardEditNoteComponent } from '../../containers/edit/jhh-client-dashboard-edit-note.component';

describe('JhhDashboardEditNoteComponent', () => {
  let component: JhhClientDashboardEditNoteComponent;
  let fixture: ComponentFixture<JhhClientDashboardEditNoteComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardEditNoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardEditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
