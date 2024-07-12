import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EmergencyService } from './Service/emergency.service';
import { Notificacion } from './Model/notificacion.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isSupervisor: boolean = false;
  emergencyMessages: Notificacion[] = [];

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private emergencyService: EmergencyService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.getCurrentUserRole().subscribe((role) => {
      this.isSupervisor = role === 'Supervisor';
    });

    this.loadEmergencyMessages();
  }

  loadEmergencyMessages(): void {
    this.emergencyService.getEmergencyMessages().subscribe(
      (messages: Notificacion[]) => {
        this.emergencyMessages = messages;
      },
      error => {
        console.error('Error fetching emergency messages', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}