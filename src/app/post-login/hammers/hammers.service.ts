import { Injectable } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { HttpClient } from '@angular/common/http';
import { Hammer } from './hammer.model';
import { AuthService } from '../../services/auth.service';
import { Godown } from '../pipe/Godown';

@Injectable()
export class HammersService {
    hammersUrl: string;
    godownUrl: string;
    constructor(
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.hammersUrl = this.config.getAbsoluteUrl('hammers');
        this.godownUrl = this.config.getAbsoluteUrl('hammerGodowns');
    }
    getAll(godown_id) {
        const params = { user_id: this.auth.userid, godown_id }
        return this.http.get<Hammer[]>(this.hammersUrl, { params })
    }

    getGodowns() {
        return this.http.get<Godown[]>(this.godownUrl);
    }
}