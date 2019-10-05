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
import { RpmTableData } from '../../models/RpmTableData';
import { RpmValue } from '../../models/RpmValue';
import { AuthService } from '../../services/auth.service';
import { RpmEntry } from '../../models/RpmEntry';

@Component({
    templateUrl: './rpm-entry-component.html',
    styleUrls: ['./rpm-entry-component.scss']
})
export class RpmEntryComponent implements OnInit, OnDestroy, AfterViewInit {
    rpmEntry: RpmTableData = {
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
    bookId;
    bookEndNo;
    rpmEntryNo;
    book: Book;
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
        private config: ConfigService,
        private rpmEntryService: RpmEntryService,
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
                const pipeData: RpmValue = { pipeType: pipe.type, feet: 0, pipeId: +pipe.id, pipeSize: +pipe.size, length: 0 }
                this.rpmEntry.previousStockFT.push(pipeData);
                this.rpmEntry.rrIncome.push(pipeData);
                this.rpmEntry.mmIncome.push(pipeData);
                this.rpmEntry.balanceStockFeet.push(pipeData);
                this.rpmEntry.availableStock.push(pipeData);
                this.rpmEntry.vehicleInOut.push(pipeData);
                this.rpmEntry.damageFeet.push(pipeData);
                this.pointExpenseFeetFormArray.push(this.buildPointExpenseForm(pipe.type, pipe.id, pipe.size))
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
                this.bookId = data.book_id;
                this.bookStartNo = data.start
                this.bookEndNo = data.end;
                this.rpmEntryNo = data.rpm_sheet_no;
            }

        })
    }

    assignVehicle() {
        const dialogRef = this.dialog.open(AssignVehicleDialogComponent, {
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
        });

        dialogRef.afterClosed().subscribe((data: RpmTableData) => {
            if (data) {
                console.log(data)
                this.rpmEntry = data;
                // this.removePointExpenseFeetCtrls();
                // data.pointExpenseFeet.forEach(rpm => {
                //     this.pointExpenseFeetFormArray.push(this.buildPointExpenseForm(rpm.pipeType, rpm.pipeId, rpm.pipeSize))
                // })
            }
        })
    };

    removePointExpenseFeetCtrls() {
        while (this.pointExpenseFeetFormArray.controls.length) {
            this.pointExpenseFeetFormArray.removeAt(0)
        }
    }

    onVehicleChange() {
        this.rpmEntryService.getLastRpmEntrySheet(this.selectedVehicle).subscribe((lastRpmEntrySheet) => {
            console.log(lastRpmEntrySheet)
            this.rpmEntryNo = lastRpmEntrySheet.rpm_sheet_no;
            this.bookEndNo = lastRpmEntrySheet.end;
            this.bookStartNo = lastRpmEntrySheet.start;
            this.bookId = lastRpmEntrySheet.book_id;
        }, (err) => {

        })
    }

    save() {
        const pointExpenseFeet = this.form.value.pointExpenseFeet
        this.rpmEntry.pointExpenseFeet = pointExpenseFeet;
        const payload: RpmEntrySheet = {
            book_id: this.bookId,
            end: this.bookEndNo,
            start: this.bookStartNo,
            rpm_sheet_no: this.rpmEntryNo,
            vehicle_id: +this.selectedVehicle.vehicle_id,
            f_rpm_table_data: []
        }

        for (const pipe of this.pipes) {
            const rpmEntry: RpmEntry = {
                balance_stock_feet: this.rpmEntry.balanceStockFeet.find((p) => p.pipeId === +pipe.id ).feet,
                previous_stock_feet: this.rpmEntry.previousStockFT.find((p) => p.pipeId === +pipe.id ).feet,
                rr_income: this.rpmEntry.rrIncome.find((p) => p.pipeId === +pipe.id ).length,
                rr_income_feet: this.rpmEntry.rrIncome.find((p) => p.pipeId === +pipe.id ).feet,
                mm_income: this.rpmEntry.mmIncome.find((p) => p.pipeId === +pipe.id ).length,
                mm_income_feet: this.rpmEntry.mmIncome.find((p) => p.pipeId === +pipe.id ).feet,
                pipe_id: +pipe.id,
                pipe_size: +pipe.size,
                pipe_type: pipe.type,
                damage_feet: this.rpmEntry.damageFeet.find((p) => p.pipeId === +pipe.id ).feet,
                vehicle_ex_in: this.rpmEntry.vehicleInOut.find((p) => p.pipeId === +pipe.id ).length,
                vehicle_ex_out: this.rpmEntry.vehicleInOut.find((p) => p.pipeId === +pipe.id ).length,
                point_expenses_feet: +this.form.value.pointExpenseFeet.find(p => +p.pipeId === +pipe.id).value
            }
            payload.f_rpm_table_data.push(rpmEntry);
        }
        this.rpmEntryService.submitRpm(payload).subscribe(() => {
            console.log('next sheet')
        }, () => {})
    }

    private buildPointExpenseForm(pipeType, pipeId, pipeSize) {
        return this.fb.group({ pipeType, pipeId, pipeSize, value: '' })
    }
}