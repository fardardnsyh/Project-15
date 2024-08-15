import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'jhh-sidebar-burger',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './sidebar-burger.component.html',
  styleUrls: ['./sidebar-burger.component.scss'],
})
export class SidebarBurgerComponent {
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  handleClick(): void {
    this.toggleSidebar.emit();
  }
}
