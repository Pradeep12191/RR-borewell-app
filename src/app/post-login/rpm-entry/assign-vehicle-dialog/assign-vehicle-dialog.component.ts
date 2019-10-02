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
    @ViewChild('godownSelect', { static: false }) godownSelect: MatSelect;
    @ViewChild('pipeSelect', { static: false }) pipeSelect: MatSelect;
    getUrl;
    pipeSerialNos: { serial_no: string; billno: string }[];
    selectedPipes;
    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private auth: AuthService,
        private config: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService
    ) {
        this.godowns = data.godowns;
        this.pipes = data.pipes;
        this.vehicle = data.vehicle;
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
}