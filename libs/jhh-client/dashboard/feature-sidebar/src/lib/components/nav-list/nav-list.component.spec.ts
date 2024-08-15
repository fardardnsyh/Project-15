import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavListComponent } from './nav-list.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('NavListComponent', () => {
  let component: NavListComponent;
  let fixture: ComponentFixture<NavListComponent>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({}),
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [NavListComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sidebar items', () => {
    const sidebarItems: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.sidenav__item')
    );
    expect(sidebarItems.length).toBe(component.sidebarItems.length);
  });
});
