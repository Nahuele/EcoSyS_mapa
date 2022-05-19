import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {environment} from '../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-coord',
  templateUrl: './map-coord.component.html',
  styleUrls: ['./map-coord.component.css']
})
export class MapCoordComponent implements OnInit {

  mapa: mapboxgl.Map;
  private puntoElegidoPriv;
  // con esto se lo paso al parent Form
  @Output() puntoElegidoEmit = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    // this.puntoElegido.emit('algo');
    mapboxgl.accessToken = environment.mapboxKey;
    let marker;
    this.puntoElegidoEmit.emit(null);
    this.mapa = new mapboxgl.Map({
      container: 'mapacoord', // container id
      style:     `mapbox://styles/mapbox/streets-v11`, // mapbox://styles/mapbox/streets-v11
      center: [-60, -35.584892], // starting position
      zoom:   6 // starting zoom
    });

    this.mapa.on('mousemove', function (e) {
      document.getElementById('infocoordenadas').innerHTML = JSON.stringify(e.lngLat.wrap());
    });

    this.mapa.on('click', (e) => {
      const coordenadas = e.lngLat
      this.puntoElegidoPriv = coordenadas;
      if (marker) {
        // remuevo marker anterior antes de mostrar el nuevo
        marker.remove()
        marker = null
        marker = new mapboxgl.Marker({draggable: true}).setLngLat([coordenadas.lng, coordenadas.lat]).addTo(this.mapa)
      } else {
        marker = new mapboxgl.Marker({draggable: true}).setLngLat([coordenadas.lng, coordenadas.lat]).addTo(this.mapa)
      }
    });
    this.mapa.addControl(new mapboxgl.NavigationControl());
  }

  enviarCoordenada() {
    console.log(this.puntoElegidoPriv)
    this.puntoElegidoEmit.emit(this.puntoElegidoPriv)
  }

}
