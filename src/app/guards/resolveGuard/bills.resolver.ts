import { Resolve } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class BillsResolver implements Resolve<any> {
    billsUrl;
    constructor(
        private config: ConfigService,
        private auth: AuthService,
        private app: AppService,
        private http: HttpClient
    ) {
        this.billsUrl = this.config.getAbsoluteUrl('bills');
    }
    resolve() {
        const start = 0;
        const end = 200;
        let params = new HttpParams().set('user_id', this.auth.userid);
        params = params.append('gudown_id', this.app.selectedGodownId.toString());
        params = params.append('start', '0');
        params = params.append('end', '100');
        return this.http.get(this.billsUrl, {params});
    }
}