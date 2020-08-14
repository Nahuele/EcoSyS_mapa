import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  projectsCollection: AngularFirestoreCollection;
  especiesCollection: AngularFirestoreCollection;
  proyectos: Observable<any>;
  proyectoDoc: AngularFirestoreDocument;
  especies: Observable<any>;

  constructor(public db: AngularFirestore) {
    this.projectsCollection = this.db.collection('proyectos_detalles')
    // this.proyectos = this.db.collection('proyectos_detalles').valueChanges();
    // this.especies = this.db.collection('especies').valueChanges();
    this.proyectos = this.projectsCollection.snapshotChanges()
      .pipe( // esto es para traer el ID , las de arriba no traian
        map(actions => {
          return actions.map(propiedad => {
            const data = propiedad.payload.doc.data();
            data.id = propiedad.payload.doc.id;
            return data;
          });
        }));
    // this.especiesCollection = this.db.collection('especies')
    // this.especies = this.projectsCollection.snapshotChanges()
    //   .pipe( // esto es para traer el ID , las de arriba no traian
    //     map(actions => {
    //       return actions.map(propiedad => {
    //         const data = propiedad.payload.doc.data();
    //         data.id = propiedad.payload.doc.id;
    //         return data;
    //       });
    //     }));
  }

  getProjects() {
    return this.proyectos;
  };

  getEspecies() {
    return this.especies;
  };
  addProject(project, especies?) {
   this.projectsCollection.add(project);
   // this.especiesCollection.add(especies);
  }
  deleteProject(proyecto) {
    // encuentro el proyecto basado en el id
    this.proyectoDoc = this.db.doc(`proyectos_detalles/${proyecto.id}`)
    // elimino el proyecto
    this.proyectoDoc.delete();
  }
}
