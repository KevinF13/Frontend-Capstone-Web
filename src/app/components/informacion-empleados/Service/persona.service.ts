import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Persona } from '../Model/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private apiUrl = `${environment.apiUrl}/persona`;

  constructor(private http: HttpClient) { }

  getAllPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl, this.getAuthHeaders());
  }

  createPersona(personaData: any): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, personaData, this.getAuthHeaders());
  }

  updatePersona(personaId: string, personaData: any): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${personaId}`, personaData, this.getAuthHeaders());
  }

  deletePersona(personaId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${personaId}`, this.getAuthHeaders());
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return { headers };
  }
}
