import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

import { SidebarService } from '../../services/sidebar.service';

import { NavListComponent } from '../../components/nav-list/nav-list.component';
import { BrandComponent } from '../../components/brand/brand.component';

@Component({
  selector: 'jhh-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    NavListComponent,
    BrandComponent,
  ],
  templateUrl: './jhh-client-dashboard-sidebar.component.html',
  styleUrls: ['./jhh-client-dashboard-sidebar.component.scss'],
})
export class JhhClientDashboardSidebarComponent implements OnInit {
  private readonly sidebarService: SidebarService = inject(SidebarService);

  isBreakpointMobile$: Observable<boolean>;
  isSidebarOpened$: Observable<boolean>;
  isSidebarExpanded$: Observable<boolean>;

  ngOnInit(): void {
    this.isBreakpointMobile$ = this.sidebarService.isBreakpointMobile$;
    this.isSidebarOpened$ = this.sidebarService.isSidebarOpened$;
    this.isSidebarExpanded$ = this.sidebarService.isSidebarExpanded$;
  }

  handleClose(): void {
    this.sidebarService.toggleSidebar();
  }
}
