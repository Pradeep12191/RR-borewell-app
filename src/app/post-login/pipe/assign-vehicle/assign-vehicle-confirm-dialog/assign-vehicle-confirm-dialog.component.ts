import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Vehicle } from '../../../../models/Vehicle';
import { AuthService } from '../../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../../../services/config.service';


@Component({
    templateUrl: './assign-vehicle-confirm-dialog.component.html',
    styleUrls: ['./assign-vehicle-confirm-dialog.component.scss']
})

export class AssignVehicleConfirmDialogComponent {
    pipes;
    vehicle: Vehicle;
    godownType;
    pipeType;
    updateUrl;
    constructor(
        @Inject(MAT_DIALOG_DATA) private data,
        private dialofRef: MatDialogRef<AssignVehicleConfirmDialogComponent>,
        private auth: AuthService,
        private http: HttpClient,
        private toastr: ToastrService,
        private config: ConfigService
    ) {
        this.pipes = data.pipes;
        this.vehicle = data.vehicle;
        this.godownType = data.godownType;
        this.pipeType = data.pipeType;
        this.updateUrl = this.config.getAbsoluteUrl('AssignPipeToVehicle');
    }

    savePipe() {
        const payload = this.pipes.map(pipe => {
            const data = {}
            data['user_id'] = this.auth.userid;
            data['gudown_type'] = this.godownType;
            data['gudown_id'] = this.data.godownId;
            data['vehicle_no'] = this.vehicle.regNo;
            data['vehicle_id'] = this.vehicle.vehicle_id;
            data['serial_no'] = pipe.serial_no;
            data['serial_no_id'] = pipe.serial_no;
            data['pipe_size'] = this.data.pipeSize;
            data['billno'] = pipe.billno;
            data['remarks'] = '';
            return data;
        });
        console.log(JSON.stringify({ assignedPipes: payload }, null, 2));
        this.http.put(this.updateUrl, { assignedPipes: payload }).subscribe((response) => {
            this.toastr.success(`Pipes assigned to vehicle - ${this.vehicle.regNo} successfully`, null, { timeOut: 2000 });
            this.dialofRef.close(response)
        }, (err) => {
            if (err) {
                this.toastr.error(`Error while assigning pipes to vehicle - ${this.vehicle.regNo}`, null, { timeOut: 2000 })
            }
        })
    }
}