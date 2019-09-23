import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PipeSize } from '../../../models/PipeSize';

@Injectable()
export class PipeSizesResolver implements Resolve<any>{
    constructor(
        private config: ConfigService,
        private http: HttpClient
    ) {
        this.pipeSizesUrl = this.config.getAbsoluteUrl('pipeSizes');
    }

    pipeSizesUrl;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.http.get<PipeSize[]>(this.pipeSizesUrl);
    }
}