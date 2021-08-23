import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {map, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanEditGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean  {
    return this.authService.user$.pipe(
      take(1),
      map((user) => user && this.authService.isEditor(user)),
        tap((canEdit) => {
          if (!canEdit) {
            window.alert('Acceso denegado! Si ya confirmó el correo electrónico cierre sesión y vuelva a loguear.')
          }
        })
    );
  }

}
