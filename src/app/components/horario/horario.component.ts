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

  constructor(
    private personaService: PersonaService,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    this.getPersonas();
    // Calcula la fecha actual en el formato DD/MM/YYYY
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
  
    const fecha = formData.get('fecha') as string;
    // Convertir fecha a formato dd/mm/yyyy
    const [year, month, day] = fecha.split('-');
    const fechaFormatted = `${day}/${month}/${year}`;
  
    const createHorarioDto = {
      lugarTrabajo: formData.get('lugar') as string,
      puesto: formData.get('puesto') as string,
      diaSemana: formData.get('diaSemana') as string,
      fecha: fechaFormatted, // Enviar fecha en formato dd/mm/yyyy
      horaInicio: formData.get('horaInicio') as string,
      horaFin: formData.get('horaFin') as string,
      userId: this.selectedUserId // Usa el userId seleccionado
    };
  
    console.log('DTO de creación de horario:', createHorarioDto);
  
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
  

  // Método para actualizar el userId seleccionado
  setSelectedUserId(userId: string) {
    this.selectedUserId = userId;
  }

  // Función para manejar el cierre del formulario
  closeForm() {
    this.selectedUserId = null;
  }

  // Función para actualizar el día de la semana según la fecha seleccionada
  updateDiaSemana(event: Event) {
    const input = event.target as HTMLInputElement;
    const [year, month, day] = input.value.split('-');
    const date = new Date(`${month}/${day}/${year}`);
    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    const diaSemana = days[date.getDay()];
    const diaSemanaInput = document.getElementById('diaSemana') as HTMLInputElement;
    diaSemanaInput.value = diaSemana;
  }
}
