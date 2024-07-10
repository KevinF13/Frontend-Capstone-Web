import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { Cliente } from '../Model/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/cliente`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  getAll(queryParams: any = {}): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, {
      ...this.getHttpOptions(),
      params: queryParams
    }).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Cliente> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Cliente>(url, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  create(cliente: Cliente): Observable<Cliente> {
    console.log('Datos enviados al backend para creación:', cliente); // Agregar este console.log
    return this.http.post<Cliente>(this.apiUrl, cliente, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  update(id: string, cliente: Cliente): Observable<Cliente> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Datos enviados al backend para actualización:', cliente);
    return this.http.put<Cliente>(url, cliente, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  delete(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }
}