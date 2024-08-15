import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinksComponent } from '../../components/links/links.component';

@Component({
  selector: 'jhh-footer',
  standalone: true,
  imports: [CommonModule, LinksComponent],
  templateUrl: './jhh-client-dashboard-footer.component.html',
  styleUrls: ['./jhh-client-dashboard-footer.component.scss'],
})
export class JhhClientDashboardFooterComponent {}
