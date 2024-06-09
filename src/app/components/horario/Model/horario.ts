export enum DiaSemana {
    Lunes = 'LUNES',
    Martes = 'MARTES',
    Miercoles = 'MIERCOLES',
    Jueves = 'JUEVES',
    Viernes = 'VIERNES',
    Sabado = 'SABADO',
    Domingo = 'DOMINGO'
  }
  
  export interface Horario {
    userId: string;
    diaSemana: DiaSemana;
    fecha: string;
    horaInicio: string;
    horaFin: string;
  }
  