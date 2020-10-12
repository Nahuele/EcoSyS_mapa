import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CamposFormulario} from '../campos-formulario';
import {FormArray, FormBuilder} from '@angular/forms';
import {ProyectoService} from '../../editar-db/proyecto.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {AuthService} from '../../editar-db/auth/auth.service';
import {AlertComponent} from 'ngx-bootstrap/alert';
import {IucnApiService} from '../iucn-api.service';
import {
  bufferTime,
  catchError,
  concatMap, defaultIfEmpty,
  delay, filter, last,
  map,
  mapTo, mergeAll, mergeMap,
  scan, share,
  startWith,
  switchMap,
  switchMapTo, take, takeLast,
  takeWhile,
  timeout
} from 'rxjs/operators';
import {BehaviorSubject, concat, forkJoin, interval, merge, Observable, of, Subject, timer} from 'rxjs';
import {EMPTY} from 'rxjs';

@Component({
  selector:    'app-editar',
  templateUrl: './editar.component.html',
  styleUrls:   ['./editar.component.css']
})
export class EditarComponent implements OnInit, OnDestroy {

  @Input() userUidEdit;
  // public projId: string;
  @Output() cerrarForm = new EventEmitter();
  @Input() id;
  public formProyecto: CamposFormulario;
  public userUid;
  public formProyectoFinal;
  // 1) Nested: crear variables para mostrar en el template
  public listafotosFromDB;
  public listasppFromDB;
  public listapersonalFromDb;
  public listacoordenadasFromDb;
  public iucndetalles;
  public iucndetalleslist = {};
  strtemp = '';
  iucndetails$ = new BehaviorSubject('');

  public alerta = false;

  alerts: any[] = [{
    type:    'success',
    msg:     `Gracias! se ha agregado el proyecto a la base de datos`,
    timeout: 3000
  }];


  constructor(private formBuilder: FormBuilder,
              public proyectoService: ProyectoService,
              private modalService: BsModalService,
              private authService: AuthService,
              public iucnService: IucnApiService) {}

  ngOnInit(): void {
    this.userUid = this.authService.userid;
    this.proyectoService.selectedProject.detalles.linksvideos ? this.listafotosFromDB = this.proyectoService.selectedProject.detalles.linksvideos : this.listafotosFromDB = [];
    this.proyectoService.selectedProject.detalles.especies ? this.listasppFromDB = this.proyectoService.selectedProject.detalles.especies : this.listasppFromDB = [];
    this.proyectoService.selectedProject.detalles.personal ? this.listapersonalFromDb = this.proyectoService.selectedProject.detalles.personal : this.listapersonalFromDb = [];
    this.proyectoService.selectedProject.detalles.coordenadas ? this.listacoordenadasFromDb = this.proyectoService.selectedProject.detalles.coordenadas : this.listacoordenadasFromDb = [];

  }


  registerForm = this.formBuilder.group({
    projectid:        [''], //, [Validators.required, Validators.minLength(6)]],
    email:            [''], // , [Validators.required, Validators.email]],
    tipo_enfoque:     [''], //, Validators.required],
    nombre:           [''],
    enfoque:          [''],
    institucion:      [''],
    titulo_extendido: [''],
    descripcion:      [''],
    resumen:          [''],
    tipo_estudio:     [''],
    redes_sociales:   this.formBuilder.group({
      facebook:     [''],
      instagram:    [''],
      twitter:      [''],
      youtube:      [''],
      researchgate: [''],
    }),
    pais:             [''],
    provincia:        [''],
    ciudad:           [''],
    estado_actual:    [''],
    coordenadas:      this.formBuilder.array([]), // , Validators.required
    ano_inicio:       [''],
    web:              [''],
    tipo_sitio:       [''],
    resultados:       [''],
    linksvideos:       this.formBuilder.array([]),
    personal:         this.formBuilder.array([]),
    especies:         this.formBuilder.array([])

  });

  submit() {
    let formProyectoFinal = {};
    console.log('form DB original', this.proyectoService.selectedProject.detalles);
    let videosFinal = [...this.listafotosFromDB, ...this.registerForm.value.linksvideos];
    let especiesFinal = [...this.listasppFromDB, ...this.registerForm.value.especies];
    let personalFinal = [...this.listapersonalFromDb, ...this.registerForm.value.personal];
    let coordsFinal = [...this.listacoordenadasFromDb, ...this.registerForm.value.coordenadas];
    // 2) Nested: actualizar el objeto final
    this.formProyecto = this.removeEmptyFields(this.registerForm.value);
    formProyectoFinal['detalles'] = this.formProyecto;
    formProyectoFinal['detalles']['linksvideos'] = videosFinal;
    formProyectoFinal['detalles']['especies'] = especiesFinal;
    formProyectoFinal['detalles']['personal'] = personalFinal;
    formProyectoFinal['detalles']['coordenadas'] = coordsFinal;
    formProyectoFinal['userUid'] = this.userUid;
    formProyectoFinal['id'] = this.proyectoService.selectedProject.id;
    // formProyectoFinal['id'] = this.projobj.id;
    console.log('detalles', formProyectoFinal);
    this.proyectoService.editarProject(formProyectoFinal);
    console.log('enviado correcto');
    window.scrollTo(0, 0);
    this.cerrarForm.emit();
    this.alerta = true;

  }

  removeEmptyFields(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      return (value === null ? undefined : value === '' ? undefined : value);
    }));
  }

  get email() {
    return this.registerForm.get('email');
  }

  get coordenadas() {
    return this.registerForm.get('coordenadas') as FormArray;
  }

  get linksvideos() {
    return this.registerForm.get('linksvideos') as FormArray;
  }

  get personal() {
    return this.registerForm.get('personal') as FormArray;
  }

  get especies() {
    return this.registerForm.get('especies') as FormArray;
  }


  borrarForm() {
    this.registerForm.reset();
    this.linksvideos.controls.splice(0, this.linksvideos.length);
    this.especies.controls.splice(0, this.especies.length);
    this.personal.controls.splice(0, this.personal.length);
    window.scrollTo(0, 0);
  }

  agregarlinkvideo() {
    let linksFormGroup = this.formBuilder.group({
      link:        '',
      descripcion: '',
    });
    this.linksvideos.push(linksFormGroup);
  }

  // 3) Nested: funcion general que sirve para cualquier nested
  removerItem(indice: number, asignarForm: string, target: string,) {
    if (target === 'anterior' && indice !== -1) {
      if (asignarForm === 'videos') {
        this.listafotosFromDB.splice(indice, 1);
      } else if (asignarForm === 'especies') {
        this.listasppFromDB.splice(indice, 1);
      } else if (asignarForm === 'personal') {
        this.listapersonalFromDb.splice(indice, 1);
      } else if (asignarForm === 'coordenadas') {
        this.listacoordenadasFromDb.splice(indice, 1);
      }
    } else if (target === 'current' && indice !== -1) {
      if (asignarForm === 'videos') {
        this.linksvideos.removeAt(indice);
      } else if (asignarForm === 'especies') {
        this.especies.removeAt(indice);
        // this.listasppFromDB.splice(indice, 1);
      } else if (asignarForm === 'personal') {
        this.personal.removeAt(indice);
      } else if (asignarForm === 'coordenadas') {
        this.coordenadas.removeAt(indice);
      }
    }
  }

  agregarPersonal() {
    const personalFormGroup = this.formBuilder.group({
      nombre_personal:         '',
      apellido_personal:       '',
      rol:                     '',
      genero:                  '',
      fecha_nacimiento:        '',
      pais_residencia:         '',
      provincia_residencia:    '',
      email_personal:          [''], // , Validators.email
      redes_sociales_personal: this.formBuilder.group({
        facebook_personal:     '',
        instagram_personal:    '',
        twitter_personal:      '',
        youtube_personal:      '',
        researchgate_personal: '',
      })
    });
    this.personal.push(personalFormGroup);
  }


  agregarEspecie() {
    let especiesFormGroup = this.formBuilder.group({
      spob:          [''],
      nombre_vulgar: [''],
      tso:           ['']
    });
    this.especies.push(especiesFormGroup);
  }

  agregarCoordenadas() {
    let coordenadasFormGroup = this.formBuilder.group({
      latitud:  [''],
      longitud: ['']
    });
    this.coordenadas.push(coordenadasFormGroup);
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
    this.alerta = false;
  }

  iucnGet(index, especie?: string) {
    // let obs1;
    let spptest;
    if (especie.length > 2) {
      spptest = especie
    }
    this.iucndetalles = null
    console.log(this.iucndetalleslist)
    console.log('FUNCION DISPARADA CONTROl')

    const obs1 = this.registerForm.valueChanges // .pipe(bufferTime(5000))
      .subscribe(value => {
        let search = value['especies'][index].spob
        if (search.length > 2) {
          // console.log('subs del form value', search)
          this.strtemp = search
          this.iucndetails$.next(search);
        }
      })

    let tiempo = interval(1000).pipe(take(6))
    concat(tiempo, this.iucndetails$).subscribe((x) => {
      if (typeof x === 'string') {
        const detalleFromSv = this.iucnService.busquedaApi(x).subscribe(y => {
          const result = y.result[0];
          this.iucndetalleslist[x] = result;
        });
      }
    });
  }



  ngOnDestroy() {
    this.formProyecto = null;
    this.iucndetails$.unsubscribe();

  }

}
