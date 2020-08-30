import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadImageRoutingModule } from './upload-image-routing.module';
import { UploadImageComponent } from './upload-image.component';
import { DirectivaimagenDirective } from './directives/directivaimagen.directive';


@NgModule({
  declarations: [UploadImageComponent, DirectivaimagenDirective],
  imports: [
    CommonModule,
    UploadImageRoutingModule
  ]
})
export class UploadImageModule { }
