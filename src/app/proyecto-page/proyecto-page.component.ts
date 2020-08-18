import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProyectoService} from '../editar-db/proyecto.service';

@Component({
  selector:    'app-proyecto-page',
  templateUrl: './proyecto-page.component.html',
  styleUrls:   ['./proyecto-page.component.css']
})
export class ProyectoPageComponent implements OnInit {

  public detallesPro: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private proyectoService: ProyectoService) { }

  ngOnInit() {
    const acc = this.route.snapshot.paramMap.get('id');
    this.getProyectoFromServ(acc);
  }

  getProyectoFromServ(acc) {
    this.proyectoService.getProjects().subscribe(proyectos => {
      for (let proyecto of proyectos) {
        if (proyecto.id === acc) {
          this.detallesPro = proyecto.detalles;
          console.log(this.detallesPro);
          return this.detallesPro;

        }
      }
    });
  }

}
