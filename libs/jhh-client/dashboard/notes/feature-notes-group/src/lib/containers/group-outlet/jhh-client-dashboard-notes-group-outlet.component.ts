import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jhh-notes-group-outlet',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './jhh-client-dashboard-notes-group-outlet.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-group-outlet.component.scss'],
})
export class JhhClientDashboardNotesGroupOutletComponent {}
