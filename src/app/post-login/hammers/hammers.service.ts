import { Injectable } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Hammer } from './hammer.model';
import { AuthService } from '../../services/auth.service';
import { Godown } from '../pipe/Godown';
import { Company } from '../bits/Company';
import { HammerSize } from './hammer-size.model';
import { HammerData } from './models/hammer-data.model';
import { BitLife } from 'src/app/models/BitLife';

@Injectable()
export class HammersService {
    hammersUrl: string;
    godownUrl: string;
    lastHammerSerialNoUrl: string;
    companiesUrl: string;
    addCompanyUrl: string;
    addHammersUrl: string;
    viewHammersUrl: string;
    hammerDataUrl: string;
    hammerDataCountUrl: string;
    hammerLifeUrl: string;
    constructor(
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.hammersUrl = this.config.getAbsoluteUrl('hammers');
        this.godownUrl = this.config.getAbsoluteUrl('hammerGodowns');
        this.lastHammerSerialNoUrl = this.config.getAbsoluteUrl('lastHammerSerialNo');
        this.companiesUrl = this.config.getAbsoluteUrl('hammerCompanies');
        this.addCompanyUrl = this.config.getAbsoluteUrl('addHammerCompany');
        this.addHammersUrl = this.config.getAbsoluteUrl('addHammer');
        this.viewHammersUrl = this.config.getAbsoluteUrl('viewHammer');
        this.hammerDataUrl = this.config.getAbsoluteUrl('hammerData');
        this.hammerDataCountUrl = this.config.getAbsoluteUrl('hammerDataCount');
        this.hammerLifeUrl = this.config.getAbsoluteUrl('hammerLife');
    }
    getAll(godown_id) {
        const params = { user_id: this.auth.userid, godown_id }
        return this.http.get<HammerSize[]>(this.hammersUrl, { params })
    }

    getHammerData(hammerSize, vehicleId, serial_no, start = '0', end = '100') {
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('vehicle_id', vehicleId)
            .append('bit_size', hammerSize)
            .append('start', start.toString())
            .append('end', end.toString())
            .append('serial_no', serial_no.toString());
        return this.http.get<HammerData[]>(this.hammerDataUrl, { params })
    }

    getHammerDataCount(hammerSize, vehicleId, serial_no) {
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('vehicle_id', vehicleId)
            .append('bit_size', hammerSize)
            .append('serial_no', serial_no.toString());
        return this.http.get(this.hammerDataCountUrl, { params })
    }

    getGodowns() {
        return this.http.get<Godown[]>(this.godownUrl);
    }

    getLastHammerSerial() {
        const params = { user_id: this.auth.userid, pipe_size: '' };
        return this.http.get<number>(this.lastHammerSerialNoUrl, { params });
    };

    getCompanies() {
        const params = { user_id: this.auth.userid, pipe_size: '' };
        return this.http.get<Company[]>(this.companiesUrl, { params });
    }

    addCompany(company: Company) {
        return this.http.post<Company>(this.addCompanyUrl, company);
    }

    saveHammer(payload) {
        return this.http.post<number>(this.addHammersUrl, payload)
    };

    getHammersViewData() {
        return this.http.get<any[]>(this.viewHammersUrl, { params: { user_id: this.auth.userid } })
    }

    getHammerLife(serial_no) {
        const user_id = this.auth.userid;
        return this.http.get<BitLife>(this.hammerLifeUrl, { params: { serial_no, user_id } })
    }
}