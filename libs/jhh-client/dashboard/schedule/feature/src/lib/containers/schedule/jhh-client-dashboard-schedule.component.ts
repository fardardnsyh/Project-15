import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarView } from 'angular-calendar';
import { Observable, Subject } from 'rxjs';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

import { CalendarComponent } from '../../components/calendar/calendar.component';
import { ViewToggleComponent } from '../../components/view-toggle/view-toggle.component';
import { ViewDateToggleComponent } from '../../components/view-date-toggle/view-date-toggle.component';
import { AddComponent } from '../../components/add/add.component';
import { EventDialogComponent } from '../../components/event-dialog/event-dialog.component';
import { ViewDateComponent } from '../../components/view-date/view-date.component';

import { ScheduleEvent } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-schedule',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    ViewToggleComponent,
    ViewDateToggleComponent,
    AddComponent,
    EventDialogComponent,
    ViewDateComponent,
  ],
  templateUrl: './jhh-client-dashboard-schedule.component.html',
  styleUrls: ['./jhh-client-dashboard-schedule.component.scss'],
})
export class JhhClientDashboardScheduleComponent implements OnInit {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly scheduleFacade: ScheduleFacade = inject(ScheduleFacade);

  view: CalendarView = CalendarView.Month;
  isActiveDayOpen: boolean = true;
  viewDate: Date = new Date();

  events$: Observable<ScheduleEvent[]>;
  clickedEventId$: Subject<string | null> = new Subject<string | null>();
  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.events$ = this.scheduleFacade.events$;
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  toggleIsActiveDayOpen(bool: boolean): void {
    this.isActiveDayOpen = bool;
  }
}
