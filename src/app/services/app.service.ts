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
        isOutVehicleFormValue: null,
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
        tractors: [] // use app tractors refereence as reset of tractor gear oil service/ tractor engine oil service happens directly on tractors
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

    resetRpmData() {
        this.rpmEntryData = {
            formValue: null,
            isOutVehicleFormValue: null,
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
            tractors: [] // use app tractors refereence as reset of tractor gear oil service/ tractor engine oil service happens directly on tractors
        }
    }


}