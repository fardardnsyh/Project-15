import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function MaxSizeValidator(maxSizeInBytes: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (typeof control.value === 'undefined' || control.value === null) {
      return null;
    }

    const contentSizeInBytes: number = new Blob([control.value]).size;
    const sizeExceeded: boolean = contentSizeInBytes > maxSizeInBytes;

    return sizeExceeded
      ? {
          maxsize: {
            currentSize: contentSizeInBytes,
            maxSize: maxSizeInBytes,
          },
        }
      : null;
  };
}
