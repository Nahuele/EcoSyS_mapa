import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {ProyectoService} from '../proyecto.service';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../auth/user';
import {ProyectFormComponent} from '../proyect-form/proyect-form.component';
import {CamposFormulario} from '../proyect-form/campos-formulario';

@Component({
  selector:    'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls:   ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  private borrarConfirm: BehaviorSubject<boolean>;

  public projObj;
  public isAdmin: any = null;
  public userUid: string = null;
  public editForm: boolean = false;

  constructor(private proyectoService: ProyectoService,
              private router: Router,
              private modalService: BsModalService,
              private authService: AuthService) {  this.borrarConfirm = new BehaviorSubject<boolean>(false); }

  ngOnInit() {
    this.getProject();
    this.getCurrentUser();
  }

  editarProyecto(project) {
    // console.log(project);
    this.editForm = true;
    this.proyectoService.selectedProject = Object.assign({}, project);

    // this.proyectoService.selectedProject = project;
  }

  borrarEditarProyecto(e, project, accion) {
    this.getConfirmacion().subscribe((value) => {
      console.log('VALUe', value)
      if (value === true && accion === 'borrar') {
        console.log('VALUE BORRAR?', value)
        this.proyectoService.deleteProject(project);

      } else if (value === true && accion === 'editar') {
        this.editarProyecto(project)
        console.log('puede editar')


        // this.proyectoService.editarProject(project);
      }
    })
  }

  getProject() {
    this.proyectoService.getProjects().subscribe(proyectos => {
      this.projObj = proyectos;
    });
     }

  goToProject(id){
    this.router.navigate([`detalles/${id}`])
  }

  confirmDelete():void {
    this.borrarConfirm.next(true);
    this.modalRef.hide();
    // this.borrarProyecto();
  }
  declineDelete():void {
    this.borrarConfirm.next(false);
    this.modalRef.hide();
    // console.log(this.borrarConfirm);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
  getConfirmacion() {
    return this.borrarConfirm.asObservable();
  }


  getCurrentUser() {
    this.authService.isAuth().subscribe( auth => {
      if (auth) {
        // console.log(auth);
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin')
          // this.isAdmin = userRole.roles.editor
        })
      }
    })
  }

  // onPreUpdateProject(project) {
  //   console.log('PROJECTTT', project);
  //   this.proyectoService.selectedProject = Object.assign({}, project);
  // }

  aceptarEditar() {
    this.borrarConfirm.next(true);
    // this.proyectoService.editarProject(project);
  }

  cancelarEditar() {
    this.modalRef.hide();
  }

  openModalEdit(project: CamposFormulario) {
    // this.editarProyecto(project);
    // console.log('openmodal func', project);
    // this.proyectoService.selectedProject = Object.assign({}, project);
    // this.modalRef = this.modalService.show(ProyectFormComponent, {class: 'modal-xl'});
    // this.modalRef.content = project

  }

  ngOnDestroy() {
    this.borrarConfirm.unsubscribe();
  }
}
