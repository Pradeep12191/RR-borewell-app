import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../../services/config.service';
import { mergeMap, switchMap, map } from 'rxjs/operators';
import { of, zip } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { AppService } from '../../../services/app.service';
import { Pipe } from '../../../models/Pipe';
import { Godown } from '../../../post-login/pipe/Godown';

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
        return this.http.get<Godown[]>(this.url).pipe(mergeMap(response => {
            const goDowns = response;
            this.app.selectedGodownId = 'all'
            // if (!this.app.selectedGodownId) {
            // }
            let allParams = new HttpParams().set('user_id', this.auth.userid).append('gudown_id', this.app.selectedGodownId.toString())
            const rrParams = { user_id: this.auth.userid, gudown_id: '2' };
            const mmParams = { user_id: this.auth.userid, gudown_id: '1' };
            const all$ = this.http.get<Pipe[]>(this.pipesUrl, { params: allParams });
            const rr$ = this.http.get<Pipe[]>(this.pipesUrl, { params: rrParams });
            const mm$ = this.http.get<Pipe[]>(this.pipesUrl, { params: mmParams });
            return zip(all$, rr$, mm$).pipe(map(([allPipes, rrPipes, mmPipes]) => {
                return { goDowns, allPipes, rrPipes, mmPipes, godownId: this.app.selectedGodownId }
            }))
            // return of(response);
        }));
    }
}