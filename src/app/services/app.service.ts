import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { BoreType } from '../models/BoreType';

@Injectable()
export class AppService {
    selectedGodownId;
    previousUrl;
    boreTypesUrl: string;
    bitDataSearch = {
        bitSizeId: null,
        vehicleId: null,
        serialNo: null
    };

    rpmEntryData = {
        formValue: null,
        selectedVehcileId: null,
        date: null,
        bookId: null,
        bookStartNo: null,
        bookEndNo: null,
        lastResetDate: null,
        lastResetRpmNo: null,
        assignedBits: [],
        assignedHammers: [],
        rpmSheet: null,
        rpmEntryNo: null,
        rpmEntryTable: null,
        previousDieselRpm: null,
        pointDieselRpm: null,
        vehicleServiceLimits: null,
        compressorAirFilterServiceLimits: null,
        compressorOilServiceLimits: null,
        activeCompressorAirFilterLimit: null,
        activeCompressorOilServiceLimit: null,
        tracRunningRpm: null,
        tractors: [] // stored as need to work on reset
    };

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