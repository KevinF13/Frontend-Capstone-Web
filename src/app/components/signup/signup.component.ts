import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  role: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    // Verificar el formato del correo electrónico
    if (!this.isValidEmail(this.email)) {
      Swal.fire('Error', 'El correo electrónico ingresado no tiene un formato válido.', 'error');
      return;
    }

    // Verificar la longitud de la contraseña
    if (this.password.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }

    // Verificar el valor del rol
    if (this.role !== 'Supervisor' && this.role !== 'Guardia') {
      Swal.fire('Error', 'El rol debe ser "Supervisor" o "Guardia".', 'error');
      return;
    }

    Swal.fire({
      title: "Desea registrar los datos?",
      showCancelButton: true,
      confirmButtonText: "Guardar Registro"
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.signUp(this.email, this.password, this.role).subscribe(
          (response) => {
            Swal.fire('Éxito', '¡Usuario registrado exitosamente!', 'success');
          },
          (error) => {
            Swal.fire('Error', 'El correo ya fue registrado, intenta con otro correo', 'error');
          }
        );
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  // Función para verificar el formato del correo electrónico usando una expresión regular
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
