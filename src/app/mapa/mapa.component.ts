import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {ProyectoService} from '../editar-db/proyecto.service';
import {Observable} from 'rxjs';


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

  constructor(private proyectoService: ProyectoService,
              private view: ViewContainerRef) { }

  ngOnInit() {
    mapboxgl.accessToken = environment.mapboxKey;
    this.iniciarMapa();
    this.listenPopUps('featuresConservacionFauna');
    this.listenPopUps('featuresConservacion');
    this.listenPopUps('Huertas');

  }

  buscarCoordenadas() {
    this.proyectoService.getProjects().subscribe(proyectos => {
      let featuresConservacion = []
      let featuresConservacionFauna = []
      let featuresHuertas = []
      this.projObj = proyectos;
      for (let proj of Object.keys(this.projObj)) {
        const itemProj =  this.projObj[proj]
        const coordenadas = itemProj[itemProj.projectID].coordenadas.split(',').map(Number)
        const detallesPro = itemProj[itemProj.projectID]
        let objForLayer = {'type': 'Feature',
          'properties': {
            'title': detallesPro.nombre,
            // 'marker-color': '#3c4e5a',
            // 'marker-symbol': 'monument',
            // 'marker-size': 'large',
            // 'icon': 'theatre',
            'description' : this.setearHtmlPopUp(detallesPro)
          }, 'geometry': { 'coordinates' : coordenadas, 'type': 'Point'}
        }
        detallesPro.tipo_enfoque === 'Conservación' ?  featuresConservacion.push(objForLayer) : detallesPro.tipo_enfoque === 'Conservación de fauna' ?
          featuresConservacionFauna.push(objForLayer) : detallesPro.tipo_enfoque === 'Huerta' ? featuresHuertas.push(objForLayer) : console.log('emtpy enfoque!!');
      }
      // return listaFeatures;

      this.mapa.on('load', () => {
      // add layers from f(x)
        this.mapa.addSource('featuresConservacion', this.getSourceAndLayer('featuresConservacion', featuresConservacion,).source)
        this.mapa.addSource('featuresConservacionFauna', this.getSourceAndLayer('featuresConservacionFauna', featuresConservacionFauna,).source)
        this.mapa.addSource('Huertas', this.getSourceAndLayer('Huertas', featuresHuertas,).source)
        this.mapa.addLayer(this.getSourceAndLayer('featuresConservacion', featuresConservacion,'#006CFF').layerConfig)
        this.mapa.addLayer(this.getSourceAndLayer('featuresConservacionFauna', featuresConservacionFauna,'#FF0000').layerConfig)
        this.mapa.addLayer(this.getSourceAndLayer('Huertas', featuresHuertas,'#00B811').layerConfig)
      });

    });
    // this.proyectoService.getEspecies().subscribe(especies => {
    //   this.sppObj = especies;
    // });

  }

  // addMarker(coordenadas: Array<number>, detalle) {
  //   // console.log(detalle);
  //   // create the popup from the function
  //   var popup = new mapboxgl.Popup({ offset: 2, closeButton: false, className: "mapboxgl-popup", maxWidth: '400px'})
  //     .setHTML(this.setearHtmlPopUp(detalle));
  //   // agrega un marcador
  //   new mapboxgl.Marker()
  //     .setLngLat(coordenadas) // [12.550343, 55.665957]
  //     .setPopup(popup)
  //     .addTo(this.mapa);
  // }

  // creo una funcion q me hace el popup HTML

  setearHtmlPopUp(detalle) {
    let link = ''
    if (detalle.linksfotos) {
      link = detalle.linksfotos[0].link
    }
    const templateHtml = `<div class="card">
        <div *ngIf="${link}" class="card-header text-center">
          <img src="${link}" class="img-fluid" alt="Responsive image" style="border: 1px solid #ddd;
          border-radius: 4px;padding: 5px;width: 300px;">
</div>
  <div class="card-body">
    <h5 class="card-title">${detalle['nombre']}</h5>
    <p class="card-text"><div><strong>Titulo:</strong></div> ${detalle['titulo_extendido']}</p>
    <a href="detalles/${detalle['projectid']}" class="btn btn-primary btn-sm">Más Detalles</a>
  </div>
</div>`;
    return templateHtml;
  }

  switchLayer(layerId) {
    this.mapa.remove();
    this.iniciarMapa(layerId);
    this.listenPopUps('featuresConservacionFauna');
    this.listenPopUps('featuresConservacion');
    this.listenPopUps('Huertas');
  }

  getSourceAndLayer(nameLayer, featuresList, colorDot?) {
    const source = {'type': 'geojson', 'data': {'type': 'FeatureCollection', 'features': featuresList}}
    const layerConfig = {'id': `${nameLayer}`, 'type': 'circle', 'source': `${nameLayer}`,
      'layout': {'visibility': 'visible'},
      paint: {'circle-radius': 20,
        'circle-color': colorDot, //'#223b53'
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': 0.7
      }
    }
    return {source, layerConfig}
  }

  mostrarCapa(event) {
    let visibility = event.checked;
    let clickedLayerId = event.name
  // toggle layer visibility by changing the layout object's visibility property
    if (visibility === true) {
      this.mapa.setLayoutProperty(clickedLayerId,'visibility', 'none');
    } else {
      this.mapa.setLayoutProperty(clickedLayerId, 'visibility', 'visible');
    }
  }

  private iniciarMapa(layer?:string) {
    if (layer) {
      this.mapa = new mapboxgl.Map({
        container: 'mapa-mapbox', // container id
        style:     `mapbox://styles/mapbox/${layer}`, // mapbox://styles/mapbox/streets-v11
        // mapbox://styles/iannbarbe/ckduoxxyy0u7d19teotam0daj
        center:    [-68.5631238, -43.7027949], // starting position
        zoom:      3 // starting zoom
      });
      this.mapa.addControl(new mapboxgl.NavigationControl());
      this.buscarCoordenadas();
    } else {
      this.mapa = new mapboxgl.Map({
        container: 'mapa-mapbox', // container id
        style:     `mapbox://styles/mapbox/satellite-v9`, // mapbox://styles/mapbox/streets-v11
        // mapbox://styles/iannbarbe/ckduoxxyy0u7d19teotam0daj
        center:    [-68.5631238, -43.7027949], // starting position
        zoom:      3 // starting zoom
      });
      // agrego el boton  de zoom y norte
      this.mapa.addControl(new mapboxgl.NavigationControl());
      this.buscarCoordenadas();
    }

  }

  listenPopUps(layerId) {
    this.mapa.on('click', layerId, (e) => {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

// Ensure that if the this.mapa is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup({ offset: 25, closeButton: false, className: "mapboxgl-popup", maxWidth: '400px'})
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(this.mapa);
    });
// Change the cursor to a pointer when the mouse is over the places layer.
    this.mapa.on('mouseenter', layerId, () => {
      this.mapa.getCanvas().style.cursor = 'pointer';
    });
// Change it back to a pointer when it leaves.
    this.mapa.on('mouseleave', layerId, () => {
      this.mapa.getCanvas().style.cursor = '';
    });
  }


}
