import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {ProyectoService} from '../editar-db/proyecto.service';


@Component({
  selector:    'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls:   ['./mapa.component.css']
})

export class MapaComponent implements OnInit {
  public projObj;
  public sppObj;
  public idProject;
  mapa: mapboxgl.Map;

  constructor(private proyectoService: ProyectoService) { }

  ngOnInit() {

    mapboxgl.accessToken = environment.mapboxKey;
    this.mapa = new mapboxgl.Map({
      container: 'mapa-mapbox', // container id
      style:     'mapbox://styles/iannbarbe/ckduoxxyy0u7d19teotam0daj',
      center:    [-68.5631238, -43.7027949], // starting position
      zoom:      3 // starting zoom
    });
    // agrego el boton  de zoom y norte
    this.mapa.addControl(new mapboxgl.NavigationControl());

    this.buscarCoordenadas();
  }

  buscarCoordenadas() {
    this.proyectoService.getProjects().subscribe(proyectos => {
      this.projObj = proyectos;
      // this.idProject = this.projObj[0].projectID;

      for (let proj of Object.keys(this.projObj)) {
        const itemProj =  this.projObj[proj]
        const coordenadas = itemProj[itemProj.projectID].coordenadas.split(',').map(Number)
        console.log(itemProj[itemProj.projectID]);
        this.addMarker(coordenadas,itemProj[itemProj.projectID])
      }
    });
    this.proyectoService.getEspecies().subscribe(especies => {
      this.sppObj = especies;
    });
  }

  addMarker(coordenadas: Array<number>, detalle) {
    // console.log(detalle);
    // create the popup from the function
    var popup = new mapboxgl.Popup({ offset: 2, closeButton: false, className: "mapboxgl-popup", maxWidth: '400px'})
      .setHTML(this.setearHtmlPopUp(detalle));
    // agrega un marcador
    new mapboxgl.Marker()
      .setLngLat(coordenadas) // [12.550343, 55.665957]
      .setPopup(popup)
      .addTo(this.mapa);
  }
  // creo una funcion q me hace el popup HTML
  setearHtmlPopUp(detalle) {
    const templateHtml = `<div class="card">
    <div *ngIf=detalle['linksfotos']>
    <div *ngFor="let foto of detalle['linksfotos']">
          <img [src]="foto['link']" class="img-fluid" alt="Responsive image" style="border: 1px solid #ddd;
          border-radius: 4px;padding: 5px;width: 200px;">
        </div>
</div>

  <div class="card-body">
    <h3 class="card-title">${detalle['nombre']}</h3>
    <p class="card-text"><div><strong>Titulo extendido:</strong></div> ${detalle['titulo_extendido']}</p>
    <a href="detalles/${detalle['projectid']}" class="btn btn-primary btn-sm">Más Detalles</a>
  </div>
</div>`;
    return templateHtml;
  }
}
