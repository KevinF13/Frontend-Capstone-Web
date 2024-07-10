import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { ClienteService } from './Service/cliente.service';
import { Cliente } from './Model/cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  cliente: Partial<Cliente> = { nombreCliente: '', descripcion: '', userId: '' };
  isEditing: boolean = false;

  constructor(private clienteService: ClienteService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllClientes();
  }

  getAllClientes(): void {
    this.clienteService.getAll().subscribe(
      (data: Cliente[]) => {
        this.clientes = data;
      },
      (error) => {
        Swal.fire('Error', 'Error al obtener los clientes', 'error');
        console.error('Error al obtener los clientes', error);
      }
    );
  }

  selectCliente(cliente: Cliente): void {
    this.cliente = { ...cliente };
    this.isEditing = true;
  }

  createNewCliente(): void {
    this.cliente = { nombreCliente: '', descripcion: '', userId: '' };
    this.isEditing = false;
  }

  saveCliente(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user && user._id) {
          this.cliente.userId = user._id;
          console.log('Datos a enviar para creación o actualización:', this.cliente); // Agrega esta línea

          if (this.isEditing) {
            this.clienteService.update(this.cliente._id!, this.cliente as Cliente).subscribe(
              () => {
                Swal.fire('Éxito', 'Cliente actualizado exitosamente', 'success');
                this.getAllClientes();
                this.cancel();
              },
              (error) => {
                Swal.fire('Error', 'Error al actualizar el cliente', 'error');
                console.error('Error al actualizar el cliente', error);
              }
            );
          } else {
            this.clienteService.create(this.cliente as Cliente).subscribe(
              () => {
                Swal.fire('Éxito', 'Cliente creado exitosamente', 'success');
                this.getAllClientes();
                this.cancel();
              },
              (error) => {
                Swal.fire('Error', 'Error al crear el cliente', 'error');
                console.error('Error al crear el cliente', error);
              }
            );
          }
        } else {
          Swal.fire('Error', 'No se pudo obtener el _id del usuario', 'error');
          console.error('No se pudo obtener el _id del usuario');
        }
      },
      (error) => {
        Swal.fire('Error', 'Error al obtener el usuario actual', 'error');
        console.error('Error al obtener el usuario actual', error);
      }
    );
  }

  deleteCliente(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(id).subscribe(
          () => {
            Swal.fire('Eliminado', 'Cliente eliminado exitosamente', 'success');
            this.getAllClientes();
          },
          (error) => {
            Swal.fire('Error', 'Error al eliminar el cliente', 'error');
            console.error('Error al eliminar el cliente', error);
          }
        );
      }
    });
  }

  cancel(): void {
    this.cliente = { nombreCliente: '', descripcion: '', userId: '' };
    this.isEditing = false;
  }
}