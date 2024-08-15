import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SidebarBurgerComponent } from './sidebar-burger.component';

describe('SidebarBurgerComponent', () => {
  let component: SidebarBurgerComponent;
  let fixture: ComponentFixture<SidebarBurgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarBurgerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarBurgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleClick when button is clicked', () => {
    jest.spyOn(component, 'handleClick').mockImplementation(() => {});

    fixture.detectChanges();

    const button: DebugElement = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(component.handleClick).toHaveBeenCalled();
  });
});
