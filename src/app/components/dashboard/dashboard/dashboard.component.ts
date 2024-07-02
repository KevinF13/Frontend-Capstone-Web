import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto'; // Importa Chart.js directamente
import { BitacoraService } from '../../bitacora/Service/bitacora.service';
import 'chartjs-chart-box-and-violin-plot';
import { Persona } from '../../informacion-empleados/Model/persona';
import { PersonaService } from '../../informacion-empleados/Service/persona.service';
import { DiaSemana, Horario } from '../../horario/Model/horario';
import { HorarioService } from '../../horario/Service/horario.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public bitacoraChart: any;
  public personas: Persona[] = [];
  public horarios: Horario[] = [];

  constructor(private bitacoraService: BitacoraService, private personaService: PersonaService, private horarioService: HorarioService) {}

  ngOnInit(): void {
    this.loadBitacoraData();
    this.loadDataEmpleados();
  }

  loadBitacoraData(): void {
    this.bitacoraService.getAllBitacoras().subscribe(data => {
      const clientes = data.map(bitacora => bitacora.cliente);
      const clienteCounts = this.countOccurrences(clientes);
      this.createChart(clienteCounts);
      this.createPieChart(clienteCounts);
      this.createAreaChart(clienteCounts);
      this.createBoxPlot([[10, 20, 30, 40, 50], [15, 25, 35, 45, 55]]); // Ejemplo de datos para el gráfico de caja y bigotes
      this.createBubbleChart([{ x: 10, y: 20, r: 5 }, { x: 15, y: 25, r: 10 }]); // Ejemplo de datos para el gráfico de burbujas
      // Puedes llamar a otros métodos para crear otros tipos de gráficos aquí si es necesario
    });
  }
  loadDataEmpleados(): void {
    // Ejemplo de carga de datos de personas desde el servicio
    this.personaService.getAllPersonas().subscribe(
      data => {
        this.personas = data;
        this.createArmaChart();
        this.createFechaIngresoChart();
        this.createEdadChart();
      },
      error => {
        console.error('Error al cargar los datos de personas', error);
      }
    );
    this.horarioService.getAllHorarios().subscribe(
      data => {
        this.horarios = data;
        this.createFechaHorarioChart();
        this.createMismoHorarioChart();
        this.createFinDeSemanaChart();
      },
      error => {
        console.error('Error al cargar los datos de horarios', error);
      }
    );
  }

  countOccurrences(array: string[]): { [key: string]: number } {
    return array.reduce((acc: { [key: string]: number }, curr: string) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
  }
  

  createChart(data: { [key: string]: number }): void {
    const labels = Object.keys(data);
    const values = Object.values(data);

    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    this.bitacoraChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Bitácoras por Cliente',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  createPieChart(data: { [key: string]: number }): void {
    const labels = Object.keys(data);
    const values = Object.values(data);
  
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.bitacoraChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Bitácoras por Cliente',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem: any) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          }
        }
      }
    });
  }

  createAreaChart(data: { [key: string]: number }): void {
    const labels = Object.keys(data);
    const values = Object.values(data);
  
    const ctx = document.getElementById('areaChart') as HTMLCanvasElement;
    this.bitacoraChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Bitácoras por Cliente',
          data: values,
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.3
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createBoxPlot(data: number[][]): void {
    // Calcular los valores necesarios para simular el gráfico de caja y bigotes
    const median = data.map(d => d[2]); // Mediana
    const q1 = data.map(d => d[1]);     // Primer cuartil (Q1)
    const q3 = data.map(d => d[3]);     // Tercer cuartil (Q3)
    const min = data.map(d => d[0]);    // Valor mínimo
    const max = data.map(d => d[4]);    // Valor máximo
  
    // Configurar el gráfico utilizando Chart.js
    const ctx = document.getElementById('boxPlotChart') as HTMLCanvasElement;
    this.bitacoraChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Bitácoras'],
        datasets: [
          {
            label: 'Mediana',
            data: median,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointRadius: 0, // No mostrar puntos
          },
          {
            label: 'Q1 - Q3',
            data: q3,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: 'Min - Max',
            data: max,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            data: min,
            borderColor: 'rgba(255, 99, 132, 0)',
            backgroundColor: 'rgba(255, 99, 132, 0)',
            borderWidth: 0,
            pointRadius: 0,
            fill: '-1', // Relleno hasta el conjunto de datos anterior (max)
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Gráfico de Caja y Bigotes Simulado',
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Valores',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  createBubbleChart(data: { x: number; y: number; r: number }[]): void {
    const ctx = document.getElementById('bubbleChart') as HTMLCanvasElement;
    this.bitacoraChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Bitácoras',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const { datasetIndex, dataIndex } = context;
                const dataPoint = data[dataIndex];
                return `Bitácora ${dataPoint.x}, Valor ${dataPoint.y}, Radio ${dataPoint.r}`;
              }
            }
          }
        }
      }
    });
  }


  ///GRAFICOS DE INFORMACION DEL PERSONAL
  createArmaChart(): void {
    const manejaArmaCount = this.personas.filter(persona => persona.manejaArma).length;
    const noManejaArmaCount = this.personas.length - manejaArmaCount;

    const ctx = document.getElementById('armaChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Maneja Arma', 'No Maneja Arma'],
        datasets: [{
          label: 'Personas',
          data: [manejaArmaCount, noManejaArmaCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem: any) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          }
        }
      }
    });
  }

  createFechaIngresoChart(): void {
    const fechasIngreso = this.personas.map(persona => persona.fechaIngreso);
    const fechasCount = this.countOccurrences(fechasIngreso);

    const labels = Object.keys(fechasCount);
    const values = Object.values(fechasCount);

    const ctx = document.getElementById('fechaIngresoChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de Personas por Fecha de Ingreso',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createEdadChart(): void {
    const personasMayoresCount = this.personas.filter(persona => {
      const fechaNacimiento = new Date(persona.fechaNacimiento);
      return fechaNacimiento.getFullYear() > 1999;
    }).length;

    const personasMenoresCount = this.personas.length - personasMayoresCount;

    const ctx = document.getElementById('edadChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Mayores de 1999', 'Menores o Igual a 1999'],
        datasets: [{
          label: 'Edad de Personas',
          data: [personasMayoresCount, personasMenoresCount],
          backgroundColor: [
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem: any) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          }
        }
      }
    });
  }
// Métodos para gráficos de Horarios

createFechaHorarioChart(): void {
  const fechas = this.horarios.map(horario => horario.fecha);
  const fechasCount = this.countOccurrences(fechas);

  const labels = Object.keys(fechasCount);
  const values = Object.values(fechasCount);

  const ctx = document.getElementById('fechaHorarioChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Cantidad de User IDs por Fecha',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

createMismoHorarioChart(): void {
  const horarios = this.horarios.map(horario => `${horario.horaInicio}-${horario.horaFin}`);
  const horariosCount = this.countOccurrences(horarios);

  const labels = Object.keys(horariosCount);
  const values = Object.values(horariosCount);

  const ctx = document.getElementById('mismoHorarioChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Cantidad de User IDs por Horario',
        data: values,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

createFinDeSemanaChart(): void {
  const sabadoCount = this.horarios.filter(horario => horario.diaSemana === DiaSemana.Sabado).length;
  const domingoCount = this.horarios.filter(horario => horario.diaSemana === DiaSemana.Domingo).length;

  const ctx = document.getElementById('finDeSemanaChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Sábado', 'Domingo'],
      datasets: [{
        label: 'User IDs que trabajan en fin de semana',
        data: [sabadoCount, domingoCount],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem: any) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            }
          }
        }
      }
    }
  });
}

}