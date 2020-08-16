// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // CUIDADO ESTA EN TRUE
  production: true,
  // mapboxKey: 'pk.eyJ1IjoibmFodWVsZSIsImEiOiJja2RteGl3dDYxZDg4MnFsY2JrbmczbTVyIn0.cmv_eh2S5gMk-jXPNbuDNg', nahue
  // mapboxKey: 'pk.eyJ1IjoiaWFubmJhcmJlIiwiYSI6ImNrZHF0OXN5dDFxeGgzMXBlaGhjejgzeDYifQ.YoVZW3-DD0PLY3q4voJsPg', iana
  mapboxKey: 'pk.eyJ1IjoibmFodWVsZSIsImEiOiJja2RteGl3dDYxZDg4MnFsY2JrbmczbTVyIn0.cmv_eh2S5gMk-jXPNbuDNg', // eje capas
  firebase: {
    apiKey: "AIzaSyCu0Uq4FqtPkgiblDUuGsOJ2_eq1LJtPmo",
    authDomain: "mapaproyectos-59125.firebaseapp.com",
    databaseURL: "https://mapaproyectos-59125.firebaseio.com",
    projectId: "mapaproyectos-59125",
    storageBucket: "mapaproyectos-59125.appspot.com",
    messagingSenderId: "1028006325784",
    appId: "1:1028006325784:web:b017a9a52ad41e28085d6d",
    measurementId: "G-MJ2FJJTB3D"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
