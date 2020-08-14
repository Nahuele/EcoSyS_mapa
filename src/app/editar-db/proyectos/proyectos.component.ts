import { Component, OnInit } from '@angular/core';
import {ProyectoService} from '../proyecto.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  public projObj;
  constructor(private proyectoService: ProyectoService) { }

  ngOnInit() {
    this.proyectoService.getProjects().subscribe(proyectos => {
      this.projObj = proyectos;
      console.log(this.projObj);
    });
    // this.proyectoService.getEspecies().subscribe(especies => {
    //   console.log(especies);
    // })
  }
  editarProyecto($event, p) {

  }
  borrarProyecto($event, p) {
    this.proyectoService.deleteProject(p);
  }
}
