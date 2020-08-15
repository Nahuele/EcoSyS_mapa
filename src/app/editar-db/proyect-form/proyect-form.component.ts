import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProyectoService} from '../proyecto.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {AlertComponent} from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-proyect-form',
  templateUrl: './proyect-form.component.html',
  styleUrls: ['./proyect-form.component.css']
})
export class ProyectFormComponent implements OnInit {

  public alerta: boolean = false;
  alerts: any[] = [{
    type: 'success',
    msg: `Gracias! se ha agregado el proyecto a la base de datos`,
    timeout: 3000
  }];

  constructor(private formBuilder: FormBuilder,
              private proyectoService: ProyectoService,
              private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  registerSpForm = this.formBuilder.group({
    especies: this.formBuilder.array([])})

  registerForm = this.formBuilder.group({
    projectid: [''], // , [Validators.required, Validators.minLength(8)]
    email: [''], //, [Validators.required, Validators.email]
    tipo_enfoque: ['', Validators.required], //, Validators.required
    nombre: [''],
    enfoque: [''],
    institucion: [''],
    titulo_extendido: [''],
    descripcion: [''],
    resumen: [''],
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
    coordenadas: [''], // , Validators.required
    ano_inicio: [''],
    web: [''],
    tipo_sitio:[''],
    resultados:[''],
    linksfotos: this.formBuilder.array([]),
    personal: this.formBuilder.array([])

  })

  submit() {
    const formProyecto = this.removeEmptyFields(this.registerForm.value)
    const formProyectoFinal = {};
    formProyectoFinal[formProyecto['projectid']] = formProyecto
    const formEspecies = this.removeEmptyFields(this.registerSpForm.value)
    const formEspeciesFinal = {};
    formEspeciesFinal[formProyecto['projectid']] = formEspecies
    console.log(formEspeciesFinal);
    this.proyectoService.addProject(formProyectoFinal);
    this.proyectoService.addEspecies(formEspeciesFinal);
    this.borrarForm();
    this.alerta = true;
    window.scrollTo(0,0)
  }

  isEmpty(value) {
    if (value === null)
      return true;

    if (typeof value == 'object' && Object.keys(value).length === 0)
      return true;

    if (typeof value == 'string' && value.trim() == '')
      return true;

    return false;
  }

  removeEmptyFields(input) {
    if (Array.isArray(input)) {
      for (let index = input.length - 1; index >= 0; index--) {
        if (typeof input[index] == 'object') {
          this.removeEmptyFields(input[index]);
        }
        if (this.isEmpty(input[index])) {
          input.splice(index, 1);
        }
      }
    } else {
      for (let index in input) {
        if (typeof input[index] == 'object') {
          this.removeEmptyFields(input[index]);
        }
        if (this.isEmpty(input[index])) {
          delete input[index];
        }

      }

    }
    return input
  }

  get projectid() {
    return this.registerForm.get('projectid')
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
    return this.registerSpForm.get('especies') as FormArray;
  }

  borrarForm() {
    this.registerForm.reset();
    this.linksfotos.controls.splice(0, this.linksfotos.length);
    this.especies.controls.splice(0,this.especies.length);
    this.personal.controls.splice(0, this.personal.length);
  }

  agregarlinkimg() {
    let linksFormGroup = this.formBuilder.group({
      link: '',
      descripcion: '',
    });
    this.linksfotos.push(linksFormGroup);
  }
  removerlinkimg(indice:number) {
    this.linksfotos.removeAt(indice);
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
    // console.log(this.especies.value);
  }
  removerEspecie(indice: number) {
    this.especies.removeAt(indice)
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
    this.alerta = false;
  }
}
