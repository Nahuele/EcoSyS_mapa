import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProyectoService} from '../editar-db/proyecto.service';
import {StorageService} from '../upload-image/storage.service';

@Component({
  selector:    'app-proyecto-page',
  templateUrl: './proyecto-page.component.html',
  styleUrls:   ['./proyecto-page.component.css'],
  providers: [StorageService]
})
export class ProyectoPageComponent implements OnInit {

  public detallesPro: any;
  public imagenes;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private proyectoService: ProyectoService,
              private storageSvc: StorageService) { }

  ngOnInit() {
    const acc = this.route.snapshot.paramMap.get('id');
    this.getProyectoFromServ(acc);
  }

  getProyectoFromServ(acc) {
    this.proyectoService.getProjects().subscribe(proyectos => {
      for (const proyecto of proyectos) {
        if (proyecto.id === acc) {
          this.detallesPro = proyecto.detalles;
          console.log('detalles,', proyecto);
          // este me trae las imagenes desde el servicio
          this.imagenes = this.storageSvc.getImages(proyecto.id, proyecto.userUid);
          console.log(`images ${this.imagenes.length}`, this.imagenes);
          return this.detallesPro;
        }
      }
    });
  }

}
