import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config.service';
import { mergeMap, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Injectable()
export class GodownTypesResolver implements Resolve<any> {
    url;
    pipesUrl;
    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private auth: AuthService
    ) {
        this.url = this.config.getAbsoluteUrl('godownTypes');
        this.pipesUrl = this.config.getAbsoluteUrl('pipeCount');
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.http.get(this.url).pipe(mergeMap(response => {
            const goDowns = response;
            return this.http.get(this.pipesUrl + '/' + this.auth.userid + '/' + response[1].godown_id).pipe(map((pipes) => {
                return {goDowns, pipes, godownId: response[1].godown_id}
            }))
            // return of(response);
        }));
    }
}