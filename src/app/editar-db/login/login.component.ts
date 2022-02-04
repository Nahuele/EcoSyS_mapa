import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {auth} from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  mensaje;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  async onLogin() {
    const {email, password} = this.loginForm.value;
    try {
      const user = await this.authService.login(email, password);
      console.log(user)
      if (user) {
        if (user['a'] && user.emailVerified) {
          this.router.navigate(['/proyectos']);
          this.mensaje = user['message'];
          console.log('proyect')
        } else if (user['a'] && !user.emailVerified) {
          this.mensaje = user['message'];
          console.log('verif')
          this.router.navigate(['/verifemail']);
        } else {
          this.mensaje = user['message'];
        }
      }
    }
    catch (e) {
      this.mensaje = e;
      console.log(e);
    }
}
  onLoginFacebook() {
    this.authService.afAuth.signInWithPopup( new auth.FacebookAuthProvider());
  }


}
