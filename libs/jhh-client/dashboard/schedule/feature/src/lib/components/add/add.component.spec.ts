import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddComponent } from './add.component';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let mockScheduleFacade: Partial<ScheduleFacade>;
  let mockDialog: jest.Mocked<MatDialog>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn(),
      afterClosed: jest.fn().mockReturnValue(of(null)),
    } as unknown as jest.Mocked<MatDialog>;
    mockScheduleFacade = {
      addEventInProgress$: of(false),
      addEventError$: of(null),
      addEventSuccess$: of(false),
    };

    await TestBed.configureTestingModule({
      imports: [AddComponent],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: ScheduleFacade, useValue: mockScheduleFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group correctly', () => {
    expect(component.formGroup).toBeDefined();
    expect(
      component.formGroup.controls[component.formField.Title]
    ).toBeDefined();
    expect(
      component.formGroup.controls[component.formField.Start]
    ).toBeDefined();
    expect(component.formGroup.controls[component.formField.End]).toBeDefined();
    expect(
      component.formGroup.controls[component.formField.Description]
    ).toBeDefined();
    expect(
      component.formGroup.controls[component.formField.Color]
    ).toBeDefined();
  });

  it('form should be invalid when empty', () => {
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('should display spinner when addEventInProgress$ emits true', (done) => {
    mockScheduleFacade.addEventInProgress$ = of(true);
    component.ngOnInit();
    component.addEventInProgress$.subscribe((isInProgress) => {
      expect(isInProgress).toBe(true);
      done();
    });
  });

  it('should display error message when addEventError$ emits value', (done) => {
    const errorMessage = 'Error occurred';
    mockScheduleFacade.addEventError$ = of(errorMessage);
    component.ngOnInit();
    component.addEventError$.subscribe((error) => {
      expect(error).toBe(errorMessage);
      done();
    });
  });
});
