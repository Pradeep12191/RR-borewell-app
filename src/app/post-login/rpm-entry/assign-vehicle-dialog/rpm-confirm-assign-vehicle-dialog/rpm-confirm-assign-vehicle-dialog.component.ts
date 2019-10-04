import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Vehicle } from '../../../../models/Vehicle';
import { PipeSize } from '../../../../models/PipeSize';
import { Godown } from '../../../pipe/Godown';
import { AuthService } from '../../../../services/auth.service';
import { Moment } from 'moment';
import { RpmEntryService } from '../../rpm-entry.service';


@Component({
    templateUrl: './rpm-confirm-assign-vehicle-dialog.component.html',
    styleUrls: ['./rpm-confirm-assign-vehicle-dialog.component.scss']
})
export class RpmConfirmAssignVehicleDialogComponent {
    vehicle: Vehicle;
    pipe: PipeSize;
    godown:Godown;
    date;
    pipes: {serial_no: string, billno: string}[];
    rpmEntryNo: number;
    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private auth: AuthService,
        private rpmEntryService: RpmEntryService,
        private dialogRef: MatDialogRef<RpmConfirmAssignVehicleDialogComponent>
    ) {
        this.vehicle = data.vehicle
        this.pipe = data.pipe;
        this.godown = data.godown;
        this.date = data.date;
        this.pipes = data.pipes;
        this.rpmEntryNo = data.rpmNo;
    }

    saveAssign() {
        const payload = this.pipes.map(pipe => {
            const data = {}
            data['user_id'] = this.auth.userid;
            data['gudown_type'] = this.godown.godownType;
            data['gudown_id'] = this.godown.godown_id;
            data['vehicle_no'] = this.vehicle.regNo;
            data['vehicle_id'] = this.vehicle.vehicle_id;
            data['serial_no'] = pipe.serial_no;
            data['serial_no_id'] = pipe.serial_no;
            data['pipe_size'] = this.pipe.size;
            data['billno'] = pipe.billno;
            data['date'] = this.date ? (this.date as Moment).format('DD-MM-YYYY') : '';
            data['remarks'] = '';
            data['rpm_sheet_no'] = this.rpmEntryNo
            return data;
        });

        this.rpmEntryService.updateAssignVehicle({ assignedPipes: payload }, this.vehicle)
            .subscribe((pipes) => {
                this.dialogRef.close(pipes)
            })
    }
}