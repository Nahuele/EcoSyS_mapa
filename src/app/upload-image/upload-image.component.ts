import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FileItem} from './models/file-item';
import {StorageService} from './storage.service';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  providers: [StorageService]
})
export class UploadImageComponent implements OnInit, OnChanges {

  files: FileItem[] = [];
  isOverDrop = false;
  @Input() idNewProject;
  @Input() idUser;
  private obs$;

  constructor(private readonly storageSvc: StorageService) {

  }

  ngOnInit() {
    this.obs$ = from(this.idNewProject) // .pipe((distinctUntilChanged()))
    this.obs$.subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    let idProject = changes['idNewProject'].currentValue
    if (idProject !== '0' && this.idUser.length > 1) {
      this.onUpload(idProject, this.idUser)
    }
  }

  onUpload(idProject: string, idUser: string) {
      this.storageSvc.uploadImage(this.files, idProject, idUser);
  }

  onDestroy() {
  this.obs$.unsubscribe();
  }
}
