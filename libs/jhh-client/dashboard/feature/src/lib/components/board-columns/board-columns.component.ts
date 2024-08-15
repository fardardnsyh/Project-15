import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { BoardColumn } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'jhh-home-board-columns',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink,
    MatExpansionModule,
  ],
  templateUrl: './board-columns.component.html',
  styleUrls: ['./board-columns.component.scss'],
})
export class BoardColumnsComponent {
  @Input({ required: true }) columns: BoardColumn[];

  readonly clientRoute: typeof ClientRoute = ClientRoute;
}
