import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

import { GetPercentageClass } from '@jhh/jhh-client/dashboard/practice/util-get-percentage-class';

import { Quiz, QuizItem, QuizResult } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-practice-quiz-play',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  @Input({ required: true }) quiz: Quiz;
  @Input({ required: true }) isPlayMode$: BehaviorSubject<boolean>;
  @Input({ required: true }) isQuizShuffled$: BehaviorSubject<boolean>;
  @Input({ required: true }) questionsLimit$: BehaviorSubject<number>;

  currentQuestionIndex: number = 0;
  shuffledAndLimitedQuestions: QuizItem[];
  selectedAnswers: Map<number, string[]> = new Map<number, string[]>();
  quizResults: QuizResult[];
  totalScore: number;
  percentage: number;

  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;
    this.shuffledAndLimitedQuestions = [...this.quiz.items];

    if (this.isQuizShuffled$.getValue()) {
      this.shuffleQuestions();
    }

    if (this.questionsLimit$.getValue() > 0) {
      this.limitQuestions();
    }
  }

  get progressPercentage(): number {
    return (
      (Array.from(this.selectedAnswers.entries()).filter(
        ([_, answers]) => answers.length
      ).length /
        this.shuffledAndLimitedQuestions.length) *
      100
    );
  }

  get allQuestionsAnswered(): boolean {
    return this.shuffledAndLimitedQuestions.every(
      (_, index) =>
        this.selectedAnswers.has(index) &&
        this.selectedAnswers.get(index)!.length > 0
    );
  }

  get percentageClass(): string {
    return GetPercentageClass(this.percentage);
  }

  getMaxSelectableAnswers(questionIndex: number): number {
    return this.shuffledAndLimitedQuestions[questionIndex].answers.filter(
      (answer) => answer.isCorrect
    ).length;
  }

  onSelectAnswer(questionIndex: number, answerText: string): void {
    if (this.isMultipleChoice(questionIndex)) {
      const currentAnswers: string[] =
        this.selectedAnswers.get(questionIndex) || [];
      const answerIndex: number = currentAnswers.indexOf(answerText);
      if (answerIndex > -1) {
        currentAnswers.splice(answerIndex, 1);
      } else {
        currentAnswers.push(answerText);
      }
      this.selectedAnswers.set(questionIndex, [...currentAnswers]);
    } else {
      this.selectedAnswers.set(questionIndex, [answerText]);
    }
  }

  shouldDisableAnswer(questionIndex: number, answerText: string): boolean {
    const currentAnswers: string[] =
      this.selectedAnswers.get(questionIndex) || [];
    const maxSelectable: number = this.getMaxSelectableAnswers(questionIndex);

    return (
      currentAnswers.length >= maxSelectable &&
      !currentAnswers.includes(answerText)
    );
  }

  isMultipleChoice(questionIndex: number): boolean {
    const question: QuizItem = this.shuffledAndLimitedQuestions[questionIndex];
    const correctAnswersCount: number = question.answers.filter(
      (answer) => answer.isCorrect
    ).length;

    return correctAnswersCount > 1;
  }

  nextQuestion(): void {
    if (
      this.currentQuestionIndex <
      this.shuffledAndLimitedQuestions.length - 1
    ) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(questionIndex: number): void {
    this.currentQuestionIndex = questionIndex;
  }

  playAgain(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswers.clear();
    this.quizResults = [];
  }

  quitQuiz(): void {
    this.isPlayMode$.next(false);
  }

  onSubmitQuiz(): void {
    this.quizResults = this.shuffledAndLimitedQuestions.map((item, index) => {
      const userAnswers: string[] = this.selectedAnswers.get(index) || [];
      const correctAnswers: string[] = item.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.text);
      const isCorrect: boolean =
        userAnswers.sort().join(',') === correctAnswers.sort().join(',');

      return {
        question: item.question,
        userAnswers,
        correctAnswers,
        isCorrect,
      };
    });

    this.totalScore = this.quizResults.filter(
      (result) => result.isCorrect
    ).length;
    this.percentage = Number(
      (
        (this.totalScore / this.shuffledAndLimitedQuestions.length) *
        100
      ).toFixed()
    );

    if (this.quizResults.length) {
      this.practiceFacade.addQuizResults(
        this.quiz.id,
        this.quizResults,
        this.totalScore,
        this.percentage
      );
    }
  }

  private shuffleQuestions(): void {
    for (let i = this.shuffledAndLimitedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [
        this.shuffledAndLimitedQuestions[i],
        this.shuffledAndLimitedQuestions[j],
      ] = [
        this.shuffledAndLimitedQuestions[j],
        this.shuffledAndLimitedQuestions[i],
      ];
    }
  }

  private limitQuestions(): void {
    const limit: number = this.questionsLimit$.getValue();

    if (limit > 0 && limit < this.shuffledAndLimitedQuestions.length) {
      this.shuffledAndLimitedQuestions = this.shuffledAndLimitedQuestions.slice(
        0,
        limit
      );
    }
  }
}
