import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';

import '../../node_modules/bootstrap/dist/js/bootstrap.min';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
