import { Component, Inject, ViewChild } from '@angular/core';
import { Godown } from '../../pipe/Godown';
import { MAT_DIALOG_DATA, MatSelect, MatDialog, MatDialogRef } from '@angular/material';
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
import { RpmConfirmAssignVehicleDialogComponent } from './rpm-confirm-assign-vehicle-dialog/rpm-confirm-assign-vehicle-dialog.component';
import { LoaderService } from '../../../services/loader-service';


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
    selectedPipes: { serial_no: string; billno: string }[] = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private auth: AuthService,
        private config: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService,
        private rpmEntryService: RpmEntryService,
        private dialog: MatDialog,
        private loader: LoaderService,
        private dialogRef: MatDialogRef<AssignVehicleDialogComponent>
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


    confirmAssign() {
        const dialogRef = this.dialog.open(RpmConfirmAssignVehicleDialogComponent, {
            disableClose: true,
            width: '50vw',
            position: { top: '25px' },
            maxHeight: '95vh',
            data: {
                pipes: this.selectedPipes,
                rpmNo: this.rpmEntryNo,
                godown: this.selectedGodown,
                pipe: this.selectedPipe,
                vehicle: this.vehicle,
                date: this.date
            }
        });

        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.pipeSerialNos = res;
            }
        })
    }

    onDoneClick() {
        this.loader.showSaveLoader('Fetching Rpm, please wait ...')
        this.rpmEntryService.getRpmTableData(this.vehicle, this.rpmEntryNo).subscribe((data) => {
            this.loader.hideSaveLoader();
            this.dialogRef.close(data)
        }, () => {
            this.toastr.error('Error while Fetching RPM Entry');
        })
    }
}