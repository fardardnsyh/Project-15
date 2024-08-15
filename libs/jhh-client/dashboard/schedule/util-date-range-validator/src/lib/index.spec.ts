import '@angular/compiler';
import { FormControl, FormGroup } from '@angular/forms';

import { DateRangeValidator } from '.';

describe('DateRangeValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });

    formGroup.setValidators(DateRangeValidator('startDate', 'endDate') as any);
    formGroup.updateValueAndValidity();
  });

  it('should not return an error for a valid date range', () => {
    formGroup.get('startDate')?.setValue('2023-01-01');
    formGroup.get('endDate')?.setValue('2023-01-02');

    formGroup.updateValueAndValidity();

    expect(formGroup.valid).toBeTruthy();
    expect(formGroup.get('endDate')?.errors).toBeNull();
  });

  it('should return an error when the end date is before the start date', () => {
    formGroup.get('startDate')?.setValue('2023-01-02');
    formGroup.get('endDate')?.setValue('2023-01-01');

    formGroup.updateValueAndValidity();

    expect(formGroup.valid).toBeFalsy();
    expect(formGroup.errors).toEqual({ invalidDateRange: true });
    expect(formGroup.get('endDate')?.errors).toEqual({
      invalidDateRange: true,
    });
  });

  it('should return an error for an invalid date', () => {
    formGroup.get('startDate')?.setValue('invalid-date');
    formGroup.get('endDate')?.setValue('2023-01-02');

    formGroup.updateValueAndValidity();

    expect(formGroup.valid).toBeFalsy();
    expect(formGroup.errors).toEqual({ invalidDateRange: true });
  });
});
