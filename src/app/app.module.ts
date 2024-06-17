import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { GuardiaComponent } from './components/guardia/guardia/guardia.component';
import { InformacionEmpleadosComponent } from './components/informacion-empleados/informacion-empleados.component';
import { MatInputModule } from '@angular/material/input';
import { AuthInterceptor } from './auth/service/auth.interceptor';
import { HorarioComponent } from './components/horario/horario.component';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { RegistroPersonaComponent } from './components/registro-persona/registro-persona.component';
import { DatePipe } from '@angular/common';
import { MonitoreoComponent } from './components/monitoreo/monitoreo.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    GuardiaComponent,
    InformacionEmpleadosComponent,
    HorarioComponent,
    BitacoraComponent,
    CalendarioComponent,
    RegistroPersonaComponent,
    MonitoreoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
