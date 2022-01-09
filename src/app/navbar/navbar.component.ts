import { Component, OnInit } from '@angular/core';
import {AuthService} from '../editar-db/auth/auth.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;
  public isLogged: boolean = false;
  public uid: string;

  public user$: Observable<any> = this.authService.afAuth.user;
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.getCurrentUser();
    // this.user$.subscribe(data => this.uid = data.uid)
  }

  onLogout() {
    try {
      this.authService.logout();
      this.router.navigate(['/'])
    }
    catch (e) {
      console.log(e);
    }
  }

  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        console.log('user logged');
        this.isLogged = true;
        this.router.navigate(['/'])
      } else {
        console.log('not logged');
        this.isLogged = false;
      }
    })
  }

}
