import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Notificacion } from '../Model/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  private apiUrl = `${environment.apiUrl}/notificacion`; // Ajusta el URL de acuerdo a tu configuración
  constructor(private http: HttpClient) {}

  private getToken(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }
    return token;
  }

  getEmergencyMessages(): Observable<Notificacion[]> {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Notificacion[]>(this.apiUrl, { headers });
  }
}