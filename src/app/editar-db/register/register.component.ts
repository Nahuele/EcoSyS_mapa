import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {

  mensaje;
  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  async onRegister() {
    const {email, password } = this.registerForm.value;
    try {
      const user = await this.authService.register(email, password);
      console.log(user)
      if (user['a'] && !user.emailVerified) {
        console.log('verificar')
        this.router.navigate(['/verifemail'])
      } else {
        this.mensaje = user['message'];
        // throw new Error('Something bad happened');
        console.log(this.mensaje)
      }
    }
    catch (e) {
      this.mensaje = e;
      console.log(e);
    }

  }
}
