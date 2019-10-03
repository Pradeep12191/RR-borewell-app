import { Component, Inject, ViewChild } from '@angular/core';
import { Godown } from '../../pipe/Godown';
import { MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { Vehicle } from '../../../models/Vehicle';
import { PipeSize } from '../../../models/PipeSize';
import { BehaviorSubject } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { ConfigService } from '../../../services/config.service';
import { ToastrService } from 'ngx-toastr';
import { Moment } from 'moment';
import { RpmEntryService } from '../rpm-entry.service';


@Component({
    templateUrl: './assign-vehicle-dialog.component.html',
    styleUrls: ['./assign-vehicle-dialog.component.scss']
})
export class AssignVehicleDialogComponent {
    selectedGodown: Godown;
    selectedPipe: PipeSize;
    vehicle: Vehicle;
    godowns: Godown[];
    pipes: PipeSize[];
    loaderStatus$ = new BehaviorSubject(false);
    date;
    rpmEntryNo;
    @ViewChild('godownSelect', { static: false }) godownSelect: MatSelect;
    @ViewChild('pipeSelect', { static: false }) pipeSelect: MatSelect;
    getUrl;
    pipeSerialNos: { serial_no: string; billno: string }[];
    selectedPipes:{ serial_no: string; billno: string }[]= [];
    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private auth: AuthService,
        private config: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService,
        private rpmEntryService: RpmEntryService
    ) {
        this.godowns = data.godowns;
        this.pipes = data.pipes;
        this.vehicle = data.vehicle;
        this.date = data.date;
        this.rpmEntryNo = data.rpmEntryNo;
        this.getUrl = this.config.getAbsoluteUrl('pipeSerialNos');
    }

    onChange(type: 'godown' | 'pipe') {
        this.loaderStatus$.next(true);
        if (type === 'pipe') {
            if (!this.selectedGodown) {
                setTimeout(() => {
                    this.godownSelect.open();
                    return this.godownSelect.focus();
                })

            }
        }
        if (this.selectedGodown && this.selectedPipe) {
            let params = new HttpParams().set('user_id', this.auth.userid);
            params = params.append('pipe_size', this.selectedPipe.size);
            params = params.append('gudown_id', this.selectedGodown.godown_id);
            this.http.get<any[]>(this.getUrl, { params }).pipe(finalize(() => {
                this.loaderStatus$.next(false);
            })).subscribe((data) => {
                this.pipeSerialNos = data
            }, (err) => {
                if (err) {
                    this.toastr.error('Network Error, while fetching Pipe serial no, please try again later', null, { timeOut: 2000 })
                }
            })
        }
    }

    onTransferSelection(data) {
        this.selectedPipes = data;
    }

    saveAssign() {
        const payload = this.selectedPipes.map(pipe => {
            const data = {}
            data['user_id'] = this.auth.userid;
            data['gudown_type'] = this.selectedGodown.godownType;
            data['gudown_id'] = this.selectedGodown.godown_id;
            data['vehicle_no'] = this.vehicle.regNo;
            data['vehicle_id'] = this.vehicle.vehicle_id;
            data['serial_no'] = pipe.serial_no;
            data['serial_no_id'] = pipe.serial_no;
            data['pipe_size'] = this.selectedPipe.size;
            data['billno'] = pipe.billno;
            data['date'] = this.date ? (this.date as Moment).format('DD-MM-YYYY') : '';
            data['remarks'] = '';
            data['rpm_sheet_no'] = this.rpmEntryNo
            return data;
        });

        this.rpmEntryService.postAssignVehicle({ assignedPipes: payload }, this.vehicle)
            .subscribe((pipes) => {
                this.pipeSerialNos = pipes;
            })
    }
}