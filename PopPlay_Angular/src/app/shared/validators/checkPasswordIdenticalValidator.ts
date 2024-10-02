import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/** An actor's name can't match the given regular expression */
export const checkPasswordIdenticalValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
      const pwd = control.get('password')?.value;
      const pwd2 = control.get('password2')?.value;
      return pwd === pwd2 ? null : { passwordMismatch: true };
    };