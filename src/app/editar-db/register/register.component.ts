import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  async onRegister() {
    console.log(this.registerForm.value);
    const {email, password } = this.registerForm.value;
    try {
      const user = this.authService.register(email,password);
      if (user) {
        this.router.navigate(['/verifemail'])
      }
    }
    catch (e) {
      console.log(e);
    }

  }
}
