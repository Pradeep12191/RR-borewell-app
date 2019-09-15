import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../../services/config.service';
import { mergeMap, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { AppService } from '../../../services/app.service';

@Injectable()
export class PipesResolver implements Resolve<any> {
    url;
    pipesUrl;
    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private auth: AuthService,
        private app: AppService
    ) {
        this.url = this.config.getAbsoluteUrl('godownTypes');
        this.pipesUrl = this.config.getAbsoluteUrl('pipeCount');
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.http.get(this.url).pipe(mergeMap(response => {
            const goDowns = response;
            this.app.selectedGodownId = response[1].godown_id;
            let params = new HttpParams().set('user_id', this.auth.userid).append('gudown_id', this.app.selectedGodownId.toString())
            return this.http.get(this.pipesUrl, {params}).pipe(map((pipes) => {
                return {goDowns, pipes, godownId: response[1].godown_id}
            }))
            // return of(response);
        }));
    }
}