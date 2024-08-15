import '@angular/compiler';
import { FormControl } from '@angular/forms';

import { WhitespaceValidator } from '.';

describe('WhitespaceValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl();
  });

  it('should return null when control value is null', () => {
    control.setValue(null);
    expect(WhitespaceValidator(control)).toBeNull();
  });

  it('should return null when control value is an empty string', () => {
    control.setValue('');
    expect(WhitespaceValidator(control)).toBeNull();
  });

  it('should return null when control value contains no whitespace', () => {
    control.setValue('noSpace');
    expect(WhitespaceValidator(control)).toBeNull();
  });

  it('should return an object with whitespace: true when control value contains whitespace', () => {
    control.setValue('has space');
    expect(WhitespaceValidator(control)).toEqual({ whitespace: true });
  });
});
