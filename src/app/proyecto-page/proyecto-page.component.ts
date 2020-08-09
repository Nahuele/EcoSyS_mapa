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
    this.getDetalles(acc);
    this.getFauna(acc);
  }

  public getDetalles(acc) {
    this.getproject.getDetalles().subscribe(data => {
      console.log(data[acc]);
      this.detallesPro = data[acc]
    })
  }

  public getFauna(acc) {
    this.getproject.getFauna().subscribe(data => {
      console.log(data);
      console.log(data[acc]);
      this.faunaPro = data[acc]
    })
  }
}
