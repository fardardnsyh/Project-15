import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JhhClientAuthUiTemplateComponent } from '@jhh/jhh-client/auth/ui-template';
import { FormComponent } from '../../components/form/form.component';

@Component({
  selector: 'jhh-login',
  standalone: true,
  imports: [CommonModule, JhhClientAuthUiTemplateComponent, FormComponent],
  templateUrl: './jhh-client-auth-login.component.html',
  styleUrls: ['./jhh-client-auth-login.component.scss'],
})
export class JhhClientAuthLoginComponent {}
