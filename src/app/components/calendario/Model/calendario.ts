export type DiaSemanaKeys = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

export interface DiaSemana {
  LUNES: string[];
  MARTES: string[];
  MIERCOLES: string[];
  JUEVES: string[];
  VIERNES: string[];
  SABADO: string[];
  DOMINGO: string[];
}

export interface HorarioPorDia {
  userId: string;
  nombres: string;
  apellidos: string;
  dias: DiaSemana;
}

export interface Calendario {
  id(id: any, horario: Calendario): unknown;
  _id: string;
  userId: string;
  diaSemana: DiaSemanaKeys;
  lugarTrabajo: string;
  puesto: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}
