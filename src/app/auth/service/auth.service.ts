import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface User {
  _id: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}

interface SignUpResponse {
  token: string;
}

interface LoginResponse {
  token: string;
  userId: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string, role: string): Observable<SignUpResponse> {
    // Obtener el token almacenado en el localStorage
    const token = localStorage.getItem('token');
    
    // Comprobar si el token está presente
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }

    // Configurar el encabezado de autorización
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Construir el cuerpo de la solicitud
    const body = { email, password, role };

    // Realizar la solicitud POST con el encabezado de autorización y el cuerpo de la solicitud
    return this.http.post<SignUpResponse>(`${this.apiUrl}/signup`, body, { headers });
  }
  
  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body).pipe(
      tap((response: LoginResponse) => {
        // Almacenar el token en el localStorage después de iniciar sesión exitosamente
        localStorage.setItem('token', response.token);
        // Actualiza el estado de inicio de sesión a true cuando el usuario inicia sesión
        this.loggedIn.next(true);
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    // Obtener el token almacenado en el localStorage
    const token = localStorage.getItem('token');

    // Comprobar si el token está presente
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }

    // Configurar el encabezado de autorización
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Realizar la solicitud GET con el encabezado de autorización
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  // logout() {
  //   // Lógica de cierre de sesión aquí
  //   localStorage.removeItem('token'); // Elimina el token del almacenamiento local
  //   this.loggedIn.next(false); // Actualiza el estado de inicio de sesión a false cuando el usuario cierra sesión
  // }

  // isLoggedIn(): Observable<boolean> {
  //   return this.loggedIn.asObservable();
  // }
  
  logout() {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    this.loggedIn.next(false); // Actualiza el estado de inicio de sesión a false
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }


}
