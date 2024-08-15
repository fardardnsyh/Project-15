import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jhh-dashboard-offers-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './jhh-client-dashboard-offers-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-offers-shell.component.scss'],
})
export class JhhClientDashboardOffersShellComponent {}
