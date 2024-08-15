import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarCommonModule, CalendarView } from 'angular-calendar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'jhh-schedule-view-date-toggle',
  standalone: true,
  imports: [CommonModule, CalendarCommonModule, MatIconModule, MatButtonModule],
  templateUrl: './view-date-toggle.component.html',
  styleUrls: ['./view-date-toggle.component.scss'],
})
export class ViewDateToggleComponent {
  @Input({ required: true }) view: CalendarView;
  @Input({ required: true }) viewDate: Date;
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() toggleIsActiveDayOpen: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  handleViewDateChange(newDate: Date, bool: boolean): void {
    this.toggleIsActiveDayOpen.emit(bool);
    this.viewDateChange.emit(newDate);
  }
}
