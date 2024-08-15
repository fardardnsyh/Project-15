import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

interface SidebarItem {
  icon: string;
  text: string;
  route: ClientRoute;
  exact?: boolean;
}

@Component({
  selector: 'jhh-sidebar-nav-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.scss'],
})
export class NavListComponent {
  @Input({ required: true }) isSidebarExpanded: boolean | null;
  @Input({ required: true }) isBreakpointMobile: boolean | null;

  readonly sidebarItems: SidebarItem[] = [
    {
      icon: 'home',
      text: 'Home',
      route: ClientRoute.HomeLink,
      exact: true,
    },
    {
      icon: 'work',
      text: 'Offers',
      route: ClientRoute.OffersLink,
    },
    {
      icon: 'event',
      text: 'Schedule',
      route: ClientRoute.ScheduleLink,
    },
    {
      icon: 'view_column',
      text: 'Board',
      route: ClientRoute.BoardLink,
    },
    {
      icon: 'school',
      text: 'Practice',
      route: ClientRoute.PracticeLink,
    },
    {
      icon: 'note_add',
      text: 'Notes',
      route: ClientRoute.NotesLink,
    },
  ];
}
