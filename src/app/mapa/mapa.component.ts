import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {MapInfoWindow, MapMarker} from '@angular/google-maps';
import {GoogleMapsModule} from '@angular/google-maps';

// api AIzaSyCCXLGfiyzjnY4yfwpf2g26tdNIrQucNKA



@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  title = 'project';
  position = {
    lat: -34.681,
    lng: -58.371
  }

  label = {
    color: 'red',
    text:  'algo'
  }


  constructor() { }

  ngOnInit(): void {


  }
}
