import { Resolve } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { HttpClient } from '@angular/common/http';
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
        return this.http.get(this.billsUrl + '/' + this.auth.userid + '/' + this.app.selectedGodownId + '/' + start + '/' + end);
    }
}