import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PipeSize } from '../../models/PipeSize';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Vehicle } from '../../models/Vehicle';
import * as moment from 'moment';
import { OverlayCardService } from '../../services/overlay-card.service';
import { CardOverlayref } from '../../services/card-overlay-ref';
import { AddBookPopupComponent } from './add-book-popup/add-book-popup.component';
import { MatDialog, MatSelect } from '@angular/material';
import { AssignVehicleDialogComponent } from './assign-vehicle-dialog/assign-vehicle-dialog.component';
import { HttpClient } from '@angular/common/http';
import { Godown } from '../pipe/Godown';
import { ConfigService } from '../../services/config.service';
import { zip } from 'rxjs';
import { LoaderService } from '../../services/loader-service';
import { finalize } from 'rxjs/operators';
import { RpmEntryService } from './rpm-entry.service';
import { Book } from '../../models/Book';
import { RpmEntrySheet } from '../../models/RpmEntrySheet';

@Component({
    templateUrl: './rpm-entry-component.html',
    styleUrls: ['./rpm-entry-component.scss']
})
export class RpmEntryComponent implements OnInit, OnDestroy, AfterViewInit {
    rpmEntry = {
        previousStockFT: [],
        rrIncome: [],
        mmIncome: [],
        availableStock: [],
        pointExpenseFeet: [],
        balanceStockFeet: [],
        vehicleInOut: [],
        damageFeet: []
    }
    routeDataSubscription: Subscription;
    pipeTotalFlex = 80;
    pipeFlex = 10;
    pipes: PipeSize[];
    form: FormGroup;
    vehicles: Vehicle[];
    selectedVehicle: Vehicle;
    bookPopupRef: CardOverlayref;
    appearance;
    date = moment();
    godowns: Godown[];
    bookStartNo;
    bookEndNo;
    rpmEntryNo;
    @ViewChild('addBookBtn', { static: false, read: ElementRef }) addBookBtn: ElementRef;
    @ViewChild('vehicleSelect', { static: false }) vehicleSelect: MatSelect;

    get pointExpenseFeetFormArray() {
        return this.form.get('pointExpenseFeet') as FormArray
    }

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private cardOverlay: OverlayCardService,
        private dialog: MatDialog,
        private http: HttpClient,
        private config: ConfigService,
        private rpmEntryService: RpmEntryService,
        private loader: LoaderService
    ) {
        this.form = this.fb.group({
            pointExpenseFeet: this.fb.array([]),
            remarks: ''
        })
        this.appearance = this.config.getConfig('formAppearance');
    }


    ngOnInit() {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.pipes = data.pipes;
            this.vehicles = data.vehicles;
            this.godowns = data.godowns;
            this.pipeFlex = this.pipeTotalFlex / this.pipes.length;
            this.pipeFlex = Math.round(this.pipeFlex * 100) / 100;

            this.pipes.forEach(pipe => {
                const pipeData = { pipeType: pipe.type, value: '' }
                this.rpmEntry.previousStockFT.push(pipeData);
                this.rpmEntry.rrIncome.push(pipeData);
                this.rpmEntry.mmIncome.push(pipeData);
                this.rpmEntry.balanceStockFeet.push(pipeData);
                this.rpmEntry.availableStock.push(pipeData);
                this.rpmEntry.vehicleInOut.push(pipeData);
                this.rpmEntry.damageFeet.push(pipeData);
                this.pointExpenseFeetFormArray.push(this.buildPointExpenseForm(pipe.type))
            })
        })
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.vehicleSelect.open();
            this.vehicleSelect.focus();
        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe() }
    }

    private buildPointExpenseForm(pipeType) {
        return this.fb.group({ pipeType, value: '' })
    }

    addBook() {
        if (this.bookPopupRef) {
            this.bookPopupRef.close();
        }
        this.bookPopupRef = this.cardOverlay.open(AddBookPopupComponent, this.addBookBtn, {
            data: {
                vehicle: this.selectedVehicle
            }
        }, [{
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: -250,
            offsetY: -85
        }]);
        this.bookPopupRef.afterClosed$.subscribe((data: RpmEntrySheet) => {
            if (data) {
                this.bookStartNo = data.start
                this.bookEndNo = data.end;
                this.rpmEntryNo = data.rpm_sheet_no;
            }
            
        })
    }

    assignVehicle() {
        this.dialog.open(AssignVehicleDialogComponent, {
            data: {
                godowns: this.godowns,
                pipes: this.pipes,
                vehicle: this.selectedVehicle,
                date: this.date,
                rpmEntryNo: this.rpmEntryNo
            },
            width: '1000px',
            position: { top: '0px' },
            maxHeight: '100vh',
            height: '100vh',
            disableClose: true
        })
    };

    onVehicleChange() {
        this.rpmEntryService.getLastRpmEntrySheet(this.selectedVehicle).subscribe((lastRpmEntrySheet) => {
            console.log(lastRpmEntrySheet)
            this.rpmEntryNo = lastRpmEntrySheet.rpm_sheet_no;
            this.bookEndNo = lastRpmEntrySheet.end;
            this.bookStartNo = lastRpmEntrySheet.start;
        }, (err) => {

        })
    }

    save() {
        const pointExpenseFeet = this.form.value.pointExpenseFeet
        this.rpmEntry.pointExpenseFeet = pointExpenseFeet;
        console.log(JSON.stringify(this.rpmEntry, null, 2))
    }
}