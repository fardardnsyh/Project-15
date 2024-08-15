import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jhh-dashboard-practice-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './jhh-client-dashboard-practice-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-practice-shell.component.scss'],
})
export class JhhClientDashboardPracticeShellComponent {}
