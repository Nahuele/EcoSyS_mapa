import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFireModule} from '@angular/fire';
import {AngularFireStorage} from '@angular/fire/storage';
import {StorageService} from '../upload-image/storage.service';



@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  public projectsCollection: AngularFirestoreCollection;
  public proyectos: Observable<any>;
  public proyectoDoc: AngularFirestoreDocument;
  public selectedProject;
  public idProjectSubmitted$ = new BehaviorSubject<any>('0');

  constructor(public db: AngularFirestore,
              public DB: AngularFireModule,
              private storage: AngularFireStorage,
              private storageSvc: StorageService
  ) {
    this.projectsCollection = this.db.collection('proyectos_detalles');
    this.proyectos = this.projectsCollection.snapshotChanges()
      .pipe( // esto es para traer el ID , las de arriba no traian
        map(actions => {
          return actions.map(propiedad => {
            const data = propiedad.payload.doc.data();
            // data.projectID = Object.keys(data);
            data.id = propiedad.payload.doc.id;
            return data;
          });
        }));
  }

  getProjects() {
    return this.proyectos;
  }
  // con el then capturo el id del project una vez que esta finalizada la subida de las fotos
  addProject(project) {
    this.projectsCollection.add(project).then((ref) => {
      this.idProjectSubmitted$.next( ref.id);
      // console.log('Imagen subida en id: ',ref.id)
    });
  }

  editarProject(project) {
    const idProj = project.id;
    this.proyectoDoc = this.db.doc(`proyectos_detalles/${idProj}`);
    this.proyectoDoc.update(project);
  }

  deleteProject(project) {
    // encuentro el proyecto basado en el id
    this.proyectoDoc = this.db.doc(`proyectos_detalles/${project.id}`);
    this.proyectoDoc.delete();
    // borrar fotos
    const storageRef = this.storage.storage.ref();
    // Create a reference, busca el usuario, y el id del proyecto, luego borra all incluso la carpeta
    const folderRef = storageRef.child(`uploads/${project.userUid}/${project.id}`);
    // Now we get the references of these files
    folderRef.listAll().then(function (result) {
      result.items.forEach(function (file) {
        file.delete();
      });
    }).catch(function (error) {
      console.log('error en borrar', error)
    });
  }



}
