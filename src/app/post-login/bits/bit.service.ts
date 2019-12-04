import { Injectable } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { BitData } from './BitData';
import { BitLife } from 'src/app/models/BitLife';

@Injectable()
export class BitService {

    private bitDataUrl;
    private bitDataCountUrl;
    private bitLifeUrl;
    constructor(
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.bitDataUrl = this.config.getAbsoluteUrl('bitData');
        this.bitDataCountUrl = this.config.getAbsoluteUrl('bitDataCount');
        this.bitLifeUrl = this.config.getAbsoluteUrl('bitLife');
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
    };

    getBitLife(serial_no) {
        const user_id = this.auth.userid;
        return this.http.get<BitLife>(this.bitLifeUrl, { params: { serial_no, user_id } })
    }
}