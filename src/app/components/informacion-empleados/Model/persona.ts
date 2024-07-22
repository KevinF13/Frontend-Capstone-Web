export interface Persona {
  userId: string;
  clienteId: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  direccionDomicilio: string;
  telefono: string;
  manejaArma: boolean;
  imagen: string;
  fechaIngreso: string;
  createdAt:Date;
  updatedAt:Date;
}
