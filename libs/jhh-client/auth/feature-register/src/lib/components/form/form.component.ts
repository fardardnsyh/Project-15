import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import zxcvbn from 'zxcvbn';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';
import { RegisterFieldLength } from '@jhh/shared/domain';
import {
  AuthFormErrorKey,
  AuthFormField,
  PasswordStrengthClass,
} from '@jhh/jhh-client/auth/domain';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { WhitespaceValidator } from '@jhh/jhh-client/shared/util-whitespace-validator';

function passwordsMatch(group: FormGroup): ValidationErrors | null {
  const passwordControl = group.get(AuthFormField.Password);
  const confirmPasswordControl = group.get(AuthFormField.ConfirmPassword);

  if (
    passwordControl &&
    confirmPasswordControl &&
    confirmPasswordControl.value !== passwordControl.value
  ) {
    return { confirmPasswordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'jhh-register-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  readonly clientRoute: typeof ClientRoute = ClientRoute;
  readonly registerFieldLength: typeof RegisterFieldLength =
    RegisterFieldLength;
  readonly formField: typeof AuthFormField = AuthFormField;
  readonly formErrorKey: typeof AuthFormErrorKey = AuthFormErrorKey;

  formGroup: FormGroup;
  hidePassword: boolean = true;

  registerInProgress$: Observable<boolean>;
  registerError$: Observable<string | null>;

  private _passwordStrength$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  passwordStrength$: Observable<number> =
    this._passwordStrength$.asObservable();

  progressBarClass$: Observable<string> = this.passwordStrength$.pipe(
    map((strength: number) => {
      switch (true) {
        case strength >= 100:
          return PasswordStrengthClass.Strong;
        case strength >= 75:
          return PasswordStrengthClass.Good;
        case strength >= 50:
          return PasswordStrengthClass.Medium;
        case strength >= 25:
          return PasswordStrengthClass.Weak;
        default:
          return PasswordStrengthClass.None;
      }
    })
  );

  ngOnInit(): void {
    this.registerInProgress$ = this.authFacade.registerInProgress$;
    this.registerError$ = this.authFacade.registerError$;

    this.initFormGroup();
  }

  validatePasswords(): void {
    this.formGroup.updateValueAndValidity();

    const password = this.formGroup.get(this.formField.Password)?.value;
    const passwordStrength: zxcvbn.ZXCVBNResult = zxcvbn(password);
    const newStrength: number = password
      ? Math.max(25, passwordStrength.score * 25)
      : 0;

    this._passwordStrength$.next(newStrength);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const username = this.formGroup.get(this.formField.Username)?.value;
      const password = this.formGroup.get(this.formField.Password)?.value;
      const confirmPassword = this.formGroup.get(
        this.formField.ConfirmPassword
      )?.value;

      this.authFacade.register(username, password, confirmPassword);
    }
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group(
      {
        [this.formField.Username]: [
          '',
          [
            Validators.required,
            Validators.minLength(RegisterFieldLength.MinUsernameLength),
            Validators.maxLength(RegisterFieldLength.MaxUsernameLength),
            WhitespaceValidator,
          ],
        ],
        [this.formField.Password]: [
          '',
          [
            Validators.required,
            Validators.minLength(RegisterFieldLength.MinPasswordLength),
            Validators.maxLength(RegisterFieldLength.MaxPasswordLength),
            WhitespaceValidator,
          ],
        ],
        [this.formField.ConfirmPassword]: [''],
      },
      { validators: [passwordsMatch] }
    );
  }
}
