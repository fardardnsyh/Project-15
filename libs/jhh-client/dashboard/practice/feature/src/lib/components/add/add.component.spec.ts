import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { AddComponent } from './add.component';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let mockPracticeFacade: Partial<PracticeFacade>;
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
    mockPracticeFacade = {
      addQuizInProgress$: of(false),
      addQuizError$: of(null),
      addQuizSuccess$: of(false),
    };

    await TestBed.configureTestingModule({
      imports: [AddComponent],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: PracticeFacade, useValue: mockPracticeFacade },
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
      component.formGroup.controls[component.formField.Name]
    ).toBeDefined();
    expect(
      component.formGroup.controls[component.formField.Description]
    ).toBeDefined();
    expect(
      component.formGroup.controls[component.formField.ImageUrl]
    ).toBeDefined();
    expect(
      component.formGroup.controls[component.formField.Items]
    ).toBeDefined();
  });

  it('form should be invalid when empty', () => {
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('should display spinner when addQuizInProgress$ emits true', (done) => {
    mockPracticeFacade.addQuizInProgress$ = of(true);
    component.ngOnInit();
    component.addQuizInProgress$.subscribe((isInProgress) => {
      expect(isInProgress).toBe(true);
      done();
    });
  });

  it('should display error message when addQuizError$ emits value', (done) => {
    const errorMessage = 'Error occurred';
    mockPracticeFacade.addQuizError$ = of(errorMessage);
    component.ngOnInit();
    component.addQuizError$.subscribe((error) => {
      expect(error).toBe(errorMessage);
      done();
    });
  });
});
