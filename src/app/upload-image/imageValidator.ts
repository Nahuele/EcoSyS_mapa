import {FileItem} from './models/file-item';

export class ImageValidator {
  private acceptType = ['image/jpeg', 'image/png', 'image/jpg'];

  // valida q solo sean jpeg y png
  validateType(fileType : string):boolean {
    return fileType === '' || fileType === undefined ? false : this.acceptType.includes(fileType);
  }
  // valida q no suban 2 veces el mismo archivo
  checkDropped(fileName: string, files:FileItem[]):boolean {
    for (const file of files) {
      if (file.name === fileName) {
        return true;
      }
    }
    return false;
  }
}
