import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FileItem} from '../models/file-item';
import {ImageValidator} from '../imageValidator';

@Directive({
  selector: '[appDirectivaimagen]'
})
export class DirectivaimagenDirective extends ImageValidator {

  @Input() files: FileItem[] = [];
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter();
  // escuchamos cuando raton entra y sale
  @HostListener('dragover', ['$event'])
  onDragEnter(event: any) {
    this.preventAndStop(event);
    this.mouseOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave() {
    this.mouseOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    const dataTransfer = this.getDataTransfer(event);
    if (!dataTransfer) {
      return;
    }
    this.preventAndStop(event);
    this.extractFiles(dataTransfer.files);
    this.mouseOver.emit(false);
  }


  private getDataTransfer(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private extractFiles(fileList: FileList): void {
    for (const property of Object.getOwnPropertyNames(fileList)) {
      const tempFile = fileList[property];
      if (this.canBeUpload(tempFile)) {
        const newFile = new FileItem(tempFile);
        this.files.push(newFile);
      }
    }
  }

  private canBeUpload(file: File): boolean {
    return !this.checkDropped(file.name, this.files) && this.validateType(file.type);
  }

  // previene q se abra navegador cuando se arrastra fichero
  private preventAndStop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
