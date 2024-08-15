import {
  Component,
  DestroyRef,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ColumnsComponent } from '../../components/columns/columns.component';
import { AddColumnComponent } from '../../components/add-column/add-column.component';

import {
  BoardFacade,
  updateBoardColumnsFail,
  updateBoardColumnsSuccess,
} from '@jhh/jhh-client/dashboard/board/data-access';

import { BoardColumn } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-board',
  standalone: true,
  imports: [CommonModule, ColumnsComponent, AddColumnComponent],
  templateUrl: './jhh-client-dashboard-board.component.html',
  styleUrls: ['./jhh-client-dashboard-board.component.scss'],
})
export class JhhClientDashboardBoardComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly actions$: Actions = inject(Actions);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  @HostBinding('class.isSaving') get isSavingClass() {
    return this.isSaving$.getValue();
  }

  boardColumns$: Observable<BoardColumn[]>;
  isSaving$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  wasUpdateTriggeredByColumnsComponent$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.boardColumns$ = this.boardFacade.boardColumns$;

    this.actions$
      .pipe(
        ofType(updateBoardColumnsSuccess, updateBoardColumnsFail),
        tap((action) => {
          if (action.type === updateBoardColumnsSuccess.type) {
            this.wasUpdateTriggeredByColumnsComponent$.next(true);
          } else {
            this.wasUpdateTriggeredByColumnsComponent$.next(false);
          }
          this.isSaving$.next(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
