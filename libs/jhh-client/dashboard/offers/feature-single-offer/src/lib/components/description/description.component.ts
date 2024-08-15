import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhh-offer-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent {
  @Input({ required: true }) description: string;
}
