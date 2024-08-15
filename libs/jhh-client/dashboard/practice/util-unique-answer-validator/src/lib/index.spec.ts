import '@angular/compiler';
import { FormArray, FormControl } from '@angular/forms';

import { UniqueAnswerValidator } from '.';
import { QuizField } from '@jhh/jhh-client/dashboard/practice/domain';

describe('UniqueAnswerValidator', () => {
  function createAnswerControl(answer: string): FormControl {
    return new FormControl({ [QuizField.AnswerText]: answer });
  }

  it('should return null for all unique answers', () => {
    const answers = new FormArray([
      createAnswerControl('Answer 1'),
      createAnswerControl('Answer 2'),
      createAnswerControl('Answer 3'),
    ]);
    const validatorFn = UniqueAnswerValidator();
    const result = validatorFn(answers);

    expect(result).toBeNull();
  });

  it('should return an error object for duplicate answers', () => {
    const answers = new FormArray([
      createAnswerControl('Duplicate'),
      createAnswerControl('duplicate'),
      createAnswerControl('Unique Answer'),
    ]);
    const validatorFn = UniqueAnswerValidator();
    const result = validatorFn(answers);

    expect(result).toEqual({ duplicatedAnswers: true });
  });

  it('should detect duplicates ignoring case and whitespace', () => {
    const answers = new FormArray([
      createAnswerControl('  Answer '),
      createAnswerControl('answer'),
      createAnswerControl('Another Answer'),
    ]);
    const validatorFn = UniqueAnswerValidator();
    const result = validatorFn(answers);

    expect(result).toEqual({ duplicatedAnswers: true });
  });

  it('should return null when the FormArray is empty or contains no controls', () => {
    const emptyAnswers = new FormArray([]);
    const validatorFn = UniqueAnswerValidator();
    const resultForEmpty = validatorFn(emptyAnswers);

    expect(resultForEmpty).toBeNull();
  });
});
