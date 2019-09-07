import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    private userInfoUrl;
    constructor(
        private auth: AuthService,
        private router: Router,
        private config: ConfigService,
        private http: HttpClient
    ) {
        this.userInfoUrl = this.config.getAbsoluteUrl('userInfo') + '/' + this.auth.username;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean> | Promise<boolean> | boolean {
            if(this.auth.isLoggedIn()){
                return this.http.get(this.userInfoUrl).pipe(switchMap((response) => {
                    return of(true);
                }), catchError((err: HttpErrorResponse) => {
                    if (err.status === 403) {
                        this.auth.userid = null;
                        this.auth.token = null;
                        this.router.navigate(['login']);
                        return of(false);
                    }
                    throwError(err);
                }))                
            }else{
                this.router.navigate(['login']);
                return of(false);
            }

        // if (this.auth.isLoggedIn()) {
        //     return true
        // }
        // this.router.navigate(['login']);
        // return false;
    }
}