import {
  Component,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

import { GetPercentageClass } from '@jhh/jhh-client/dashboard/practice/util-get-percentage-class';

import { QuizResults } from '@jhh/shared/domain';

interface ExtendedResults extends QuizResults {
  percentageClass: string;
}

@Component({
  selector: 'jhh-practice-quiz-results',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);

  @Input({ required: true }) results: QuizResults[];
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  readonly defaultDisplayedItems: number = 5;

  dialogRef: MatDialogRef<TemplateRef<any>>;
  displayedItems: number = this.defaultDisplayedItems;
  extendedResults: ExtendedResults[];

  openedResults$: BehaviorSubject<ExtendedResults | null> =
    new BehaviorSubject<ExtendedResults | null>(null);

  ngOnInit(): void {
    const sortedResults: QuizResults[] = [...this.results];

    sortedResults.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    this.extendedResults = sortedResults.map((result) => ({
      ...result,
      percentageClass: GetPercentageClass(result.percentage),
    }));
  }

  toggleList(): void {
    this.displayedItems =
      this.displayedItems === this.results.length
        ? this.defaultDisplayedItems
        : this.results.length;
  }

  openDialog(result: ExtendedResults): void {
    this.openedResults$.next(result);
    this.dialogRef = this.dialog.open(this.dialogContent, { autoFocus: false });
    this.dialogRef.afterClosed().subscribe(() => {
      this.openedResults$.next(null);
    });
  }
}
