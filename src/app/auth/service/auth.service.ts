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
  _id: any;
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
  private currentUserRole = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string, role: string): Observable<SignUpResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = { email, password, role };
    return this.http.post<SignUpResponse>(`${this.apiUrl}/signup`, body, { headers });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.loggedIn.next(true);
        this.currentUserRole.next(response.role);  // Actualiza el rol actual del usuario
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha iniciado sesión. El token no está disponible.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(`${this.apiUrl}/me`, { headers });
  }

  setCurrentUserRole(role: string) {
    this.currentUserRole.next(role);  // Establece el rol actual del usuario
  }

  getCurrentUserRole(): Observable<string | null> {
    return this.currentUserRole.asObservable();
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.currentUserRole.next(null);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Método delete para eliminar un usuario por ID
deleteUser(userId: string): Observable<void> {
  const token = this.getToken();
  let headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.delete<void>(`${this.apiUrl}/user/${userId}`, { headers });
}
private getToken(): string {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se ha iniciado sesión. El token no está disponible.');
  }
  return token;
}

  ///PRUEBAS
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string | null {
    return this.userId;
  }
}
