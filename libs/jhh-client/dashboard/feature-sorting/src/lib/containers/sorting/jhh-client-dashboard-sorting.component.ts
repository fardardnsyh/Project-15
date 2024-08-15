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
import { SelectComponent } from '../../components/select/select.component';

@Component({
  selector: 'jhh-sorting',
  standalone: true,
  imports: [CommonModule, SelectComponent],
  templateUrl: './jhh-client-dashboard-sorting.component.html',
  styleUrls: ['./jhh-client-dashboard-sorting.component.scss'],
})
export class JhhClientDashboardSortingComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @Input({ required: true }) sortOptionsValues: string[];
  @Input({ required: true }) defaultSort: string;
  @Input({ required: true }) currentSort$: BehaviorSubject<string>;
  @Output() updateCurrentSort: EventEmitter<string> =
    new EventEmitter<string>();

  ngOnInit(): void {
    this.currentSort$
      .pipe(
        tap((sort) => {
          if (!this.isValidSort(sort)) {
            this.updateCurrentSort.emit(this.defaultSort);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onSortChange(newSort: string): void {
    if (this.isValidSort(newSort)) {
      this.updateCurrentSort.emit(newSort);
    }
  }

  private isValidSort(sort: string): boolean {
    return this.sortOptionsValues.includes(sort);
  }
}
