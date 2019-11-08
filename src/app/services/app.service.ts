import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { BoreType } from '../models/BoreType';

@Injectable()
export class AppService {
    selectedGodownId;
    previousUrl;
    boreTypesUrl: string;

    constructor(
        private config: ConfigService,
        private http: HttpClient
    ) {
        this.boreTypesUrl = this.config.getAbsoluteUrl('boreTypes')
    }

    getBoreTypes() {
        return this.http.get<BoreType[]>(this.boreTypesUrl)
    }
}