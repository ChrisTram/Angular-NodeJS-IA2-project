import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService,
              private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // si on renvoie true ça dira qu'on autorise la navigation
    // si false : refusé.
    // on va associé ce guard avec la définition des routes dans le module.
      //return true;

      return this.authService.isAdmin()
      .then((authentifie:boolean) => {
        if(authentifie) {
          return true; // on autorise la navigation
        } else {
          this.router.navigate(["/home"]);
          return false;
        }
      })
  }

}
