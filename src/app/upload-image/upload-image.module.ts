import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadImageRoutingModule } from './upload-image-routing.module';
import { UploadImageComponent } from './upload-image.component';
import { DirectivaimagenDirective } from './directives/directivaimagen.directive';
import {TooltipModule} from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [UploadImageComponent, DirectivaimagenDirective],
  exports:      [
    UploadImageComponent
  ],
    imports: [
        CommonModule,
        UploadImageRoutingModule,
        TooltipModule
    ]
})
export class UploadImageModule { }
