import { Injectable } from '@angular/core';
import dbFaunas from '../../assets/dbFauna.json';
import detallesProyectos from '../../assets/detalles.json';
import {Observable, of} from 'rxjs';
import dbProjects from '../../assets/dbProjects.json';

@Injectable({
  providedIn: 'root'
})
export class GetProjectsService {

  public proyectos = dbProjects;

  constructor() { }

  public getProyectos(): Observable<any> {
    const proyectos$ = this.proyectos
    return of(proyectos$)
  }

}
