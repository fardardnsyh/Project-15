import { RouterOutlet } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { JhhClientAuthShellComponent } from './jhh-client-auth-shell.component';

describe('JhhClientAuthShellComponent', () => {
  let component: JhhClientAuthShellComponent;
  let fixture: ComponentFixture<JhhClientAuthShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientAuthShellComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientAuthShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a router outlet', () => {
    const element = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(element).not.toBeNull();
  });
});
