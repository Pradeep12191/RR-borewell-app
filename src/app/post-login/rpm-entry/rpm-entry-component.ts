import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PipeSize } from '../../models/PipeSize';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Vehicle } from '../../models/Vehicle';
import * as moment from 'moment';
import { Moment } from 'moment';
import { OverlayCardService } from '../../services/overlay-card.service';
import { CardOverlayref } from '../../services/card-overlay-ref';
import { AddBookPopupComponent } from './add-book-popup/add-book-popup.component';
import { MatDialog, MatSelect, MatSnackBar, MatDatepicker, MatInput, MatCheckboxChange } from '@angular/material';
import { AssignVehicleDialogComponent } from './assign-vehicle-dialog/assign-vehicle-dialog.component';
import { Godown } from '../pipe/Godown';
import { ConfigService } from '../../services/config.service';
import { LoaderService } from '../../services/loader-service';
import { finalize } from 'rxjs/operators';
import { zip } from 'rxjs';
import { RpmEntryService } from './rpm-entry.service';
import { Book } from '../../models/Book';
import { RpmEntrySheet } from '../../models/RpmEntrySheet';
import { RpmTableData } from '../../models/RpmTableData';
import { RpmValue } from '../../models/RpmValue';
import { RpmEntry } from '../../models/RpmEntry';
import { CommonService } from '../../services/common.service';
import { BitSize } from '../bits/BitSize';
import { AssignBitDialogComponent } from './assign-bit-dialog/assign-bit-dialog.component';
import { ServiceLimit } from '../../models/Limit';
import { VehicleServices } from '../../models/VehicleServices';
import { BitSerialNo } from '../../models/BitSerialNo';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: './rpm-entry-component.html',
    styleUrls: ['./rpm-entry-component.scss']
})
export class RpmEntryComponent implements OnInit, OnDestroy, AfterViewInit {
    rpmSheet: RpmEntrySheet;
    rpmEntryTable: RpmTableData = {
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
    date = null;
    godowns: Godown[];
    bitGodowns: Godown[];
    bitSizes: BitSize[];
    rpmHourFeets: ServiceLimit[];
    compressorAirFilterServiceLimits: ServiceLimit[];
    activeCompressorAirFilterLimit: ServiceLimit;
    assignedBits: BitSerialNo[];
    bookStartNo;
    bookId;
    bookEndNo;
    rpmEntryNo;
    vehicleServiceLimits: VehicleServices
    book: Book;
    @ViewChild('addBookBtn', { static: false, read: ElementRef }) addBookBtn: ElementRef;
    @ViewChild('vehicleSelect', { static: false }) vehicleSelect: MatSelect;
    @ViewChild('inVehicleSelect', { static: false }) inVehicleSelect: MatSelect;
    @ViewChild('outVehicleSelect', { static: false }) outVehicleSelect: MatSelect;
    @ViewChild('inRpmInput', { static: false }) inRpmNoInput: MatInput;
    @ViewChild('outRpmInput', { static: false }) outRpmNoInput: MatInput;
    @ViewChild('picker', { static: false }) picker: MatDatepicker<any>;
    @ViewChild('dateInput', { static: false }) dateInput: ElementRef;
    @ViewChildren('inFeetInput') inFeetInputs: QueryList<ElementRef>;
    @ViewChildren('outFeetInput') outFeetInputs: QueryList<ElementRef>;
    @ViewChildren('damageFeetInput') damageFeetInputs: QueryList<ElementRef>;
    @ViewChildren('expenseFeetInput') expenseFeetInputs: QueryList<ElementRef>;
    @ViewChildren('remarksInput', { read: ElementRef }) remarksInput: QueryList<ElementRef>;
    allInputs: QueryList<ElementRef>[] = new Array(5);

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
        private loader: LoaderService,
        private common: CommonService,
        private toastr: ToastrService
    ) {
        this.form = this.fb.group({
            pointExpenseFeet: this.fb.array([]),
            vehicleExIn: this.fb.array([]),
            vehicleExOut: this.fb.array([]),
            isDamage: { value: false, disabled: true },
            damageFeet: this.fb.array([]),
            isInVehicle: { value: false, disabled: true },
            inVehicle: ['', Validators.required],
            inRpmNo: ['', Validators.required],
            isOutVehicle: { value: false, disabled: true },
            outVehicle: ['', Validators.required],
            outRpmNo: ['', Validators.required],
            remarks: { value: '', disabled: false },
            rpm: this.fb.group({
                end: '',
                manual: '',
                isManual: false
            }),
            diesel: this.fb.group({
                compressor: '',
                lorry: '',
                support: ''
            }),
            depth: this.fb.group({
                bore: '',
                pipeErection: '',
                above: this.fb.group({
                    feet: '',
                    hrs: '',
                    min: ''
                })
            }),
            bit: ''
        })
        this.appearance = this.config.getConfig('formAppearance');
    }


    ngOnInit() {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.pipes = data.pipes;
            this.vehicles = data.vehicles;
            this.godowns = data.godowns;
            this.bitGodowns = data.bitGodowns;
            this.bitSizes = data.bits;
            this.rpmHourFeets = data.rpmHourFeets;
            this.compressorAirFilterServiceLimits = data.compressorAirFilterServiceLimits;
            this.pipeFlex = this.pipeTotalFlex / this.pipes.length;
            this.pipeFlex = Math.round(this.pipeFlex * 100) / 100;

            this.pipes.forEach(pipe => {
                const pipeData: RpmValue = { pipeType: pipe.type, feet: 0, pipeId: +pipe.id, pipeSize: +pipe.size, length: 0 }
                this.rpmEntryTable.previousStockFeet.push({ ...pipeData });
                this.rpmEntryTable.rrIncome.push({ ...pipeData });
                this.rpmEntryTable.mmIncome.push({ ...pipeData });
                this.rpmEntryTable.balanceStockFeet.push({ ...pipeData });
                this.rpmEntryTable.availableStockFeet.push({ ...pipeData });
                this.rpmEntryTable.damageFeet.push({ ...pipeData });
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
        });
        this.allInputs[0] = this.inFeetInputs;
        this.allInputs[1] = this.outFeetInputs;
        this.allInputs[2] = this.damageFeetInputs;
        this.allInputs[3] = this.expenseFeetInputs;
        this.allInputs[4] = this.remarksInput;

    }

    openAssignBitDialog() {
        const dialogRef = this.dialog.open(AssignBitDialogComponent, {
            data: {
                bitGodowns: this.bitGodowns,
                bits: this.bitSizes,
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

        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.assignedBits = res;
            }
        })
    }

    onInputKeyUp(event: KeyboardEvent, rowIndex, colIndex) {
        const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter']
        if (validKeys.indexOf(event.key) !== -1) {
            const trigger = (event.target as HTMLInputElement);
            const curPos = trigger.selectionStart;
            const length = trigger.value.length;
            if (event.key === 'Enter' || event.key === 'ArrowRight') {
                if (event.key === 'ArrowRight') {
                    if (curPos === length) {
                        this.moveNextInput(rowIndex, colIndex);
                    }
                } else {
                    this.moveNextInput(rowIndex, colIndex);
                }
            }
            if (event.key === 'ArrowLeft') {
                if (curPos === 0) {
                    this.movePrevInput(rowIndex, colIndex);
                }
            }

            if (event.key === 'ArrowUp') {
                // go upto one level enabled row, and focus the input as same index of current row;
                let prevRow: QueryList<ElementRef> = null;
                for (let i = rowIndex - 1; i >= 0; i--) {
                    prevRow = this.allInputs[i];
                    const lastInput = prevRow.toArray()[prevRow.length - 1].nativeElement as HTMLInputElement;
                    if (lastInput && !lastInput.disabled) {
                        break;
                    }
                }
                if (prevRow) {
                    const sameLevelInput = prevRow.toArray()[colIndex].nativeElement as HTMLInputElement;
                    sameLevelInput.focus();
                }
            }

            if (event.key === 'ArrowDown') {
                // go upto one level enabled row, and focus the input as same index of current row;
                let nextRow: QueryList<ElementRef> = null;
                for (let i = rowIndex + 1; i < this.allInputs.length; i++) {
                    nextRow = this.allInputs[i];
                    const firstInput = nextRow.toArray()[0].nativeElement as HTMLInputElement;
                    if (firstInput && !firstInput.disabled) {
                        break;
                    }
                }
                if (nextRow) {
                    const firstInput = nextRow.toArray()[colIndex].nativeElement as HTMLInputElement;
                    firstInput.focus();
                }
            }

        }
    }

    moveNextInput(rowIndex, colIndex) {
        const queryList = this.allInputs[rowIndex];
        const nextElRef = queryList.toArray()[colIndex + 1];
        if (nextElRef) {
            const input = nextElRef.nativeElement as HTMLInputElement;
            setTimeout(() => {
                input.focus();
                input.setSelectionRange(0, 0);
            })

        } else {
            // focus currently at last input, try traversing to next enabled control
            let nextRow: QueryList<ElementRef> = null;
            for (let i = rowIndex + 1; i < this.allInputs.length; i++) {
                nextRow = this.allInputs[i];
                const firstInput = nextRow.toArray()[0].nativeElement as HTMLInputElement;
                if (firstInput && !firstInput.disabled) {
                    break;
                }
            }
            if (nextRow) {
                const firstInput = nextRow.toArray()[0].nativeElement as HTMLInputElement;
                setTimeout(() => {
                    firstInput.focus();
                    firstInput.setSelectionRange(0, 0);
                })
            }
        }
    }

    movePrevInput(rowIndex, colIndex) {
        const queryList = this.allInputs[rowIndex];
        const prevElRef = queryList.toArray()[colIndex - 1];
        if (prevElRef) {
            const input = prevElRef.nativeElement as HTMLInputElement;
            setTimeout(() => {
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            })
        } else {
            // focus currently at first input, try traversing to previous row enabled control
            let prevRow: QueryList<ElementRef> = null;
            for (let i = rowIndex - 1; i >= 0; i--) {
                prevRow = this.allInputs[i];
                const lastInput = prevRow.toArray()[prevRow.length - 1].nativeElement as HTMLInputElement;
                if (lastInput && !lastInput.disabled) {
                    break;
                }
            }
            if (prevRow) {
                const lastInput = prevRow.toArray()[prevRow.length - 1].nativeElement as HTMLInputElement;
                setTimeout(() => {
                    lastInput.focus();
                    lastInput.setSelectionRange(lastInput.value.length, lastInput.value.length);
                })
            }
        }
    }

    onCheckChange(event: MatCheckboxChange, type: 'in' | 'out' | 'damage') {
        if (type === 'in') {
            if (event.checked) {
                setTimeout(() => {
                    this.inVehicleSelect.open();
                    this.inVehicleSelect.focus();
                }, 100);

                // this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
            } else {
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').disable());
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').reset(''));
                this.form.get('inVehicle').reset('')
                this.form.get('inRpmNo').reset('')
            }
        }

        if (type === 'out') {
            if (event.checked) {
                setTimeout(() => {
                    this.outVehicleSelect.open();
                    this.outVehicleSelect.focus();
                }, 100);
                // this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
            } else {
                this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').disable());
                this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').reset(''));
                this.form.get('outVehicle').reset('');
                this.form.get('outRpmNo').reset('');
            }

        }

        if (type === 'damage') {
            if (event.checked) {
                this.damageFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
                setTimeout(() => {
                    const firstDamageFeet = this.damageFeetInputs.toArray()[0].nativeElement as HTMLInputElement;
                    if (firstDamageFeet && !firstDamageFeet.disabled) {
                        firstDamageFeet.focus();
                    }
                }, 100)
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
        const rrIncome = this.rpmEntryTable.rrIncome.find(rr => rr.pipeId === pipeId).feet;
        const mmIncome = this.rpmEntryTable.mmIncome.find(mm => mm.pipeId === pipeId).feet;
        const previousStockFeet = this.rpmEntryTable.previousStockFeet.find(ps => ps.pipeId === pipeId).feet;
        const availableStock = this.rpmEntryTable.availableStockFeet.find(as => as.pipeId === pipeId);
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
        const availableStockFeet = this.rpmEntryTable.availableStockFeet.find(as => as.pipeId === pipeId).feet;
        const balanceStock = this.rpmEntryTable.balanceStockFeet.find(bs => bs.pipeId === pipeId);
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
            if (this.form.get('inVehicle').valid && this.form.get('inRpmNo').valid) {
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').enable())
            } else {
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').disable())
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').reset(''));
            }
            return setTimeout(() => {
                this.inRpmNoInput.focus();
            }, 100)
        }
        if (this.form.get('outVehicle').valid && this.form.get('outRpmNo').valid) {
            this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        } else {
            this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').disable());
            this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').reset(''));
        }
        setTimeout(() => {
            this.outRpmNoInput.focus();
        }, 100);
    }

    onExRpmNoInput(type: 'in' | 'out') {
        if (type === 'in') {
            if (this.form.get('inVehicle').valid && this.form.get('inRpmNo').valid) {
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').enable())
            } else {
                this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').disable())

            }
        }
        if (this.form.get('outVehicle').valid && this.form.get('outRpmNo').valid) {
            this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').enable())
        } else {
            this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').disable())
        }
    }

    onExRpmNoEnter(type: 'in' | 'out') {
        if (type === 'in') {
            const firstInFeetInput = this.inFeetInputs.toArray()[0].nativeElement as HTMLInputElement;
            if (!firstInFeetInput.disabled) {
                firstInFeetInput.focus();
            }
            return;
        }
        const firstOutFeetInput = this.outFeetInputs.toArray()[0].nativeElement as HTMLInputElement;
        if (firstOutFeetInput && !firstOutFeetInput.disabled) {
            firstOutFeetInput.focus();
        }
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
            offsetX: -330,
            offsetY: -85
        }]);
        this.bookPopupRef.afterClosed$.subscribe((rpmSheet: RpmEntrySheet) => {
            if (rpmSheet) {
                this.bookId = rpmSheet.book_id;
                this.bookStartNo = rpmSheet.start
                this.bookEndNo = rpmSheet.end;
                this.rpmEntryNo = rpmSheet.rpm_sheet_no;
                this.rpmSheet = rpmSheet;
            }

        })
    };

    onRpmEndInput() {
        let start = 0;
        let running = 0;
        const end = +this.form.get('rpm.end').value;
        const manual = +this.form.get('rpm.manual').value;
        const endRpm = end + manual;
        if (this.rpmSheet.rpm && this.rpmSheet.rpm.start) {
            start = this.rpmSheet.rpm.start
        }
        if (endRpm > start) {
            running = endRpm - start
        } else {
            running = null
        }

        if (this.rpmSheet.rpm) {
            this.rpmSheet.rpm.running = running;
            this.rpmSheet.rpm.point_diesel = running + start;
        }
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
                this.rpmEntryTable.rrIncome = [...data.rrIncome];
                this.rpmEntryTable.mmIncome = [...data.mmIncome];
                this.updateAllPipeStockFeet();
            }
        })
    };

    removePointExpenseFeetCtrls() {
        while (this.pointExpenseFeetFormArray.controls.length) {
            this.pointExpenseFeetFormArray.removeAt(0)
        }
    }

    onServieLimitSelect(limit: ServiceLimit) {
        this.loader.showSaveLoader('Loading')
        const services: VehicleServices = {
            ...this.vehicleServiceLimits,
            c_air_filter: limit.limit,
            vehicle_id: +this.selectedVehicle.vehicle_id
        }
        this.rpmEntryService.updateCompressorAirFilter(services).pipe(
            finalize(() => {
                this.loader.hideSaveLoader()
            })
        ).subscribe(() => {
            this.activeCompressorAirFilterLimit = limit
            this.toastr.success('Compressor Air Filter Service Limit updated successfully', null, { timeOut: 2000 })
        }, (err) => {
            if (err) {
                this.toastr.error('Error while updating compressor air filter service limit', null, { timeOut: 2000 })
            }
        });
    }

    onVehicleChange() {
        this.loader.showSaveLoader('Loading ...');
        const lastRpmSheet$ = this.rpmEntryService.getLastRpmEntrySheet(this.selectedVehicle);
        const vehicleServiceLimit$ = this.rpmEntryService.getServiceLimits(this.selectedVehicle);
        const assingedBit$ = this.rpmEntryService.getAssignedBits(this.selectedVehicle);
        zip(lastRpmSheet$, vehicleServiceLimit$, assingedBit$).pipe(finalize(() => {
            this.loader.hideSaveLoader();
        })).subscribe(([lastRpmEntrySheet, serviceLimits, assignedBits]) => {
            this.vehicleServiceLimits = serviceLimits;
            this.activeCompressorAirFilterLimit = this.compressorAirFilterServiceLimits
                .find(c => c.limit === this.vehicleServiceLimits.c_air_filter);
            this.assignedBits = assignedBits;
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
            this.form.get('remarks').enable();
            this.updatePreviousStockFeet(lastRpmEntrySheet);
            this.rpmSheet = lastRpmEntrySheet;
            this.pointExpenseFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
            this.resetStockFeets();
        }, (err) => {

        })
    };

    updatePreviousStockFeet(lastRpmEntrySheet: RpmEntrySheet) {
        const rpmData = lastRpmEntrySheet.f_rpm_table_data;
        this.rpmEntryNo = lastRpmEntrySheet.rpm_sheet_no;
        if (rpmData) {
            rpmData.forEach(rd => {
                const previousStock = this.rpmEntryTable.previousStockFeet.find(ps => ps.pipeId === rd.pipe_id);
                const rrIncome = this.rpmEntryTable.rrIncome.find(ps => ps.pipeId === rd.pipe_id);
                const mmIncome = this.rpmEntryTable.mmIncome.find(ps => ps.pipeId === rd.pipe_id);
                const availableStock = this.rpmEntryTable.availableStockFeet.find(ps => ps.pipeId === rd.pipe_id);
                const balanceStock = this.rpmEntryTable.balanceStockFeet.find(ps => ps.pipeId === rd.pipe_id);
                previousStock.feet = rd.previous_stock_feet ? +rd.previous_stock_feet : 0;
                rrIncome.feet = rd.rr_income_feet ? +rd.rr_income_feet : 0;
                mmIncome.feet = rd.mm_income_feet ? +rd.mm_income_feet : 0;
                rrIncome.length = rd.rr_income;
                mmIncome.length = rd.mm_income;
                availableStock.feet = rrIncome.feet + mmIncome.feet + previousStock.feet;
                balanceStock.feet = availableStock.feet;
            })
        } else {
            this.rpmEntryTable.availableStockFeet.forEach(as => {
                as.feet = 0;
                as.length = 0;
            });
            this.rpmEntryTable.previousStockFeet.forEach(ps => {
                ps.feet = 0;
                ps.length = 0;
            });
            this.rpmEntryTable.balanceStockFeet.forEach(bs => {
                bs.length = 0;
                bs.feet = 0;
            })
        }
    }

    private resetStockFeets() {
        this.form.get('inVehicle').reset();
        this.form.get('outVehicle').reset();
        this.form.get('inRpmNo').reset();
        this.form.get('outRpmNo').reset();
        this.form.get('isDamage').reset();
        this.form.get('isInVehicle').reset();
        this.form.get('remarks').reset();
        this.date = null;
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
        });

        // this.picker.open();
        // (this.dateInput.nativeElement as HTMLInputElement).focus()

    }

    enableAllControls() {
        this.damageFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        this.pointExpenseFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
    }

    onDepthInput() {
        const boreDepth = +this.form.get('depth.bore').value;
        const pipeErectionDepth = +this.form.get('depth.pipeErection').value;
        let runningFeet = 0;
        let bitPreviousFeet = 0;

        if (this.rpmSheet && this.rpmSheet.bit && this.rpmSheet.bit.previous_feet) {
            bitPreviousFeet = this.rpmSheet.bit.previous_feet;
        }

        if (boreDepth >= pipeErectionDepth) {
            runningFeet = boreDepth - pipeErectionDepth
        } else {
            runningFeet = 0;
        }

        if (this.rpmSheet && this.rpmSheet.bit) {
            this.rpmSheet.bit.running_feet = runningFeet;
            this.rpmSheet.bit.total_feet = runningFeet + bitPreviousFeet;
        }
    }

    submit() {
        if (!this.date) {
            (this.dateInput.nativeElement as HTMLInputElement).focus();
            return this.snackBar.open('Date is required', null, { duration: 2000 })
        }
        const pointExpenseFeet = this.form.value.pointExpenseFeet
        this.rpmEntryTable.pointExpenseFeet = pointExpenseFeet;
        const payload: RpmEntrySheet = {
            book_id: this.bookId,
            end: this.bookEndNo,
            start: this.bookStartNo,
            rpm_sheet_no: this.rpmEntryNo,
            vehicle_id: +this.selectedVehicle.vehicle_id,
            rpm_vehicle_exchange: {
                vehicle_in_id: this.form.value.inVehicle ? +this.form.value.inVehicle.vehicle_id : 0,
                vehicle_in_no: this.form.value.inVehicle ? this.form.value.inVehicle.regNo : '',
                vehicle_out_id: this.form.value.outVehicle ? +this.form.value.outVehicle.vehicle_id : 0,
                vehicle_out_no: this.form.value.outVehicle ? this.form.value.outVehicle.regNo : '',
                vehicle_in_rpm_sheet_no: this.form.value.inRpmNo || 0,
                vehicle_out_rpm_sheet_no: this.form.value.outRpmNo || 0,
            },
            remarks: this.form.value.remarks,
            vehicle_no: this.selectedVehicle.regNo,
            date: this.date ? (this.date as Moment).format('DD-MM-YYYY') : '',
            f_rpm_table_data: [],
            rpm: {
                start: this.rpmSheet.rpm.start,
                manual: +this.form.value.rpm.manual,
                end: +this.form.value.rpm.end,
                running: this.rpmSheet.rpm.running,
                point_diesel: this.rpmSheet.rpm.point_diesel
            },
            diesel: {
                average: this.rpmSheet.diesel.average,
                previous_rpm: this.rpmSheet.diesel.previous_rpm,
                total: this.rpmSheet.diesel.total,
                support: +this.form.value.diesel.support,
                compressor: +this.form.value.diesel.compressor,
                lorry: +this.form.value.diesel.lorry
            },
            service: {
                c_air_filter: this.rpmSheet.service.c_air_filter,
                c_oil_service: this.rpmSheet.service.c_oil_service,
                e_air_filter: this.rpmSheet.service.c_air_filter,
                e_oil_service: this.rpmSheet.service.e_oil_service,
                seperator: this.rpmSheet.service.seperator
            },
            depth: {
                average: 0,
                above: {
                    feet: this.form.value.depth.above.feet,
                    hrs: +this.form.value.depth.above.hrs,
                    min: +this.form.value.depth.above.min,
                },
                bore: +this.form.value.depth.bore,
                pipe_erection: +this.form.value.depth.pipeErection
            },
            bit: {
                ...this.form.value.bit,
                hammer: this.rpmSheet.bit.hammer,
                piston: this.rpmSheet.bit.piston,
                previous_feet: this.rpmSheet.bit.previous_feet,
                running_feet: this.rpmSheet.bit.running_feet,
                total_feet: this.rpmSheet.bit.total_feet
            }
        }

        for (const pipe of this.pipes) {
            const rpmEntry: RpmEntry = {
                balance_stock_feet: this.rpmEntryTable.balanceStockFeet.find((p) => p.pipeId === +pipe.id).feet,
                previous_stock_feet: this.rpmEntryTable.previousStockFeet.find((p) => p.pipeId === +pipe.id).feet,
                available_stock_feet: this.rpmEntryTable.availableStockFeet.find((p) => p.pipeId === +pipe.id).feet,
                rr_income: this.rpmEntryTable.rrIncome.find((p) => p.pipeId === +pipe.id).length,
                rr_income_feet: this.rpmEntryTable.rrIncome.find((p) => p.pipeId === +pipe.id).feet,
                mm_income: this.rpmEntryTable.mmIncome.find((p) => p.pipeId === +pipe.id).length,
                mm_income_feet: this.rpmEntryTable.mmIncome.find((p) => p.pipeId === +pipe.id).feet,
                pipe_id: +pipe.id,
                pipe_size: +pipe.size,
                pipe_type: pipe.type,
                damage_feet: +this.form.value.damageFeet.find(p => +p.pipeId === +pipe.id).value || 0,
                vehicle_ex_out: +this.form.value.vehicleExOut.find(p => +p.pipeId === +pipe.id).value || 0,
                vehicle_ex_in: +this.form.value.vehicleExIn.find(p => +p.pipeId === +pipe.id).value || 0,
                point_expenses_feet: +this.form.value.pointExpenseFeet.find(p => +p.pipeId === +pipe.id).value || 0,
            }
            payload.f_rpm_table_data.push(rpmEntry);
        }
        this.rpmEntryService.submitRpm(payload).subscribe((lastRpmEntrySheet) => {
            this.common.scrollTop();
            this.rpmSheet = lastRpmEntrySheet;
            this.updatePreviousStockFeet(lastRpmEntrySheet);
            this.resetStockFeets();
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