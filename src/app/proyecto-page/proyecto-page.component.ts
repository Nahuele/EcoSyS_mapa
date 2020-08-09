import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GetProjectsService} from '../home/get-projects.service';

@Component({
  selector: 'app-proyecto-page',
  templateUrl: './proyecto-page.component.html',
  styleUrls: ['./proyecto-page.component.css']
})
export class ProyectoPageComponent implements OnInit {

  public detallesPro: any;
  public faunaPro: any;

  constructor(private route: ActivatedRoute,
              private router:Router,
              private getproject: GetProjectsService) { }

  ngOnInit() {
    const acc = this.route.snapshot.paramMap.get('id');
    this.getProyectos(acc);
  }

  getProyectos(acc) {
    this.getproject.getProyectos().subscribe(data => {
      this.detallesPro = data.detalles_proyectos[acc];
      this.faunaPro = data.especies[acc]
    })
  }

}
