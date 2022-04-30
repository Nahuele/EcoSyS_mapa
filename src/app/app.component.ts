import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'ecomapa';

  constructor(){}



  event$
  // public ruta;
  //
  // constructor(private location: Location) {
  //   this.event$=location.onUrlChange((val) => {
  //     // aca spliteo la url y me quedo con la base
  //     this.ruta = val.split('/')[1]
  //   })
  // }

  // defineStyles(rutaActual) {
  //   let styles = {
  //     // 'fontSize.em': 3,
  //     // 'backgroundColor': 'red',
  //     // 'color': 'red'
  //     // width:'auto',
  //     position: 'relative',
  //     height: '100vh',
  //     width: '100%',
  //     'background-size':'cover'
  //   }
  //
  //   if (rutaActual ===  'detalles') {
  //     styles['background-image'] = "url('../assets/foto_fondo_proyecto.jpg')"
  //     styles['background-color'] = 'rgba(255,255,255,0.2)'
  // }
  //   return styles
  //
  // }

}
