import { Component, Inject } from '@angular/core';
import { Vehicle } from '../../../../models/Vehicle';
import { Godown } from '../../../pipe/Godown';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from '../../../../services/auth.service';
import { RpmEntryService } from '../../rpm-entry.service';
import { Moment } from 'moment';
import { HammerSize } from 'src/app/post-login/hammers/hammer-size.model';
import { HammerSerial } from 'src/app/post-login/hammers/add-hammer-dialog/add-hammer/add-hammer.component';


@Component({
    templateUrl: './assign-hammer-confirm-dialog.component.html',
    styleUrls: ['./assign-hammer-confirm-dialog.component.scss']
})
export class AssignHammerConfirmDialogComponent {
    vehicle: Vehicle;
    hammer: HammerSize;
    godown: Godown;
    date;
    hammers: HammerSerial[];
    rpmEntryNo: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private auth: AuthService,
        private rpmEntryService: RpmEntryService,
        private dialogRef: MatDialogRef<AssignHammerConfirmDialogComponent>
    ) {
        this.vehicle = data.vehicle
        this.hammer = data.hammer;
        this.godown = data.godown;
        this.date = data.date;
        this.hammers = data.hammers;
        this.rpmEntryNo = data.rpmNo;
    }

    saveAssign() {
        const payload = this.hammers.map(hammer => {
            const data = {}
            data['user_id'] = this.auth.userid;
            data['gudown_type'] = this.godown.godownType;
            data['gudown_id'] = this.godown.godown_id;
            data['vehicle_no'] = this.vehicle.regNo;
            data['vehicle_id'] = +this.vehicle.vehicle_id;
            data['serial_no'] = hammer['serial_no'];
            data['bit_size'] = this.hammer.size;
            data['bit_no'] = 0;
            data['date'] = this.date ? (this.date as Moment).format('DD-MM-YYYY') : '';
            data['remarks'] = '';
            data['rpm_sheet_no'] = this.rpmEntryNo
            return data;
        });
        this.rpmEntryService.updateAssignHammer({assignedBits: payload}, this.vehicle).subscribe((bits) => {
            this.dialogRef.close(bits)
        }, () => {})
    }
}