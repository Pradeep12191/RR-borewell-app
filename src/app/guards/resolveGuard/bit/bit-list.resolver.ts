import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { mergeMap, map } from 'rxjs/operators';
import { AppService } from '../../../services/app.service';

export class BitListResolver implements Resolve<any>{
    constructor(
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService,
        private app: AppService
    ) {
        this.bitsUrl = this.config.getAbsoluteUrl('BitList');
        this.godownsUrl = this.config.getAbsoluteUrl('godownTypes');
    }

    bitsUrl;
    godownsUrl;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.http.get(this.godownsUrl).pipe(mergeMap(response => {
            const godowns = response;
            if (!this.app.selectedGodownId) {
                this.app.selectedGodownId = response[1].godown_id;
            }
            let params = new HttpParams().set('user_id', this.auth.userid).append('gudown_id', this.app.selectedGodownId.toString())
            return this.http.get(this.bitsUrl, { params }).pipe(map((bits) => {
                return { godowns, bits, godownId: this.app.selectedGodownId }
            }))
        }));
    }
}