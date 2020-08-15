import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {ProyectoService} from '../proyecto.service';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector:    'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls:   ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  private borrarConfirm: BehaviorSubject<boolean>;
  itemFromTemplate;

  public projObj;
  public sppObj;
  public idProject;

  constructor(private proyectoService: ProyectoService,
              private router: Router,
              private modalService: BsModalService) {  this.borrarConfirm = new BehaviorSubject<boolean>(false); }

  ngOnInit() {
    this.getMergedShit();
  }

  editarProyecto(p) {
  }

  borrarProyecto(e, project) {
    this.getConfirmacion().subscribe((value) => {
      if (value === true) {
        this.proyectoService.deleteProject(project);
      }
    })
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

  goToProject(){
    this.router.navigate([`detalles/${this.idProject}`])
  }

  confirmDelete():void {
    this.borrarConfirm.next(true);
    this.modalRef.hide();
    // this.borrarProyecto();
    console.log(this.borrarConfirm);
  }
  declineDelete():void {
    this.borrarConfirm.next(false);
    this.modalRef.hide();
    console.log(this.borrarConfirm);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
  getConfirmacion() {
    return this.borrarConfirm.asObservable();
  }

  ngOnDestroy() {
    this.borrarConfirm.unsubscribe();
  }
}
