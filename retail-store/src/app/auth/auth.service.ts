import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'

import { User } from './user.model';

import { environment } from '../../environments/environment';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface UserLocalStore {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  userBehaviorSubject = new BehaviorSubject<User>(null);
  
  private tokenExpirationTimer: any;
  
  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  signUp(email: string, password: string) {
    // const apiKey = 'AIzaSyAKj-czPsFfHPoJtYCI1uB8KiDjABk-UR0';
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseWebApiKey}`;

    const signUpBody = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http
    .post<AuthResponse>(signUpUrl, signUpBody)
    .pipe(
      tap(authResponse => {
        this.handleAuthentication(authResponse);
      }),
      catchError(this.handleError)
    )
  }

  login(email: string, password: string) {
    // const apiKey = 'AIzaSyAKj-czPsFfHPoJtYCI1uB8KiDjABk-UR0'
    const loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseWebApiKey}`;

    const loginBody = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http
    .post<AuthResponse>(loginUrl, loginBody)
    .pipe(
      tap(authResponse => {
        this.handleAuthentication(authResponse);
      }),
      catchError(this.handleError)
    )
  }

  autoLogin() {
    const userLocalStored: UserLocalStore = JSON.parse(localStorage.getItem('userLocalStore'));
    if(!userLocalStored) {
      return;
    }    

    const userStored = new User(
      userLocalStored.email,
      userLocalStored.id,
      userLocalStored._token,
      new Date(userLocalStored._tokenExpirationDate)
    );
    if(userStored.token) {
      this.user = userStored;
      this.userBehaviorSubject.next(this.user);

      const expirationDuration = new Date(userLocalStored._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout() {
    localStorage.removeItem('userLocalStore');
    
    this.user = null;
    this.userBehaviorSubject.next(this.user);

    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;

    this.router.navigate(['/auth']);
  }

  private handleAuthentication(authResponse: AuthResponse) {
    const email = authResponse.email;
    const id = authResponse.localId;
    const _token = authResponse.idToken;
    const _tokenExpirationDate = new Date(
      (new Date().getTime()) + (+authResponse.expiresIn * 1000)
    );    
    const user = new User(email, id, _token, _tokenExpirationDate);

    localStorage.setItem('userLocalStore', JSON.stringify(user));

    this.user = user;
    this.userBehaviorSubject.next(this.user);

    
    const expirationDuration = +authResponse.expiresIn * 1000;
    this.autoLogout(expirationDuration);
  }
  
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Đã xảy ra lỗi không xác định!';
    if(!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email đã tồn tại.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Thông tin đăng nhập không hợp lệ.';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }
}