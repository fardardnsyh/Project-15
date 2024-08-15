import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

import { QuizField } from '@jhh/jhh-client/dashboard/practice/domain';

export function AnswersValidator(): ValidatorFn {
  return (answers: AbstractControl): { [key: string]: any } | null => {
    const answersArray = answers as FormArray;
    const correctAnswersCount: number = answersArray.controls.filter(
      (answer) => answer.get(QuizField.IsCorrect)?.value
    ).length;
    const incorrectAnswersCount: number =
      answersArray.length - correctAnswersCount;

    if (correctAnswersCount < 1 || incorrectAnswersCount < 1) {
      return { invalidAnswersDistribution: true };
    }

    return null;
  };
}
