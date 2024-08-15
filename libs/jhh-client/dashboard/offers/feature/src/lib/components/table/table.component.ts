import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  MatSort,
  MatSortModule,
  Sort,
  SortDirection,
} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { filter, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MenuComponent } from '../menu/menu.component';

import { RemoveOffersDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';
import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';
import { QueryParamsService } from '../../services/query-params.service';

import { FormatOfferSalaryPipe } from '@jhh/jhh-client/dashboard/offers/util-format-offer-salary';
import { GetOfferStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-offer-status-icon';

import { Offer, OfferPriority, OfferStatus } from '@jhh/shared/domain';
import {
  OffersPerPage,
  OffersTableColumn,
} from '@jhh/jhh-client/dashboard/offers/domain';

interface OfferWithIcon extends Offer {
  statusIcon: string;
}

@Component({
  selector: 'jhh-offers-table',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MenuComponent,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    RouterLink,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    FormatOfferSalaryPipe,
  ],
  providers: [CurrencyPipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);
  private readonly removeOffersDialogService: RemoveOffersDialogService =
    inject(RemoveOffersDialogService);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);

  @Input({ required: true }) offers: Offer[];
  @ViewChild(MatPaginator) private readonly paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) private readonly sort: MatSort;

  readonly offersTableColumn: typeof OffersTableColumn = OffersTableColumn;
  readonly offersTableColumnValue: OffersTableColumn[] =
    Object.values(OffersTableColumn);
  readonly offersPerPageValues: number[] = Object.values(OffersPerPage).filter(
    (value): value is number => typeof value === 'number'
  );
  readonly priorityMapping: { [key: string]: number } = {
    [OfferPriority.High]: 3,
    [OfferPriority.Medium]: 2,
    [OfferPriority.Low]: 1,
  };
  readonly statusMapping: { [key: string]: number } = {
    [OfferStatus.Rejected]: 6,
    [OfferStatus.Accepted]: 5,
    [OfferStatus.OfferReceived]: 4,
    [OfferStatus.Interviewing]: 3,
    [OfferStatus.Applied]: 2,
    [OfferStatus.NotApplied]: 1,
  };

  dataSource: MatTableDataSource<OfferWithIcon>;
  selection: SelectionModel<Offer> = new SelectionModel<Offer>(true, []);
  filterValue: string;
  paginatorPage: number;
  paginatorSize: number;

  removeOffersInProgress$: Observable<boolean>;
  removeOffersSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.updateDataSource();

    this.removeOffersInProgress$ = this.offersFacade.removeOffersInProgress$;
    this.removeOffersSuccess$ = this.offersFacade.removeOffersSuccess$;

    this.queryParamsService.setFromCurrentRoute();
    this.queryParamsService.updateQueryParams();

    this.handleRemoveSuccess();
  }

  ngAfterViewInit(): void {
    this.useQueryParams();
    this.updateTableSettings();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offers']) {
      this.updateDataSource();
      this.updateTableSettings();
      this.selection.clear();

      if (this.paginator) {
        const totalItems: number = this.dataSource.data.length;
        if (
          this.paginatorPage * this.paginatorSize >= totalItems &&
          this.paginatorPage > 0
        ) {
          this.paginator.previousPage();
          this.paginatorPage =
            this.paginatorPage > 1
              ? this.paginatorPage - 1
              : this.paginatorPage;
        }
      }
    }
  }

  applyFilter(event: Event | string): void {
    const filterValue: string = (
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value
    )
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
    this.queryParamsService.updateCurrentFilter(filterValue);
    this.dataSource.paginator?.firstPage();
  }

  removeSelectedOffers(): void {
    if (this.selection.selected.length) {
      this.removeOffersDialogService.openDialog(this.selection.selected);
    }
  }

  isSomeSelected(): boolean {
    return this.selection.selected.length > 0 && !this.areAllSelected();
  }

  areAllSelected(): boolean {
    return (
      this.dataSource.data.length > 0 &&
      this.dataSource.data.every((row) => this.selection.isSelected(row))
    );
  }

  areAllSelectedOnCurrentPage(): boolean {
    return (
      this.dataSource['_renderData']._value.length > 0 &&
      this.dataSource['_renderData']._value.every((row: any) =>
        this.selection.isSelected(row)
      )
    );
  }

  toggleAllOnCurrentPage(): void {
    const areAllSelected: boolean = this.areAllSelectedOnCurrentPage();
    const action = areAllSelected
      ? this.selection.deselect.bind(this.selection)
      : this.selection.select.bind(this.selection);

    this.dataSource['_renderData']._value.forEach((row: any) => action(row));
  }

  handleSort({ active, direction }: Sort): void {
    this.dataSource.paginator?.firstPage();
    this.queryParamsService.updateCurrentSort(
      `${direction ? active : ''},${direction}`
    );
  }

  handlePaginator(event: PageEvent): void {
    event.pageIndex !== event.previousPageIndex &&
      this.queryParamsService.updateCurrentPage(event.pageIndex + 1);
    event.pageSize !== this.paginatorSize &&
      this.queryParamsService.updateCurrentPerPage(event.pageSize);
  }

  private setSortingDataAccessor(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case OffersTableColumn.Priority:
          return this.priorityMapping[item.priority];
        case OffersTableColumn.Status:
          return this.statusMapping[item.status];
        case OffersTableColumn.Salary:
          return this.getSortableSalaryValue(item);
        default:
          return (item as any)[property];
      }
    };
  }

  private updateDataSource(): void {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<OfferWithIcon>();
    }
    this.dataSource.data = this.offers.map(
      (offer) =>
        ({
          ...offer,
          statusIcon: GetOfferStatusIcon(offer.status),
        } as OfferWithIcon)
    );
  }

  private updateTableSettings(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setSortingDataAccessor();
  }

  private isValidSort(active: string, direction: string): boolean {
    return (
      this.offersTableColumnValue.includes(active as OffersTableColumn) &&
      ['asc', 'desc', ''].includes(direction)
    );
  }

  private getSortableSalaryValue(item: Offer): number {
    return item.minSalary && item.maxSalary
      ? (item.minSalary + item.maxSalary) / 2
      : item.minSalary || item.maxSalary || 0;
  }

  private handleRemoveSuccess(): void {
    this.removeOffersSuccess$
      .pipe(
        filter((success) => success),
        tap(() => {
          this.selection.clear();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private useQueryParams(): void {
    this.queryParamsService
      .getAllQueryParams$()
      .pipe(
        tap(({ filter, perPage, page, sort }) => {
          this.filterValue =
            filter === 'null' || filter === 'undefined' ? '' : filter;

          this.paginatorSize = this.offersPerPageValues.includes(perPage)
            ? perPage
            : OffersPerPage.Ten;
          if (!this.offersPerPageValues.includes(perPage)) {
            this.queryParamsService.updateCurrentPerPage(OffersPerPage.Ten);
          }

          const totalPages: number = Math.ceil(
            this.dataSource.data.length / this.paginatorSize
          );
          this.paginatorPage =
            !Number.isInteger(page) || page < 1 || page > totalPages
              ? 1
              : page - 1;
          if (this.paginatorPage + 1 !== page) {
            this.queryParamsService.updateCurrentPage(1);
          }

          const [active, direction] = sort.split(',');
          if (
            this.isValidSort(active, direction) &&
            (this.sort.active !== active || this.sort.direction !== direction)
          ) {
            this.sort.active = active;
            this.sort.direction = direction as 'asc' | 'desc' | '';
            this.sort.sortChange.emit({
              active,
              direction: direction as SortDirection,
            });
          } else if (!this.isValidSort(active, direction)) {
            this.queryParamsService.updateCurrentSort(',');
            this.sort.active = '';
            this.sort.direction = '';
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.applyFilter(this.filterValue);
    this.paginator.pageIndex = this.paginatorPage;
    this.paginator.pageSize = this.paginatorSize;
    this.setSortingDataAccessor();
  }
}
