import '@angular/compiler';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { AnswersValidator } from '.';

import { QuizField } from '@jhh/jhh-client/dashboard/practice/domain';

describe('AnswersValidator', () => {
  function createAnswer(isCorrect: boolean): FormGroup {
    return new FormGroup({
      [QuizField.IsCorrect]: new FormControl(isCorrect),
    });
  }

  it('should return null for a valid mix of correct and incorrect answers', () => {
    const answers = new FormArray([createAnswer(true), createAnswer(false)]);

    const validatorFn = AnswersValidator();
    const result = validatorFn(answers);

    expect(result).toBeNull();
  });

  it('should return an error object for all correct answers', () => {
    const answers = new FormArray([createAnswer(true), createAnswer(true)]);

    const validatorFn = AnswersValidator();
    const result = validatorFn(answers);

    expect(result).toEqual({ invalidAnswersDistribution: true });
  });

  it('should return an error object for all incorrect answers', () => {
    const answers = new FormArray([createAnswer(false), createAnswer(false)]);

    const validatorFn = AnswersValidator();
    const result = validatorFn(answers);

    expect(result).toEqual({ invalidAnswersDistribution: true });
  });
});
