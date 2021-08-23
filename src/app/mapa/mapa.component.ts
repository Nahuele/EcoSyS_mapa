import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {ProyectoService} from '../editar-db/proyecto.service';
import {StorageService} from '../upload-image/storage.service';
import {BehaviorSubject, interval} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector:    'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls:   ['./mapa.component.css'],
})

export class MapaComponent implements OnInit {
  mapa: mapboxgl.Map;
  ftConsBio = true;
  ftAgroEco = true;
  ftAmbSoc = true;
  idproject: string;
  capasCargadas = false;
  private projectsList = [];
  loadingCursor = new BehaviorSubject<boolean>(false);

  constructor(private proyectoService: ProyectoService,
              private view: ViewContainerRef,
              private storageSvc: StorageService) { }

  ngOnInit() {
    mapboxgl.accessToken = environment.mapboxKey;
    this.iniciarMapa();
    this.listenPopUps('featuresConservacionBio');
    this.listenPopUps('ambienteYsoc');
    this.listenPopUps('agroeco');
    this.mapa.getCanvas().style.cursor = 'wait';
    // esto es para el cursor waiting
    this.loadingCursor.asObservable().subscribe(value => {
      value == true ? this.mapa.getCanvas().style.cursor = 'wait' : this.mapa.getCanvas().style.cursor = 'default';
    })
  }

  buscarCoordenadas() {
    this.proyectoService.getProjects().subscribe(proyectos => {
      const projects = proyectos;
      // const featuresConservacionVeg = [];
      // const featuresConservacionFauna = [];
      const featuresConservacionBio = [];
      const featuresAgroEco = [];
      const featuresAmbSoc = [];
      for (const proj of Object.keys(projects)) {
        const itemProj = projects[proj].detalles;
        this.idproject = projects[proj].id;

        this.projectsList.push(projects[proj]);

        if (itemProj.coordenadas) {
          itemProj.coordenadas.forEach((element) => {
            const coordenadas = [+element.longitud, +element.latitud];
            const detallesPro = itemProj;
            const objForLayer = {
              type:        'Feature',
              properties:  {
                title: detallesPro.nombre,
                // 'marker-color': '#3c4e5a',
                // 'marker-symbol': 'monument',
                // 'marker-size': 'large',
                // 'icon': 'theatre',
                description: this.setearHtmlPopUp(projects[proj]),
              }, geometry: {coordinates: coordenadas, type: 'Point'}
            };
            detallesPro.tipo_enfoque === 'Experiencias agroecológicas' ? featuresAgroEco.push(objForLayer) : detallesPro.tipo_enfoque === 'Conservación de la biodiversidad' ?
              // tslint:disable-next-line:max-line-length
              featuresConservacionBio.push(objForLayer) : detallesPro.tipo_enfoque === 'Ambiente y sociedad' ? featuresAmbSoc.push(objForLayer) :
                // detallesPro.tipo_enfoque === 'Conservación de vegetación' ? featuresConservacionVeg.push(objForLayer)
                console.log('emtpy enfoque!!');
          });
        } else {
          console.log('not coord found');
        }
      }

      if (this.mapa.loaded()) {
        this.mapa.loadImage('../../assets/logos_mapa/biodiversidad_logo_mini.png', (error, image) => {
          if (error) { throw error; }
          this.mapa.addImage('bioLogo', image);
          this.mapa.addSource('featuresConservacionBio', this.getSourceAndLayer('featuresConservacionBio', featuresConservacionBio, 'bioLogo').source);
          this.mapa.addLayer(this.getSourceAndLayer('featuresConservacionBio', featuresConservacionBio, 'bioLogo').layerConfig);
        });
        this.mapa.loadImage('../../assets/logos_mapa/agroeco_logo_mini.png', (error, image) => {
          if (error) { throw error; }
          this.mapa.addImage('agroecoLogo', image);
          this.mapa.addSource('agroeco', this.getSourceAndLayer('agroeco', featuresAgroEco, 'agroecoLogo').source);
          this.mapa.addLayer(this.getSourceAndLayer('agroeco', featuresAgroEco, 'agroecoLogo').layerConfig);
        });
        this.mapa.loadImage('../../assets/logos_mapa/sociedad_amb_logo_mini.png', (error, image) => {
          if (error) { throw error; }
          this.mapa.addImage('socambLogo', image);
          this.mapa.addSource('ambienteYsoc', this.getSourceAndLayer('ambienteYsoc', featuresAmbSoc, 'socambLogo').source);
          this.mapa.addLayer(this.getSourceAndLayer('ambienteYsoc', featuresAmbSoc, 'socambLogo').layerConfig);
        });
      }
      else {
        this.cargarMapaIconos(featuresConservacionBio, featuresAgroEco, featuresAmbSoc);
      }
    });
  }

  // creo una funcion q me hace el popup HTML
  setearHtmlPopUp(proyecto) {

    const link = 'https://icon-library.com/images/no-image-available-icon/no-image-available-icon-7.jpg';

    return `<div class="card">
        <div class="card-header text-center">
          <img src="${link}" class="img-fluid" alt="Responsive image" style="border: 1px solid #ddd;
          border-radius: 4px;padding: 5px;width: 350px;">
</div>
  <div class="card-body">
    <h5 class="card-title">${proyecto.detalles.nombre}</h5>
    <p class="card-text"><div><strong>Resumen:</strong></div> ${proyecto.detalles.resumen}</p>
    <a href="detalles/${proyecto.id}" class="btn btn-primary btn-sm">Más Detalles
    <i class="fa fa-search"></i></a>
  </div>
  <div id="user/${proyecto.userUid}"></div>
</div>`;

  }

  switchStyle(layerId) {
    this.mapa.remove();
    this.iniciarMapa(layerId);
    // this.listenPopUps('featuresConservacionFauna');
    // this.listenPopUps('featuresConservacionVeg');
    this.listenPopUps('featuresConservacionBio');
    this.listenPopUps('ambienteYsoc');
    this.listenPopUps('agroeco');
  }

  getSourceAndLayer(nameLayer, featuresList, icon?) {
    const source = {type: 'geojson', data: {type: 'FeatureCollection', features: featuresList}};
    const layerConfig = {
      id:     `${nameLayer}`,
      source: `${nameLayer}`,
      type:   'symbol',
      layout: {
        visibility:   'visible',
        'icon-image': icon,
        'icon-size':  1
      },
      // paint:    {
      //   'circle-radius':       20,
      //   'circle-color':        '#223b53', // colorDot,
      //   'circle-stroke-color': 'white',
      //   'circle-stroke-width': 1,
      //   'circle-opacity':      0.7
      // }
    };
    return {source, layerConfig};
  }

  mostrarCapa(event) {
    const visibility = event.checked;
    const clickedLayerId = event.name;
    // toggle layer visibility by changing the layout object's visibility property
    if (visibility === true) {
      this.mapa.setLayoutProperty(clickedLayerId, 'visibility', 'none');
    } else {
      this.mapa.setLayoutProperty(clickedLayerId, 'visibility', 'visible');
    }
  }

  listenPopUps(layerId) {

    this.mapa.on('click', layerId, (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      let description = e.features[0].properties.description;
      const project = description.split('"');
      let projectID;
      let userId;
      this.loadingCursor.next(true)
      // Ensure that if the this.mapa is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      for (const itemHtml of project) {
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
        this.loadingCursor.next(false);
      });
    });
// // Change the cursor to a pointer when the mouse is over the places layer.
    this.mapa.on('mouseenter', layerId, () => {
      if (!this.loadingCursor.getValue()) {
        this.mapa.getCanvas().style.cursor = 'pointer';
      }
    });
// Change it back to a pointer when it leaves.
    this.mapa.on('mouseleave', layerId, () => {
      if (!this.loadingCursor.getValue()) {
        this.mapa.getCanvas().style.cursor = '';
      }
    });
  }

  iniciarMapa(layer?: string) {
    const selectedLayer = layer ? layer : 'satellite-v9';
    this.mapa = new mapboxgl.Map({
      container: 'mapa-mapbox', // container id
      style:     `mapbox://styles/mapbox/${selectedLayer}`, // mapbox://styles/mapbox/streets-v11
      // mapbox://styles/iannbarbe/ckduoxxyy0u7d19teotam0daj
      center: [-68.5631238, -43.7027949], // starting position
      zoom:   3 // starting zoom
    });
    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(new mapboxgl.ScaleControl());
    this.buscarCoordenadas();
  }
// esto intenta solucionar el bug de map.on('load') o ('idle') que no carga la primera vez
  cargarMapaIconos(ftsConservacionBio, ftsAgroEco, ftsAmbSoc) {
    this.mapa.on('idle', () => {
      this.mapa.loadImage('../../assets/logos_mapa/biodiversidad_logo_mini.png', (error, image) => {
        if (error) { throw error; }
        this.mapa.addImage('bioLogo', image);
        this.mapa.addSource('featuresConservacionBio', this.getSourceAndLayer('featuresConservacionBio', ftsConservacionBio, 'bioLogo').source);
        this.mapa.addLayer(this.getSourceAndLayer('featuresConservacionBio', ftsConservacionBio, 'bioLogo').layerConfig);
      });
      this.mapa.loadImage('../../assets/logos_mapa/agroeco_logo_mini.png', (error, image) => {
        if (error) { throw error; }
        this.mapa.addImage('agroecoLogo', image);
        this.mapa.addSource('agroeco', this.getSourceAndLayer('agroeco', ftsAgroEco, 'agroecoLogo').source);
        this.mapa.addLayer(this.getSourceAndLayer('agroeco', ftsAgroEco, 'agroecoLogo').layerConfig);
      });
      this.mapa.loadImage('../../assets/logos_mapa/sociedad_amb_logo_mini.png', (error, image) => {
        if (error) { throw error; }
        this.mapa.addImage('socambLogo', image);
        this.mapa.addSource('ambienteYsoc', this.getSourceAndLayer('ambienteYsoc', ftsAmbSoc, 'socambLogo').source);
        this.mapa.addLayer(this.getSourceAndLayer('ambienteYsoc', ftsAmbSoc, 'socambLogo').layerConfig);
      });
      // this.showOrHideLayers();
      console.log('mapa desde funcion correctora con idle, lo carga 3 veces, 2 de las cuales va a dar errores xq ya existen los objetos html')
      this.capasCargadas = true;
    });
  }

}
