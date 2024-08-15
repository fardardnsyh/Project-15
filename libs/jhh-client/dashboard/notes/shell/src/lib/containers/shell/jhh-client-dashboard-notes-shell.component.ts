import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jhh-dashboard-notes-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './jhh-client-dashboard-notes-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-shell.component.scss'],
})
export class JhhClientDashboardNotesShellComponent {}
