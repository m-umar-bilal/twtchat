import { Injectable } from '@angular/core';
// import {
//   Router, CanActivate,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot
// } from '@angular/router';

// Service to handle session or current user
@Injectable()
export class AuthGuard {

    constructor() { }

    /**
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns
     *
     * @function AuthGuard
     * Method to let the user go to the dashboard is the session is active
     */
    public canActivate() {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        // this.router.navigate(['/home']);
        // return false;
    }
}
