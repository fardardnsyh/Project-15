import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-toolbar-brand',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent {
  readonly clientRoute: typeof ClientRoute = ClientRoute;
}
