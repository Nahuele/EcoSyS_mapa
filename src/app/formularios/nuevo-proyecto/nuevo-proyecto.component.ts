import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProyectoService} from '../../editar-db/proyecto.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {AuthService} from '../../editar-db/auth/auth.service';
import {first, skip, switchMap, take, takeWhile} from 'rxjs/operators';
import {AlertComponent} from 'ngx-bootstrap/alert';
import {BehaviorSubject, concat, interval} from 'rxjs';
import {IucnApiService} from '../iucn-api.service';
import {Router} from '@angular/router';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {Location} from '@angular/common';

import {
  areasTemBiodiversidad,
  areasTemAgroecologico,
  areastemAmbienteysoc,
  campoAplicacBiodiversidad,
  campoAplicacSocYamb
} from '../campos-formulario';
import {MapCoordComponent} from '../map-coord/map-coord.component';

@Component({
  selector:    'app-nuevo-proyecto',
  templateUrl: './nuevo-proyecto.component.html',
  styleUrls:   ['./nuevo-proyecto.component.scss']
})


export class NuevoProyectoComponent implements OnInit, OnDestroy {
  disabled = false;
  // esto es para test del multiselect dropdown
  lista_areas_tem = [];
  lista_campo_aplicacion = [];
  selected_items_areas_tem = [];
  selected_items_campo_aplica = [];
  dropdownSettings = {};
  openMapCoordModal: BsModalRef;
  coordsFromMapa;

  constructor(private formBuilder: FormBuilder,
              public proyectoService: ProyectoService,
              private modalService: BsModalService,
              public iucnService: IucnApiService,
              private router: Router,
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
  public userUid$ = new BehaviorSubject('');
  public iucndetalles;
  public iucndetalleslist = {};
  strtemp = '';
  public listavideosFromDB;
  public listasppFromDB;
  public listapersonalFromDb;
  public listacoordenadasFromDb;
  iucndetails$ = new BehaviorSubject('');

  public alerta = false;

  alerts: any[] = [{
    type:    'success',
    msg:     `Gracias! se ha agregado el proyecto a la base de datos. Redirigiendo a Tus Proyectos ...`,
    timeout: 3000
  }];


  registerForm = this.formBuilder.group({
    email:        ['', [Validators.required, Validators.email]],
    tipo_enfoque: ['' , Validators.required],
    nombre:       ['', Validators.required],
    // areas_tematicas: this.formBuilder.array([]),
    institucion:        [''],
    titulo_extendido:   [''],
    descripcion:        [''],
    telefono_contacto:  [''],
    resumen:            [''],
    tipo_estudio:       [''],
    tipo_produccion:    [''],
    nombre_sitio:       [''],
    alcance_geografico: [''],
    redes_sociales:     this.formBuilder.group({
      facebook:  [''],
      instagram: [''],
      twitter:   [''],
      youtube:   [''],
      otra:      [''],
    }),
    pais:               [''],
    provincia:          [''],
    localidad_cercana:  [''],
    estado_actual:      [''],
    coordenadas:        this.formBuilder.array([]), // , Validators.required
    ano_inicio:         [''],
    web:                [''],
    tipo_sitio:         [''],
    resultados:         [''],
    palabras_clave:     [''],
    linksvideos:        this.formBuilder.array([]),
    personal:           this.formBuilder.array([]),
    especies:           this.formBuilder.array([])

  });

  ngOnInit() {
    this.userUid$.next(this.authService.userid);

    if (this.proyectoService.selectedProject && this.proyectoService.selectedProject.detalles) {
      console.log('se seeleleeciono uno');
      console.log(this.proyectoService.selectedProject.detalles);
      const objetoFromService = this.proyectoService.selectedProject.detalles;

      objetoFromService.linksvideos && objetoFromService.linksvideos.length > 0 ? this.listavideosFromDB = objetoFromService.linksvideos : this.listavideosFromDB = [];
      objetoFromService.especies && objetoFromService.especies.length > 0 ? this.listasppFromDB = objetoFromService.especies : this.listasppFromDB = [];
      objetoFromService.personal && objetoFromService.personal.length > 0 ? this.listapersonalFromDb = objetoFromService.personal : this.listapersonalFromDb = [];
      objetoFromService.coordenadas && objetoFromService.coordenadas.length > 0 ? this.listacoordenadasFromDb = objetoFromService.coordenadas : this.listacoordenadasFromDb = [];
      objetoFromService.areas_tematicas && objetoFromService.areas_tematicas.length > 0 ? this.selected_items_areas_tem = objetoFromService.areas_tematicas : this.selected_items_areas_tem = [];
      objetoFromService.campo_aplicacion && objetoFromService.campo_aplicacion.length > 0 ? this.selected_items_campo_aplica = objetoFromService.campo_aplicacion : this.selected_items_campo_aplica = [];
    }
    // multi select dropdown areas tematicas
    this.dropdownSettings = {
      singleSelection:                false,
      selectAllText:                  'Seleccionar todo',
      unSelectAllText:                'Deseleccionar todo',
      enableCheckAll:                 false,
      itemsShowLimit:                 3,
      noDataAvailablePlaceholderText: "Seleccione Tipo",
      allowSearchFilter:              false
    };
    // esto revisa cambios en tiempo real del form, los elif son para borrar cuando cambio de tipo_enfoque y no borrar si ya lo tiene cargado
    // this.registerForm.valueChanges.subscribe(x => { // .pipe(skip(1))

    this.onChangeTipoEnfq();

  }

  onChangeTipoEnfq() {
    this.registerForm.get('tipo_enfoque').valueChanges.subscribe(enfq => {
      console.log(enfq);
      this.lista_areas_tem = enfq === 'Conservación de la biodiversidad' ? areasTemBiodiversidad : enfq === 'Ambiente y sociedad' ? areastemAmbienteysoc :
        enfq === 'Experiencias agroecológicas' ? areasTemAgroecologico : [];
      this.lista_campo_aplicacion = enfq === 'Conservación de la biodiversidad' ? campoAplicacBiodiversidad : enfq === 'Ambiente y sociedad' ? campoAplicacSocYamb : [];
      if (this.proyectoService.selectedProject && this.proyectoService.selectedProject.detalles) {
        console.log('ejecutada, hay proyecto');
        if (enfq !== this.proyectoService.selectedProject.detalles.tipo_enfoque && enfq !== null && enfq.length !== 0) {
          console.log('son diferentes', enfq, '///', this.proyectoService.selectedProject.detalles, '///');
          this.selected_items_areas_tem = [];
          this.selected_items_campo_aplica = [];
        } else {
          this.selected_items_areas_tem = this.proyectoService.selectedProject.detalles.areas_tematicas;
          this.selected_items_campo_aplica = this.proyectoService.selectedProject.detalles.campo_aplicacion;
        }
      } else {
        console.log('borrando');
        this.selected_items_areas_tem = [];
        this.selected_items_campo_aplica = [];
      }
    });


  }

  submit() {
    let formProyectoFinal = {};
    // 2) Nested: actualizar el objeto final
    formProyectoFinal['detalles'] = this.removeEmptyFields(this.registerForm.value);
    formProyectoFinal['userUid'] = this.userUid$.value;
    formProyectoFinal['detalles'].fecha_modificacion = new Date().toLocaleString();

    this.proyectoService.selectedProject ? formProyectoFinal['id'] = this.proyectoService.selectedProject.id : null;

    // cargar el anterior
    if (this.proyectoService.selectedProject) {
      const videosFinal = [...this.listavideosFromDB, ...this.registerForm.value.linksvideos];
      const especiesFinal = [...this.listasppFromDB, ...this.registerForm.value.especies];
      const personalFinal = [...this.listapersonalFromDb, ...this.registerForm.value.personal];
      const coordsFinal = [...this.listacoordenadasFromDb, ...this.registerForm.value.coordenadas];
      formProyectoFinal['detalles']['linksvideos'] = videosFinal;
      formProyectoFinal['detalles']['especies'] = especiesFinal;
      formProyectoFinal['detalles']['personal'] = personalFinal;
      formProyectoFinal['detalles']['coordenadas'] = coordsFinal;
      formProyectoFinal['detalles']['fecha_modificacion'] = new Date();
    }

    formProyectoFinal['detalles']['areas_tematicas'] = this.selected_items_areas_tem;
    formProyectoFinal['detalles']['campo_aplicacion'] = this.selected_items_campo_aplica;

    console.log(formProyectoFinal['detalles']);

    formProyectoFinal['id'] ? this.proyectoService.editarProject(formProyectoFinal) : this.proyectoService.addProject(formProyectoFinal);

    this.alerta = true;
    // window.scrollTo(0, 0);
    setTimeout(() => {
      this.router.navigate(['proyectos']);
    }, 3000);
  }

  removeEmptyFields(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) => value === null ? undefined : value === '' ? undefined : value === undefined ? undefined : value.length === 0 ? undefined : value));
  }

  borrarForm() {
    this.registerForm.reset();
    this.selected_items_areas_tem = [];
    this.selected_items_campo_aplica = [];
    this.linksvideos.controls.splice(0, this.linksvideos.length);
    this.especies.controls.splice(0, this.especies.length);
    this.personal.controls.splice(0, this.personal.length);
    this.listasppFromDB = [];
    this.listacoordenadasFromDb = [];
    this.listavideosFromDB = [];
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
    if (target === 'anterior' && indice !== -1) {
      if (asignarForm === 'videos') {
        this.listavideosFromDB.splice(indice, 1);
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
      profesion:               '',
      especialidad:            '',
      genero:                  '',
      fecha_nacimiento:        '',
      pais_residencia:         '',
      provincia_residencia:    '',
      email_personal:          [''], // , Validators.email
      redes_sociales_personal: this.formBuilder.group({
        facebook:     [''],
        instagram:    [''],
        twitter:      [''],
        youtube:      [''],
        researchgate: [''],
        otra:         [''],
      })
    });
    this.personal.push(personalFormGroup);
  }

  agregarEspecie() {
    const especiesFormGroup = this.formBuilder.group({
      spob:          [''],
      nombre_vulgar: [''],
      nombre_ingles: [''],
      tso:           ['']
    });
    this.especies.push(especiesFormGroup);
  }

  agregarCoordenadas(mapacor: TemplateRef<any>) {
    this.openMapCoordModal = this.modalService.show(mapacor, Object.assign({}, {class: 'modal-xl'}));
    this.coordsFromMapa = null;
  }

  getCoordsFromMapa(event) {
    // este evento viene del child component, me trae las coordenadas luego de dar click en el mapa
    this.coordsFromMapa = event;
    if (this.coordsFromMapa) {
      const coordenadasFormGroup = this.formBuilder.group({
        latitud:         this.coordsFromMapa.lat.toString(),
        longitud:        this.coordsFromMapa.lng.toString(),
        datos_del_sitio: this.formBuilder.group({
          pais:               [''],
          provincia:          [''],
          localidad_cercana:  [''],
          nombre_sitio:       [''],
          tipo_sitio:         [''],
          alcance_geografico: [''],
        })
      });
      this.openMapCoordModal.hide();
      this.coordenadas.push(coordenadasFormGroup);
    }
  }

  onClosed(dismissedAlert: AlertComponent) {
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
    concat(tiempo, this.iucndetails$).subscribe(x => {
      if (typeof x === 'string') {
        const detalleFromSv = this.iucnService.busquedaApi(x).subscribe(y => {
          this.iucndetalleslist[x] = y.result[0];
        });
      }
    });
  }

  onItemSelect(item: any) {
    // console.log('arreglar areas tematicas y forms!')
    // console.log(this.selected_items_areas_tem);
    // console.log(this.selected_items_campo_aplica);
  }

  ngOnDestroy() {
    this.projobj = null;
    this.registerForm.reset();
    this.proyectoService.selectedProject = null;
  }

}
