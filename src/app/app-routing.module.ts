import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './auth/service/auth.guard';
import { InformacionEmpleadosComponent } from './components/informacion-empleados/informacion-empleados.component';

const routes: Routes = [
  { path: 'registrarGuardia', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'infoEmpleados', component: InformacionEmpleadosComponent },
  //{ path: '**', redirectTo: '/home' }
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
