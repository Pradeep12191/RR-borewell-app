import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from '../../models/Vehicle';
import { RpmEntryService } from '../rpm-entry/rpm-entry.service';
import { MatDatepicker, MatSelect, MatDialog } from '@angular/material';
import { ConfigService } from '../../services/config.service';
import { ConfirmBitVehicleExchangeComponent } from './confirm-bit-vehicle-exchange-dialog/confirm-bit-vehicle-exchange-dialog.component';

@Component({
    templateUrl: './bit-vehicle-exchange.component.html',
    styleUrls: ['./bit-vehicle-exchange.component.scss']
})
export class BitVehicleExchangeComponent implements OnInit {
    date = moment();
    loaderStatus$ = new BehaviorSubject(false);
    assignedBits;
    selectedBits = [];
    routeDataSubscription: Subscription;
    selectedFromVehicle: Vehicle;
    selectedToVehicle: Vehicle;
    vehicles: Vehicle[];
    appearance;
    remarks;
    @ViewChild('dateInput', { static: false }) dateInput: ElementRef;
    @ViewChild('picker', { static: false }) datePicker: MatDatepicker<any>;
    @ViewChild('fromVehicleSelect', { static: false }) fromVehicleSelect: MatSelect;
    @ViewChild('toVehicleSelect', { static: false }) toVehicleSelect: MatSelect;


    constructor(
        private route: ActivatedRoute,
        private rpmEntryService: RpmEntryService,
        private config: ConfigService,
        private dialog: MatDialog
    ) {
        this.appearance = this.config.getConfig('formAppearance')
    }

    ngOnInit() {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.vehicles = data.vehicles
        });
    }

    ngAfterViewInit() {
        this.openDatePicker();
        this.datePicker.closedStream.subscribe(() => {
            if (!this.selectedFromVehicle) {
                this.fromVehicleSelect.open();
                this.fromVehicleSelect.focus();
            }

        })
    }

    openDatePicker() {
        setTimeout(() => {
            this.datePicker.open();
            (this.dateInput.nativeElement as HTMLElement).focus()
        }, 300)
    }

    onTransferSelection(event) {
        this.selectedBits = event;
    }

    confirm() {
        this.dialog.open(ConfirmBitVehicleExchangeComponent, {
            disableClose: true,
            width: '40vw',
            position: { top: '25px' },
            maxHeight: '95vh',
            data: {
                bits: this.selectedBits,
                fromVehicle: this.selectedFromVehicle,
                toVehicle: this.selectedToVehicle,
                date: this.date,
                remarks: this.remarks
            }
        })
    }

    fromVehicles() {
        if (this.selectedToVehicle) {
            return this.vehicles.filter(v => v.vehicle_id !== this.selectedToVehicle.vehicle_id)
        }
        return this.vehicles;
    }

    toVehicles() {
        if (this.selectedFromVehicle) {
            return this.vehicles.filter(v => v.vehicle_id !== this.selectedFromVehicle.vehicle_id)
        }
        return this.vehicles;
    }

    onChange() {
        this.loaderStatus$.next(true);
        this.rpmEntryService.getAssignedBits(this.selectedFromVehicle).subscribe((assignedBits) => {
            this.assignedBits = assignedBits;
            this.loaderStatus$.next(false);
            if (!this.selectedToVehicle) {
                this.toVehicleSelect.focus();
                this.toVehicleSelect.open();
            }
        });
    }

}