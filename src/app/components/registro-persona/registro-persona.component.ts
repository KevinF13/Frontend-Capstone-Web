import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../informacion-empleados/Service/persona.service';
import { Persona } from '../informacion-empleados/Model/persona';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { cedulaValidator } from './cedula.validator'; // Importar el validador

@Component({
  selector: 'app-registro-persona',
  templateUrl: './registro-persona.component.html',
  styleUrls: ['./registro-persona.component.css']
})
export class RegistroPersonaComponent implements OnInit {
  personaForm!: FormGroup;
  loading = false;
  userId: string = '';

  constructor(private fb: FormBuilder, private personaService: PersonaService, private authService: AuthService, private router: Router, private datePipe: DatePipe) {
    this.createForm();
  }

  ngOnInit() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    this.personaForm.get('fechaIngreso')?.setValue(formattedDate);

    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userId = userId;
      this.personaForm.get('userId')?.setValue(this.userId);
    } else {
      console.error('No se pudo obtener el userId del AuthService.');
    }
  }

  createForm() {
    this.personaForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula: ['', [Validators.required, cedulaValidator()]], // Aplicar el validador personalizado
      fechaNacimiento: ['', Validators.required],
      direccionDomicilio: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      telefono: ['', Validators.required],
      manejaArma: [false],
      imagen: [''],
      userId: ['']
    });
    this.personaForm.get('userId')?.setValue(this.userId);
  }

  onSubmit() {
    if (this.personaForm.invalid) {
      return;
    }

    this.loading = true;

    const persona: Persona = this.personaForm.value;

    this.personaService.createPersona(persona).subscribe(
      (response) => {
        Swal.fire('Éxito', '¡Persona registrada exitosamente!', 'success');
        this.loading = false;
        this.personaForm.reset();
        this.router.navigate(['/registrarGuardia']);
      },
      (error) => {
        console.log(persona);
        console.error('Error al registrar persona:', error);
        Swal.fire('Error', 'Hubo un problema al registrar la persona, por favor intenta de nuevo más tarde', 'error');
        this.loading = false;
      }
    );
  }

  toggleWeapon(hasWeapon: boolean) {
    this.personaForm.get('manejaArma')?.setValue(hasWeapon);
  }
}
