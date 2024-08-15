import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'jhh-schedule-view-toggle',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule],
  templateUrl: './view-toggle.component.html',
  styleUrls: ['./view-toggle.component.scss'],
})
export class ViewToggleComponent {
  @Input({ required: true }) view: CalendarView;
  @Output() viewChange: EventEmitter<CalendarView> =
    new EventEmitter<CalendarView>();

  readonly CalendarView: typeof CalendarView = CalendarView;

  handleViewChange(newView: CalendarView): void {
    this.viewChange.emit(newView);
  }
}
