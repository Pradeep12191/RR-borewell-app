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
        this.updateUrl = this.config.getAbsoluteUrl('bitVehicleExchange');
    }

    savePipe() {
        const payload = {
            bits: this.bits,
            from_vehcile: this.fromVehicle,
            to_vehicle: this.toVehicle
        }
        console.log(JSON.stringify(payload, null, 2));
        this.http.put(this.updateUrl, payload).subscribe((response) => {
            this.toastr.success(`Bits Exchanged Successfully`, null, { timeOut: 2000 })
            this.dialogRef.close(response)
        }, (err) => {
            if (err) {
                this.toastr.error(`Network Error while exchanging Bits`, null, { timeOut: 2000 })
            }
        })
    }
}