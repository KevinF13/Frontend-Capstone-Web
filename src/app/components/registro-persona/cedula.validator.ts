// cedula.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cedulaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cedula = control.value;
    if (!cedula) {
      return null; // Si el campo está vacío, no hay error
    }

    let total = 0;
    const longitud = cedula.length;
    const longcheck = longitud - 1;

    if (longitud === 10) {
      for (let i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
          let aux = parseInt(cedula.charAt(i)) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cedula.charAt(i));
        }
      }
      total = total % 10 ? 10 - total % 10 : 0;

      if (cedula.charAt(longitud - 1) == total) {
        return null; // Cédula válida
      }
    }
    return { cedulaInvalida: true }; // Cédula inválida
  };
}
