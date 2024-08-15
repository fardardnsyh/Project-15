import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhh-pagination-controls',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnChanges {
  @Input({ required: true }) currentPage: number;
  @Input({ required: true }) totalPages: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  inputPage: number;

  ngOnChanges(): void {
    this.inputPage = this.currentPage;
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  setPage(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    const pageNumber: number = Number(value);
    this.pageChange.emit(pageNumber);
  }
}
