import { Component, OnInit } from '@angular/core';
import { Persona } from './Model/persona';
import { PersonaService } from './Service/persona.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from 'src/app/auth/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informacion-empleados',
  templateUrl: './informacion-empleados.component.html',
  styleUrls: ['./informacion-empleados.component.css']
})
export class InformacionEmpleadosComponent implements OnInit {
  users: User[] = []; // Cambia el nombre de personas a users
  personas: Persona[] = [];
  showForm: boolean = false;
  personaForm: FormGroup;
  selectedUserId: string | undefined;
  // personaSeleccionada: Persona | null = null;
  // editingMode: boolean = false;

  constructor(private fb: FormBuilder, private personaService: PersonaService, private authService: AuthService) {
    this.personaForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      direccionDomicilio: ['', Validators.required],
      telefono: ['', Validators.required],
      manejaArma: [false, Validators.required],
      imagen: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.getPersonas(); // Llamada al método implementado
    this.getUsers(); // Llamada al método para obtener usuarios
  }

  seleccionarUsuario(userId: string) {
    // Verificar si el userId no está presente en la tabla de Personas
    // this.editingMode = false;
    const usuarioExistente = this.personas.find(persona => persona.userId === userId);
    if (!usuarioExistente) {
      this.selectedUserId = userId;
      this.personaForm.get('userId')!.setValue(userId); // Asignar el valor de userId al campo del formulario
      this.personaForm.get('userId')!.disable(); // Deshabilitar el input para que no se pueda modificar
      this.showForm = true; // Esto mostrará el formulario emergente
    } else {
      // Mostrar SweetAlert si el usuario ya tiene un perfil creado
      Swal.fire({
        icon: 'error',
        title: 'Perfil Existente',
        text: 'El usuario ya tiene un perfil creado.'
      });
    }
  }
  
  
  getUsers(): void {
    this.authService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error al obtener usuarios', error);
      }
    );
  }
  
  updatePersona(userId: string): void {
    // this.editingMode = true;
    // const personaEncontrada = this.personas.find(persona => persona.userId === userId);
    // if (personaEncontrada) {
    //   this.personaSeleccionada = personaEncontrada;
    //   this.personaForm.patchValue(this.personaSeleccionada);
    //   this.showForm = true; // Abrir el formulario
    // } else {
    //   console.error('Persona no encontrada');
    // }
  }
  
  onSubmit() {
    console.log(this.personaForm);
    if (this.personaForm.valid && this.selectedUserId) {
      this.personaForm.patchValue({ userId: this.selectedUserId });
      this.personaForm.get('userId')!.disable(); // Bloquear el campo userId
      const newPersona: Persona = this.personaForm.value;
      newPersona.userId = this.selectedUserId;
      this.personaService.createPersona(newPersona).subscribe(
        response => {
          // Mostrar SweetAlert si la persona se crea exitosamente
          Swal.fire({
            icon: 'success',
            title: 'Persona Creada',
            text: 'La persona ha sido creada exitosamente.'
          });
          // Aquí puedes añadir lógica para redirigir al usuario, mostrar un mensaje, etc.
        },
        error => {
          // Mostrar SweetAlert si hay un error al crear la persona
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al crear la persona.'
          });
          console.error('Error al crear la persona', error);
        }
      );
    }
  }
  

  cerrarFormulario() {
    this.showForm = false;
    this.selectedUserId = undefined; // Limpiar el ID seleccionado cuando se cierra el formulario
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

  deletePersona(userId: string): void {
    // Lógica para eliminar una persona
  }
  
}
