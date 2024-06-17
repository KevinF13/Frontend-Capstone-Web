import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UbicacionActual } from '../Model/monitoreo';

@Injectable({
  providedIn: 'root'
})
export class UbicacionActualService {
    private apiUrl = `${environment.apiUrl}/ubicacion-actual`;

    constructor(private http: HttpClient) {}
  
    getAllUbicaciones(): Observable<UbicacionActual[]> {
      // Obtener el token de autenticación desde donde sea que lo tengas almacenado
      const token = localStorage.getItem('token');
  
      // Configurar los headers con el token de autenticación
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        })
      };
  
      // Realizar la solicitud HTTP GET para obtener todas las ubicaciones
      return this.http.get<UbicacionActual[]>(this.apiUrl, httpOptions).pipe(
        catchError(this.handleError)
      );
    }

    getUbicacionesPorUserId(userId: string): Observable<UbicacionActual[]> {
        const url = `${this.apiUrl}/user/${userId}`;
        // Realizar la solicitud HTTP GET para obtener las ubicaciones por userId
        return this.http.get<UbicacionActual[]>(url).pipe(
          catchError(this.handleError)
        );
      }
    
  
    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Error desconocido!';
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // El backend retornó un código de error
        errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    }
}
