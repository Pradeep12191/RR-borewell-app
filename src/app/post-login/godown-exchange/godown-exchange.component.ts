import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PipeSize } from '../../models/PipeSize';
import { Godown } from '../pipe/Godown';
import { ConfigService } from '../../services/config.service';
import { MatDatepicker, MatSelect, MatDialog } from '@angular/material';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ConfirmGodownExchangeComponent } from './confirm-godown-exchange-dialog/confirm-godown-exchange-dialog.component';

@Component({
    templateUrl: './godown-exchange.component.html',
    styleUrls: ['./godown-exchange.component.scss']
})
export class GodownExchangeComponent implements OnDestroy, AfterViewInit {
    date = new Date();
    getUrl;
    pipes: PipeSize[];
    godowns: Godown[];
    pipeSerialNos: { bill_no: string; serial_no: string }[];
    selectedPipe: PipeSize;
    selectedGodown: Godown;
    routeDataSubscription: Subscription;
    loaderStatus$ = new BehaviorSubject(false);

    @ViewChild('dateInput', { static: false }) dateInput: ElementRef<any>;
    @ViewChild('picker', { static: false }) datePicker: MatDatepicker<any>;
    @ViewChild('pipeSelect', { static: false }) pipeSelect: MatSelect;
    @ViewChild('godownSelect', { static: false }) godownSelect: MatSelect;
    selectedPipes = [];

    constructor(
        private route: ActivatedRoute,
        private config: ConfigService,
        private auth: AuthService,
        private http: HttpClient,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.pipes = data.pipes;
            this.godowns = data.godowns;
        })
        this.getUrl = this.config.getAbsoluteUrl('pipeSerialNos');
    }

    ngAfterViewInit() {
        this.openDatePicker();
        this.datePicker.closedStream.subscribe(() => {
            if (!this.selectedPipe) {
                this.pipeSelect.open();
                this.pipeSelect.focus();
            }

        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe() }
    }

    openDatePicker() {
        setTimeout(() => {
            this.datePicker.open();
            (this.dateInput.nativeElement as HTMLElement).focus()
        }, 300)
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

    alternateGodown(godown: Godown) {
        return this.godowns.filter(g => g !== godown)[0].godownType
    }

    onTransferSelection(data) {
        this.selectedPipes = data;
    }

    confirm() {
        const toGodown = this.godowns.filter(g => g !== this.selectedGodown)[0];
        this.dialog.open(ConfirmGodownExchangeComponent, {
            disableClose: true,
            width: '40vw',
            position: { top: '25px' },
            maxHeight: '95vh',
            data: {
                pipes: this.selectedPipes,
                pipe: this.selectedPipe,
                fromGodown: this.selectedGodown,
                date: this.date,
                toGodown
            }
        })
    }
}