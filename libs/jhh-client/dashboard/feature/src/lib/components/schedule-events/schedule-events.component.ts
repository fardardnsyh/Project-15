import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { ScheduleEvent } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-home-schedule-events',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    RouterLink,
    MatIconModule,
    MatIconModule,
  ],
  templateUrl: './schedule-events.component.html',
  styleUrls: ['./schedule-events.component.scss'],
})
export class ScheduleEventsComponent {
  @Input({ required: true }) events: ScheduleEvent[];

  readonly clientRoute: typeof ClientRoute = ClientRoute;
}
