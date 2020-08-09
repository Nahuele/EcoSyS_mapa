import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProyectoPageComponent} from './proyecto-page/proyecto-page.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'detalles/:id', component: ProyectoPageComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
