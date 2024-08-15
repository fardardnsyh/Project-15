import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { JhhClientDashboardToolbarComponent } from '@jhh/jhh-client/dashboard/feature-toolbar';
import { JhhClientDashboardSidebarComponent } from '@jhh/jhh-client/dashboard/feature-sidebar';
import { JhhClientDashboardBreadcrumbsComponent } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';
import { JhhClientDashboardTitleComponent } from '@jhh/jhh-client/dashboard/feature-title';
import { JhhClientDashboardFooterComponent } from '@jhh/jhh-client/dashboard/feature-footer';
import { JhhClientDashboardHomeComponent } from '@jhh/jhh-client/dashboard/feature';

import { DashboardFacade } from '@jhh/jhh-client/dashboard/data-access';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-dashboard-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatProgressSpinnerModule,
    JhhClientDashboardToolbarComponent,
    JhhClientDashboardSidebarComponent,
    JhhClientDashboardBreadcrumbsComponent,
    JhhClientDashboardTitleComponent,
    JhhClientDashboardFooterComponent,
    JhhClientDashboardHomeComponent,
  ],
  templateUrl: './jhh-client-dashboard-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-shell.component.scss'],
})
export class JhhClientDashboardShellComponent implements OnInit {
  private readonly dashboardFacade: DashboardFacade = inject(DashboardFacade);
  readonly router: Router = inject(Router);

  loadAssignedDataInProgress$: Observable<boolean> =
    this.dashboardFacade.loadAssignedDataInProgress$;
  loadAssignedDataError$: Observable<string | null> =
    this.dashboardFacade.loadAssignedDataError$;

  readonly clientRoute: typeof ClientRoute = ClientRoute;

  ngOnInit(): void {
    this.dashboardFacade.loadAssignedData();
  }
}
