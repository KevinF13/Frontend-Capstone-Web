import { Component } from '@angular/core';
import { Bitacora } from './Model/bitacora';
import { BitacoraService } from './Service/bitacora.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent {
  bitacoras: Bitacora[] = [];
  nombresAgentes: string[] = [];
  filtroNombreAgente: string = '';
  filtroFechaHorario: string = ''; // Variable para el filtro por fechaHorario

  constructor(private bitacoraService: BitacoraService) { }

  ngOnInit(): void {
    this.getAllPersonas();
  }

  getAllPersonas(): void {
    this.bitacoraService.getAllBitacoras({}).subscribe(bitacoras => {
      this.bitacoras = bitacoras;
      // Obtener nombres únicos de agentes
      this.nombresAgentes = Array.from(new Set(bitacoras.map(bitacora => bitacora.nombreAgente)));
    });
  }

 // Función para filtrar las bitácoras según el nombre del agente y la fechaHorario
 filtrarBitacorasPorNombreAgente(): Bitacora[] {
  let bitacorasFiltradas = this.bitacoras;

  if (this.filtroNombreAgente.trim()) {
    bitacorasFiltradas = bitacorasFiltradas.filter(bitacora =>
      bitacora.nombreAgente.toLowerCase() === this.filtroNombreAgente.toLowerCase()
    );
  }

  if (this.filtroFechaHorario.trim()) {
    bitacorasFiltradas = bitacorasFiltradas.filter(bitacora =>
      bitacora.fechaHorario.includes(this.filtroFechaHorario)
    );
  }
  return bitacorasFiltradas;
}

// Función para limpiar los filtros
limpiarFiltros(): void {
  this.filtroNombreAgente = '';
  this.filtroFechaHorario = '';
}


  generarPDF(bitacoraSeleccionada: Bitacora): void {
    // Crear el documento jsPDF
    const doc = new jsPDF();

    // Definir el título
    const titulo = 'BITACORA';

    // Definir los estilos
    const margenRojo: [number, number, number, number] = [10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20];

    // Agregar el margen rojo
    doc.setDrawColor(255, 0, 0);
    doc.rect(...margenRojo);

    // Agregar el título en la mitad de la página
    const tituloX = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(titulo) * doc.getFontSize() / 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(titulo, tituloX, 20);

    // Crear el contenido
    const contenido = `
      Agente: ${bitacoraSeleccionada.nombreAgente}\n
      Fecha: ${bitacoraSeleccionada.fechaHorario}\n
      Turno: ${bitacoraSeleccionada.turnoHorario}\n
      Cliente: ${bitacoraSeleccionada.cliente}\n
      Prendas: ${bitacoraSeleccionada.prendas}\n
      Hora de la Novedad: ${bitacoraSeleccionada.horaNovedades}\n
      Detalle de la Novedad: ${bitacoraSeleccionada.novedades}
    `;

    // Agregar el contenido con negrita
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.text(contenido, 20, 40);

    // Guardar el PDF
    doc.save('bitacora.pdf');
  }
}
