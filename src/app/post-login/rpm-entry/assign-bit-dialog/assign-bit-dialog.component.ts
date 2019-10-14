import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatSelect, MatDialog, MatDialogRef } from '@angular/material';
import { Godown } from '../../pipe/Godown';
import { BitSize } from '../../bits/BitSize';
import { Vehicle } from '../../../models/Vehicle';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BitSerialNo } from '../../../models/BitSerialNo';
import { AssignBitConfirmDialogComponent } from './assign-bit-confirm-dialog/assign-bit-confirm-dialog.component';


@Component({
    templateUrl: './assign-bit-dialog.component.html',
    styleUrls: ['./assign-bit-dialog.component.scss']
})
export class AssignBitDialogComponent implements AfterViewInit {
    godowns: Godown[];
    bits: BitSize[];
    vehicle: Vehicle;
    date;
    rpmEntryNo;
    @ViewChild('godownSelect', { static: false }) godownSelect: MatSelect;
    @ViewChild('pipeSelect', { static: false }) bitSelect: MatSelect;
    loaderStatus$ = new BehaviorSubject(false);
    getUrl: string;
    selectedGodown: Godown;
    selectedBit: BitSize;
    bitSerialNos: BitSerialNo[];
    selectedBits: BitSerialNo[];

    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private auth: AuthService,
        private config: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AssignBitDialogComponent>
    ) {
        this.godowns = data.bitGodowns;
        this.selectedGodown = this.godowns[0];
        this.bits = data.bits;
        this.vehicle = data.vehicle;
        this.date = data.date;
        this.rpmEntryNo = data.rpmEntryNo;
        this.getUrl = this.config.getAbsoluteUrl('unassignedBitSerialNos');
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.bitSelect.open()
            this.bitSelect.focus()
        }, 300)

    }

    onChange(type: 'godown' | 'bit') {
        this.loaderStatus$.next(true);
        if (type === 'bit') {
            if (!this.selectedGodown) {
                setTimeout(() => {
                    this.godownSelect.open();
                    return this.godownSelect.focus();
                })

            }
        }
        if (this.selectedGodown && this.selectedBit) {
            let params = new HttpParams().set('user_id', this.auth.userid);
            params = params.append('bit_id', this.selectedBit.id.toString());
            params = params.append('godown_id', this.selectedGodown.godown_id);
            this.http.get<any[]>(this.getUrl, { params }).pipe(finalize(() => {
                this.loaderStatus$.next(false);
            })).subscribe((data) => {
                this.bitSerialNos = data
            }, (err) => {
                if (err) {
                    this.toastr.error('Network Error, while fetching Pipe serial no, please try again later', null, { timeOut: 2000 })
                }
            })
        }
    }

    onTransferSelection(data) {
        this.selectedBits = data;
    }

    confirmAssign() {
        const dialogRef = this.dialog.open(AssignBitConfirmDialogComponent, {
            disableClose: true,
            width: '50vw',
            position: { top: '25px' },
            maxHeight: '95vh',
            data: {
                bits: this.selectedBits,
                rpmNo: this.rpmEntryNo,
                godown: this.selectedGodown,
                bit: this.selectedBit,
                vehicle: this.vehicle,
                date: this.date
            }
        });

        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.bitSerialNos = res;
            }
        })
    }

    onDoneClick() {
        this.dialogRef.close()
    }
}