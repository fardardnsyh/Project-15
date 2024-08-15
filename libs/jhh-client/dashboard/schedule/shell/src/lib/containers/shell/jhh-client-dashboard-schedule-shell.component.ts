import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jhh-dashboard-schedule-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './jhh-client-dashboard-schedule-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-schedule-shell.component.scss'],
})
export class JhhClientDashboardScheduleShellComponent {}
