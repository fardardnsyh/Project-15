import { AbstractControl } from '@angular/forms';

import { regex } from '@jhh/shared/regex';

export function ColorValidator(
  control: AbstractControl
): { invalidColor: boolean } | null {
  if (!control.value) {
    return null;
  }

  if (regex.color.test(control.value)) {
    return null;
  } else {
    return { invalidColor: true };
  }
}
