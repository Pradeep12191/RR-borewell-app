import { Injectable } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RpmEntrySheet } from '../../models/RpmEntrySheet';


@Injectable()
export class RpmEntryReportService {
    rpmEntryReportUrl: string;
    constructor(
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.rpmEntryReportUrl = this.config.getAbsoluteUrl('rpmReport');
    }

    getRpmEntries(vehicleId) {
        const params = new HttpParams().set('user_id', this.auth.userid)
            .append('vehicle_id', vehicleId)
        return this.http.get<RpmEntrySheet[]>(this.rpmEntryReportUrl, { params })
    }
}