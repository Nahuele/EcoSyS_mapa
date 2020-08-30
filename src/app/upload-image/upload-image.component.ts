import { Component, OnInit } from '@angular/core';
import {FileItem} from './models/file-item';
import {StorageService} from './storage.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  providers: [StorageService]
})
export class UploadImageComponent implements OnInit {

  files: FileItem[] = [];
  isOverDrop = false;
  constructor(private readonly storageSvc: StorageService) { }

  ngOnInit(): void {
  }

  onUpload(): void {
    this.storageSvc.uploadImage(this.files);
  }
}
