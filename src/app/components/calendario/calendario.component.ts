import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CalendarioService } from './Service/calendario.service';
import { Calendario } from './Model/calendario';
import { PersonaService } from '../informacion-empleados/Service/persona.service';
import { Persona } from '../informacion-empleados/Model/persona';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  horarios: Calendario[] = [];
  personas: Persona[] = [];
  dias: string[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  startDate!: Date;
  endDate!: Date;
  fechasSemana: Date[] = [];
  selectedHorario: Calendario | null = null;
  uniqueLugaresTrabajo: string[] = [];
  lugaresTrabajo: string[] = [];
  selectedLugarTrabajo: string = '';

  constructor(private calendarioService: CalendarioService, private personaService: PersonaService, private elementRef: ElementRef) { 
    this.initializeDates();
  }

  ngOnInit(): void {
    this.getHorarios();
    this.getUniqueLugaresTrabajo();
  }

  initializeDates(): void {
    const currentDate = new Date();
    const first = currentDate.getDate() - currentDate.getDay() + 1;
    this.startDate = new Date(currentDate.setDate(first));
    this.endDate = new Date(currentDate.setDate(first + 6));
    this.updateFechasSemana();
  }

  updateFechasSemana(): void {
    this.fechasSemana = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.startDate);
      date.setDate(this.startDate.getDate() + i);
      this.fechasSemana.push(date);
    }
    this.endDate = new Date(this.fechasSemana[6]);
  }

  getHorarios(): void {
    const startDateStr = this.formatDate(this.startDate);
    const endDateStr = this.formatDate(this.endDate);
    this.personaService.getAllPersonas().subscribe(
      (personas) => {
        this.personas = personas;
        this.calendarioService.getAllHorarios().subscribe(
          (horarios) => {
            this.horarios = horarios.filter(horario => this.isDateInRange(horario.fecha));
            this.lugaresTrabajo = [...new Set(this.horarios.map(horario => horario.lugarTrabajo))];
            this.getUniqueLugaresTrabajo();
          },
          (error) => {
            console.error('Error al obtener horarios', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener personas', error);
      }
    );
  }

  changeWeek(direction: number): void {
    const daysToAdd = direction * 7;
    this.startDate.setDate(this.startDate.getDate() + daysToAdd);
    this.endDate.setDate(this.startDate.getDate() + 6);
    this.updateFechasSemana();
    this.getHorarios();
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  isDateInRange(dateStr: string): boolean {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date >= this.startDate && date <= this.endDate;
  }

  getHorariosPorDia(dia: string, persona: Persona): Calendario[] {
    const index = this.dias.indexOf(dia);
    if (index === -1) return [];
    const dateToCompare = this.fechasSemana[index];
    return this.horarios.filter(horario => 
      horario.diaSemana === dia && 
      horario.userId === persona.userId && 
      this.isSameDate(horario.fecha, dateToCompare)
    );
  }

  isSameDate(dateStr: string, date: Date): boolean {
    const [day, month, year] = dateStr.split('/').map(Number);
    const horarioDate = new Date(year, month - 1, day);
    return horarioDate.getDate() === date.getDate() &&
           horarioDate.getMonth() === date.getMonth() &&
           horarioDate.getFullYear() === date.getFullYear();
  }

  openHorarioInfo(horario: Calendario): void {
    if (this.selectedHorario === horario) {
      this.closeHorarioInfo();
    } else {
      this.selectedHorario = horario;
    }
  }

  closeHorarioInfo(): void {
    this.selectedHorario = null;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeHorarioInfo();
    }
  }

  getUniqueLugaresTrabajo(): void {
    this.uniqueLugaresTrabajo = [...new Set(this.horarios.map(horario => horario.lugarTrabajo))];
  }

  filterHorariosByLugarTrabajo(): Calendario[] {
    if (this.selectedLugarTrabajo) {
      return this.horarios.filter(horario => horario.lugarTrabajo === this.selectedLugarTrabajo);
    } else {
      return this.horarios;
    }
  }
  
}
