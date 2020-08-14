import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css'],
})
export class ResetPassComponent implements OnInit {

  userEmail = new FormControl('');

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  async onResetPass() {
    try {
      console.log('reset email');
      const email = this.userEmail.value;
      await this.authService.resetPass(email);
      window.alert('Se ha enviado email, revisa tu bandeja de entrada');
      this.router.navigate(['/login'])
    }
    catch (e) {
      console.log(e);
    }
  }
}
