import { Component, OnInit } from '@angular/core';
import {AuthService} from '../editar-db/auth/auth.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  public uid: string;

  public user$: Observable<any> = this.authService.afAuth.user;
  constructor(private authService: AuthService,
              private router: Router) { }

  async ngOnInit() {
    // this.user$.subscribe(data => this.uid = data.uid)
  }

  async onLogout() {
    try {
      this.authService.logout();
      this.router.navigate(['/'])
    }
    catch (e) {
      console.log(e);
    }
  }

}
