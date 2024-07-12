import { Component } from '@angular/core';
import { Notificacion } from '../header/Model/notificacion.model';
import { EmergencyService } from '../header/Service/emergency.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent {
  emergencyMessages: Notificacion[] = [];

  constructor(private emergencyService: EmergencyService) {}

  ngOnInit() {
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
}