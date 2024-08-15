import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

import { NotesGroup } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jhh-home-notes',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink, MatExpansionModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent {
  @Input({ required: true }) groups: NotesGroup[];

  readonly clientRoute: typeof ClientRoute = ClientRoute;
}
