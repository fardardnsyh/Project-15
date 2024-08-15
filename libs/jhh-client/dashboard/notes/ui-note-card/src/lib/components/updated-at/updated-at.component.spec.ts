import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { UpdatedAtComponent } from './updated-at.component';

describe('UpdatedAtComponent', () => {
  let component: UpdatedAtComponent;
  let fixture: ComponentFixture<UpdatedAtComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, UpdatedAtComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatedAtComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display updated date in the correct format', () => {
    const testDate: Date = new Date(2023, 10, 15, 15, 30);
    component.updatedAt = testDate;
    fixture.detectChanges();

    const dateElement = fixture.nativeElement.querySelector('span');
    expect(dateElement.textContent).toContain('15.11.23 15:30');
  });
});
