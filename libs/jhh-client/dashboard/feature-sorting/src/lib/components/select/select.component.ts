import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'jhh-sorting-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input({ required: true }) currentSort: string;
  @Input({ required: true }) sortOptionsValues: string[];
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();

  handleSortChange(newValue: string): void {
    this.selectionChange.emit(newValue);
  }
}
