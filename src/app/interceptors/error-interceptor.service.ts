import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../services/loader-service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
    constructor(
        @Inject(forwardRef(() => LoaderService)) private loader: LoaderService,
        private toastr: ToastrService,
        private router: Router
    ) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
            this.loader.hideLoader();
            this.loader.hideSaveLoader();
            if (err.error instanceof ErrorEvent) {
                // client side error
                this.toastr.error('Check your internet connection', 'Error', { timeOut: 2000 })
            } else {
                // server side error
                if (err.status === 404) {
                    if (req.url.indexOf('login') !== -1) {
                        this.toastr.error('Service unavilable at this moment', "Error", { timeOut: 2000 })
                    } else {
                        this.toastr.error('Service unavilable at this moment', "Error", { timeOut: 2000 })
                        this.router.navigate(['/postlogin/error']);
                    }
                    return throwError(null)
                }
                if (err.status === 0) {
                    if (req.url.indexOf('login') !== -1) {
                        this.toastr.error('Unknown Error occured', "Error", { timeOut: 2000 })
                    } else {
                        this.router.navigate(['/postlogin/error']);
                    }
                }
            }
            return throwError(err)
        }));
    }
}