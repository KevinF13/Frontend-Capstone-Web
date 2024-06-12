import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { InformacionEmpleadosComponent } from './components/informacion-empleados/informacion-empleados.component';
import { HorarioComponent } from './components/horario/horario.component';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { HeaderComponent } from './components/header/header.component';
import { RegistroPersonaComponent } from './components/registro-persona/registro-persona.component';

const routes: Routes = [
  { path: 'registrarGuardia', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'infoEmpleados', component: InformacionEmpleadosComponent },
  { path: 'asignacionHorario', component: HorarioComponent },
  { path: 'bitacora', component: BitacoraComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'registroPerfil', component: RegistroPersonaComponent },
  { path: '**', redirectTo: '/home' }
  // { path: '', redirectTo: '/header', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
