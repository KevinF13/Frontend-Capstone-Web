import { Component, OnInit } from '@angular/core';
import { Bitacora } from './Model/bitacora';
import { BitacoraService } from './Service/bitacora.service';
import { jsPDF } from 'jspdf';
import { BitacoraNovedad } from './Model/bitacoraNovedad';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit {
  bitacoras: Bitacora[] = [];
  bitacoraNovedad: BitacoraNovedad[] = [];
  nombresAgentes: string[] = [];
  filtroNombreAgente: string = '';
  filtroFechaHorario: string = '';

  constructor(private bitacoraService: BitacoraService) { }

  ngOnInit(): void {
    this.getAllPersonas();
  }

  getAllPersonas(): void {
    this.bitacoraService.getAllBitacoras({}).subscribe(bitacoras => {
      console.log('Bitacoras obtenidas:', bitacoras);
      this.bitacoras = bitacoras;
      this.nombresAgentes = Array.from(new Set(bitacoras.map(bitacora => bitacora.nombreAgente)));
      console.log('Nombres de agentes únicos:', this.nombresAgentes);
    }, error => {
      console.error('Error obteniendo bitácoras:', error);
    });

    this.bitacoraService.getAllBitacoraNovedad({}).subscribe(bitacoraNovedad => {
      console.log('Bitacoras novedad obtenidas:', bitacoraNovedad);
      this.bitacoraNovedad = bitacoraNovedad;
    }, error => {
      console.error('Error obteniendo bitácoras novedad:', error);
    });
  }

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

    console.log('Bitacoras filtradas:', bitacorasFiltradas);
    return bitacorasFiltradas;
  }

  limpiarFiltros(): void {
    this.filtroNombreAgente = '';
    this.filtroFechaHorario = '';
  }

  generarPDF(bitacoraSeleccionada: Bitacora): void {
    const doc = new jsPDF();

    const titulo = 'BITACORA';
    const margenRojo: [number, number, number, number] = [10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20];

    doc.setDrawColor(255, 0, 0);
    doc.rect(...margenRojo);

    const tituloX = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(titulo) * doc.getFontSize() / 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(titulo, tituloX, 20);

    let contenido = `
      Agente: ${bitacoraSeleccionada.nombreAgente}\n
      Fecha: ${bitacoraSeleccionada.fechaHorario}\n
      Turno: ${bitacoraSeleccionada.turnoHorario}\n
      Cliente: ${bitacoraSeleccionada.cliente}\n
      Prendas De la Empresa: ${bitacoraSeleccionada.prendasEmpresa}\n
      Prendas Del Cliente: ${bitacoraSeleccionada.prendasCliente}\n
    `;

    const novedades = this.bitacoraNovedad.filter(novedad => novedad.idBitacora === bitacoraSeleccionada._id);
    if (novedades.length > 0) {
      contenido += '\nNovedades:\n';
      novedades.forEach((novedad, index) => {
        contenido += `
          ${index + 1}. Hora Novedad: ${novedad.horaNovedad}
          Novedad: ${novedad.novedad}
        `;
      });
    }

    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.text(contenido, 20, 40);

    doc.save('bitacora.pdf');
  }
}
