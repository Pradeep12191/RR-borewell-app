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
import { MatDialog, MatSelect, MatSnackBar, MatDatepicker, MatInput, MatCheckboxChange } from '@angular/material';
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
        previousStockFeet: [],
        rrIncome: [],
        mmIncome: [],
        availableStockFeet: [],
        pointExpenseFeet: [],
        balanceStockFeet: [],
        vehicleExIn: [],
        vehicleExOut: [],
        damageFeet: []
    }
    routeDataSubscription: Subscription;
    pipeTotalFlex = 72;
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
    @ViewChild('inVehicleSelect', { static: false }) inVehicleSelect: MatSelect;
    @ViewChild('outVehicleSelect', { static: false }) outVehicleSelect: MatSelect;
    @ViewChild('inRpmInput', { static: false }) inRpmNoInput: MatInput;
    @ViewChild('outRpmInput', { static: false }) outRpmNoInput: MatInput;
    @ViewChild('picker', { static: false }) picker: MatDatepicker<any>;
    @ViewChild('dateInput', { static: false }) dateInput: ElementRef;

    get pointExpenseFeetFormArray() {
        return this.form.get('pointExpenseFeet') as FormArray
    }

    get veicleExInFormArray() {
        return this.form.get('vehicleExIn') as FormArray;
    }

    get veicleExOutFormArray() {
        return this.form.get('vehicleExOut') as FormArray;
    }

    get damageFeetFormArray() {
        return this.form.get('damageFeet') as FormArray;
    }

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private cardOverlay: OverlayCardService,
        private dialog: MatDialog,
        private config: ConfigService,
        private rpmEntryService: RpmEntryService,
        private snackBar: MatSnackBar,
        private loader: LoaderService
    ) {
        this.form = this.fb.group({
            pointExpenseFeet: this.fb.array([]),
            vehicleExIn: this.fb.array([]),
            vehicleExOut: this.fb.array([]),
            isDamage: { value: false, disabled: true },
            damageFeet: this.fb.array([]),
            isInVehicle: { value: false, disabled: true },
            inVehicle: '',
            inRpmNo: '',
            isOutVehicle: { value: false, disabled: true },
            outVehicle: '',
            outRpmNo: '',
            remarks: '',
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
                this.rpmEntry.previousStockFeet.push({ ...pipeData });
                this.rpmEntry.rrIncome.push({ ...pipeData });
                this.rpmEntry.mmIncome.push({ ...pipeData });
                this.rpmEntry.balanceStockFeet.push({ ...pipeData });
                this.rpmEntry.availableStockFeet.push({ ...pipeData });
                this.rpmEntry.damageFeet.push({ ...pipeData });
                this.pointExpenseFeetFormArray.push(this.buildPointExpenseForm(pipe.type, pipe.id, pipe.size))
                this.veicleExOutFormArray.push(this.buildPointExpenseForm(pipe.type, pipe.id, pipe.size))
                this.veicleExInFormArray.push(this.buildPointExpenseForm(pipe.type, pipe.id, pipe.size))
                this.damageFeetFormArray.push(this.buildPointExpenseForm(pipe.type, pipe.id, pipe.size))
            })
        })
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.vehicleSelect.open();
            this.vehicleSelect.focus();
        })
        this.picker.closedStream.subscribe(() => {
            // this.inVehicleSelect.open();
            // this.inVehicleSelect.focus();
        })
    }

    onCheckChange(event: MatCheckboxChange, type: 'in' | 'out' | 'damage') {
        if (type === 'in') {
            if (event.checked) {
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
            } else {
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').disable());
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').setValue(''));
                this.form.get('inVehicle').setValue('')
                this.form.get('inRpmNo').setValue('')
            }
        }

        if (type === 'out') {
            if (event.checked) {
                this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
            } else {
                this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').disable());
                this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').setValue(''));
                this.form.get('outVehicle').setValue('')
                this.form.get('outRpmNo').setValue('')
            }

        }

        if (type === 'damage') {
            if (event.checked) {
                this.damageFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
            } else {
                this.damageFeetFormArray.controls.forEach(ctrl => ctrl.get('value').setValue(''));
                this.damageFeetFormArray.controls.forEach(ctrl => ctrl.get('value').disable());
            }

        }
    }

    /**
     * rrIncome + mmIncome + previousStockFeet + vehicleExchangeIn - (vehicleExchangeOut + damageFeet)
     */
    updateAvailableStock(pipeId) {
        const rrIncome = this.rpmEntry.rrIncome.find(rr => rr.pipeId === pipeId).feet;
        const mmIncome = this.rpmEntry.mmIncome.find(mm => mm.pipeId === pipeId).feet;
        const previousStockFeet = this.rpmEntry.previousStockFeet.find(ps => ps.pipeId === pipeId).feet;
        const availableStock = this.rpmEntry.availableStockFeet.find(as => as.pipeId === pipeId);
        let vehicleInExchange = this.veicleExInFormArray.controls.find(ctrl => +ctrl.get('pipeId').value === pipeId).get('value').value;
        let vehicleOutExchange = this.veicleExOutFormArray.controls.find(ctrl => +ctrl.get('pipeId').value === pipeId).get('value').value;
        let damageFeet = this.damageFeetFormArray.controls.find(ctrl => +ctrl.get('pipeId').value === pipeId).get('value').value;
        vehicleInExchange = vehicleInExchange ? +vehicleInExchange : 0;
        vehicleOutExchange = vehicleOutExchange ? +vehicleOutExchange : 0;
        damageFeet = damageFeet ? +damageFeet : 0;

        const availableStockFeet = (rrIncome + mmIncome + previousStockFeet + vehicleInExchange) - (vehicleOutExchange + damageFeet);
        if (availableStockFeet > 0) {
            availableStock.feet = availableStockFeet;
        } else {
            availableStock.feet = 0;
        }
        this.updateBalanceStock(pipeId);

    }

    /**
     * available 
     */
    updateBalanceStock(pipeId) {
        let pointExpenseFeet = this.pointExpenseFeetFormArray.controls.find(ctrl => +ctrl.get('pipeId').value === pipeId).get('value').value
        pointExpenseFeet = pointExpenseFeet ? +pointExpenseFeet : 0;
        const availableStockFeet = this.rpmEntry.availableStockFeet.find(as => as.pipeId === pipeId).feet;
        const balanceStock = this.rpmEntry.balanceStockFeet.find(bs => bs.pipeId === pipeId);
        const balanceStockFeet = availableStockFeet - pointExpenseFeet;
        if (balanceStockFeet > 0) {
            balanceStock.feet = balanceStockFeet
        } else {
            balanceStock.feet = 0;
        }
    }

    updateAllPipeStockFeet() {
        this.pipes.forEach(pipe => {
            const pipeId = +pipe.id;
            this.updateAvailableStock(pipeId);
        })
    }


    onExVehicleChange(type: 'in' | 'out') {
        if (type === 'in') {
            return setTimeout(() => {
                this.inRpmNoInput.focus();
            }, 100)
        }
        return this.outRpmNoInput.focus();

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
                this.rpmEntry.rrIncome = [...data.rrIncome];
                this.rpmEntry.mmIncome = [...data.mmIncome];
                this.updateAllPipeStockFeet();
            }
        })
    };

    removePointExpenseFeetCtrls() {
        while (this.pointExpenseFeetFormArray.controls.length) {
            this.pointExpenseFeetFormArray.removeAt(0)
        }
    }

    onVehicleChange() {
        this.loader.showSaveLoader('Loading ...')
        this.rpmEntryService.getLastRpmEntrySheet(this.selectedVehicle).pipe(finalize(() => {
            this.loader.hideSaveLoader();
        })).subscribe((lastRpmEntrySheet) => {
            this.rpmEntryNo = lastRpmEntrySheet.rpm_sheet_no;
            this.bookEndNo = lastRpmEntrySheet.end;
            this.bookStartNo = lastRpmEntrySheet.start;
            this.bookId = lastRpmEntrySheet.book_id;
            this.picker.open();
            this.dateInput.nativeElement.focus();
            // once vehicle is selected enable all controls
            this.form.get('isInVehicle').enable();
            this.form.get('isOutVehicle').enable();
            this.form.get('isDamage').enable();
            this.pointExpenseFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
            this.resetStockFeets();
        }, (err) => {

        })
    };

    private resetStockFeets() {
        // followning below 3 items needs to set from api call
        this.rpmEntry.previousStockFeet.forEach(ps => {
            ps.length = 0;
            ps.feet = 0;
        })
        this.rpmEntry.rrIncome.forEach(rr => {
            rr.length = 0;
            rr.feet = 0;
        });
        this.rpmEntry.mmIncome.forEach(mm => {
            mm.length = 0;
            mm.feet = 0;
        });
        this.rpmEntry.availableStockFeet.forEach(as => {
            as.length = 0;
            as.feet = 0;
        });
        this.rpmEntry.balanceStockFeet.forEach(bs => {
            bs.length = 0;
            bs.feet = 0;
        });
        this.form.get('inVehicle').reset();
        this.form.get('outVehicle').reset();
        this.form.get('inRpmNo').reset();
        this.form.get('outRpmNo').reset();
        this.form.get('isDamage').reset();
        this.form.get('isInVehicle').reset();
        this.form.get('isOutVehicle').reset();
        this.veicleExInFormArray.controls.forEach(ctrl => {
            ctrl.get('value').reset();
            ctrl.get('value').disable();
        })
        this.veicleExOutFormArray.controls.forEach(ctrl => {
            ctrl.get('value').reset();
            ctrl.get('value').disable();
        })
        this.damageFeetFormArray.controls.forEach(ctrl => {
            ctrl.get('value').reset();
            ctrl.get('value').disable();
        })
        this.pointExpenseFeetFormArray.controls.forEach(ctrl => {
            ctrl.get('value').reset();
        })
    }

    enableAllControls() {
        this.damageFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        this.pointExpenseFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
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
            vehicle_in_id: this.form.value.inVehicle ? +this.form.value.inVehicle.vehicle_id : 0,
            vehicle_out_id: this.form.value.outVehicle ? +this.form.value.outVehicle.vehicle_id : 0,
            vehicle_in_rpm_sheet_no: this.form.value.inRpmNo || 0,
            vehicle_out_rpm_sheet_no: this.form.value.outRpmNo || 0,
            f_rpm_table_data: []
        }

        for (const pipe of this.pipes) {
            const rpmEntry: RpmEntry = {
                balance_stock_feet: this.rpmEntry.balanceStockFeet.find((p) => p.pipeId === +pipe.id).feet,
                previous_stock_feet: this.rpmEntry.previousStockFeet.find((p) => p.pipeId === +pipe.id).feet,
                available_stock_feet: this.rpmEntry.availableStockFeet.find((p) => p.pipeId === +pipe.id).feet,
                rr_income: this.rpmEntry.rrIncome.find((p) => p.pipeId === +pipe.id).length,
                rr_income_feet: this.rpmEntry.rrIncome.find((p) => p.pipeId === +pipe.id).feet,
                mm_income: this.rpmEntry.mmIncome.find((p) => p.pipeId === +pipe.id).length,
                mm_income_feet: this.rpmEntry.mmIncome.find((p) => p.pipeId === +pipe.id).feet,
                pipe_id: +pipe.id,
                pipe_size: +pipe.size,
                pipe_type: pipe.type,
                damage_feet: +this.form.value.damageFeet.find(p => +p.pipeId === +pipe.id).value || 0,
                vehicle_ex_out: +this.form.value.vehicleExOut.find(p => +p.pipeId === +pipe.id).value || 0,
                vehicle_ex_in: +this.form.value.vehicleExIn.find(p => +p.pipeId === +pipe.id).value || 0,
                point_expenses_feet: +this.form.value.pointExpenseFeet.find(p => +p.pipeId === +pipe.id).value || 0
            }
            payload.f_rpm_table_data.push(rpmEntry);
        }
        this.rpmEntryService.submitRpm(payload).subscribe(() => {
            console.log('next sheet')
        }, () => { })
    }

    private buildPointExpenseForm(pipeType, pipeId, pipeSize) {
        return this.fb.group({ pipeType, pipeId, pipeSize, value: { value: '', disabled: true } })
    }
    tableClick($event: MouseEvent) {
        const trigger = $event.target as HTMLElement;
        if (trigger.tagName === 'INPUT' && trigger.attributes.getNamedItem('disabled') && !this.selectedVehicle) {
            return this.snackBar.open('Please Select a Vehicle', null, { duration: 4000 });
        }
    }
}