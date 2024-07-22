import { HttpClient } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UbicacionActual } from './Model/monitoreo';
import { UbicacionActualService } from './Service/monitoreo.service';
import { Persona } from '../informacion-empleados/Model/persona';
import { PersonaService } from '../informacion-empleados/Service/persona.service';

declare var google: any;

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit, AfterViewInit  {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;
  ubicaciones: UbicacionActual[] = [];
  ubicacionesFiltradas: UbicacionActual[] = [];
  personas: Persona[] = [];
  paginatedPersonas: Persona[] = [];
  selectedPersonas: Persona[] = [];
  markers: google.maps.Marker[] = [];
  currentPage: number = 0;
  pageSize: number = 4;
  totalPages: number = 0;

  constructor(private ubicacionService: UbicacionActualService, private personaService: PersonaService) {}

  ngOnInit(): void {
    this.loadUbicaciones();
    this.getPersonas();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  getPersonas(): void {
    this.personaService.getAllPersonas().subscribe(
      (personas) => {
        this.personas = personas;
        this.totalPages = Math.ceil(this.personas.length / this.pageSize);
        this.updatePaginatedPersonas();
      },
      (error) => {
        console.error('Error al obtener personas', error);
      }
    );
  }

  updatePaginatedPersonas(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPersonas = this.personas.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginatedPersonas();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedPersonas();
    }
  }

  initMap(): void {
    const mapElement = this.mapContainer.nativeElement;
    this.map = new google.maps.Map(mapElement, {
      center: { lat: -0.188836, lng: -78.485394 },
      zoom: 8
    });
  }

  loadUbicaciones(): void {
    this.ubicacionService.getAllUbicaciones().subscribe(
      (data) => {
        this.ubicaciones = data;
        this.filterUbicaciones(); // Filtrar ubicaciones después de cargarlas
      },
      (error) => {
        console.error('Error al cargar ubicaciones', error);
      }
    );
  }

  onPersonaCheckChange(persona: Persona, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedPersonas.push(persona);
    } else {
      this.selectedPersonas = this.selectedPersonas.filter(p => p.userId !== persona.userId);
    }
    this.filterUbicaciones();
  }

  filterUbicaciones(): void {
    const selectedUserIds = this.selectedPersonas.map(p => p.userId);
    if (selectedUserIds.length > 0) {
      this.ubicacionesFiltradas = this.ubicaciones.filter(ubicacion => selectedUserIds.includes(ubicacion.userId));
    } else {
      this.ubicacionesFiltradas = this.ubicaciones;
    }
    this.setMarkers();
  }

  setMarkers(): void {
    if (typeof google !== 'undefined' && this.map) {
      // Eliminar marcadores anteriores
      this.clearMarkers();

      // Agregar nuevos marcadores
      this.ubicacionesFiltradas.forEach((ubicacion) => {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(parseFloat(ubicacion.latitud), parseFloat(ubicacion.longitud)),
          map: this.map,
          title: ubicacion.ciudad,
        });

        this.markers.push(marker);

        const infowindow = new google.maps.InfoWindow({
          content: `<div><h5>${ubicacion.ciudad}</h5><p>Última actualización: ${ubicacion.ultimaActualizacion}</p></div>`
        });

        marker.addListener('click', () => {
          infowindow.open(this.map, marker);
        });
      });
    }
  }

  clearMarkers(): void {
    this.markers.forEach(marker => {
      (marker as any).setMap(null);
    });
    this.markers = [];
  }
  isActive(persona: Persona): boolean {
    // Lógica para determinar si la persona está activa
    return true; // Cambiar según la lógica real
  }

  getEtiqueta(persona: Persona): string {
    // Lógica para obtener la etiqueta de la persona
    return 'Etiqueta'; // Cambiar según la lógica real
  }
}