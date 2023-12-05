import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService, AuthResponse } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  signUpMode: boolean = false;
  isLoading: boolean = false;

  isError: boolean = false;
  erroMessage: string;

  authForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  onSwitchMode() {
    this.signUpMode = !this.signUpMode;
  }

  onSubmit() {
    if(!this.authForm.valid) {
      return;
    }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    let authObservable: Observable<AuthResponse>;

    this.isLoading = true;

    if (this.signUpMode) {   
      authObservable = this.authService.signUp(email, password);
    } else {
      authObservable = this.authService.login(email, password);
    }

    authObservable.subscribe({
      next: (authResponse) => {
        this.router.navigate(['/products']);
    },
      error: (error) => {
        this.isError = true;
        this.erroMessage = error.message;
      }
    });    
   
    this.isLoading = false;
    this.authForm.reset();
  }

  ngOnInit() {
    this.initForm();
  }

  onCloseAlert() {
    this.isError = false;
    this.erroMessage = null;
  }

  private initForm() {
    this.authForm = new FormGroup({
      email: new FormControl('admin@gmail.com', [Validators.required, Validators.email]),
      password: new FormControl('123456', [Validators.required, Validators.minLength(6)])
    });
  }
}