import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { Bitacora } from '../Model/bitacora';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {
  private apiUrl = `${environment.apiUrl}/bitacora`;

  constructor(private http: HttpClient) {}

  // Método para obtener todas las bitácoras
  getAllBitacoras(queryParams: any = {}): Observable<Bitacora[]> {
    return this.http.get<Bitacora[]>(this.apiUrl, {
      ...this.getHttpOptions(),
      params: queryParams
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener una bitácora por ID
  getBitacoraById(id: string): Observable<Bitacora> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Bitacora>(url, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  // // Método para crear una bitácora
  // createBitacora(bitacora: any): Observable<Bitacora> {
  //   return this.http.post<Bitacora>(this.apiUrl, bitacora, this.getHttpOptions())
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // Método para actualizar una bitácora
  // updateBitacora(id: string, bitacora: any): Observable<Bitacora> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.put<Bitacora>(url, bitacora, this.getHttpOptions())
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // Método para eliminar una bitácora
  // deleteBitacora(id: string): Observable<any> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.delete(url, this.getHttpOptions())
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

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
    let errorMessage = 'Error desconocido!';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
