import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ControlsComponent } from '../../components/controls/controls.component';

@Component({
  selector: 'jhh-pagination',
  standalone: true,
  imports: [CommonModule, ControlsComponent],
  templateUrl: './jhh-client-dashboard-pagination.component.html',
  styleUrls: ['./jhh-client-dashboard-pagination.component.scss'],
})
export class JhhClientDashboardPaginationComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @Input({ required: true }) totalPages: number;
  @Input({ required: true }) defaultPage: number;
  @Input({ required: true }) currentPage$: BehaviorSubject<number>;
  @Output() updateCurrentPage: EventEmitter<number> =
    new EventEmitter<number>();

  ngOnInit(): void {
    this.currentPage$
      .pipe(
        tap((page) => {
          if (!this.isValidPage(page)) {
            this.updateCurrentPage.emit(this.defaultPage);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  handlePageChange(newPage: number): void {
    if (this.isValidPage(newPage)) {
      this.updateCurrentPage.emit(newPage);
    }
  }

  private isValidPage(page: number): boolean {
    return Number.isInteger(page) && page >= 1 && page <= this.totalPages;
  }
}
