import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto'; // Importa Chart.js directamente
import { BitacoraService } from '../../bitacora/Service/bitacora.service';
import { Persona } from '../../informacion-empleados/Model/persona';
import { PersonaService } from '../../informacion-empleados/Service/persona.service';
import { Horario } from '../../horario/Model/horario';
import { HorarioService } from '../../horario/Service/horario.service';
import { ClienteService } from '../../cliente/Service/cliente.service';
import { Cliente } from '../../cliente/Model/cliente';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public bitacoraChart: any;
  public personas: Persona[] = [];
  public horarios: Horario[] = [];
  public clientesData: { nombreCliente: string, count: number }[] = []; // Data for the clients chart
  

  constructor(
    private bitacoraService: BitacoraService, 
    private personaService: PersonaService,
    private horarioService: HorarioService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.loadBitacoraData();
    this.loadDataEmpleados();
    this.loadClientesData();
  }

  loadClientesData(): void {
    this.personaService.getAllPersonas().subscribe(
      (personas: Persona[]) => {
        const clienteCounts: { [key: string]: number } = this.countOccurrences(personas.map(persona => persona.clienteId));
        
        this.clientesData = Object.keys(clienteCounts).map(clienteId => ({
          nombreCliente: clienteId, // Temporalmente usamos clienteId
          count: clienteCounts[clienteId]
        }));

        // Ahora obtenemos los nombres de los clientes
        this.clienteService.getAll().subscribe(
          (clientes: Cliente[]) => {
            this.clientesData.forEach(data => {
              const cliente = clientes.find(cliente => cliente._id === data.nombreCliente);
              if (cliente) {
                data.nombreCliente = cliente.nombreCliente;
              }
            });

            // Crear el gráfico una vez que tenemos los nombres de los clientes
            this.createClientesChart();
          },
          error => {
            console.error('Error cargando datos de clientes', error);
          }
        );
      },
      error => {
        console.error('Error cargando datos de personas', error);
      }
    );
  }

  createClientesChart(): void {
    const labels = this.clientesData.map(cliente => cliente.nombreCliente);
    const data = this.clientesData.map(cliente => cliente.count);

    const ctx = document.getElementById('clientesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de User IDs por Cliente',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1 // Mostrar solo enteros en el eje Y
            }
          }
        }
      }
    });
  }
  
  loadBitacoraData(): void {
    this.bitacoraService.getAllBitacoras().subscribe(data => {
      const clientes = data.map(bitacora => bitacora.cliente);
      const clienteCounts = this.countOccurrences(clientes);
      this.createChart(clienteCounts);
    });
  }
  
  loadDataEmpleados(): void {
    // Ejemplo de carga de datos de personas desde el servicio
    this.personaService.getAllPersonas().subscribe(
      data => {
        this.personas = data;
        this.createArmaChart();
        this.createFechaIngresoChart(); // Llamar al nuevo método para el gráfico de ingreso por fecha
      },
      error => {
        console.error('Error al cargar los datos de personas', error);
      }
    );
    this.horarioService.getAllHorarios().subscribe(
      data => {
        this.horarios = data;
        this.createFechaHorarioChart();
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
          label: 'Agentes que Manejan Armas',
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
    const fechasIngreso = this.personas.map(persona => new Date(persona.createdAt).toLocaleDateString());
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
}