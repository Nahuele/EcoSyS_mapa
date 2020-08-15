import {Component, OnInit} from '@angular/core';
import {ProyectoService} from '../proyecto.service';

@Component({
  selector:    'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls:   ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  public projObj;
  public sppObj;
  public idProject;

  constructor(private proyectoService: ProyectoService) { }

  ngOnInit() {
    this.getMergedShit();
  }

  editarProyecto(p) {
  }

  borrarProyecto(event, project) {
    this.proyectoService.deleteProject(project);
  }

  getMergedShit() {
    this.proyectoService.getProjects().subscribe(proyectos => {
      this.projObj = proyectos;
      this.idProject = this.projObj[0].projectID;
      console.log(this.projObj);

    });
    this.proyectoService.getEspecies().subscribe(especies => {
      console.log(especies);
      this.sppObj = especies;

    });
  }

}
