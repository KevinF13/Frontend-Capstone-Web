import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calendario } from '../Model/calendario';
import { environment } from 'src/environments/environment.development';
import { PersonaService } from '../../informacion-empleados/Service/persona.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
    
  private apiUrl = `${environment.apiUrl}/horario`; // Reemplaza esto con la URL de tu API

  constructor(private http: HttpClient, private personaService: PersonaService) { }

 // Método para obtener todos los horarios filtrados por rango de fechas
 getAllHorarios(startDate?: string, endDate?: string, page: number = 1, keyword: string = ''): Observable<Calendario[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se ha iniciado sesión. El token no está disponible.');
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  let params = new HttpParams().set('page', page.toString());
  if (keyword) {
    params = params.set('keyword', keyword);
  }
  if (startDate && endDate) {
    params = params.set('startDate', startDate).set('endDate', endDate);
  }

  return this.http.get<Calendario[]>(this.apiUrl, { headers, params });
}

  



  // Otros métodos para crear, actualizar, eliminar, etc.
   // Método para actualizar un horario por ID
   updateHorario(id: string, horario: Partial<Calendario>): Observable<Calendario> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<Calendario>(`${this.apiUrl}/${id}`, horario, { headers });
  }

  // Método para eliminar un horario por ID
  deleteHorario(id: string): Observable<Calendario> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<Calendario>(`${this.apiUrl}/${id}`, { headers });
  }
}
