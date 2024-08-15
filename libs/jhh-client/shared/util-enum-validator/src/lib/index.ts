import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function EnumValidator<T>(enumObj: { [key: string]: T }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values: T[] = Object.values(enumObj);
    if (values.includes(control.value)) {
      return null;
    }
    return { enumInvalid: { value: control.value } };
  };
}
