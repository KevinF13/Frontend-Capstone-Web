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
    this.personaService.getAllPersonas();
    let params = new HttpParams().set('page', page.toString());
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (startDate && endDate) {
      params = params.set('startDate', startDate).set('endDate', endDate);
    }

    return this.http.get<Calendario[]>(this.apiUrl, { params });
  }

  // Otros métodos para crear, actualizar, eliminar, etc.
}
