import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'jhh-searchbar-input',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input({ required: true }) placeholder: string;
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

  onInputChange(value: string): void {
    this.searchChange.emit(value);
  }
}
