import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  isAuthenticated = false;
  email: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.userBehaviorSubject.subscribe(
      user => {
        this.isAuthenticated = !!user;
        if (user) {
          this.email = user.email;
        }        
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
