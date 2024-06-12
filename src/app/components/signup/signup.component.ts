import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private authService: AuthService, private router: Router) {}

  @Output() userIdEmitter: EventEmitter<string> = new EventEmitter<string>();

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
            console.log('SignUp Response:', response); // Log para depurar
            const userId = response._id;
            this.authService.setUserId(userId);
            Swal.fire('Éxito', '¡Usuario registrado exitosamente!', 'success');
            this.router.navigate(['/registroPerfil']);
          },
          (error) => {
            console.error('Error al registrar usuario:', error); // Log para depurar
            if (error.status === 409) { // Conflict - Correo ya registrado
              Swal.fire('Error', 'El correo ya fue registrado, intenta con otro correo', 'error');
            } else if (error.status !== 201) { // Cualquier otro error diferente a 201
              Swal.fire('Error', 'Hubo un problema al registrar el usuario, por favor intenta de nuevo más tarde', 'error');
            }
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
