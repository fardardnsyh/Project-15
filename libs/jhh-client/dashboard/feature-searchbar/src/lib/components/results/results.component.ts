import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jhh-searchbar-results',
  standalone: true,
  imports: [CommonModule, MatListModule, RouterLink],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  @Input({ required: true }) results: any[];
  @Input({ required: true }) loading: boolean;
  @Input({ required: true }) searchStarted: boolean;

  trackByFn(index: number, item: any) {
    return item.id;
  }
}
