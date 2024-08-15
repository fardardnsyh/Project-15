import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

import { Quiz } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-home-practice',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatDividerModule],
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent {
  @Input({ required: true }) quizzes: Quiz[];

  readonly clientRoute: typeof ClientRoute = ClientRoute;
}
