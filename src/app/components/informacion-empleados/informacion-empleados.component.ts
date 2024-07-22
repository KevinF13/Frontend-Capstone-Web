import { Component, OnInit } from '@angular/core';
import { Persona } from './Model/persona';
import { PersonaService } from './Service/persona.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from 'src/app/auth/service/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente/Model/cliente';

@Component({
  selector: 'app-informacion-empleados',
  templateUrl: './informacion-empleados.component.html',
  styleUrls: ['./informacion-empleados.component.css']
})
export class InformacionEmpleadosComponent implements OnInit {
  users: User[] = [];
  personas: Persona[] = [];
  clientes: Cliente[] = [];
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  createPersonaForm: FormGroup;
  editPersonaForm: FormGroup;
  selectedUserId: string | undefined;
  selectedUserDetails: Persona | null = null; // Asegúrate de inicializar como null

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5; // Número de ítems por página

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
      userId: ['', Validators.required],
      clienteId: ['', Validators.required]
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
      userId: ['', Validators.required],
      clienteId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getPersonas();
    this.getUsers();
    this.getClientes();
  }

  getClientes(): void {
    this.personaService.getAllClientes().subscribe(
      (clientes) => {
        this.clientes = clientes;
      },
      (error) => {
        console.error('Error al obtener clientes', error);
      }
    );
  }

  seleccionarUsuario(userId: string) {
    const usuarioExistente = this.personas.find(persona => persona.userId === userId);
    if (!usuarioExistente) {
      this.selectedUserId = userId;
      this.createPersonaForm.get('userId')!.setValue(userId);
      this.createPersonaForm.get('userId')!.disable();
      this.showCreateForm = true;
    } else {
    }
  }

  mostrarDetallesUsuario(userId: string) {
    const usuarioSeleccionado = this.personas.find(persona => persona.userId === userId);
    if (usuarioSeleccionado) {
      // Convertir fecha de ingreso al formato YYYY-MM-DD
      usuarioSeleccionado.fechaIngreso = this.convertirFecha(usuarioSeleccionado.fechaIngreso);
      
      this.selectedUserDetails = usuarioSeleccionado;
    } else {
      this.selectedUserDetails = null;
      Swal.fire({
        icon: 'error',
        title: 'Perfil no encontrado',
        text: 'No se encontraron detalles para el usuario seleccionado.'
      });
    }
  }
  
  // Función para convertir fecha a formato YYYY-MM-DD
  convertirFecha(fecha: string): string {
    // Si la fecha ya está en el formato esperado, retornarla
    if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return fecha;
    }
  
    // Si la fecha está en formato "DD/MM/YYYY", convertirla a "YYYY-MM-DD"
    const partes = fecha.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
  
    // Si no se puede convertir, retornar la fecha original
    return fecha;
  }
  
  cerrarDetallesUsuario() {
    this.selectedUserDetails = null;
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
      userId: userId,  // Asignar el userId al campo del formulario
   
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
    
  cerrarCreateForm() {
    this.showCreateForm = false;
    this.selectedUserId = undefined;
  }

  cerrarEditForm() {
    this.showEditForm = false;
  }

  getPersonas(): void {
    this.personaService.getAllClientes().subscribe(
      (clientes) => {
        this.clientes = clientes;
      },
      (error) => {
        console.error('Error al obtener clientes', error);
      }
    );
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
            this.cerrarDetallesUsuario();
            this.personas = this.personas.filter(persona => persona.userId !== userId);
            Swal.fire('Eliminada!', '', 'success');
          },
          error => {
            console.error('Error al eliminar la persona:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar la persona', 'error');
          }
        );
        this.authService.deleteUser(userId).subscribe(
          () => {
            console.log('Usuario eliminada');
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

  guardarCambios() {
    if (this.selectedUserDetails) {
      const personaData = this.selectedUserDetails;
      const userId = this.selectedUserDetails.userId;
    
      this.personaService.updatePersona(userId, personaData).subscribe(
        updatedPersona => {
          // Actualizar los detalles del usuario en la variable local
          this.selectedUserDetails = updatedPersona;
    
          // Ocultar el formulario de edición
          this.showEditForm = false;
    
          // Mostrar una alerta de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La persona ha sido actualizada correctamente.',
            confirmButtonText: 'OK'
          });
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

  toggleWeapon(hasWeapon: boolean) {
    if (this.selectedUserDetails) {
      this.selectedUserDetails.manejaArma = hasWeapon;
    }
  }

  // Métodos para paginación
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
  }
}