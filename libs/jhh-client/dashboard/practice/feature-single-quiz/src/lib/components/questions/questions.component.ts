import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { QuizItem } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-practice-quiz-questions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent {
  @Input({ required: true }) questions: QuizItem[];
  @ViewChild(MatAccordion) private readonly accordion: MatAccordion;

  isAccordionOpen: boolean = false;

  toggleAccordion(): void {
    this.isAccordionOpen ? this.accordion.closeAll() : this.accordion.openAll();
    this.isAccordionOpen = !this.isAccordionOpen;
  }
}
