import { Injectable } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { HttpClient } from '@angular/common/http';
import { Hammer } from './hammer.model';
import { AuthService } from '../../services/auth.service';
import { Godown } from '../pipe/Godown';
import { Company } from '../bits/Company';
import { HammerSize } from './hammer-size.model';

@Injectable()
export class HammersService {
    hammersUrl: string;
    godownUrl: string;
    lastHammerSerialNoUrl: string;
    companiesUrl: string;
    addCompanyUrl: string;
    addHammersUrl: string;
    viewHammersUrl: string;
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
    }
    getAll(godown_id) {
        const params = { user_id: this.auth.userid, godown_id }
        return this.http.get<HammerSize[]>(this.hammersUrl, { params })
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
}