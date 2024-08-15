import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

import { Note } from '@jhh/shared/domain';

import { MenuComponent } from '../../components/menu/menu.component';
import { HeaderComponent } from '../../components/header/header.component';
import { UpdatedAtComponent } from '../../components/updated-at/updated-at.component';

@Component({
  selector: 'jhh-note-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MenuComponent,
    MatDividerModule,
    HeaderComponent,
    UpdatedAtComponent,
  ],
  templateUrl: './jhh-client-dashboard-note-card.component.html',
  styleUrls: ['./jhh-client-dashboard-note-card.component.scss'],
})
export class JhhClientDashboardNoteCardComponent {
  @Input() slug?: string;
  @Input({ required: true }) note: Note;
}
