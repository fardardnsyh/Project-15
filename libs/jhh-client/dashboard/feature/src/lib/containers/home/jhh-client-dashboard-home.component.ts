import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFacade } from '@jhh/jhh-client/dashboard/data-access';
import { Observable } from 'rxjs';

import { OffersComponent } from '../../components/offers/offers.component';
import { ScheduleEventsComponent } from '../../components/schedule-events/schedule-events.component';
import { BoardColumnsComponent } from '../../components/board-columns/board-columns.component';
import { NotesComponent } from '../../components/notes/notes.component';
import { PracticeComponent } from '../../components/practice/practice.component';

import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

import { HomeData } from '@jhh/jhh-client/dashboard/domain';

@Component({
  selector: 'jhh-home',
  standalone: true,
  imports: [
    CommonModule,
    OffersComponent,
    ScheduleEventsComponent,
    BoardColumnsComponent,
    NotesComponent,
    PracticeComponent,
  ],
  templateUrl: './jhh-client-dashboard-home.component.html',
  styleUrls: ['./jhh-client-dashboard-home.component.scss'],
})
export class JhhClientDashboardHomeComponent implements OnInit {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly dashboardFacade: DashboardFacade = inject(DashboardFacade);

  homeData$: Observable<HomeData>;
  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.homeData$ = this.dashboardFacade.getHomeData();
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }
}
