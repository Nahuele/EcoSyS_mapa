import { Injectable } from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {FileItem} from './models/file-item';
import {finalize} from 'rxjs/operators';

@Injectable()

export class StorageService {

  private MEDIA_STORAGE_PATH = 'uploads';

  constructor(private readonly storage: AngularFireStorage) { }

  uploadImage(images: FileItem[], idNewProject, idUser) {
    for (const item of images) {
      item.uploading = true;

      const filePath = this.generateFileName(item.name, idNewProject, idUser);
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, item.file,);
      item.uploadPercent = task.percentageChanges();
      task.snapshotChanges().pipe(
        finalize( () => {
          item.downloadURL = fileRef.getDownloadURL();
          item.uploading = false;
        })
      ).subscribe();
    }
  }

  private generateFileName(name: string, idNewProject: string, idUser: string):string {
    console.log('GENERADO FILE NAME 2', idNewProject)
    return `${this.MEDIA_STORAGE_PATH}/${idUser}/${idNewProject}/${new Date().getTime()}_${name}`
  }

  public getImages(projectId: string, userID: string) {
    const filePath = this.storage.storage.ref(`uploads/${userID}/${projectId}`);
    let imgList = [];
    // Now we get the references of these images
    filePath.listAll().then(function(result) {
      result.items.forEach(function(imageRef) {
        // And finally display them
        imageRef.getDownloadURL().then(function(url) {
          imgList.push(url);
          // console.log('la url', url)
        }).catch(function(error) {
          // Handle any errors
        });
      });
    }).catch(function(error) {
      // Handle any errors
    });
    return imgList;
  }
}
