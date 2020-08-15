import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {from, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import * as firebase from 'firebase';
import {AngularFireModule} from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  public projectsCollection: AngularFirestoreCollection;
  public especiesCollection: AngularFirestoreCollection;
  public proyectos: Observable<any>;
  public proyectoDoc: AngularFirestoreDocument;
  public especiesDoc: AngularFirestoreDocument;
  public especies: Observable<any>;

  constructor(public db: AngularFirestore, public DB: AngularFireModule) {
    this.projectsCollection = this.db.collection('proyectos_detalles')
    this.proyectos = this.projectsCollection.snapshotChanges()
      .pipe( // esto es para traer el ID , las de arriba no traian
        map(actions => {
          return actions.map(propiedad => {
            const data = propiedad.payload.doc.data();
            data.projectID = Object.keys(data);
            data.id = propiedad.payload.doc.id;
            return data;
          });
        }));
    this.especiesCollection = this.db.collection('especies')

    this.especies = this.especiesCollection.snapshotChanges()
      .pipe(map(actions => {
          return actions.map(propiedad => {
            const data = propiedad.payload.doc.data();
            data.projectID = Object.keys(data);
            data.id = propiedad.payload.doc.id;
            return data;
          });
        }));
  }

  getProjects() {
    return this.proyectos;
  };

  getEspecies() {
    // this.especies.subscribe( data => console.log(data))
    // return this.especiesCollection
    return this.especies;
  };
  addProject(project) {
   this.projectsCollection.add(project);
  }
  addEspecies(especies) {
    if (especies) {
      this.especiesCollection.add(especies);
    }
  }

  deleteProject(project) {
    // encuentro el proyecto basado en el id
    this.proyectoDoc = this.db.doc(`proyectos_detalles/${project.id}`);
    const projectId = project.projectID;
    // ccon esta subscripcion busco en la tabla de sp y borros las q tengan mismo ID del proyecto ! ojo con esto!
    this.especies.subscribe( especie => {
      if (especie.length > 0) {
        for (let indexSp of Object.keys(especie)) {
          const docuSp = especie[indexSp]
          if (projectId in docuSp) {
            this.especiesDoc = this.db.doc(`especies/${docuSp.id}`)
            this.especiesDoc.delete();
          }
        }
      }
    })
    // elimino el proyecto y sp
    this.proyectoDoc.delete();
  }
}
