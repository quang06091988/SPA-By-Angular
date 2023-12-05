import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.userBehaviorSubject.pipe(
      take(1),
      map(user => {
        const isAuth = !!user;
        if(isAuth) {
          return true;
        }
        return router.createUrlTree(['/auth']);
      })
    );
};
