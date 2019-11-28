import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatSelect, MatDialog, MatDialogRef } from '@angular/material';
import { Godown } from '../../pipe/Godown';
import { Vehicle } from '../../../models/Vehicle';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AssignHammerConfirmDialogComponent } from './assign-hammer-confirm-dialog/assign-hammer-confirm-dialog.component';
import { RpmEntryService } from '../rpm-entry.service';
import { LoaderService } from '../../../services/loader-service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducer';
import { Hammer } from '../../hammers/hammer.model';
import { HammerSerial } from '../../hammers/add-hammer-dialog/add-hammer/add-hammer.component';
import { HammerSize } from '../../hammers/hammer-size.model';


@Component({
    templateUrl: './assign-hammer-dialog.component.html',
    styleUrls: ['./assign-hammer-dialog.component.scss']
})
export class AssignHammerDialogComponent implements AfterViewInit {
    godowns: Godown[];
    hammers: HammerSize[];
    vehicle: Vehicle;
    date;
    rpmEntryNo;
    @ViewChild('godownSelect', { static: false }) godownSelect: MatSelect;
    @ViewChild('pipeSelect', { static: false }) bitSelect: MatSelect;
    loaderStatus$ = new BehaviorSubject(false);
    getUrl: string;
    selectedGodown: Godown;
    selectedHammer: HammerSize;
    hammerSerialNos: HammerSerial[];
    selectedHammers: HammerSerial[];

    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private auth: AuthService,
        private config: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AssignHammerDialogComponent>,
        private rpmEntryService: RpmEntryService,
        private loader: LoaderService,
        private store: Store<AppState>
    ) {
        this.godowns = data.bitGodowns;
        this.selectedGodown = this.godowns[0];
        this.hammers = data.hammers;
        this.vehicle = data.vehicle;
        this.date = data.date;
        this.rpmEntryNo = data.rpmEntryNo;
        this.getUrl = this.config.getAbsoluteUrl('unassignedHammerSerialNos');
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.bitSelect.open()
            this.bitSelect.focus()
        }, 300)

    }

    onChange(type: 'godown' | 'hammer') {
        this.loaderStatus$.next(true);
        if (type === 'hammer') {
            if (!this.selectedGodown) {
                setTimeout(() => {
                    this.godownSelect.open();
                    return this.godownSelect.focus();
                })

            }
        }
        if (this.selectedGodown && this.selectedHammer) {
            let params = new HttpParams().set('user_id', this.auth.userid);
            params = params.append('bit_id', this.selectedHammer.id.toString());
            params = params.append('godown_id', this.selectedGodown.godown_id);
            this.http.get<any[]>(this.getUrl, { params }).pipe(finalize(() => {
                this.loaderStatus$.next(false);
            })).subscribe((data) => {
                this.hammerSerialNos = data
            }, (err) => {
                if (err) {
                    this.toastr.error('Network Error, while fetching Pipe serial no, please try again later', null, { timeOut: 2000 })
                }
            })
        }
    }

    onTransferSelection(data) {
        this.selectedHammers = data;
    }

    confirmAssign() {
        const dialogRef = this.dialog.open(AssignHammerConfirmDialogComponent, {
            disableClose: true,
            width: '50vw',
            position: { top: '25px' },
            maxHeight: '95vh',
            data: {
                hammers: this.selectedHammers,
                rpmNo: this.rpmEntryNo,
                godown: this.selectedGodown,
                hammer: this.selectedHammer,
                vehicle: this.vehicle,
                date: this.date
            }
        });

        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.hammerSerialNos = res;
            }
        })
    }

    onDoneClick() {
        this.loader.showSaveLoader('Loading');
        this.rpmEntryService.getAssignedHammers(this.vehicle).pipe(
            finalize(() => this.loader.hideSaveLoader())
        ).subscribe((res) => {
            this.dialogRef.close(res)
        }, () => {
            this.toastr.error('Error while fetching assigned bits');
            this.dialogRef.close()
        })

    }
}