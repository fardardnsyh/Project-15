import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhhClientDashboardNotesShellComponent } from './jhh-client-dashboard-notes-shell.component';

describe('JhhClientDashboardNotesShellComponent', () => {
  let component: JhhClientDashboardNotesShellComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardNotesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
