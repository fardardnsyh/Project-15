import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhhClientAuthRegisterComponent } from './jhh-client-auth-register.component';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { ActivatedRoute } from '@angular/router';

describe('JhhClientAuthRegisterComponent', () => {
  let component: JhhClientAuthRegisterComponent;
  let fixture: ComponentFixture<JhhClientAuthRegisterComponent>;
  const mockAuthFacade = {
    register: jest.fn(),
    registerInProgress$: of(false),
    registerError$: of(null),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientAuthRegisterComponent],
      providers: [
        FormBuilder,
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JhhClientAuthRegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
