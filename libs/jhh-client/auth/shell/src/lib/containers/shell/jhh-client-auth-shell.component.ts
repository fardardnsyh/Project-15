import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jhh-auth-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './jhh-client-auth-shell.component.html',
  styleUrls: ['./jhh-client-auth-shell.component.scss'],
})
export class JhhClientAuthShellComponent {}
