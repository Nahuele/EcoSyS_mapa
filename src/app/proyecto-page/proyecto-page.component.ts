import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProyectoService} from '../editar-db/proyecto.service';
import {StorageService} from '../upload-image/storage.service';
import nombresFields from '../../assets/detallesFields.json';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector:    'app-proyecto-page',
  templateUrl: './proyecto-page.component.html',
  styleUrls:   ['./proyecto-page.component.css'],
})
export class ProyectoPageComponent implements OnInit {

  public detallesPro: any;
  public imagenes;
  public fieldsNames: { label: string; field: string }[] = nombresFields;
  public videos = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private proyectoService: ProyectoService,
              private storageSvc: StorageService,
              public sanitizer: DomSanitizer,) { }

  ngOnInit() {
    const acc = this.route.snapshot.paramMap.get('id');
    this.getProyectoFromServ(acc);


  }

  getProyectoFromServ(acc) {
    this.proyectoService.getProjects().subscribe(proyectos => {
      for (const proyecto of proyectos) {
        if (proyecto.id === acc) {
          this.detallesPro = proyecto.detalles;
          console.log('detalles,', proyecto.detalles);
          // este me trae las imagenes desde el servicio
          this.imagenes = this.storageSvc.getImages(proyecto.id, proyecto.userUid);
          if (this.detallesPro.linksvideos) {
            const obj = Object.values(this.detallesPro.linksvideos)
            for (let item in obj) {
              const url = obj[item]['link']
              const regExp = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
              const match = url.match(regExp);
              const id = (match && match[1].length==11)? match[1] : false;
              this.videos.push(id);
              this.createVideoTag();
            }

          }
          return this.detallesPro;
        }
      }
    });
  }

  createVideoTag() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }

}
