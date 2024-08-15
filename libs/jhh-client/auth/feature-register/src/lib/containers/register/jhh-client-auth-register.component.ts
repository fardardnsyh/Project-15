import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JhhClientAuthUiTemplateComponent } from '@jhh/jhh-client/auth/ui-template';
import { FormComponent } from '../../components/form/form.component';

@Component({
  selector: 'jhh-register',
  standalone: true,
  imports: [CommonModule, JhhClientAuthUiTemplateComponent, FormComponent],
  templateUrl: './jhh-client-auth-register.component.html',
  styleUrls: ['./jhh-client-auth-register.component.scss'],
})
export class JhhClientAuthRegisterComponent {}
