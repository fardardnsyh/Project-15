import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from '@jhh/shared/domain';

import { JhhClientDashboardShellComponent } from './jhh-client-dashboard-shell.component';
import { JhhClientDashboardToolbarComponent } from '@jhh/jhh-client/dashboard/feature-toolbar';
import { JhhClientDashboardSidebarComponent } from '@jhh/jhh-client/dashboard/feature-sidebar';

import { DashboardFacade } from '@jhh/jhh-client/dashboard/data-access';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

class MockDashboardFacade {
  loadAssignedDataInProgress$: Observable<boolean> = of(false);
  loadAssignedDataError$: Observable<string | null> = of(null);

  loadAssignedData(): void {}
}

class MockAuthFacade {
  removeAccountInProgress$: Observable<boolean> = of(false);
  removeAccountError$: Observable<string | null> = of(null);
  user$: Observable<User | null> = of(null);

  logout(): void {}

  removeAccount(): void {}
}

describe('JhhClientDashboardShellComponent', () => {
  let component: JhhClientDashboardShellComponent;
  let fixture: ComponentFixture<JhhClientDashboardShellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        JhhClientDashboardShellComponent,
        JhhClientDashboardToolbarComponent,
        JhhClientDashboardSidebarComponent,
      ],
      providers: [
        { provide: DashboardFacade, useClass: MockDashboardFacade },
        {
          provide: AuthFacade,
          useClass: MockAuthFacade,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render JhhClientSharedUiToolbarComponent', () => {
    const toolbar: DebugElement = fixture.debugElement.query(
      By.directive(JhhClientDashboardToolbarComponent)
    );
    expect(toolbar).not.toBeNull();
  });

  it('should render JhhClientSharedUiSidebarComponent', () => {
    const sidebar: DebugElement = fixture.debugElement.query(
      By.directive(JhhClientDashboardSidebarComponent)
    );
    expect(sidebar).not.toBeNull();
  });

  it('should render RouterOutlet', () => {
    const routerOutlet: DebugElement = fixture.debugElement.query(
      By.directive(RouterOutlet)
    );
    expect(routerOutlet).not.toBeNull();
  });
});
