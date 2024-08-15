import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CalendarView } from 'angular-calendar';

@Component({
  selector: 'jhh-schedule-view-date',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './view-date.component.html',
  styleUrls: ['./view-date.component.scss'],
})
export class ViewDateComponent {
  @Input({ required: true }) view: CalendarView;
  @Input({ required: true }) viewDate: Date;
}
