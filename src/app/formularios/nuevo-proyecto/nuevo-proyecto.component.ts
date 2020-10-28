import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';
import {ProyectoService} from '../../editar-db/proyecto.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {AuthService} from '../../editar-db/auth/auth.service';
import {take} from 'rxjs/operators';
import {AlertComponent} from 'ngx-bootstrap/alert';
import {BehaviorSubject, concat, interval} from 'rxjs';
import {IucnApiService} from '../iucn-api.service';

@Component({
  selector:    'app-nuevo-proyecto',
  templateUrl: './nuevo-proyecto.component.html',
  styleUrls:   ['./nuevo-proyecto.component.scss']
})


export class NuevoProyectoComponent implements OnInit, OnDestroy {


  constructor(private formBuilder: FormBuilder,
              public proyectoService: ProyectoService,
              private modalService: BsModalService,
              public iucnService: IucnApiService,
              private authService: AuthService) {}

  get email() {
    return this.registerForm.get('email');
  }

  get linksvideos() {
    return this.registerForm.get('linksvideos') as FormArray;
  }

  get personal() {
    return this.registerForm.get('personal') as FormArray;
  }

  get coordenadas() {
    return this.registerForm.get('coordenadas') as FormArray;
  }

  get especies() {
    return this.registerForm.get('especies') as FormArray;
  }

  @Input() userUidEdit;
  // public projId: string;
  @Input() projobj;
  public formProyecto;
  public userUid$ = new BehaviorSubject('');
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


  registerForm = this.formBuilder.group({
    projectid:        [''], // , [Validators.required, Validators.minLength(6)]],
    email:            [''], // , [Validators.required, Validators.email]],
    tipo_enfoque:     [''], // , Validators.required],
    nombre:           [''],
    enfoque:          [''],
    institucion:      [''],
    titulo_extendido: [''],
    descripcion:      [''],
    resumen:          [''],
    tipo_estudio:     [''],
    redes_sociales:   this.formBuilder.group({
      facebook:  [''],
      instagram: [''],
      twitter:   [''],
      youtube:   [''],
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
    linksvideos:      this.formBuilder.array([]),
    personal:         this.formBuilder.array([]),
    especies:         this.formBuilder.array([])

  });

  ngOnInit(): void {
    this.userUid$.next(this.authService.userid);
  }

  submit() {
    let formProyectoFinal = {};
    // 2) Nested: actualizar el objeto final
    formProyectoFinal['detalles'] = this.removeEmptyFields(this.registerForm.value);
    formProyectoFinal['userUid'] = this.userUid$.value;
    console.log('detalles', formProyectoFinal);

    this.proyectoService.addProject(formProyectoFinal);
    this.alerta = true;
    window.scrollTo(0, 0);
    this.ngOnDestroy();
  }

  removeEmptyFields(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      return (value === null ? undefined : value === '' ? undefined : value.length === 0 ? undefined : value);
    }));
  }

  borrarForm() {
    this.registerForm.reset();
    this.linksvideos.controls.splice(0, this.linksvideos.length);
    // this.especies.controls.splice(0,this.especies.length);
    this.personal.controls.splice(0, this.personal.length);
    window.scrollTo(0, 0);
  }

  agregarvideos() {
    const linksFormGroup = this.formBuilder.group({
      link:             '',
      descripcionvideo: '',
    });
    this.linksvideos.push(linksFormGroup);
  }

  // 3) Nested: funcion general que sirve para cualquier nested
  removerItem(indice: number, asignarForm: string, target: string,) {
    if (target === 'current' && indice !== -1) {
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
        facebook_personal:     [''],
        instagram_personal:    [''],
        twitter_personal:      [''],
        youtube_personal:      [''],
        researchgate_personal: [''],
      })
    });
    this.personal.push(personalFormGroup);
  }

  agregarEspecie() {
    const especiesFormGroup = this.formBuilder.group({
      spob:          [''],
      nombre_vulgar: [''],
      tso:           ['']
    });
    this.especies.push(especiesFormGroup);
  }

  agregarCoordenadas() {
    const coordenadasFormGroup = this.formBuilder.group({
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
      spptest = especie;
    }
    this.iucndetalles = null;
    console.log(this.iucndetalleslist);
    console.log('FUNCION DISPARADA CONTROl');

    const obs1 = this.registerForm.valueChanges // .pipe(bufferTime(5000))
      .subscribe(value => {
        const search = value.especies[index].spob;
        if (search.length > 2) {
          // console.log('subs del form value', search)
          this.strtemp = search;
          this.iucndetails$.next(search);
        }
      });

    const tiempo = interval(1000).pipe(take(6));
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
    this.projobj = null;
    this.formProyecto = null;
    this.registerForm.reset();
  }

}
