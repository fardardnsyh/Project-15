import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'jhh-note-card-updated-at',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './updated-at.component.html',
  styleUrls: ['./updated-at.component.scss'],
})
export class UpdatedAtComponent {
  @Input({ required: true }) updatedAt: Date;
}
