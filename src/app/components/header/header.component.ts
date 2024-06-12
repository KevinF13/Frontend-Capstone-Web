import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Variable para verificar si el usuario ha iniciado sesión
  isSupervisor: boolean = false; // Variable para verificar si el usuario es Supervisor

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn; // Actualiza el estado de inicio de sesión en el componente de encabezado
    });

    this.authService.getCurrentUserRole().subscribe((role) => {
      this.isSupervisor = role === 'Supervisor';
    });
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout();
    this.isLoggedIn = false; // Actualiza isLoggedIn como false después de cerrar sesión
    this.router.navigate(['/']); // Redirige al usuario a la página de inicio
}

}

