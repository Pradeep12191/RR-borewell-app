import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from 'protractor';
import { ConfigService } from '../../../services/config.service';
import { PIPES } from '../../../data/pipes';
import { AppService } from '../../../services/app.service';


export class PipeDataResolver implements Resolve<any>{
    url;
    constructor(
        private auth: AuthService,
        private http: HttpClient,
        private config: ConfigService,
        private app: AppService
    ) {
        this.url = this.config.getAbsoluteUrl('PipeData');
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const pipeSize = route.paramMap.get('pipeSize');
        const start = '0';
        const end = '100';

        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('pipe_size', pipeSize)
            .append('start', start)
            .append('end', end);
        return this.http.get(this.url, { params })
    }
}