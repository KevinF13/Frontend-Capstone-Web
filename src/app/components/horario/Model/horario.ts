export enum DiaSemana {
    Lunes = 'Lunes',
    Martes = 'Martes',
    Miercoles = 'Miercoles',
    Jueves = 'Jueves',
    Viernes = 'Viernes',
    Sabado = 'Sabado',
    Domingo = 'Domingo'
  }
  
  export interface Horario {
    userId: string;
    diaSemana: DiaSemana;
    fecha: string;
    horaInicio: string;
    horaFin: string;
  }
  