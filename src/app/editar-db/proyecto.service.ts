import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFireModule} from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  public projectsCollection: AngularFirestoreCollection;
  public proyectos: Observable<any>;
  public proyectoDoc: AngularFirestoreDocument;
  public selectedProject = {
    id: null
  };

  constructor(public db: AngularFirestore,
              public DB: AngularFireModule,
  ) {

    this.projectsCollection = this.db.collection('proyectos_detalles');
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

  }

  getProjects() {
    return this.proyectos;
  };

  addProject(project) {
    this.projectsCollection.add(project);
  }

  editarProject(project) {
    let idProj = project.id;
    this.proyectoDoc = this.db.doc(`proyectos_detalles/${idProj}`);
    this.proyectoDoc.update(project);
  }

  deleteProject(project) {
    // encuentro el proyecto basado en el id
    this.proyectoDoc = this.db.doc(`proyectos_detalles/${project.id}`);
    this.proyectoDoc.delete();
  }


}
