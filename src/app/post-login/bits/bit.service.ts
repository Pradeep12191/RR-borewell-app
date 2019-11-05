import { Injectable } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { BitData } from './BitData';

@Injectable()
export class BitService {

    private bitDataUrl;
    private bitDataCountUrl;
    constructor(
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.bitDataUrl = this.config.getAbsoluteUrl('bitData');
        this.bitDataCountUrl = this.config.getAbsoluteUrl('bitDataCount');
    }

    getBitData(bitSize, vehicleId, serial_no, start = '0', end = '100') {
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('vehicle_id', vehicleId)
            .append('bit_size', bitSize)
            .append('start', start.toString())
            .append('end', end.toString())
            .append('serial_no', serial_no.toString());
        return this.http.get<BitData[]>(this.bitDataUrl, { params })
    }

    getBitDataCount(bitSize, vehicleId, serial_no) {
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('vehicle_id', vehicleId)
            .append('bit_size', bitSize)
            .append('serial_no', serial_no.toString());
        return this.http.get(this.bitDataCountUrl, { params })
    }
}