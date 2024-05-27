import { Component, OnInit } from '@angular/core';
import { Persona } from './Model/persona';
import { PersonaService } from './Service/persona.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-informacion-empleados',
  templateUrl: './informacion-empleados.component.html',
  styleUrls: ['./informacion-empleados.component.css']
})
export class InformacionEmpleadosComponent implements OnInit {
  personas: Persona[] = []; // Inicialización en el constructor
  showForm: boolean = false;
  personaForm!: FormGroup;

  
  constructor(private formBuilder: FormBuilder, private personaService: PersonaService) { }



  ngOnInit(): void {
    this.getPersonas();
    this.personaForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      direccionDomicilio: ['', Validators.required],
      telefono: ['', Validators.required],
      manejaArma: ['', Validators.required],
      imagen: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      userId: ['', Validators.required],
      // Agrega más campos según tus necesidades y valida como desees
    });
  }
  onSubmit(): void {
    if (this.personaForm.invalid) {
      return;
    }

    // Envía los datos del formulario al servicio para crear una nueva persona
    this.personaService.createPersona(this.personaForm.value).subscribe(
      (response) => {
        console.log('Persona creada exitosamente:', response);
        // Agrega aquí la lógica para manejar la respuesta, como mostrar un mensaje de éxito
        // y reiniciar el formulario
        this.showForm = false;
        this.personaForm.reset();
      },
      (error) => {
        console.error('Error al crear persona:', error);
        // Agrega aquí la lógica para manejar el error, como mostrar un mensaje de error
      }
    );
  }

  getPersonas(): void {
    this.personaService.getAllPersonas()
      .subscribe(personas => this.personas = personas);
  }

  createPersona(): void {
    // Lógica para crear una persona
  }

  updatePersona(userId: string): void {
    // Lógica para actualizar una persona
  }

  deletePersona(userId: string): void {
    // Lógica para eliminar una persona
  }

}
