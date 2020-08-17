import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProyectoService} from '../editar-db/proyecto.service';

@Component({
  selector: 'app-proyecto-page',
  templateUrl: './proyecto-page.component.html',
  styleUrls: ['./proyecto-page.component.css']
})
export class ProyectoPageComponent implements OnInit {

  public detallesPro: any;
  public sppObj: any;


  constructor(private route: ActivatedRoute,
              private router:Router,
              private proyectoService: ProyectoService) { }

  ngOnInit() {
    const acc = this.route.snapshot.paramMap.get('id');
    this.getProyecto(acc);
  }

  getProyecto(acc) {
    this.proyectoService.getProjects().subscribe(proyectos => {
      for (let proyecto of proyectos) {
        console.log(proyecto);
        if (proyecto.id === acc) {
          // this.detallesPro = proyecto.id;
          console.log(this.detallesPro);
          return this.detallesPro
        }
      }
      console.log(this.detallesPro);
    });
    this.proyectoService.getEspecies().subscribe(entry => {
      for (let item of entry) {
        if (item[acc]) {
          this.sppObj = item[acc]['especies'];
        }
      }
      console.log(this.sppObj);
    });
  }

}
