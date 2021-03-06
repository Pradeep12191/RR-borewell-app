import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PipeTypeResolver implements Resolve<any>{
    constructor(
        private config: ConfigService,
        private http: HttpClient
    ) {
        const baseUrl = this.config.getConfig('apiUrl');
        const url = this.config.getUrl('getpipe_type');
        this.pipeTypeUrl = baseUrl + url; 
    }

    pipeTypeUrl;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.http.get(this.pipeTypeUrl)
    }
}