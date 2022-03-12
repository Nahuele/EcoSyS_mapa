import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProyectoService} from '../editar-db/proyecto.service';
import {StorageService} from '../upload-image/storage.service';
import nombresFields from '../../assets/detallesFields.json';
import {DomSanitizer} from '@angular/platform-browser';
import {CarouselComponent} from 'ngx-bootstrap/carousel';
import {IucnApiService} from '../formularios/iucn-api.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

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
  public iucndetalleslist = {};
  modalRef: BsModalRef;
  @ViewChild(CarouselComponent) carousel: CarouselComponent;
  showPersonal = true;
  showCoordenadas = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private proyectoService: ProyectoService,
              private storageSvc: StorageService,
              public sanitizer: DomSanitizer,
              public iucnService: IucnApiService,
              private modalService: BsModalService) { }

  ngOnInit() {
    const acc = this.route.snapshot.paramMap.get('id');
    this.getProyectoFromServ(acc);
  }

  getProyectoFromServ(acc) {
    this.proyectoService.getProjects().subscribe(proyectos => {
      for (const proyecto of proyectos) {
        if (proyecto.id === acc) {
          this.detallesPro = proyecto.detalles;
          // este me trae las imagenes desde el servicio
          this.imagenes = this.storageSvc.getImages(proyecto.id, proyecto.userUid);
          console.log(this.imagenes);
          // consulto las especies en peligro con la API
          if (this.detallesPro.especies && this.detallesPro.especies.length > 0) {
            for (let especie of this.detallesPro.especies) {
              this.checkRedList(especie.spob.toLowerCase())
            }
          }

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
          console.log(this.detallesPro)
          console.log(this.detallesPro)
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

  checkRedList(item) {
    if (this.iucnService.busquedaApi(item)) {
      this.iucnService.busquedaApi(item).subscribe(y => {
        this.iucndetalleslist[item] = y.result[0];
        console.log(this.iucndetalleslist)
      });
    }
  }

  openIucnModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
