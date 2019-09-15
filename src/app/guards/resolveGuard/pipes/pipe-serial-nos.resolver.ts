import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from 'protractor';
import { ConfigService } from '../../../services/config.service';
import { PIPES } from '../../../data/pipes';
import { AppService } from '../../../services/app.service';


export class PipeSerialNosResolver implements Resolve<any>{
    url;
    constructor(
        private auth: AuthService,
        private http: HttpClient,
        private config: ConfigService,
        private app: AppService
    ) {
        this.url = this.config.getAbsoluteUrl('pipeSerialNos');
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const pipeSize = route.paramMap.get('pipeSize');
        const pipeName = route.paramMap.get('pipeName');
        let params = new HttpParams().set('user_id', this.auth.userid);
        params = params.append('pipe_size', pipeSize);
        params = params.append('gudown_id', this.app.selectedGodownId.toString());
        return this.http.get(this.url, { params })
    }
}