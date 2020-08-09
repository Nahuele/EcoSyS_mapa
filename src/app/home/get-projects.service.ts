import { Injectable } from '@angular/core';
import dbFaunas from '../../assets/dbFauna.json';
import detallesProyectos from '../../assets/detalles.json';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetProjectsService {

  public dbFauna = dbFaunas;
  public detallesPro = detallesProyectos;

  constructor() { }

  public getFauna(): Observable<any>  {
    const dbFauna$ = this.dbFauna
    console.log('fauna desde serv', dbFauna$);
    return of(dbFauna$)
  }

  public getDetalles(): Observable<any> {
    const detallesPro$ = this.detallesPro
    return of(detallesPro$)
  }

}
