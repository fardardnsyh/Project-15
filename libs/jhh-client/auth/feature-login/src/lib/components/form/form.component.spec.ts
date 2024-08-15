import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { By } from '@angular/platform-browser';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { AuthFormField } from '@jhh/jhh-client/auth/domain';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let authFacade: AuthFacade;
  let loginInProgressSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loginInProgressSubject = new BehaviorSubject(false);
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
            login: jest.fn(),
            loginInProgress$: of(false),
            loginError$: of(null),
          },
        },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authFacade = TestBed.inject(AuthFacade);
    authFacade.login = jest.fn().mockReturnValue(of('some_value'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility when the toggle button is clicked', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('#password-input')
    ).nativeElement;
    const toggleButton = fixture.debugElement.query(
      By.css('#password-type-toggle')
    ).nativeElement;
    expect(passwordInput.type).toBe('password');

    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('text');

    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('password');
  });

  it('should call onSubmit and login when the form is valid', () => {
    const authFacade = TestBed.inject(AuthFacade);
    component.formGroup.get(AuthFormField.Username)?.setValue('username');
    component.formGroup.get(AuthFormField.Password)?.setValue('password');

    component.onSubmit();

    expect(authFacade.login).toHaveBeenCalledWith('username', 'password');
  });

  it('should disable submit button when login is in progress', () => {
    loginInProgressSubject.next(true);
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('should show spinner when login is in progress', async () => {
    component.loginInProgress$ = of(true);
    component.loginError$ = of(null);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });
});
