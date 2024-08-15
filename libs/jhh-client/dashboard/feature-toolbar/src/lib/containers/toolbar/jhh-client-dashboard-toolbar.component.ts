import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';

import { SidebarService } from '@jhh/jhh-client/dashboard/feature-sidebar';

import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { SidebarBurgerComponent } from '../../components/sidebar-burger/sidebar-burger.component';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';
import { BrandComponent } from '../../components/brand/brand.component';

@Component({
  selector: 'jhh-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    MatSlideToggleModule,
    ThemeSwitcherComponent,
    SidebarBurgerComponent,
    UserMenuComponent,
    BrandComponent,
  ],
  templateUrl: './jhh-client-dashboard-toolbar.component.html',
  styleUrls: ['./jhh-client-dashboard-toolbar.component.scss'],
})
export class JhhClientDashboardToolbarComponent implements OnInit {
  private readonly sidebarService: SidebarService = inject(SidebarService);

  isBreakpointMobile$: Observable<boolean>;

  ngOnInit(): void {
    this.isBreakpointMobile$ = this.sidebarService.isBreakpointMobile$;
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
