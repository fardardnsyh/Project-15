import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { InputComponent } from '../../components/input/input.component';
import { ResultsComponent } from '../../components/results/results.component';

@Component({
  selector: 'jhh-searchbar',
  standalone: true,
  imports: [CommonModule, InputComponent, ResultsComponent],
  templateUrl: './jhh-client-dashboard-searchbar.component.html',
  styleUrls: ['./jhh-client-dashboard-searchbar.component.scss'],
})
export class JhhClientDashboardSearchbarComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @Input() placeholder: string = 'Search...';
  @Input({ required: true }) searchFunction: (
    query: string
  ) => Observable<any[] | null>;

  query$: Subject<string> = new Subject<string>();
  results$: Observable<any[]>;

  searchStarted: boolean = false;
  loading: boolean = false;

  ngOnInit(): void {
    this.handleQuery();
  }

  onSearch(query: string): void {
    this.loading = !!query;
    this.searchStarted = !!query;
    this.query$.next(query);
  }

  handleQuery(): void {
    this.results$ = this.query$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      tap(() => (this.loading = true)),
      switchMap((query) => {
        if (query === '') {
          return of([]);
        } else {
          return this.searchFunction(query).pipe(
            map((results) => results || [])
          );
        }
      }),
      tap(() => (this.loading = false)),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
