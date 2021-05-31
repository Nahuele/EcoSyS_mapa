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
  // con esto se lo paso al parent Form
  @Output() puntoElegido = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    // this.puntoElegido.emit('algo');
    mapboxgl.accessToken = environment.mapboxKey;
    let marker;
    this.puntoElegido.emit(null);
    this.mapa = new mapboxgl.Map({
      container: 'mapacoord', // container id
      style:     `mapbox://styles/mapbox/satellite-v9`, // mapbox://styles/mapbox/streets-v11
      center: [-66.477375, -35.584892], // starting position
      zoom:   4 // starting zoom
    });

    this.mapa.on('mousemove', function (e) {
      document.getElementById('infocoordenadas').innerHTML = JSON.stringify(e.lngLat.wrap());
    });

    this.mapa.on('click', (e) => {
      const coordenadas = e.lngLat
      this.puntoElegido.emit(coordenadas)
      console.log(coordenadas)
      // this.puntoElegido.emit([coordenadas.lng, coordenadas.lat])
      if (marker) {
        // remuevo marker anterior antes de mostrar el nuevo
        marker.remove()
        marker = null
        marker = new mapboxgl.Marker({draggable: true}).setLngLat([coordenadas.lng, coordenadas.lat]).addTo(this.mapa)
      } else {
        marker = new mapboxgl.Marker({draggable: true}).setLngLat([coordenadas.lng, coordenadas.lat]).addTo(this.mapa)
      }
    });
  }

}
