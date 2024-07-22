import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mayorDeEdadValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si no hay valor, no validar
    }

    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    return edad >= 18 ? null : { noEsMayorDeEdad: true };
  };
}
