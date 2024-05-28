import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Horario } from '../Model/horario';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = `${environment.apiUrl}/horario`;

  constructor(private http: HttpClient) {}

  // Método para crear un horario
  createHorario(createHorarioDto: CreateHorarioDto): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, createHorarioDto, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para obtener todos los horarios
  getAllHorarios(queryParams: any = {}): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl, {
      ...this.getHttpOptions(),
      params: queryParams
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener horarios por userId
  getHorariosByUserId(userId: string): Observable<Horario[]> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<Horario[]>(url, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para actualizar un horario por userId
  updateHorario(id: string, updateHorarioDto: UpdateHorarioDto): Observable<Horario> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Horario>(url, updateHorarioDto, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para eliminar un horario por userId
  deleteHorario(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para obtener las opciones de la solicitud HTTP incluyendo el token de autenticación
  private getHttpOptions() {
    const token = localStorage.getItem('token'); // Suponiendo que el token de autenticación se almacena en el localStorage
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  // Manejo de errores de las peticiones HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}

// Definir interfaces para los DTOs
interface CreateHorarioDto {
  // Define aquí las propiedades del DTO para crear un horario
}

interface UpdateHorarioDto {
  // Define aquí las propiedades del DTO para actualizar un horario
}
