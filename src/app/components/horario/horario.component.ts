import { Component, OnInit } from '@angular/core';
import { Persona } from '../informacion-empleados/Model/persona';
import { PersonaService } from '../informacion-empleados/Service/persona.service';
import { HorarioService } from './Service/horario.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {
  
  personas: Persona[] = [];
  selectedUserId: string | null = null;

  constructor(
    private personaService: PersonaService,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    this.getPersonas();
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

  // Método para enviar el formulario
  submitForm() {
    const form = document.getElementById('horarioForm') as HTMLFormElement;
    const formData = new FormData(form);
    
    // Verifica si se ha seleccionado una persona
    if (!this.selectedUserId) {
      console.error('Debes seleccionar una persona para asignarle un horario.');
      return;
    }

    const createHorarioDto = {
      diaSemana: formData.get('diaSemana') as string,
      fecha: formData.get('fecha') as string,
      horaInicio: formData.get('horaInicio') as string,
      horaFin: formData.get('horaFin') as string,
      userId: this.selectedUserId // Usa el userId seleccionado
    };

    console.log('DTO de creación de horario:', createHorarioDto);

    this.horarioService.createHorario(createHorarioDto).subscribe(
      (response) => {
        console.log('Horario creado exitosamente:', response);
        // Aquí puedes agregar lógica adicional después de crear el horario
      },
      (error) => {
        console.error('Error al crear horario:', error);
        // Aquí puedes manejar el error como desees
      }
    );

    // Ocultar el formulario después de enviarlo
    this.selectedUserId = null;
  }

  // Método para actualizar el userId seleccionado
  setSelectedUserId(userId: string) {
    this.selectedUserId = userId;
  }
}
