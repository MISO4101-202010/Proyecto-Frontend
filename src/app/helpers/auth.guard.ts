import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) { }

    cookieValue: string;

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var currentUser = JSON.parse(sessionStorage.getItem('userConectaTe'));
        if (currentUser != null) {
            console.log("Entra Authguard")
            // check if route is restricted by role
            console.log("Entra: " + currentUser.isAlumno)
            if ( currentUser.isAlumno === true ) {
                // role not authorised so redirect to home page
                this.router.navigate(['/']);
                return false;
            }

            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}