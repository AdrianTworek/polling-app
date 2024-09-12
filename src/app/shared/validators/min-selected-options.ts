import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

export const minSelectedOptions = (min = 1): ValidatorFn => {
  return (formArray: AbstractControl) => {
    const formArrayControl = formArray as FormArray;
    const totalSelected = formArrayControl.controls.reduce((total, control) => {
      const value = control.value;
      if (typeof value === 'boolean') {
        return total + (value ? 1 : 0);
      } else if (typeof value === 'string') {
        return total + (value.trim() !== '' ? 1 : 0);
      } else if (Array.isArray(value)) {
        return total + (value.length > 0 ? 1 : 0);
      } else if (typeof value === 'object' && value !== null) {
        return total + (Object.keys(value).length > 0 ? 1 : 0);
      }
      return total;
    }, 0);

    return totalSelected >= min
      ? null
      : { minSelected: { actual: totalSelected, required: min } };
  };
};
