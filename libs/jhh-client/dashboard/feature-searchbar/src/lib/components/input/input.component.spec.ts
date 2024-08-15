import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        InputComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided placeholder', () => {
    const testPlaceholder: string = 'Test Placeholder';
    component.placeholder = testPlaceholder;
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('mat-label');
    expect(labelElement.textContent).toContain(testPlaceholder);
  });

  it('should emit searchChange event on input change', () => {
    jest.spyOn(component.searchChange, 'emit');
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.searchChange.emit).toHaveBeenCalledWith('test');
  });
});
