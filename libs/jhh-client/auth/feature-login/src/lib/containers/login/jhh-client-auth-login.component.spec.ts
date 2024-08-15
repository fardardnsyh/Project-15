import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { JhhClientAuthLoginComponent } from './jhh-client-auth-login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('JhhClientAuthLoginComponent', () => {
  let component: JhhClientAuthLoginComponent;
  let fixture: ComponentFixture<JhhClientAuthLoginComponent>;
  const mockAuthFacade = {
    login: jest.fn(),
    loginInProgress$: of(false),
    loginError$: of(null),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NoopAnimationsModule,
        JhhClientAuthLoginComponent,
      ],
      providers: [
        FormBuilder,
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientAuthLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
