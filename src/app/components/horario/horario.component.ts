import { Component, OnInit } from '@angular/core';
import { Persona } from '../informacion-empleados/Model/persona';
import { PersonaService } from '../informacion-empleados/Service/persona.service';
import { HorarioService } from './Service/horario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {

  personas: Persona[] = [];
  selectedUserId: string | null = null;
  today!: string;

  startDate: string | null = null;
  endDate: string | null = null;

  showEnviarButton: boolean = false;
  showEnviarConRangoButton: boolean = false;

  constructor(
    private personaService: PersonaService,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    this.getPersonas();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    this.today = `${day}/${month}/${year}`;
  }

  getPersonas(): void {
    this.personaService.getAllPersonas().subscribe(
      (personas) => {
        this.personas = personas;
      },
      (error) => {
        console.error('Error al obtener personas', error);
      }
    );
  }

  submitForm() {
    const form = document.getElementById('horarioForm') as HTMLFormElement;
    const formData = new FormData(form);
  
    // Verifica si se ha seleccionado una persona
    if (!this.selectedUserId) {
      console.error('Debes seleccionar una persona para asignarle un horario.');
      return;
    }
  
    const lugarTrabajo = formData.get('lugar') as string;
    const puesto = formData.get('puesto') as string;
    const horaInicio = formData.get('horaInicio') as string;
    const horaFin = formData.get('horaFin') as string;
    const fecha = formData.get('fecha') as string;
  
    // Parsear la fecha seleccionada
    const [year, month, day] = fecha.split('-');
    const date = new Date(`${year}-${month}-${day}T00:00:00`); // Asegurando que es inicio del día
    const diaSemana = this.getDiaSemana(date);
    const fechaFormatted = `${day}/${month}/${year}`;
  
    // Crear el DTO
    const createHorarioDto = {
      lugarTrabajo,
      puesto,
      diaSemana,
      fecha: fechaFormatted,
      horaInicio,
      horaFin,
      userId: this.selectedUserId
    };
  
    // Llamar al servicio para crear el horario
    this.horarioService.createHorario(createHorarioDto).subscribe(
      (response) => {
        console.log('Horario creado exitosamente:', response);
  
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Horario creado!',
          text: 'El horario ha sido creado exitosamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          // Aquí puedes agregar lógica adicional después de mostrar la alerta
        });
      },
      (error) => {
        console.error('Error al crear horario:', error);
  
        // Mostrar SweetAlert de error
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Hubo un error al crear el horario. Por favor, intenta nuevamente.',
          confirmButtonText: 'OK'
        });
      }
    );
  
    // Limpiar selección después de enviar el formulario
    this.selectedUserId = null;
  }
  
  
  

  submitFormWithRange() {
    const form = document.getElementById('horarioForm') as HTMLFormElement;
    const formData = new FormData(form);

    if (!this.selectedUserId || !this.startDate || !this.endDate) {
      console.error('Debes seleccionar una persona y un rango de fechas para asignarle un horario.');
      return;
    }

    const lugarTrabajo = formData.get('lugar') as string;
    const puesto = formData.get('puesto') as string;
    const horaInicio = formData.get('horaInicio') as string;
    const horaFin = formData.get('horaFin') as string;

    // Parsear las fechas de inicio y fin
    const start = new Date(this.startDate + 'T00:00:00'); // Asegurando que es inicio del día
    const end = new Date(this.endDate + 'T23:59:59'); // Asegurando que es fin del día

    // Iterar sobre cada día del rango de fechas, incluyendo el último día
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const fechaFormatted = `${day}/${month}/${year}`;

      // Crear el DTO para cada día
      const createHorarioDto = {
        lugarTrabajo,
        puesto,
        diaSemana: this.getDiaSemana(date),
        fecha: fechaFormatted,
        horaInicio,
        horaFin,
        userId: this.selectedUserId
      };

      // Llamar al servicio para crear el horario
      this.horarioService.createHorario(createHorarioDto).subscribe(
        (response) => {
          console.log('Horario creado exitosamente:', response);
        },
        (error) => {
          console.error('Error al crear horario:', error);
        }
      );
    }

    Swal.fire({
      icon: 'success',
      title: '¡Horarios creados!',
      text: 'Los horarios han sido creados exitosamente.',
      confirmButtonText: 'OK'
    });

    this.clearForm();
  }

  setSelectedUserId(userId: string, isRange: boolean = false) {
    this.selectedUserId = userId;
    this.showEnviarButton = !isRange;
    this.showEnviarConRangoButton = isRange;
  }

  clearForm() {
    this.selectedUserId = null;
    this.startDate = null;
    this.endDate = null;
    this.showEnviarButton = false;
    this.showEnviarConRangoButton = false;
  }

  updateDiaSemana(event: Event) {
    const input = event.target as HTMLInputElement;
    const [year, month, day] = input.value.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    const diaSemana = this.getDiaSemana(date);
    const diaSemanaInput = document.getElementById('diaSemana') as HTMLInputElement;
    diaSemanaInput.value = diaSemana;
  }
  

  getDiaSemana(date: Date): string {
    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    return days[date.getDay()];
  }

  onStartDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.startDate = input.value;
  }

  onEndDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.endDate = input.value;
  }
}
