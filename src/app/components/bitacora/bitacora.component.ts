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

  imageUrl: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDtCS--5BguZl3QOlVnKHam2CDxxV8yVav-g&s';

  constructor(private bitacoraService: BitacoraService) { }

  ngOnInit(): void {
    this.getAllBitacoras();
    this.getAllBitacoraNovedad();
  }

  getAllBitacoras(): void {
    this.bitacoraService.getAllBitacoras({}).subscribe(
      bitacoras => {
        this.bitacoras = bitacoras;
        this.nombresAgentes = Array.from(new Set(bitacoras.map(b => b.nombreAgente))); // Set para nombres únicos
        console.log('Agentes cargados:', this.nombresAgentes);
      },
      error => {
        console.error('Error obteniendo bitácoras:', error);
      }
    );
  }

  getAllBitacoraNovedad(): void {
    this.bitacoraService.getAllBitacoraNovedad({}).subscribe(
      bitacoraNovedad => {
        this.bitacoraNovedad = bitacoraNovedad;
      },
      error => {
        console.error('Error obteniendo bitácoras novedad:', error);
      }
    );
  }

  filtrarBitacorasPorNombreAgente(): Bitacora[] {
    console.log('Filtrando por agente:', this.filtroNombreAgente);
    console.log('Filtrando por fecha:', this.filtroFechaHorario);

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

    console.log('Bitácoras filtradas:', bitacorasFiltradas);
    return bitacorasFiltradas;
  }

  limpiarFiltros(): void {
    this.filtroNombreAgente = '';
    this.filtroFechaHorario = '';
  }

  generarPDF(bitacoraSeleccionada: Bitacora): void {
    const doc = new jsPDF('p', 'pt', 'letter');
    const margin = 40;
    let y = margin;

    const imgWidth = 100;
    const imgHeight = 50;
    const imgX = margin;
    const imgY = margin;
    doc.addImage(this.imageUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    const titleText = 'BITÁCORA';
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = imgX + imgWidth + 130;
    const titleY = imgY + imgHeight / 2 + 10;
    doc.text(titleText, titleX, titleY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    y += imgY + imgHeight + 20;
    doc.text(`Agente: ${bitacoraSeleccionada.nombreAgente}`, margin, y);
    y += 20;
    doc.text(`Fecha: ${bitacoraSeleccionada.fechaHorario}`, margin, y);
    y += 20;
    doc.text(`Turno: ${bitacoraSeleccionada.turnoHorario}`, margin, y);
    y += 20;
    doc.text(`Cliente: ${bitacoraSeleccionada.cliente}`, margin, y);
    y += 20;
    doc.text(`Prendas de la Empresa: ${bitacoraSeleccionada.prendasEmpresa}`, margin, y);
    y += 20;
    doc.text(`Prendas del Cliente: ${bitacoraSeleccionada.prendasCliente}`, margin, y);
    y += 40;

    const novedades = this.bitacoraNovedad.filter(novedad => novedad.idBitacora === bitacoraSeleccionada._id);
    if (novedades.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Novedades:', margin, y);
      y += 20;

      doc.setFont('helvetica', 'normal');
      novedades.forEach((novedad, index) => {
        const novedadTexto = `${index + 1}. Hora Novedad: ${novedad.horaNovedad}\nNovedad: ${novedad.novedad}`;
        const lines = doc.splitTextToSize(novedadTexto, doc.internal.pageSize.width - 2 * margin);
        lines.forEach((line: string) => {
          doc.text(line, margin, y);
          y += 20;
        });
      });
    }

    doc.save('bitacora.pdf');
  }
}