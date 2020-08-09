import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import dbFaunas from '../../assets/dbFauna.json';
import detallesProyectos from '../../assets/detalles.json';
import {GetProjectsService} from '../home/get-projects.service';

// apiGoogle AIzaSyCCXLGfiyzjnY4yfwpf2g26tdNIrQucNKA


@Component({
  selector:    'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls:   ['./mapa.component.css']
})

export class MapaComponent implements OnInit {
  // google maps
  // title = 'project';
  // position = {
  //   lat: -34.681,
  //   lng: -58.371
  // }
  //
  // label = {
  //   color: 'red',
  //   text:  'algo'
  // }

  public dbFauna = dbFaunas;

  mapa: mapboxgl.Map;

  constructor(private getProjects: GetProjectsService) { }


  ngOnInit() {

    mapboxgl.accessToken = environment.mapboxKey;
    this.mapa = new mapboxgl.Map({
      container: 'mapa-mapbox', // container id
      style:     'mapbox://styles/nahuele/ckdmxn4np0izr1imq3jpl8d96',
      center:    [-68.5631238, -43.7027949], // starting position
      zoom:      3 // starting zoom
    });
    // agrego el boton  de zoom y norte
    this.mapa.addControl(new mapboxgl.NavigationControl());

    // console.log(this.dbFauna);
    this.buscarCoordenadas();
  }

  buscarCoordenadas() {
    this.getProjects.getDetalles().subscribe(datos => {
      for (const proyectoID in datos) {
        const coordenadas = datos[proyectoID]['COORDENADAS'].split(',').map(Number);
        this.addMarker(coordenadas, datos[proyectoID]);
      }
    });
  }

  addMarker(coordenadas: Array<number>, detalle) {
    console.log(detalle);
    // create the popup
    var popup = new mapboxgl.Popup({offset: 25, closeButton: false, maxWidth: 'none'})
      .setHTML(this.setearHtmlPopUp(detalle));

    new mapboxgl.Marker()
      .setLngLat(coordenadas) // [12.550343, 55.665957]
      .setPopup(popup)
      .addTo(this.mapa);
  }

  setearHtmlPopUp(detalle) {
    let templateHtml = `<div>
    <div class="card" style="width: 20rem;">
  <img class="card-img-top" src="https://elpais.com/elpais/imagenes/2017/06/19/ciencia/1497880506_898170_1497888043_noticia_fotograma.jpg" alt="Card image cap">
  <div class="card-body">
    <h3 class="card-title">${detalle['NOMBRE DEL PROYECTO']}</h3>
    <p class="card-text"><div><strong>Titulo extendido:</strong></div> ${detalle['TITULO EXTENDIDO']}</p>
    <a href="detalles/${detalle['proyect_ID']}" class="btn btn-primary btn-sm">Más Detalles</a>
  </div>
</div>







</div>`;
    return templateHtml;
  }

}
