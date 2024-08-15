import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { AuthFormErrorKey, AuthFormField } from '@jhh/jhh-client/auth/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  readonly clientRoute: typeof ClientRoute = ClientRoute;
  readonly formField: typeof AuthFormField = AuthFormField;
  readonly formErrorKey: typeof AuthFormErrorKey = AuthFormErrorKey;

  formGroup: FormGroup;
  hidePassword: boolean = true;

  loginInProgress$: Observable<boolean>;
  loginError$: Observable<string | null>;

  ngOnInit(): void {
    this.loginInProgress$ = this.authFacade.loginInProgress$;
    this.loginError$ = this.authFacade.loginError$;

    this.initFormGroup();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const username = this.formGroup.get(this.formField.Username)?.value;
      const password = this.formGroup.get(this.formField.Password)?.value;

      this.authFacade.login(username, password);
    }
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.Username]: ['', [Validators.required]],
      [this.formField.Password]: ['', [Validators.required]],
    });
  }
}
