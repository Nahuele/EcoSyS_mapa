import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {ProyectoService} from '../editar-db/proyecto.service';
import {StorageService} from '../upload-image/storage.service';


@Component({
  selector:    'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls:   ['./mapa.component.css'],
})

export class MapaComponent implements OnInit {
  mapa: mapboxgl.Map;
  ftConsFau: boolean = true;
  ftConsFlor: boolean = true;
  ftAgroEco: boolean = true;
  ftAmbSoc: boolean = true;
  idproject: string;
  private projectsList = [];

  constructor(private proyectoService: ProyectoService,
              private view: ViewContainerRef,
              private storageSvc: StorageService) { }

  ngOnInit() {
    mapboxgl.accessToken = environment.mapboxKey;
    this.iniciarMapa();
    this.listenPopUps('featuresConservacionFauna');
    this.listenPopUps('featuresConservacionFlora');
    this.listenPopUps('ambienteYsoc');
    this.listenPopUps('agroeco');

  }

  buscarCoordenadas() {
    this.proyectoService.getProjects().subscribe(proyectos => {
      let projects = proyectos;
      const featuresConservacionFlora = [];
      const featuresConservacionFauna = [];
      const featuresAgroEco = [];
      const featuresAmbSoc = [];

      for (let proj of Object.keys(projects)) {
        const itemProj = projects[proj].detalles;
        this.idproject = projects[proj].id;

        this.projectsList.push(projects[proj]);

        itemProj.coordenadas.forEach((element) => {

          const coordenadas = [+element.longitud, +element.latitud];
          const detallesPro = itemProj;
          let objForLayer = {
            'type':        'Feature',
            'properties':  {
              'title':       detallesPro.nombre,
              // 'marker-color': '#3c4e5a',
              // 'marker-symbol': 'monument',
              // 'marker-size': 'large',
              // 'icon': 'theatre',
              'description': this.setearHtmlPopUp(projects[proj]),
            }, 'geometry': {'coordinates': coordenadas, 'type': 'Point'}
          };
          detallesPro.tipo_enfoque === 'Agroecología y soberanía alimentaria' ? featuresAgroEco.push(objForLayer) : detallesPro.tipo_enfoque === 'Conservación de fauna' ?
            featuresConservacionFauna.push(objForLayer) : detallesPro.tipo_enfoque === 'Ambiente y sociedad' ? featuresAmbSoc.push(objForLayer) :
              detallesPro.tipo_enfoque === 'Conservación de flora' ? featuresConservacionFlora.push(objForLayer)
                : console.log('emtpy enfoque!!');
        });
      }

      this.mapa.on('load', () => {
        // add layers from f(x)
        this.mapa.addSource('featuresConservacionFlora', this.getSourceAndLayer('featuresConservacionFlora', featuresConservacionFlora,).source);
        this.mapa.addSource('featuresConservacionFauna', this.getSourceAndLayer('featuresConservacionFauna', featuresConservacionFauna,).source);
        this.mapa.addSource('ambienteYsoc', this.getSourceAndLayer('ambienteYsoc', featuresAmbSoc,).source);
        this.mapa.addSource('agroeco', this.getSourceAndLayer('agroeco', featuresAgroEco,).source);
        this.mapa.addLayer(this.getSourceAndLayer('featuresConservacionFlora', featuresConservacionFlora, '#006CFF').layerConfig);
        this.mapa.addLayer(this.getSourceAndLayer('featuresConservacionFauna', featuresConservacionFauna, '#FF0000').layerConfig);
        this.mapa.addLayer(this.getSourceAndLayer('ambienteYsoc', featuresAmbSoc, '#00B811').layerConfig);
        this.mapa.addLayer(this.getSourceAndLayer('agroeco', featuresAgroEco, '#F3B32A').layerConfig);
        this.showOrHideLayers();
      });

    });
  }

  // creo una funcion q me hace el popup HTML
  setearHtmlPopUp(proyecto) {

    let link = 'https://icon-library.com/images/no-image-available-icon/no-image-available-icon-7.jpg';

    return `<div class="card">
        <div class="card-header text-center">
          <img src="${link}" class="img-fluid" alt="Responsive image" style="border: 1px solid #ddd;
          border-radius: 4px;padding: 5px;width: 250px;">
</div>
  <div class="card-body">
    <h5 class="card-title">${proyecto.detalles.nombre}</h5>
    <p class="card-text"><div><strong>Titulo:</strong></div> ${proyecto.detalles.titulo_extendido}</p>
    <a href="detalles/${proyecto.id}" class="btn btn-primary btn-sm">Más Detalles
    <i class="fa fa-search"></i></a>
  </div>
  <div id="user/${proyecto.userUid}"></div>
</div>`;

  }

  switchStyle(layerId) {
    this.mapa.remove();
    this.iniciarMapa(layerId);
    this.listenPopUps('featuresConservacionFauna');
    this.listenPopUps('featuresConservacionFlora');
    this.listenPopUps('ambienteYsoc');
    this.listenPopUps('agroeco');
  }

  getSourceAndLayer(nameLayer, featuresList, colorDot?) {
    const source = {'type': 'geojson', 'data': {'type': 'FeatureCollection', 'features': featuresList}};
    const layerConfig = {
      'id':     `${nameLayer}`, 'type': 'circle', 'source': `${nameLayer}`,
      'layout': {'visibility': 'visible'},
      paint:    {
        'circle-radius':       20,
        'circle-color':        colorDot, //'#223b53'
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity':      0.7
      }
    };
    return {source, layerConfig};
  }

  mostrarCapa(event) {
    let visibility = event.checked;
    let clickedLayerId = event.name;
    // toggle layer visibility by changing the layout object's visibility property
    if (visibility === true) {
      this.mapa.setLayoutProperty(clickedLayerId, 'visibility', 'none');
    } else {
      this.mapa.setLayoutProperty(clickedLayerId, 'visibility', 'visible');
    }
  }


  private iniciarMapa(layer?: string) {
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

      let coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

      const project = description.split('"');
      let projectID;
      let userId;

      // Ensure that if the this.mapa is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      for (let itemHtml of project) {
        if (itemHtml.includes('detalles/')) {
          projectID = itemHtml.split('/')[1];
        } else if (itemHtml.includes('user/')) {
          userId = itemHtml.split('/')[1];
        }
      }

      this.storageSvc.getSingleImage(projectID, userId).then(url => {
        // aca reemplazo la imagen por defecto cuando se le da el click al icono
        if (url.includes('http')) {
          description = description.replace('https://icon-library.com/images/no-image-available-icon/no-image-available-icon-7.jpg', url);
        }

        new mapboxgl.Popup({offset: 25, closeButton: false, className: 'mapboxgl-popup', maxWidth: '400px'})
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.mapa);
      });
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

// settear visibilidad de capas cuando cambio de estilo de mapa
  showOrHideLayers() {
    if (this.ftConsFau === true) {
      this.mapa.setLayoutProperty('featuresConservacionFauna', 'visibility', 'visible');
    } else if (this.ftConsFau === false) {
      this.mapa.setLayoutProperty('featuresConservacionFauna', 'visibility', 'none');
    }
    if (this.ftConsFlor === true) {
      this.mapa.setLayoutProperty('featuresConservacionFlora', 'visibility', 'visible');
    } else if (this.ftConsFlor === false) {
      this.mapa.setLayoutProperty('featuresConservacionFlora', 'visibility', 'none');
    }
    if (this.ftAgroEco === true) {
      this.mapa.setLayoutProperty('agroeco', 'visibility', 'visible');
    } else if (this.ftAgroEco === false) {
      this.mapa.setLayoutProperty('agroeco', 'visibility', 'none');
    }
    if (this.ftAmbSoc === true) {
      this.mapa.setLayoutProperty('ambienteYsoc', 'visibility', 'visible');
    } else if (this.ftAmbSoc === false) {
      this.mapa.setLayoutProperty('ambienteYsoc', 'visibility', 'none');
    }
  }

  ngOnDestroy() {
    // this.images$.unsubscribe();
  }
}
