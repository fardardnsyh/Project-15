import { FormGroup, ValidationErrors } from '@angular/forms';

export function DateRangeValidator(
  startControlName: string,
  endControlName: string
): (formGroup: FormGroup) => ValidationErrors | null {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const startControl = formGroup.get(startControlName);
    const endControl = formGroup.get(endControlName);

    if (!startControl || !endControl) {
      return null;
    }

    const start: Date = new Date(startControl.value);
    const end: Date = new Date(endControl.value);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { invalidDateRange: true };
    }

    if (start && end && end < start) {
      endControl.setErrors({ invalidDateRange: true });
      return { invalidDateRange: true };
    }

    if (endControl.errors && endControl.errors['invalidDateRange']) {
      delete endControl.errors['invalidDateRange'];
      if (Object.keys(endControl.errors).length === 0) {
        endControl.setErrors(null);
      }
    }

    return null;
  };
}
