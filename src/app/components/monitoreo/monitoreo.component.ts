import { HttpClient } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UbicacionActual } from './Model/monitoreo';
import { UbicacionActualService } from './Service/monitoreo.service';

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

  constructor(private ubicacionService: UbicacionActualService) {}

  ngOnInit(): void {
    this.loadUbicaciones();
  }
  ngAfterViewInit(): void {
    this.initMap();
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
        this.setMarkers();
      },
      (error) => {
        console.error('Error al cargar ubicaciones', error);
      }
    );
  }

  setMarkers(): void {
    if (typeof google !== 'undefined' && this.map) {
      this.ubicaciones.forEach((ubicacion) => {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(parseFloat(ubicacion.latitud), parseFloat(ubicacion.longitud)),
          map: this.map,
          title: ubicacion.ciudad,
        });

        const infowindow = new google.maps.InfoWindow({
          content: `<div><h5>${ubicacion.ciudad}</h5><p>Última actualización: ${ubicacion.ultimaActualizacion}</p></div>`
        });

        marker.addListener('click', () => {
          infowindow.open(this.map, marker);
        });
      });
    }
  }
}