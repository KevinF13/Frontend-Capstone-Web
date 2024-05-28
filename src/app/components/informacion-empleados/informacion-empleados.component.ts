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
  users: User[] = [];
  personas: Persona[] = [];
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  createPersonaForm: FormGroup;
  editPersonaForm: FormGroup;
  selectedUserId: string | undefined;

  constructor(private fb: FormBuilder, private personaService: PersonaService, private authService: AuthService) {
    this.createPersonaForm = this.fb.group({
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

    this.editPersonaForm = this.fb.group({
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
    this.getPersonas();
    this.getUsers();
  }

  seleccionarUsuario(userId: string) {
    const usuarioExistente = this.personas.find(persona => persona.userId === userId);
    if (!usuarioExistente) {
      this.selectedUserId = userId;
      this.createPersonaForm.get('userId')!.setValue(userId);
      this.createPersonaForm.get('userId')!.disable();
      this.showCreateForm = true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Perfil Existente',
        text: 'El usuario ya tiene un perfil creado.'
      });
    }
  }

  seleccionarPersona(persona: Persona, userId: string) {
    this.editPersonaForm.patchValue({
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      cedula: persona.cedula,
      fechaNacimiento: persona.fechaNacimiento,
      direccionDomicilio: persona.direccionDomicilio,
      telefono: persona.telefono,
      manejaArma: persona.manejaArma,
      imagen: persona.imagen,
      fechaIngreso: persona.fechaIngreso,
      userId: userId  // Asignar el userId al campo del formulario
    });
    this.editPersonaForm.get('userId')!.disable();
    this.showEditForm = true;
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

  onCreateSubmit() {
    if (this.createPersonaForm.valid && this.selectedUserId) {
      this.createPersonaForm.patchValue({ userId: this.selectedUserId });
      this.createPersonaForm.get('userId')!.disable();
      const newPersona: Persona = this.createPersonaForm.value;
      newPersona.userId = this.selectedUserId;
      this.personaService.createPersona(newPersona).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Persona Creada',
            text: 'La persona ha sido creada exitosamente.'
          });
          this.getPersonas();
          this.getUsers();
        },
        error => {
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

  onEditSubmit() {
    if (this.editPersonaForm.valid) {
      const personaData = this.editPersonaForm.getRawValue();  // Obtener todos los valores, incluidos los deshabilitados
      const userId = personaData.userId;
      delete personaData.userId;  // Eliminar userId de los datos a enviar, si no es necesario
  
      this.personaService.updatePersona(userId, personaData)
        .subscribe(
          updatedPersona => {
            console.log('Persona actualizada:', updatedPersona);
            this.showEditForm = false;  // Ocultar el formulario después de la actualización
            this.getPersonas();
            this.getUsers();
            // Mostrar una alerta de éxito
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'La persona ha sido actualizada correctamente.',
              confirmButtonText: 'OK'
            });
  
            // Aquí puedes agregar lógica adicional, como actualizar la lista de personas en la vista
          },
          error => {
            console.error('Error al actualizar la persona:', error);
  
            // Mostrar una alerta de error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al actualizar la persona. Por favor, inténtalo de nuevo.',
              confirmButtonText: 'OK'
            });
          }
        );
    }
  }
  

  cerrarCreateForm() {
    this.showCreateForm = false;
    this.selectedUserId = undefined;
  }

  cerrarEditForm() {
    this.showEditForm = false;
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
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar esta persona?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personaService.deletePersona(userId).subscribe(
          () => {
            console.log('Persona eliminada');
            this.getPersonas();
            this.getUsers();
            // Aquí puedes agregar lógica para actualizar la lista de personas en la vista
            
            this.personas = this.personas.filter(persona => persona.userId !== userId);
            Swal.fire('Eliminada!', '', 'success');
          },
          error => {
            console.error('Error al eliminar la persona:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar la persona', 'error');
          }
        );
      } else if (result.isDenied) {
        Swal.fire('La persona no ha sido eliminada', '', 'info');
      }
    });
  }
}
