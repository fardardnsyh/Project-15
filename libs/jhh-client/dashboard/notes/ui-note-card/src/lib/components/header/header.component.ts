import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripHtmlPipe } from '@jhh/jhh-client/shared/pipes';

@Component({
  selector: 'jhh-note-card-header',
  standalone: true,
  imports: [CommonModule, StripHtmlPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input({ required: true }) name: string;
  @Input({ required: true }) content: string;
}
