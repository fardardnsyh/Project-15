import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { AuthFormField } from '@jhh/jhh-client/auth/domain';
import { By } from '@angular/platform-browser';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let authFacade: AuthFacade;
  let registerInProgressSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    registerInProgressSubject = new BehaviorSubject(false);

    await TestBed.configureTestingModule({
      imports: [
        FormComponent,
        ReactiveFormsModule,
        HttpClientModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: AuthFacade,
          useValue: {
            register: jest.fn(),
            registerInProgress$: of(false),
            registerError$: of(null),
          },
        },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    authFacade = TestBed.inject(AuthFacade);
    authFacade.register = jest.fn().mockReturnValue(of('some_value'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect password strength through progress bar class', () => {
    const inputElement: HTMLInputElement =
      fixture.nativeElement.querySelector('#password-input');
    inputElement.value = 'StrongPassword123!';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    component.validatePasswords();
    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar.classList).toContain('strength-75');
  });

  it('should toggle password visibility when the toggle button is clicked', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('#password-input')
    ).nativeElement;
    const toggleButton = fixture.debugElement.query(
      By.css('#password-type-toggle-first')
    ).nativeElement;
    expect(passwordInput.type).toBe('password');

    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('text');

    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('password');
  });

  it('should call onSubmit and register when the form is valid', () => {
    const authFacade = TestBed.inject(AuthFacade);
    component.formGroup.get(AuthFormField.Username)?.setValue('username');
    component.formGroup.get(AuthFormField.Password)?.setValue('password');
    component.formGroup
      .get(AuthFormField.ConfirmPassword)
      ?.setValue('password');

    component.onSubmit();

    expect(authFacade.register).toHaveBeenCalledWith(
      'username',
      'password',
      'password'
    );
  });

  it('should disable submit button when register is in progress', () => {
    registerInProgressSubject.next(true);
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('should show spinner when register is in progress', async () => {
    component.registerInProgress$ = of(true);
    component.registerError$ = of(null);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });
});
