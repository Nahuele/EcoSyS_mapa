import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProyectoPageComponent} from './proyecto-page/proyecto-page.component';
import {LoginComponent} from './editar-db/login/login.component';
import {RegisterComponent} from './editar-db/register/register.component';
import {SendEmailComponent} from './editar-db/send-email/send-email.component';
import {ResetPassComponent} from './editar-db/reset-pass/reset-pass.component';
import {CanEditGuard} from './editar-db/auth/can-edit.guard';
import {ProyectosComponent} from './editar-db/proyectos/proyectos.component';
import {NuevoProyectoComponent} from './formularios/nuevo-proyecto/nuevo-proyecto.component';
import {EquipoComponent} from './equipo/equipo.component';
import {AboutComponent} from './acerca-de/about.component';
import {TutorialComponent} from './tutorial/tutorial.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'detalles/:id', component: ProyectoPageComponent},
  {path: 'submitproject', component: NuevoProyectoComponent, canActivate: [CanEditGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verifemail', component: SendEmailComponent},
  {path: 'resetpass', component: ResetPassComponent},
  {path: 'equipo', component: EquipoComponent},
  {path: 'acerca-de', component: AboutComponent},
  {path: 'tutorial', component: TutorialComponent},
  {path: 'proyectos', component: ProyectosComponent, canActivate: [CanEditGuard]},
  { path: 'upload-image', loadChildren: () => import('./upload-image/upload-image.module').then(m => m.UploadImageModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
