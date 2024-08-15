import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-not-found-button',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  redirectTo: ClientRoute = ClientRoute.Home;
}
