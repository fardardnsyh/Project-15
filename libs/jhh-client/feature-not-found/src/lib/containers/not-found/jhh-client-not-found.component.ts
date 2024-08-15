import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoComponent } from '../../components/info/info.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'jhh-not-found',
  standalone: true,
  imports: [CommonModule, InfoComponent, ButtonComponent],
  templateUrl: './jhh-client-not-found.component.html',
  styleUrls: ['./jhh-client-not-found.component.scss'],
})
export class JhhClientNotFoundComponent {}
