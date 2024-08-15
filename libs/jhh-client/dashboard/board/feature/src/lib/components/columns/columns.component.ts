import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragMove,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { BoardColumnsService } from '../../services/board-columns.service';

import { ClickOutsideDirective } from '@jhh/jhh-client/shared/util-click-outside';

import { ColumnMenuComponent } from '../column-menu/column-menu.component';

import {
  BoardColumn,
  BoardColumnFieldLength,
  BoardColumnItem,
} from '@jhh/shared/domain';

@Component({
  selector: 'jhh-board-columns',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ColumnMenuComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ClickOutsideDirective,
    CdkDragHandle,
  ],
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
})
export class ColumnsComponent implements OnInit, OnDestroy {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly boardColumnsService: BoardColumnsService =
    inject(BoardColumnsService);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  @ViewChild('horizontalScrollContainer')
  private readonly horizontalScrollContainer: ElementRef;
  @Input({ required: true }) isSaving$: BehaviorSubject<boolean>;
  @Input({ required: true })
  wasUpdateTriggeredByColumnsComponent$: BehaviorSubject<boolean>;

  @Input({ required: true }) set columns(value: BoardColumn[]) {
    this.originalColumns = value;
    this._columns = this.boardColumnsService.mergeWithWorkingData(
      this._columns,
      value,
      this.wasUpdateTriggeredByColumnsComponent$.getValue()
    );
    this.wasUpdateTriggeredByColumnsComponent$.next(false);
  }

  private updateSubject: Subject<void> = new Subject<void>();
  private originalColumns: BoardColumn[];
  private removedItemIds: string[] = [];
  private isItemBeingDragged: boolean = false;
  readonly boardColumnFieldLength: typeof BoardColumnFieldLength =
    BoardColumnFieldLength;

  _columns: BoardColumn[] = [];
  editingItem: { [key: string]: boolean } = {};
  editableContent: { [key: string]: string } = {};

  updateBoardColumnsInProgress$: Observable<boolean>;
  updateBoardColumnsError$: Observable<string | null>;
  updateBoardColumnsSuccess$: Observable<boolean>;
  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.updateBoardColumnsInProgress$ =
      this.boardFacade.updateBoardColumnsInProgress$;
    this.updateBoardColumnsError$ = this.boardFacade.updateBoardColumnsError$;
    this.updateBoardColumnsSuccess$ =
      this.boardFacade.updateBoardColumnsSuccess$;
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        tap(() => {
          this.saveChanges();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.updateSubject
      .pipe(
        debounceTime(8000),
        filter(() => !this.isAnyItemInEditMode() && !this.isItemBeingDragged),
        tap(() => {
          this.saveChanges();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    window.addEventListener('beforeunload', this.handleAppClose);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handleAppClose);
  }

  get connectedDropLists(): string[] {
    return this._columns.map((column) => 'drop-list-' + column.id);
  }

  trackByFn(index: number, item: BoardColumn | BoardColumnItem): string {
    return item.id;
  }

  dragStarted(): void {
    this.isItemBeingDragged = true;
  }

  dragEnded(): void {
    this.isItemBeingDragged = false;
  }

  dragMoved(event: CdkDragMove, columnEl?: HTMLDivElement): void {
    this.scrollHorizontal(event);
    if (columnEl) {
      this.scrollVertical(event, columnEl);
    }
  }

  dropColumn(event: CdkDragDrop<BoardColumn[]>): void {
    if (event.previousContainer === event.container) {
      this._columns = this.boardColumnsService.dropColumn(this._columns, event);
      this.updateSubject.next();
    }
  }

  dropItem(event: CdkDragDrop<BoardColumnItem[]>): void {
    this._columns = this.boardColumnsService.dropItem(this._columns, event);
    this.updateSubject.next();
  }

  addItem(columnId: string): void {
    this._columns = this.boardColumnsService.addItem(
      this._columns,
      columnId,
      this.editableContent,
      this.editingItem
    );
    this.updateSubject.next();
    setTimeout(() => this.scrollColumnToBottom(columnId), 0);
  }

  startEdit(itemId: string, content: string): void {
    this.editingItem[itemId] = true;
    this.editableContent[itemId] = content;
  }

  handleBlur(item: BoardColumnItem): void {
    const { updatedColumns, contentChanged } =
      this.boardColumnsService.handleBlur(
        this._columns,
        item,
        this.editableContent
      );

    if (contentChanged) {
      this._columns = updatedColumns;
    }
    this.editingItem[item.id] = false;
    if (contentChanged || !this.isAnyItemInEditMode()) {
      this.updateSubject.next();
    }
  }

  removeItem(columnId: string, itemId: string): void {
    this._columns = this.boardColumnsService.removeItem(
      this._columns,
      columnId,
      itemId,
      this.removedItemIds
    );
    this.updateSubject.next();
  }

  fetchItemsForColumn(columnId: string): BoardColumnItem[] {
    return this._columns.find((column) => column.id === columnId)?.items || [];
  }

  private saveChanges(): void {
    const updatedColumns: BoardColumn[] =
      this.boardColumnsService.getOnlyUpdatedColumns(
        this.originalColumns,
        this._columns
      );

    if (updatedColumns.length || this.removedItemIds.length) {
      this.isSaving$.next(true);

      this.boardFacade.updateBoardColumns(updatedColumns, this.removedItemIds);

      this.updateBoardColumnsSuccess$
        .pipe(
          filter((success) => success),
          tap(() => {
            this.removedItemIds = [];
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();

      this.updateBoardColumnsError$
        .pipe(
          filter((error) => error !== null),
          tap(() => {
            this.removedItemIds = [];
            this._columns = JSON.parse(JSON.stringify(this.originalColumns));
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  private handleAppClose = (): string | void => {
    const updatedColumns: BoardColumn[] =
      this.boardColumnsService.getOnlyUpdatedColumns(
        this.originalColumns,
        this._columns
      );
    this.boardColumnsService.handleAppClose(
      updatedColumns,
      this.removedItemIds
    );
  };

  private isAnyItemInEditMode(): boolean {
    return Object.values(this.editingItem).some((value) => value);
  }

  private scrollColumnToBottom(columnId: string): void {
    this.boardColumnsService.scrollColumnToBottom(
      columnId,
      this.horizontalScrollContainer
    );
  }

  private scrollHorizontal(event: CdkDragMove): void {
    this.boardColumnsService.scrollHorizontal(
      event,
      this.horizontalScrollContainer
    );
  }

  private scrollVertical(event: CdkDragMove, columnEl: HTMLDivElement): void {
    this.boardColumnsService.scrollVertical(event, columnEl);
  }
}
