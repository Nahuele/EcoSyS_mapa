import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProyectoService} from '../proyecto.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {AlertComponent} from 'ngx-bootstrap/alert';
import {AuthService} from '../auth/auth.service';
import {NgForm} from '@angular/forms';
import {filter} from 'rxjs/operators';
import {} from './campos-formulario';

@Component({
  selector: 'app-proyect-form',
  templateUrl: './proyect-form.component.html',
  styleUrls: ['./proyect-form.component.css']
})
export class ProyectFormComponent implements OnInit, OnDestroy {

  @Input() userUidEdit;
  // public projId: string;
  @Input() projobj;
  private formProyecto;
  public userUid;
  public formProyectoFinal = {};
  public listafotosFromDB ;
  public listasppFromDB;
  public listapersonalFromDb;

  public alerta: boolean = false;
  alerts: any[] = [{
    type: 'success',
    msg: `Gracias! se ha agregado el proyecto a la base de datos`,
    timeout: 3000
  }];

  public opcionRoles: ['Guardaparque', 'Director', 'Audiovisual','Voluntario de campo', 'Codirector/a', 'Investigador principal', 'Otro']

  constructor(private formBuilder: FormBuilder,
              public proyectoService: ProyectoService,
              private modalService: BsModalService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.userUid = this.authService.userid;
    this.listafotosFromDB = this.proyectoService.selectedProject.detalles.linksfotos
    // this.registerForm.valueChanges.subscribe(value => {
      // this.formProyecto = this.removeEmptyFields(value);
      // console.log(this.formProyecto)
    // })

    // if (this.proyectoService.selectedProject.detalles) {
    //   this.formProyecto.patchValue(this.proyectoService.selectedProject.detalles);
    // }
    // int af (this.projobj) {
    //   this.formProyecto = this.projobj;
    //   console.log(this.formProyecto)
    //   // this.formProyectoFinal = this.projobj
    // } else {
    //   this.formProyectoFinal = {}
    // }
    console.log(this.proyectoService.selectedProject)
  }


  registerForm = this.formBuilder.group({
    projectid: ['', [Validators.required, Validators.minLength(6)]], // , [Validators.required, Validators.minLength(8)]
    email: ['',[Validators.required, Validators.email]], //, [Validators.required, Validators.email]
    tipo_enfoque: ['', Validators.required], //, Validators.required
    nombre: [''],
    enfoque: [''],
    institucion: [''],
    titulo_extendido: [''],
    descripcion: [''],
    resumen: [''],
    tipo_estudio: [''],
    redes_sociales: this.formBuilder.group({
      facebook: [''],
      instagram: [''],
      twitter: [''],
      youtube: [''],
      researchgate: [''],
    }),
    pais: [''],
    provincia: [''],
    ciudad: [''],
    estado_actual: [''],
    coordenadas: ['', Validators.required], // , Validators.required
    ano_inicio: [''],
    web: [''],
    tipo_sitio:[''],
    resultados:[''],
    linksfotos: this.formBuilder.array([]),
    personal: this.formBuilder.array([]),
    especies: this.formBuilder.array([])

  })

  submit() {
    // let formProyectoFinal = {};
    this.formProyecto = this.removeEmptyFields(this.registerForm.value);
    this.formProyectoFinal['detalles'] = this.formProyecto
    this.formProyectoFinal['userUid'] = this.userUid;
    // console.log(formProyectoFinal);

    if (this.projobj && this.userUidEdit) {
      console.log('EDITAR');
      console.log(this.formProyecto );

      // this.proyectoService.editarProject(this.proyectoService.selectedProject);

    } else {
      console.log('SE VA AAGREGAR', this.formProyectoFinal);
      // this.proyectoService.addProject(formProyectoFinal);
    }
    // this.proyectoService.addProject(formProyectoFinal);
    // this.proyectoService.addProject(formPro);
    // this.borrarForm();
    this.alerta = true;

  }

    removeEmptyFields(obj) {
    for (var key in obj) {
      if (obj[key] === undefined) {
        delete obj[key];
        continue;
      }
      if (obj[key] && typeof obj[key] === "object") {
        filter(obj[key]);
        if (!Object.keys(obj[key]).length) {
          delete obj[key];
        }
      }
    }
    return obj;
  }

   get email() {
    return this.registerForm.get('email');
  }
  get coordenadas() {
    return this.registerForm.get('coordenadas');
  }
  get linksfotos() {
    return this.registerForm.get('linksfotos') as FormArray;
  }
  get personal() {
    return this.registerForm.get('personal') as FormArray;
  }
  get especies() {
    return this.registerForm.get('especies') as FormArray;
  }

  borrarForm() {
    this.registerForm.reset();
    this.linksfotos.controls.splice(0, this.linksfotos.length);
    // this.especies.controls.splice(0,this.especies.length);
    this.personal.controls.splice(0, this.personal.length);
    window.scrollTo(0,0)
  }

  agregarlinkimg() {
    let linksFormGroup = this.formBuilder.group({
      link: '',
      descripcion: '',
    });
    this.linksfotos.push(linksFormGroup);
  }

  removerlinkimg(indice:number, target?:string) {
    if (target === 'anterior') {
      // this.listafotosFromDB = this.listafotosFromDB.filter(x => x != this.listafotosFromDB);
      if (indice != -1) this.listafotosFromDB.splice(indice, 1);
      // this.listafotosFromDB.removeAt(indice);
      console.log('clickeado remover anterior');
    } else {
      this.linksfotos.removeAt(indice);

    }
  }

  agregarPersonal() {
    let personalFormGroup = this.formBuilder.group({
      nombre_apellido: '',
      rol: '',
      genero: '',
      fecha_nacimiento: '',
      pais_residencia: '',
      provincia_residencia: '',
      email_personal: [''], // , Validators.email
      redes_sociales_personal: this.formBuilder.group({
        facebook_personal: [''],
        instagram_personal: [''],
        twitter_personal: [''],
        youtube_personal: [''],
        researchgate_personal: [''],
      }),
    });
    this.personal.push(personalFormGroup);
  }

  removerPersonal(indice: number) {
    this.personal.removeAt(indice);
  }
  agregarEspecie() {
    let especiesFormGroup = this.formBuilder.group( {
        spob:[''],
        nombre_vulgar: [''],
        tso:['']
    });
    this.especies.push(especiesFormGroup);
  }

  removerEspecie(indice: number) {
    this.especies.removeAt(indice)
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
    this.alerta = false;
  }

  ngOnDestroy() {
    this.projobj = null;
    this.formProyecto = null;
  }

}
