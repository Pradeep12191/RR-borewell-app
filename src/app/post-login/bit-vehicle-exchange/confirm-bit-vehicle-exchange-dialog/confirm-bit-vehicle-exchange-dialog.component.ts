import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PipeSize } from '../../../models/PipeSize';
import { Godown } from '../../pipe/Godown';
import { AuthService } from '../../../services/auth.service';
import { Moment } from 'moment';
import { ConfigService } from '../../../services/config.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../../../models/Vehicle';
import { BitSerialNo } from '../../../models/BitSerialNo';


@Component({
    templateUrl: './confirm-bit-vehicle-exchange-dialog.component.html',
    styleUrls: ['./confirm-bit-vehicle-exchange-dialog.component.scss']
})
export class ConfirmBitVehicleExchangeComponent {
    fromVehicle: Vehicle;
    toVehicle: Vehicle;
    date;
    bits: BitSerialNo[];
    updateUrl;
    remarks: string;
    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private dialogRef: MatDialogRef<ConfirmBitVehicleExchangeComponent>,
        private auth: AuthService,
        private config: ConfigService,
        private toastr: ToastrService,
        private http: HttpClient
    ) {
        this.fromVehicle = data.fromVehicle;
        this.toVehicle = data.toVehicle;
        this.date = data.date;
        this.bits = data.bits;
        this.remarks = data.remarks;
        this.updateUrl = this.config.getAbsoluteUrl('godownExchange');
    }

    savePipe() {
        const payload = {}
        console.log(JSON.stringify({ assignedPipes: payload }, null, 2));
        this.http.put(this.updateUrl, { assignedPipes: payload }).subscribe((response) => {
            this.dialogRef.close(response)
        }, (err) => {
            if (err) {
                this.toastr.error(`Network Error while exchanging godown`, null, { timeOut: 2000 })
            }
        })
    }
}