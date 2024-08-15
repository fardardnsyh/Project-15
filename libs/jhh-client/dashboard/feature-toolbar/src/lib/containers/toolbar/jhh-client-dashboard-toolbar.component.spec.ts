import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhhClientDashboardToolbarComponent } from './jhh-client-dashboard-toolbar.component';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

describe('JhhClientDashboardFeatureToolbarComponent', () => {
  let component: JhhClientDashboardToolbarComponent;
  let fixture: ComponentFixture<JhhClientDashboardToolbarComponent>;
  let mockAuthFacade;

  beforeEach(async () => {
    mockAuthFacade = {};

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardToolbarComponent],
      providers: [{ provide: AuthFacade, useValue: mockAuthFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
