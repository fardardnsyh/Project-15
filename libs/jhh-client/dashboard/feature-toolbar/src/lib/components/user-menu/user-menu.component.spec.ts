import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMenuComponent } from './user-menu.component';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let mockAuthFacade;

  beforeEach(async () => {
    mockAuthFacade = {};

    await TestBed.configureTestingModule({
      imports: [UserMenuComponent],
      providers: [{ provide: AuthFacade, useValue: mockAuthFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
