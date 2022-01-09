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

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }
  async onLogin() {
    const {email,password} = this.loginForm.value;
    try {
      const user = await this.authService.login(email,password);
      if (user && user.emailVerified) {
        // redirect to project
        this.router.navigate(['/proyectos']);
      } else if (user) {
        this.router.navigate(['/verifemail']);
      } else {
        this.router.navigate(['/register']);
      }
    }
    catch (e) {
      console.log(e);
    }
}
  onLoginFacebook() {
    this.authService.afAuth.signInWithPopup( new auth.FacebookAuthProvider());
  }


}
