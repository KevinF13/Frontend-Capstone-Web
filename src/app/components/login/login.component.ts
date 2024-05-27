import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: '¡Bienvenido de nuevo!',
        });
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error logging in:', error);
        if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña o el correo electrónico son incorrectos',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se produjo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde',
          });
        }
      }
    );
  }
}
