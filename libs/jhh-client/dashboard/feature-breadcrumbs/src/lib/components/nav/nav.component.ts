import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { Breadcrumb } from '@jhh/jhh-client/dashboard/domain';

@Component({
  selector: 'jhh-breadcrumbs-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  @Input({ required: true }) breadcrumbs: Breadcrumb[];

  trackByFn(index: number, item: Breadcrumb): string {
    return item.url;
  }
}
