import { AbstractControl, ValidationErrors } from '@angular/forms';

export const requiredTrimmed = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (!value || value.trim().length === 0) {
    return { requiredTrimmed: true };
  }

  return null;
};
