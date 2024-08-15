import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

import { QuizField } from '@jhh/jhh-client/dashboard/practice/domain';

export function UniqueAnswerValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const formArray = control as FormArray;
    if (!formArray.controls || !Array.isArray(formArray.controls)) {
      return null;
    }

    const texts = formArray.controls
      .map((control) => control.value[QuizField.AnswerText])
      .map((text) => (text ? text.trim().toLowerCase() : ''));

    const hasDuplicate: boolean = texts.some(
      (text, index) => texts.indexOf(text) !== index
    );

    return hasDuplicate ? { duplicatedAnswers: true } : null;
  };
}
