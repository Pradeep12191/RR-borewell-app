import { Component, Inject } from '@angular/core';
import { Vehicle } from '../../../../models/Vehicle';
import { BitSize } from '../../../bits/BitSize';
import { Godown } from '../../../pipe/Godown';
import { BitSerialNo } from '../../../../models/BitSerialNo';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from '../../../../services/auth.service';
import { RpmEntryService } from '../../rpm-entry.service';
import { Moment } from 'moment';


@Component({
    templateUrl: './assign-bit-confirm-dialog.component.html',
    styleUrls: ['./assign-bit-confirm-dialog.component.scss']
})
export class AssignBitConfirmDialogComponent {
    vehicle: Vehicle;
    bit: BitSize;
    godown: Godown;
    date;
    bits: BitSerialNo[];
    rpmEntryNo: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private auth: AuthService,
        private rpmEntryService: RpmEntryService,
        private dialogRef: MatDialogRef<AssignBitConfirmDialogComponent>
    ) {
        this.vehicle = data.vehicle
        this.bit = data.bit;
        this.godown = data.godown;
        this.date = data.date;
        this.bits = data.bits;
        this.rpmEntryNo = data.rpmNo;
    }

    saveAssign() {
        const payload = this.bits.map(bit => {
            const data = {}
            data['user_id'] = this.auth.userid;
            data['gudown_type'] = this.godown.godownType;
            data['gudown_id'] = this.godown.godown_id;
            data['vehicle_no'] = this.vehicle.regNo;
            data['vehicle_id'] = +this.vehicle.vehicle_id;
            data['serial_no'] = bit.serial_no;
            data['bit_size'] = this.bit.size;
            data['bit_no'] = bit.bit_no;
            data['date'] = this.date ? (this.date as Moment).format('DD-MM-YYYY') : '';
            data['remarks'] = '';
            data['rpm_sheet_no'] = this.rpmEntryNo
            return data;
        });
        this.rpmEntryService.updateAssignBit({assignedBits: payload}, this.vehicle).subscribe((bits) => {
            this.dialogRef.close(bits)
        }, () => {})
    }
}