import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Persona } from '../Model/persona';
import { Cliente } from '../../cliente/Model/cliente';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = `${environment.apiUrl}/persona`; // Ajusta el URL de acuerdo a tu configuración
  private apiUrlCliente = `${environment.apiUrl}/cliente`;
  constructor(private http: HttpClient) {}

  // Método privado para obtener el token almacenado en localStorage
  private getToken(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }
    return token;
  }

  // Método para obtener todas las cliente
  getAllClientes(page: number = 1, keyword: string = ''): Observable<Cliente[]> {
    const token = this.getToken();
    let params = new HttpParams()
      .set('page', page.toString())
      .set('keyword', keyword);
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Cliente[]>(this.apiUrlCliente, { params, headers });
  }

  // Método para obtener todas las personas
  getAllPersonas(page: number = 1, keyword: string = ''): Observable<Persona[]> {
    const token = this.getToken();
    let params = new HttpParams()
      .set('page', page.toString())
      .set('keyword', keyword);
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Persona[]>(this.apiUrl, { params, headers });
  }

  // Métodos restantes con la misma lógica de agregar el token a la solicitud...

  // Método para obtener una persona por ID
  getPersona(id: string): Observable<Persona> {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Persona>(`${this.apiUrl}/${id}`, { headers });
  }

  // Método para crear una nueva persona
  createPersona(persona: Persona): Observable<Persona> {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<Persona>(this.apiUrl, persona, { headers });
  }

  // Método para actualizar una persona por ID
  updatePersona(id: string, persona: Partial<Persona>): Observable<Persona> {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, persona, { headers });
  }

  // Método para eliminar una persona por ID
  deletePersona(id: string): Observable<Persona> {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<Persona>(`${this.apiUrl}/${id}`, { headers });
  }
}
