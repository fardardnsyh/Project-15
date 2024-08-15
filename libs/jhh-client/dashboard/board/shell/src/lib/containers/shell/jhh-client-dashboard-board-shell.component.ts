import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jhh-dashboard-board-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './jhh-client-dashboard-board-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-board-shell.component.scss'],
})
export class JhhClientDashboardBoardShellComponent {}
