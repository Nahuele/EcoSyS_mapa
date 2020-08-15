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
    this.getProyectos(acc);
  }

  getProyectos(acc) {
    this.proyectoService.getProjects().subscribe(proyectos => {
      for (let proyecto of proyectos) {
        if (proyecto[acc]) {
          this.detallesPro = proyecto[acc];
        }
      }
      console.log(this.detallesPro);
    });
    // this.proyectoService.getEspecies().valueChanges().subscribe(entry => {
    //   for (let item of entry) {
    //     if (item[acc]) {
    //       this.sppObj = item[acc]['especies'];
    //     }
    //   }
    // })
  }

}
