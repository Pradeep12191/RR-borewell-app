import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Subscription, of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PipeSize } from '../../models/PipeSize';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Vehicle } from '../../models/Vehicle';
import * as moment from 'moment';
import { Moment } from 'moment';
import { OverlayCardService } from '../../services/overlay-card.service';
import { CardOverlayref } from '../../services/card-overlay-ref';
import { AddBookPopupComponent } from './add-book-popup/add-book-popup.component';
import { MatDialog, MatSelect, MatSnackBar, MatDatepicker, MatInput, MatCheckboxChange, MatSelectChange } from '@angular/material';
import { AssignVehicleDialogComponent } from './assign-vehicle-dialog/assign-vehicle-dialog.component';
import { Godown } from '../pipe/Godown';
import { ConfigService } from '../../services/config.service';
import { LoaderService } from '../../services/loader-service';
import { finalize, mergeMap, map } from 'rxjs/operators';
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
import { AddDieselPopupComponent } from './add-diesel-popup/add-diesel-popup.component';
import { ServiceCompleteConfirmDialog } from './service-complete-confirm-dialog/service-complete-confirm-dialog.component';
import { Tractor } from '../../models/Tractor';
import { BoreType } from '../../models/BoreType';
import { AssignHammerDialogComponent } from './assing-hammer-dialog/assign-hammer-dialog.component';
import { HammerSize } from '../hammers/hammer-size.model';
import { HammerSerialNo } from 'src/app/models/HammerSerialNo';

interface VehicleChangeData {
    lastRpmEntrySheet: RpmEntrySheet;
    serviceLimits: VehicleServices;
    assignedBits: BitSerialNo[];
    assignedHammers: HammerSerialNo[];
    incomeData: RpmTableData;
    lastReset: any
}

// 1. bore depth - m_depth + bore_depth (type: bore depth)
// 2. running rpm - m_rpm + running_rpm
// 3. average- (bore_depth + m_depth) - (extra_feet + m_extra_feet) / ( m_rpm + running rpm) - (m_extra_hrs + extra hrs)
// 4. diesel - m_diesel + compressor
// 5. diesel_avg - (m_diesel + compressor) / (running_rpm + m_rpm)
// 6. m_extra_feet - extra_feet + m_extra_feet,
// 7. m_extra_hrs, m_extra_min - hrs, min running total


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
    reversePipes: PipeSize[];
    form: FormGroup;
    vehicles: Vehicle[];
    selectedVehicle: Vehicle;
    bookPopupRef: CardOverlayref;
    appearance;
    date = null;
    godowns: Godown[];
    bitGodowns: Godown[];
    bitSizes: BitSize[];
    hammers: HammerSize[];
    rpmHourFeets: ServiceLimit[];
    compressorAirFilterServiceLimits: ServiceLimit[];
    compressorOilServiceLimits: ServiceLimit[]
    activeCompressorAirFilterLimit: ServiceLimit;
    activeCompressorOilServiceLimit: ServiceLimit;
    assignedBits: BitSerialNo[];
    assignedHammers: HammerSerialNo[];
    bookStartNo;
    bookId;
    bookEndNo;
    rpmEntryNo;
    vehicleServiceLimits: VehicleServices
    book: Book;
    bookRequired = false;
    tracRunningRpm = 0;
    previousDieselRpm;
    pointDieselRpm;
    tractors: Tractor[];
    boreTypes: BoreType[];
    lastResetDate;
    lastResetRpmNo;
    dateSelected$ = new Subject();
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
    @ViewChild('compressorInput', { static: false }) diselCompEl: ElementRef;
    @ViewChildren('rpmInput') rpmInputs: QueryList<ElementRef>;
    @ViewChildren('depthInput') depthInputs: QueryList<ElementRef>;
    @ViewChildren('dieselInput') dieselInputs: QueryList<ElementRef>;
    @ViewChild('aboveFeetSelect', { static: false }) aboveFeetSelect: MatSelect;
    @ViewChild('bitSelect', { static: false }) bitSelect: MatSelect;
    @ViewChild('tractorSelect', { static: false }) tractorSelect: MatSelect;
    @ViewChild('airVehicle', { static: false }) airVehicle: MatSelect;
    @ViewChild('airInoutSelect', { static: false }) airInoutSelect: MatSelect;
    @ViewChild('airRpmNoInput', { static: false }) airRpmNoInput: MatSelect;
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
        private toastr: ToastrService,
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
            user: this.fb.group({
                drillerName: { value: '', disabled: true },
                place: { value: '', disabled: true },
                party: { value: '', disabled: true },
                partyMobile: { value: '', disabled: true },
                plumber: { value: '', disabled: true },
                plumberMobile: { value: '', disabled: true },
            }),
            rpm: this.fb.group({
                end: [{ value: '', disabled: true }, this.endValueValidator('start', 'rpmError').bind(this)],
                manual: { value: '', disabled: true },
                tracEndHour: [{ value: '', disabled: true }, this.endValueValidator('tractor_start_hour', 'tracError').bind(this)],
                trac: { value: '', disabled: true },
                // isManual: false
            }),
            diesel: this.fb.group({
                compressor: { value: '', disabled: true },
                lorry: { value: '', disabled: true },
                support: { value: '', disabled: true },
                tractor: { value: '', disabled: true }
            }),
            depth: this.fb.group({
                bore: { value: '', disabled: true },
                boreHrs: { value: '', disabled: true },
                boreMins: { value: '', disabled: true },
                boreType: { value: '', disabled: true },
                pipeErection: { value: '', disabled: true },
                above: this.fb.group({
                    feet: { value: '', disabled: true },
                    hrs: { value: '', disabled: true },
                    min: { value: '', disabled: true }
                }),
                air: this.fb.group({
                    inOut: '',
                    vehicle: '',
                    rpmNo: ''
                }),
            }),
            bit: { value: '', disabled: true },
            hammer: { value: '', disable: true }
        })
        this.appearance = this.config.getConfig('formAppearance');
    }


    ngOnInit() {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.pipes = data.pipes;
            this.reversePipes = [...this.pipes].reverse();
            this.vehicles = data.vehicles;
            this.godowns = data.godowns;
            this.bitGodowns = data.bitGodowns;
            this.bitSizes = data.bits;
            this.hammers = data.hammers
            this.rpmHourFeets = data.rpmHourFeets;
            this.compressorAirFilterServiceLimits = data.compressorAirFilterServiceLimits;
            this.compressorOilServiceLimits = data.compressorOilServiceLimits
            this.tractors = data.tractors;
            this.pipeFlex = this.pipeTotalFlex / this.pipes.length;
            this.pipeFlex = Math.round(this.pipeFlex * 100) / 100;
            this.boreTypes = data.boreTypes;

            this.reversePipes.forEach(pipe => {
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
            });
            this.form.get('depth.boreType').setValue(this.boreTypes[0]);
        })
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.vehicleSelect.open();
            this.vehicleSelect.focus();
        });

        this.aboveFeetSelect._closedStream.subscribe(() => {

            setTimeout(() => {
                if (this.rpmSheet.depth && this.rpmSheet.depth.above && this.rpmSheet.depth.above.extra_feet) {
                    // hrs and min will be enabled, so focus on those
                    // hrs - depthInput - 2
                    const hrsInput = this.depthInputs.toArray()[2];
                    if (hrsInput) {
                        (hrsInput.nativeElement as HTMLInputElement).focus()
                    }
                } else {
                    if (this.assignedBits && this.assignedBits.length) {
                        this.bitSelect.open();
                        this.bitSelect.focus();
                    } else {
                        this.snackBar.open('No Bits available, so skipping bit', null, { duration: 2000 });
                        this.moveNextInput(0, -1);
                    }
                }
            });

        });

        this.tractorSelect._closedStream.subscribe(() => {
            const tractor = this.form.get('rpm.trac').value;
            if (tractor) {
                setTimeout(() => {
                    (this.rpmInputs.toArray()[0].nativeElement as HTMLInputElement).focus()
                })
            } else {
                (this.rpmInputs.toArray()[1].nativeElement as HTMLInputElement).focus()
            }
        })


        this.bitSelect._closedStream.subscribe(() => {
            // this.moveNextInput(0, -1);
        })

        this.picker.closedStream.subscribe(() => {
            if (this.date && this.bookId) {
                this.enableAllControls();
                setTimeout(() => {
                    this.dateSelected$.next(true);
                })
            }
            // this.inVehicleSelect.open();
            // this.inVehicleSelect.focus();
        });
        this.allInputs[0] = this.inFeetInputs;
        this.allInputs[1] = this.outFeetInputs;
        this.allInputs[2] = this.damageFeetInputs;
        this.allInputs[3] = this.expenseFeetInputs;
        this.allInputs[4] = this.remarksInput;

    }

    onLastUserEnter() {
        if (this.tractors && this.tractors.length) {
            this.tractorSelect.open()
            this.tractorSelect.focus();
        }
    }


    endValueValidator(propName, errorName) {
        return (control: AbstractControl) => {
            const end = +control.value;
            const start = this.rpmSheet ? +this.rpmSheet.rpm[propName] : 0;

            if (end && end < start) {
                return {
                    [errorName]: true
                }
            }
        }
    }

    displayMonthDepth() {
        let m_depth = 0;
        let boreDepth = +this.form.get('depth.bore').value;
        const boreType = this.form.get('depth.boreType').value;
        let extra_feet = 0;
        if (this.rpmSheet && this.rpmSheet.depth) {
            extra_feet = this.rpmSheet.depth.above.extra_feet
        }

        if (extra_feet) {
            boreDepth = boreDepth - extra_feet
        }

        if (this.rpmSheet && this.rpmSheet.month_data) {
            m_depth = this.rpmSheet.month_data.m_depth || 0;
        }
        if (boreType.type === 'Bore Depth' || boreType.id === 1) {
            return this.roundValue(m_depth + boreDepth);
        }
        return m_depth;
    }

    displayRunningRpm() {
        let rpm = 0;
        let m_rpm = 0;
        const boreType: BoreType = this.form.get('depth.boreType').value;
        const extraRpm = this.getCurrentExtraRpm();
        if (this.rpmSheet && this.rpmSheet.rpm) {
            rpm = this.rpmSheet.rpm.running;
        }
        if (extraRpm && extraRpm < rpm) {
            rpm = rpm - extraRpm
        }
        if (this.rpmSheet && this.rpmSheet.month_data) {
            m_rpm = this.rpmSheet.month_data.m_rpm || 0;
        }

        if (boreType.type === 'Bore Depth' || boreType.id === 1) {
            return this.roundValue(m_rpm + rpm);
        }

        return m_rpm;
    }

    displayDieselTotal() {
        const compressorDiesel = +this.form.get('diesel.compressor').value;
        let m_diesel = 0;
        let previousRunningRpm = 0;

        if (this.rpmSheet && this.rpmSheet.month_data) {
            m_diesel = this.rpmSheet.month_data.m_diesel
        }
        if (this.rpmSheet && this.rpmSheet.month_data) {
            previousRunningRpm = this.rpmSheet.month_data.m_rpm;
        }
        if (previousRunningRpm) {
            return this.roundValue(m_diesel + compressorDiesel);
        }
        return 0;

    }

    displayDieselAvg() {
        // 5. diesel_avg - (m_diesel + compressor) - displayDieselTotal()  / m_rpm
        const currentTotalDiesel = this.displayDieselTotal();
        let previousRunningRpm = 0;
        let previousExtraRpm = 0;
        let previousTotalRpm = 0;
        // let m_diesel_avg = 0;
        let currentCompressorDiesel = +this.form.get('diesel.compressor').value;

        if (this.rpmSheet && this.rpmSheet.month_data) {
            previousRunningRpm = this.rpmSheet.month_data.m_rpm;
            previousExtraRpm = this.convertToRpm(this.rpmSheet.month_data.m_extra_hour, this.rpmSheet.month_data.m_extra_min);
            previousTotalRpm = previousRunningRpm + previousExtraRpm + this.rpmSheet.month_data.m_other_rpm;
            // m_diesel_avg = this.rpmSheet.month_data.m_diesel_avg
        }

        if (currentTotalDiesel && previousTotalRpm && currentCompressorDiesel) {
            return this.roundValue(currentTotalDiesel / previousTotalRpm);
        }
        return 0;
    }

    displayAverageDepth() {
        // 3. average- (bore_depth + m_depth)** above feet** - (extra_feet + m_extra_feet) / ( m_rpm + running rpm) - (m_extra_hrs + extra hrs)
        let currentTotalBoreDepth = this.displayMonthDepth();
        let currentTotalRunningRpm = this.displayRunningRpm();
        let extra_feet = 0;
        let m_extra_feet = 0;
        let total_extra_feet = 0;
        let numerator = 0
        const hrs = +this.form.get('depth.above.hrs').value;
        const min = +this.form.get('depth.above.min').value;
        const boreType = this.form.get('depth.boreType').value;
        const boreDepth = this.form.get('depth.bore').value;
        let m_hrs = 0;
        let total_hrs = 0;

        let m_min = 0;
        let total_min = 0;

        if (this.rpmSheet && this.rpmSheet.depth) {
            extra_feet = +this.rpmSheet.depth.above.extra_feet;
        }

        if (boreType.type !== 'Bore Depth' && boreType.id !== 1) {
            if (this.rpmSheet && this.rpmSheet.month_data) {
                currentTotalBoreDepth = this.rpmSheet.month_data.m_depth;
                currentTotalRunningRpm = this.rpmSheet.month_data.m_rpm;
            }
        }
        if (this.rpmSheet && !boreDepth) {
            currentTotalRunningRpm = this.rpmSheet && this.rpmSheet.month_data && this.rpmSheet.month_data.m_rpm;
        }

        if (this.rpmSheet && this.rpmSheet.month_data) {
            m_extra_feet = this.rpmSheet.month_data.m_extra_feet || 0;
            m_hrs = this.rpmSheet.month_data.m_extra_hour || 0;
            m_min = this.rpmSheet.month_data.m_extra_min || 0;
        }
        const total_extra_hours = this.convertToRpm(hrs + m_hrs, min + m_min);
        if (hrs || min) {
            total_extra_feet = extra_feet + m_extra_feet;
        } else {
            total_extra_feet = m_extra_feet;
        }

        numerator = currentTotalBoreDepth;
        const denominator = currentTotalRunningRpm;

        if (numerator && denominator && denominator > 0 && numerator > 0) {
            return this.roundValue(numerator / denominator);
        }
        return 0;

    }

    getExtraFeet() {
        let m_extra_feet = 0;
        let extra_feet = 0;

        if (this.rpmSheet && this.rpmSheet.month_data) {
            m_extra_feet = this.rpmSheet.month_data.m_extra_feet;
        }
        if (this.rpmSheet && this.rpmSheet.depth) {
            extra_feet = this.rpmSheet.depth.above.extra_feet
        }

        return m_extra_feet + extra_feet;
    }

    getReboreDepth() {
        const depth = +this.form.get('depth.bore').value;
        const boreType: BoreType = this.form.get('depth.boreType').value;
        const pipeErection = +this.form.get('depth.pipeErection').value;
        let m_rebore_feet = 0;
        let rebore_depth = 0;

        if (this.rpmSheet && this.rpmSheet.month_data) {
            m_rebore_feet = this.rpmSheet.month_data.m_rebore_feet;
        }
        if (pipeErection && depth && depth >= pipeErection) {
            rebore_depth = this.roundValue(depth - pipeErection);
        }
        if ((boreType.type === 'Rebore' || boreType.id === 4) && rebore_depth) {
            return m_rebore_feet + rebore_depth;
        }
        return m_rebore_feet;
    }

    getOtherRpm() {
        const boreType: BoreType = this.form.get('depth.boreType').value;
        const reboreRpm = this.getReboreRpm();
        let m_other_rpm = 0;
        let rpm = 0;

        if (this.rpmSheet && this.rpmSheet.rpm) {
            rpm = this.rpmSheet.rpm.running;
        }

        if (this.rpmSheet && this.rpmSheet.month_data) {
            m_other_rpm = this.rpmSheet.month_data.m_other_rpm;
        }
        if (
            boreType.type === 'Rebore' || boreType.id === 4 ||
            boreType.type === 'Hose Cleaning' || boreType.id === 2
            || boreType.type === 'Air' || boreType.id === 3
        ) {
            if (boreType.type === 'Rebore' || boreType.id === 4) {
                if (reboreRpm && reboreRpm < rpm) {
                    rpm = rpm - reboreRpm
                }
            }
            return m_other_rpm + rpm
        }
        return m_other_rpm;
    }

    getExtraTime() {
        const hrs = +this.form.get('depth.above.hrs').value;
        const min = +this.form.get('depth.above.min').value;
        let m_extra_hrs = 0;
        let m_extra_mins = 0;
        if (this.rpmSheet && this.rpmSheet.month_data) {
            m_extra_hrs = this.rpmSheet.month_data.m_extra_hour;
            m_extra_mins = this.rpmSheet.month_data.m_extra_min;
        }
        let actualHrs = 0;
        let actualMin = 0;
        const totalMin = ((hrs + m_extra_hrs) * 60) + (min + m_extra_mins);
        if (totalMin) {
            actualHrs = Math.floor(totalMin / 60);
            actualMin = totalMin % 60;
        }
        return { hrs: actualHrs, min: actualMin };
    }

    getExtraRpm() {
        const extraTime = this.getExtraTime();
        if (extraTime.hrs || extraTime.min) {
            const totalMin = (extraTime.hrs * 60) + extraTime.min;
            const extraRpm = this.roundValue(totalMin / 60);
            return extraRpm;
        }
        return 0;
    }
    getReboreRpm() {
        const hrs = +this.form.get('depth.boreHrs').value;
        const min = +this.form.get('depth.boreMins').value;
        const boreType: BoreType = this.form.get('depth.boreType').value;
        let extraRpm = 0;
        if (this.rpmSheet && this.rpmSheet.depth && (boreType.type === 'Rebore' || boreType.id === 4)) {
            if (hrs || min) {
                extraRpm = this.convertToRpm(hrs, min);
            }
        }
        return extraRpm;
    }

    onRpmInputEnter(currentIndex) {
        const nextInput = this.rpmInputs.toArray()[currentIndex + 1];
        if (nextInput) {
            (nextInput.nativeElement as HTMLInputElement).focus();
        } else {
            const dieselInput = this.dieselInputs.toArray()[0];
            if (dieselInput) {
                (dieselInput.nativeElement as HTMLInputElement).focus();
            }
            // if no next input you are at last input
            // go to depth input first control - bore depth
        }
    }

    onDepthEnter(currentIndex) {
        if (currentIndex === 1) {
            // 1 - pipe erection feet
            // open above feet select
            this.aboveFeetSelect.open();
            this.aboveFeetSelect.focus();
            return;
        }

        const nextInput = this.depthInputs.toArray()[currentIndex + 1];
        if (nextInput) {
            (nextInput.nativeElement as HTMLInputElement).focus();
        } else {
            if (this.assignedBits && this.assignedBits.length) {
                this.bitSelect.open();
                this.bitSelect.focus();
            } else {
                this.snackBar.open('No Bits available, so skipping bit', null, { duration: 2000 });
                this.moveNextInput(0, -1);
            }
        }
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
                this.form.get('bit').reset();
                this.assignedBits = res;
            }
        })
    }

    openAssignHammer() {
        const dialogRef = this.dialog.open(AssignHammerDialogComponent, {
            data: {
                hammers: this.hammers,
                bitGodowns: this.bitGodowns,
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
                this.form.get('hammer').reset('');
                this.assignedHammers = res;
            }
        })
    }

    public bitsTrackBy(index, item: BitSerialNo) {
        return item.serial_no;
    }

    onInputKeyUp(event: KeyboardEvent, rowIndex, colIndex, ctrl?: AbstractControl) {
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
                    if (ctrl && ctrl.invalid) {
                        return;
                    }
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
        if (nextElRef && !(nextElRef.nativeElement as HTMLInputElement).disabled) {
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
            availableStock.feet = this.roundValue(availableStockFeet, 10);
        } else {
            availableStock.feet = 0;
        }
        this.updateBalanceStock(pipeId);

    }

    validateAndUpdateBalanceStock(pipeId, ctrl) {
        this.updateBalanceStock(pipeId, ctrl)
    }

    /**
     * available 
     */
    updateBalanceStock(pipeId, ctrl?: AbstractControl) {
        const pointExpenseFeetCtrl = this.pointExpenseFeetFormArray.controls.find(ctrl => +ctrl.get('pipeId').value === pipeId).get('value');
        let pointExpenseFeet = this.pointExpenseFeetFormArray.controls.find(ctrl => +ctrl.get('pipeId').value === pipeId).get('value').value
        pointExpenseFeet = pointExpenseFeet ? +pointExpenseFeet : 0;
        const availableStockFeet = this.rpmEntryTable.availableStockFeet.find(as => as.pipeId === pipeId).feet;
        const balanceStock = this.rpmEntryTable.balanceStockFeet.find(bs => bs.pipeId === pipeId);
        const balanceStockFeet = availableStockFeet - pointExpenseFeet;
        if (balanceStockFeet >= 0) {
            balanceStock.feet = this.roundValue(balanceStockFeet, 10);
            pointExpenseFeetCtrl.setErrors(null);
        } else {
            pointExpenseFeetCtrl.setErrors({ greater: true });
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

    confirmServiceCompletion(name, propName, type: 'service' | 'bit' | 'tractor' = 'service') {
        let message = '';
        if (type === 'service' || type === 'tractor') {
            message = `Would you like to complete ${name} service ?`
        }
        if (type === 'bit') {
            message = `Would you like to finish the ${name} ?`
        }
        const dialogRef = this.dialog.open(ServiceCompleteConfirmDialog, {
            data: {
                message,
                title: 'Confirm Service Completion'
            }
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res === 'yes') {
                if (type === 'service') {
                    this.rpmSheet.service[propName] = 0;
                }
                if (type === 'bit') {
                    this.rpmSheet.bit[propName] = 0;
                }
                if (type === 'tractor') {
                    this.form.get('rpm.trac').value[propName] = 0;
                }

            }
        })
    }

    confirmResetTotal() {
        const dialogRef = this.dialog.open(ServiceCompleteConfirmDialog, {
            data: {
                message: 'Would you like to Reset Total ?',
                title: 'Confirm Reset Total'
            }
        });

        dialogRef.afterClosed().subscribe((res) => {
            if (res === 'yes') {
                if (this.rpmSheet.month_data) {
                    this.loader.showSaveLoader('Reseting ...');
                    this.rpmEntryService.resetTotal({
                        date: (this.date as Moment).format('DD-MM-YYYY'),
                        rpm_no: this.rpmEntryNo,
                        vehicle_id: +this.selectedVehicle.vehicle_id,
                        vehicle_no: this.selectedVehicle.regNo
                    }).pipe(
                        finalize(() => this.loader.hideSaveLoader())
                    ).subscribe((resetData) => {
                        this.toastr.success('Total Reseted successfully');
                        this.rpmSheet.month_data.m_depth = 0;
                        this.rpmSheet.month_data.m_diesel = 0;
                        this.rpmSheet.month_data.m_diesel_avg = 0;
                        this.rpmSheet.month_data.m_rpm = 0;
                        this.rpmSheet.month_data.m_extra_hour = 0;
                        this.rpmSheet.month_data.m_extra_min = 0;
                        this.rpmSheet.month_data.m_extra_feet = 0;
                        this.rpmSheet.month_data.m_rebore_feet = 0;
                        this.rpmSheet.month_data.m_other_rpm = 0;
                        this.lastResetDate = resetData.date;
                        this.lastResetRpmNo = resetData.rpm_no;
                    })
                }
            }
        })
    }

    finishBit(bit: BitSerialNo) {
        const message = 'Would you like to Finist Bit ' + bit.bit_no + ' ?'
        const dialogRef = this.dialog.open(ServiceCompleteConfirmDialog, {
            data: {
                title: 'Finish Bit',
                message
            }
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'yes') {
                this.loader.showSaveLoader('Please wait');
                console.log(JSON.stringify({
                    ...bit,
                    ...this.selectedVehicle,
                    vehicle_id: +this.selectedVehicle.vehicle_id
                }, null, 2))
                this.rpmEntryService.finishBit({
                    ...bit,
                    ...this.selectedVehicle,
                    vehicle_id: +this.selectedVehicle.vehicle_id
                })
                    .pipe(finalize(() => this.loader.hideSaveLoader()))
                    .subscribe((bits) => {
                        this.assignedBits = bits;
                        this.form.get('bit').reset();
                        this.toastr.success('Finish Bit Updated  Sucessfully', null, { timeOut: 2000 })
                    });
            }
        })
    }

    finishHammer(hammer: HammerSerialNo) {
        const message = 'Would you like to Finist Hammer ' + hammer.serial_no + ' ?'
        const dialogRef = this.dialog.open(ServiceCompleteConfirmDialog, {
            data: {
                title: 'Finish Hammer',
                message
            }
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'yes') {
                this.loader.showSaveLoader('Please wait');
                this.rpmEntryService.finishHammer({
                    ...hammer,
                    ...this.selectedVehicle,
                    vehicle_id: +this.selectedVehicle.vehicle_id
                })
                    .pipe(finalize(() => this.loader.hideSaveLoader()))
                    .subscribe((hammers) => {
                        this.assignedHammers = hammers;
                        this.form.get('hammer').reset('');
                        this.toastr.success('Finish Hammer Updated  Sucessfully', null, { timeOut: 2000 })
                    });
            }
        })
    }

    addBook(isRequired = false) {
        if (this.bookPopupRef) {
            this.bookPopupRef.close();
        }
        this.bookPopupRef = this.cardOverlay.open(AddBookPopupComponent, this.addBookBtn, {
            data: {
                vehicle: this.selectedVehicle,
                isRequired
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
                this.bookRequired = false;
                this.resetAll();
                this.bookId = rpmSheet.book_id;
                this.bookStartNo = rpmSheet.start
                this.bookEndNo = rpmSheet.end;
                this.rpmEntryNo = rpmSheet.rpm_sheet_no;
                this.rpmSheet = rpmSheet;
                if (this.rpmSheet.rpm) {
                    this.previousDieselRpm = this.rpmSheet.rpm.prev_diesel_rpm;
                    this.pointDieselRpm = this.rpmSheet.rpm.point_diesel;
                }
                this.openDatePicker();
                this.enableAllControls();
                this.addDepthToSheet();
                this.updatePreviousStockFeet(rpmSheet);
            }
        })
    };

    /*
        total rpm = end rpm + manual rpm(if any) - used for next rpm sheet start rpm
        runnimg rpm = total rpm - start rpm 
        point diesel rpm = previous diesel rpm + running rpm
        (previous diesel rpm will be reset when diesel is re-filled, and hence point detail rpm will be running rpm
        ie, previous diesel rpm will be 0).
        services also calculated based on running rpm(sums up on previous service rpm, till gets reset - 
        once reseted service rpm starts from current running rpm ie, previous service rpm will be 0)
     */
    onRpmEndInput() {
        let start = 0;
        // let running = 0;
        const end = +this.form.get('rpm.end').value;
        const manual = +this.form.get('rpm.manual').value;
        // const endRpm = end + manual;
        if (this.rpmSheet.rpm && this.rpmSheet.rpm.start) {
            start = this.rpmSheet.rpm.start
        }
        let machineRunningRpm = end - start;
        if (machineRunningRpm <= 0) {
            machineRunningRpm = 0;
        } else {
            machineRunningRpm = this.roundValue(machineRunningRpm);
        }

        if (manual) {
            machineRunningRpm = this.roundValue(manual + machineRunningRpm);
        }

        if (this.rpmSheet.rpm) {
            this.rpmSheet.rpm.running = machineRunningRpm;
            this.rpmSheet.rpm.point_diesel = this.rpmSheet.rpm.prev_diesel_rpm + machineRunningRpm;
            this.rpmSheet.rpm.point_diesel = Math.round(this.rpmSheet.rpm.point_diesel * 100) / 100;
        }

        this.updateFeetAvg();
    }

    onTracEndInput() {
        const tracEndHour = +this.form.get('rpm.tracEndHour').value;
        const tracStartHour = +this.form.get('rpm.trac').value.start_hour;
        let runningTracRpm = 0;

        if (tracEndHour > tracStartHour) {
            runningTracRpm = tracEndHour - tracStartHour;
            runningTracRpm = Math.round(runningTracRpm * 100) / 100;
        } else {
            runningTracRpm = 0;
        }
        this.tracRunningRpm = runningTracRpm;
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
                this.rpmEntryTable.rrIncome = [...data.rrIncome.reverse()];
                this.rpmEntryTable.mmIncome = [...data.mmIncome.reverse()];
                this.updateAllPipeStockFeet();
            }
        })
    };

    removePointExpenseFeetCtrls() {
        while (this.pointExpenseFeetFormArray.controls.length) {
            this.pointExpenseFeetFormArray.removeAt(0)
        }
    }

    onServieLimitSelect(limit: ServiceLimit, prop) {
        this.loader.showSaveLoader('Loading')
        const services: VehicleServices = {
            ...this.vehicleServiceLimits,
            [prop]: limit.limit,
            vehicle_id: +this.selectedVehicle.vehicle_id
        }
        this.rpmEntryService.updateCompressorAirFilter(services).pipe(
            finalize(() => {
                this.loader.hideSaveLoader()
            })
        ).subscribe(() => {
            if (prop === 'c_air_filter') {
                this.activeCompressorAirFilterLimit = limit
                return this.toastr.success('Compressor Air Filter Service Limit updated successfully', null, { timeOut: 2000 })
            }
            if (prop === 'c_oil_service') {
                this.activeCompressorOilServiceLimit = limit;
                return this.toastr.success('Compressor Oil Service Limit updated successfully', null, { timeOut: 2000 })
            }
        }, (err) => {
            if (err) {
                this.toastr.error('Error while updating compressor air filter service limit', null, { timeOut: 2000 })
            }
        });
    }

    toVehicles() {
        if (this.selectedVehicle) {
            return this.vehicles.filter(v => v.vehicle_id !== this.selectedVehicle.vehicle_id)
        }
        return this.vehicles;
    }

    onVehicleChange() {
        this.loader.showSaveLoader('Loading ...');
        const lastRpmSheet$ = this.rpmEntryService.getLastRpmEntrySheet(this.selectedVehicle);
        const vehicleServiceLimit$ = this.rpmEntryService.getServiceLimits(this.selectedVehicle);
        const assignedBit$ = this.rpmEntryService.getAssignedBits(this.selectedVehicle);
        const assignedHammer$ = this.rpmEntryService.getAssignedHammers(this.selectedVehicle);
        const lastResetInfo$ = this.rpmEntryService.getLastResetInfo(this.selectedVehicle.vehicle_id);
        this.disableAllControls();
        zip(lastRpmSheet$, vehicleServiceLimit$, assignedBit$, lastResetInfo$, assignedHammer$).pipe(
            finalize(() => {
                this.loader.hideSaveLoader();
            }),
            mergeMap(([lastRpmEntrySheet, serviceLimits, assignedBits, lastReset, assignedHammers]) => {
                if (lastRpmEntrySheet.book_page_over) {
                    return of<VehicleChangeData>({ lastRpmEntrySheet, serviceLimits, assignedBits, incomeData: null, lastReset, assignedHammers });
                }
                return this.rpmEntryService.getRpmTableData(this.selectedVehicle, lastRpmEntrySheet.rpm_sheet_no).pipe(
                    map((incomeData) => {
                        return { lastRpmEntrySheet, serviceLimits, assignedBits, incomeData, lastReset, assignedHammers }
                    })
                );
            })
        ).subscribe(({ lastRpmEntrySheet, serviceLimits, assignedBits, incomeData, lastReset, assignedHammers }) => {
            this.vehicleServiceLimits = serviceLimits;
            this.activeCompressorAirFilterLimit = this.compressorAirFilterServiceLimits
                .find(c => c.limit === this.vehicleServiceLimits.c_air_filter);
            this.activeCompressorOilServiceLimit = this.compressorOilServiceLimits
                .find(c => c.limit === this.vehicleServiceLimits.c_oil_service);
            this.lastResetDate = lastReset.date;
            this.lastResetRpmNo = lastReset.rpm_no;
            this.assignedBits = assignedBits;
            this.assignedHammers = assignedHammers;
            if (lastRpmEntrySheet && lastRpmEntrySheet.book_page_over) {
                this.resetAll();
                this.resetBook();
                return this.addBook(true);
            }

            this.bookRequired = false;
            this.rpmEntryNo = lastRpmEntrySheet.rpm_sheet_no;
            this.bookEndNo = lastRpmEntrySheet.end;
            this.bookStartNo = lastRpmEntrySheet.start;
            this.bookId = lastRpmEntrySheet.book_id;
            this.picker.open();
            this.dateInput.nativeElement.focus();
            this.resetAll();
            // once vehicle is selected enable all controls
            if (incomeData) {
                this.rpmEntryTable.rrIncome = [...incomeData.rrIncome.reverse()];
                this.rpmEntryTable.mmIncome = [...incomeData.mmIncome.reverse()];
                this.updateAllPipeStockFeet()
            }
            this.updatePreviousStockFeet(lastRpmEntrySheet);
            this.rpmSheet = lastRpmEntrySheet;
            if (this.rpmSheet.rpm) {
                this.previousDieselRpm = this.rpmSheet.rpm.prev_diesel_rpm;
                this.pointDieselRpm = this.rpmSheet.rpm.point_diesel;
            }
            this.addDepthToSheet();
            this.enableAllControls();
        }, (err) => {

        })
    };

    updatePreviousStockFeet(lastRpmEntrySheet: RpmEntrySheet) {
        const rpmData = lastRpmEntrySheet.f_rpm_table_data;
        this.rpmEntryNo = lastRpmEntrySheet.rpm_sheet_no;
        if (rpmData) {
            rpmData.forEach(rd => {
                const previousStock = this.rpmEntryTable.previousStockFeet.find(ps => ps.pipeId === rd.pipe_id);
                const availableStock = this.rpmEntryTable.availableStockFeet.find(ps => ps.pipeId === rd.pipe_id);
                const balanceStock = this.rpmEntryTable.balanceStockFeet.find(ps => ps.pipeId === rd.pipe_id);
                previousStock.feet = rd.previous_stock_feet ? +rd.previous_stock_feet : 0;
                // available stock feet is already calculated by updateAllPipeStock()
                // - which is only rrincome and mmincome (previous stock wil be missing) from table data url
                // so add ly previous stock to avaliable stock.
                // in general rr / mmIncome will be added with avialble stock at updateAllPipeStock()
                // and previous stock will be added here
                availableStock.feet = availableStock.feet + previousStock.feet
                balanceStock.feet = availableStock.feet;
            })
        }
    }

    private resetBook() {
        this.disableAllControls();
        this.rpmSheet = null;
        this.bookId = null;
        this.bookEndNo = null;
        this.bookStartNo = null;
        this.rpmEntryNo = null;
        this.bookRequired = true;
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

    private resetAll() {

        // this.form.reset();

        this.form.get('rpm.manual').reset('');
        this.form.get('rpm.end').reset('');
        this.form.get('rpm.tracEndHour').reset('');
        this.form.get('rpm.trac').reset('');
        this.form.get('user').reset({
            drillerName: '',
            place: '',
            party: '',
            partyMobile: '',
            plumber: '',
            plumberMobile: ''
        })
        this.form.get('diesel.compressor').reset('');
        this.form.get('diesel.lorry').reset('');
        this.form.get('diesel.support').reset('');
        this.form.get('diesel.tractor').reset('');
        this.form.get('depth.pipeErection').reset('');
        this.form.get('depth.bore').reset('');
        this.form.get('depth.boreHrs').reset('');
        this.form.get('depth.boreMins').reset('');
        this.form.get('depth.above.feet').reset('');
        this.form.get('depth.above.hrs').reset('');
        this.form.get('depth.above.min').reset('');
        this.form.get('depth.boreType').reset(this.boreTypes[0]);
        this.form.get('bit').reset('');
        this.form.get('hammer').reset('');
        this.form.get('inVehicle').reset();
        this.form.get('outVehicle').reset();
        this.form.get('inRpmNo').reset();
        this.form.get('outRpmNo').reset();
        this.form.get('isDamage').reset();
        this.form.get('isInVehicle').reset();
        this.form.get('remarks').reset('');
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
        this.form.get('depth.above.hrs').disable();
        this.form.get('depth.above.min').disable();
        this.form.get('depth.boreHrs').disable();
        this.form.get('depth.boreMins').disable();

        this.rpmEntryTable.rrIncome.forEach(r => {
            r.feet = 0;
            r.length = 0;
        });

        this.rpmEntryTable.mmIncome.forEach(m => {
            m.feet = 0;
            m.length = 0;
        });

        this.rpmEntryTable.previousStockFeet.forEach(m => {
            m.feet = 0;
            m.length = 0;
        });

        this.rpmEntryTable.availableStockFeet.forEach(m => {
            m.feet = 0;
            m.length = 0;
        });

        this.rpmEntryTable.balanceStockFeet.forEach(m => {
            m.feet = 0;
            m.length = 0;
        });
        this.tracRunningRpm = 0;

        // this.picker.open();
        // (this.dateInput.nativeElement as HTMLInputElement).focus()

    }

    disableAllControls() {
        this.form.get('bit').disable();
        this.form.get('diesel').disable();
        this.form.get('depth').disable();
        this.form.get('rpm').disable();

        this.form.get('isInVehicle').disable();
        this.form.get('isOutVehicle').disable();
        this.form.get('isDamage').disable();
        this.form.get('remarks').disable();
        this.pointExpenseFeetFormArray.controls.forEach(ctrl => ctrl.disable());

    }

    enableAllControls() {
        if (!this.date) {
            return;
        }
        this.form.get('user').enable();
        this.form.get('bit').enable();
        this.form.get('diesel').enable();
        this.form.get('depth.bore').enable();
        this.form.get('depth.pipeErection').enable();
        this.form.get('depth.above.feet').enable();
        this.form.get('depth.boreType').enable();
        // this.form.get('rpm').enable();
        this.form.get('rpm.end').enable();
        this.form.get('rpm.manual').enable();
        this.form.get('rpm.trac').enable();

        this.form.get('isInVehicle').enable();
        this.form.get('isOutVehicle').enable();
        this.form.get('isDamage').enable();
        this.form.get('remarks').enable();
        this.pointExpenseFeetFormArray.controls.forEach(ctrl => ctrl.enable());

        // this.damageFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        // this.pointExpenseFeetFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        // this.veicleExInFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
        // this.veicleExOutFormArray.controls.forEach(ctrl => ctrl.get('value').enable());
    }

    openDiesel(liter) {
        if (!this.selectedVehicle || !this.bookId) {
            return
        }
        const dieselOverlayRef = this.cardOverlay.open(AddDieselPopupComponent, this.diselCompEl, {
            data: {
                diesel: liter
            }
        },
            [{
                originX: 'end',
                originY: 'top',
                overlayX: 'end',
                overlayY: 'top',
                offsetX: 220,
                offsetY: -78
            }]
        )

        dieselOverlayRef.afterClosed$.subscribe((res: number) => {
            if (res) {
                this.rpmSheet.diesel.compressor = +res
                if (this.rpmSheet.rpm) {
                    this.rpmSheet.rpm.prev_diesel_rpm = 0;
                    this.rpmSheet.rpm.point_diesel = this.rpmSheet.rpm.running
                }
                this.updateTotalDiesel();
                this.updateDieselAvg();
            }
        })
    }

    /**
     * compressor diesel / previous diesel rpm
     */
    updateDieselAvg() {
        const compressorDiesel = +this.form.get('diesel.compressor').value;
        let avg = 0;
        if (this.rpmSheet.diesel) {
            const previousDieselRpm = +this.rpmSheet.diesel.previous_rpm;
            if (previousDieselRpm <= 0 || compressorDiesel <= 0) {
                avg = 0;
            } else {
                avg = compressorDiesel / previousDieselRpm;
                avg = Math.round(avg * 100) / 100;
            }
            this.rpmSheet.diesel.average = avg;
        }
    }

    onDieselEnter(currentIndex) {
        const nextCtrl = this.dieselInputs.toArray()[currentIndex + 1];
        if (nextCtrl) {
            (nextCtrl.nativeElement as HTMLInputElement).focus();
        } else {
            (this.depthInputs.toArray()[0].nativeElement as HTMLInputElement).focus()
        }
    }

    updateTotalDiesel(type = '') {
        let totalDiesel = 0;
        const lorry = +this.form.get('diesel.lorry').value;
        const support = +this.form.get('diesel.support').value;
        const compressor = +this.form.get('diesel.compressor').value;
        const tractor = +this.form.get('diesel.tractor').value;
        if (type === 'compressor') {
            // reset previous diesel rpm when compressor diesel is filled
            if (compressor) {
                this.rpmSheet.rpm.prev_diesel_rpm = 0;
                this.rpmSheet.rpm.point_diesel = this.rpmSheet.rpm.running
            } else {
                this.rpmSheet.rpm.prev_diesel_rpm = this.previousDieselRpm;
                this.rpmSheet.rpm.point_diesel = this.roundValue(this.previousDieselRpm + +this.rpmSheet.rpm.running);
            }
        }

        if (this.rpmSheet.diesel) {
            totalDiesel = compressor + lorry + support + tractor
            this.rpmSheet.diesel.total = totalDiesel;
        }
        this.updateDieselAvg();
    }

    onDepthInput() {
        const bit: BitSerialNo = this.form.get('bit').value;
        const hammer: BitSerialNo = this.form.get('hammer').value;
        const boreType: BoreType = this.form.get('depth.boreType').value;
        const pipeErection = this.form.get('depth.pipeErection').value;
        const depth = this.form.get('depth.bore').value;
        if (boreType.type === 'Bore Depth' || boreType.type === 'Rebore' || boreType.id === 1 || boreType.id === 4) {
            this.updateBitTotalFeet(bit);
            this.updateHammerTotalFeet(hammer);
            if (boreType.type === 'Bore Depth' || boreType.id === 1) {
                this.updateExtraFeet();
            }
            if ((boreType.type === 'Rebore' || boreType.id === 4) && pipeErection && depth) {
                this.form.get('depth.boreHrs').enable();
                this.form.get('depth.boreMins').enable();
            } else {
                this.form.get('depth.boreHrs').disable();
                this.form.get('depth.boreMins').disable();
                this.form.get('depth.boreHrs').reset();
                this.form.get('depth.boreMins').reset();
            }
        }
    }

    onBoreTypeChange() {
        const boreType: BoreType = this.form.get('depth.boreType').value;

        this.form.get('depth.air').enable();
        this.form.get('depth.air').reset();
        this.form.get('depth.bore').enable();


        this.form.get('depth.above.hrs').enable();
        this.form.get('depth.above.min').enable();

        if (boreType.type === 'Air' || boreType.id === 3) {
            setTimeout(() => {
                this.airInoutSelect.open();
                this.airInoutSelect._closedStream.subscribe(() => {
                    this.airVehicle.open();
                });
                this.airVehicle._closedStream.subscribe(() => {
                    this.airRpmNoInput.focus();
                })
            });
        }

        if (boreType.type === 'Bore Depth' || boreType.id === 1 || boreType.type === 'Rebore' || boreType.id === 4) {
            if (boreType.type === 'Rebore' || boreType.id === 4) {
                this.resetExtraFeet();
            }
            this.onDepthInput();
        } else {
            // reset hammer, bit details, feet avg, extra feet
            // will be hose cleaning or air
            if (boreType.type === 'Hose Cleaning' || boreType.id === 2) {
                this.form.get('depth.bore').reset();
                this.form.get('depth.bore').disable();
            }
            this.resetDepth();
        }
    }

    /**
     * reset depth releated details
     */
    resetDepth() {
        const bit = this.form.get('bit').value;
        const hammer = this.form.get('hammer').value;
        let bitPreviousFeet = 0;
        let hammerPreviousFeet = 0;

        if (bit) {
            bitPreviousFeet = +bit.previous_feet
        }
        if (hammer) {
            hammerPreviousFeet = +hammer.previous_feet
        }
        this.resetExtraFeet();
        if (this.rpmSheet && this.rpmSheet.bit) {
            this.rpmSheet.bit.running_feet = 0;
            this.rpmSheet.bit.total_feet = bitPreviousFeet;
        }
        if (this.rpmSheet && this.rpmSheet.hammer) {
            this.rpmSheet.hammer.running_feet = 0;
            this.rpmSheet.hammer.total_feet = hammerPreviousFeet;
        }
    }

    resetExtraFeet() {
        this.form.get('depth.above.hrs').disable();
        this.form.get('depth.above.min').disable();
        this.form.get('depth.above.hrs').reset();
        this.form.get('depth.above.min').reset();
        if (this.rpmSheet.depth && this.rpmSheet.depth.above) {
            this.rpmSheet.depth.above.extra_feet = 0;
        }
        if (this.rpmSheet.depth) {
            this.rpmSheet.depth.average = 0;
        }
    }


    /**
     * 
     * @param bit 
     * calulate running feet and total feet
     * running feet bore depth - pipe erection depth
     * total feet - bit previous running feet + running feet
     */
    updateBitTotalFeet(bit: BitSerialNo) {
        const boreDepth = +this.form.get('depth.bore').value;
        const pipeErectionDepth = +this.form.get('depth.pipeErection').value;
        const boreType: BoreType = this.form.get('depth.boreType').value;

        let runningFeet = 0;
        let bitPreviousFeet = 0;

        if ((boreType.type !== 'Bore Depth' && boreType.id !== 1) && (boreType.type !== 'Rebore' && boreType.id !== 4)) {
            this.resetDepth();
            return;
        }

        if (bit) {
            bitPreviousFeet = +bit.previous_feet
        } else {
            return;
        }

        if (pipeErectionDepth && (boreDepth >= pipeErectionDepth)) {
            runningFeet = boreDepth - pipeErectionDepth
        } else {
            runningFeet = 0;
        }

        if (this.rpmSheet && this.rpmSheet.bit) {
            this.rpmSheet.bit.running_feet = runningFeet;
            this.rpmSheet.bit.total_feet = runningFeet + bitPreviousFeet;
        }
    }
    /**
     * 
     * @param hammer 
     * calulate running feet and total feet
     * running feet bore depth - pipe erection depth
     * total feet - bit previous running feet + running feet
     */
    updateHammerTotalFeet(hammer: HammerSerialNo) {
        const boreDepth = +this.form.get('depth.bore').value;
        const pipeErectionDepth = +this.form.get('depth.pipeErection').value;
        const boreType: BoreType = this.form.get('depth.boreType').value;

        let runningFeet = 0;
        let hammerPreviousFeet = 0;

        if ((boreType.type !== 'Bore Depth' && boreType.id !== 1) && (boreType.type !== 'Rebore' && boreType.id !== 4)) {
            return;
        }

        if (hammer) {
            hammerPreviousFeet = +hammer.previous_feet;
        } else {
            return;
        }

        if (pipeErectionDepth && (boreDepth >= pipeErectionDepth)) {
            runningFeet = boreDepth - pipeErectionDepth
        } else {
            runningFeet = 0;
        }

        if (this.rpmSheet && this.rpmSheet.hammer) {
            this.rpmSheet.hammer.running_feet = runningFeet;
            this.rpmSheet.hammer.total_feet = runningFeet + hammerPreviousFeet;
        }
    }

    submit() {
        if (!this.date) {
            (this.dateInput.nativeElement as HTMLInputElement).focus();
            return this.snackBar.open('Date is required', null, { duration: 2000 })
        }

        const pointExpenseFeet = this.form.value.pointExpenseFeet
        this.rpmEntryTable.pointExpenseFeet = pointExpenseFeet;

        const end = +this.form.value.rpm.end;

        if (end && end > this.rpmSheet.rpm.start) {
            this.rpmSheet.rpm.total = Math.round(end * 100) / 100;
        } else {
            this.rpmSheet.rpm.total = this.rpmSheet.rpm.start
        }


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
                tractor_start_hour: this.form.value.rpm.trac ? this.form.value.rpm.trac.start_hour : 0,
                tractor_end_hour: this.form.value.rpm.tracEndHour ? +this.form.value.rpm.tracEndHour : this.form.value.rpm.trac.start_hour,
                tractor_id: this.form.value.rpm.trac ? +this.form.value.rpm.trac.id : 0,
                tractor_no: this.form.value.rpm.trac ? this.form.value.rpm.trac.no : '',
                start: this.rpmSheet.rpm.start,
                manual: +this.form.value.rpm.manual,
                end: +this.form.value.rpm.end ? this.form.value.rpm.end : this.rpmSheet.rpm.start,
                running: this.rpmSheet.rpm.running,
                point_diesel: this.rpmSheet.rpm.point_diesel,
                total: this.rpmSheet.rpm.total,
                prev_diesel_rpm: this.rpmSheet.rpm.prev_diesel_rpm
            },
            diesel: {
                average: this.rpmSheet.diesel.average,
                previous_rpm: this.rpmSheet.diesel.previous_rpm,
                total: this.rpmSheet.diesel.total,
                support: +this.form.value.diesel.support,
                compressor: +this.form.value.diesel.compressor,
                lorry: +this.form.value.diesel.lorry,
                tractor: +this.form.value.diesel.tractor
            },
            service: {
                tractor_e_oil_service: this.form.get('rpm.trac').value ? this.roundValue(this.form.get('rpm.trac').value.e_oil_service + this.tracRunningRpm) : 0,
                tractor_g_oil_service: this.form.get('rpm.trac').value ? this.roundValue(this.form.get('rpm.trac').value.g_oil_service + this.tracRunningRpm) : 0,
                c_air_filter: this.roundValue(this.rpmSheet.service.c_air_filter + this.rpmSheet.rpm.running),
                c_oil_service: this.roundValue(this.rpmSheet.service.c_oil_service + this.rpmSheet.rpm.running),
                e_air_filter: this.roundValue(this.rpmSheet.service.e_air_filter + this.rpmSheet.rpm.running),
                e_oil_service: this.roundValue(this.rpmSheet.service.e_oil_service + this.rpmSheet.rpm.running),
                seperator: this.roundValue(this.rpmSheet.service.seperator + this.rpmSheet.rpm.running)
            },
            depth: {
                average: this.rpmSheet.depth.average,
                bore_type: this.form.value.depth.boreType.type,
                bore_id: +this.form.value.depth.boreType.id,
                rebore_hrs: this.form.value.depth.boreHrs ? +this.form.value.depth.boreHrs : 0,
                rebore_mins: this.form.value.depth.boreMins ? +this.form.value.depth.boreMins : 0,
                above: {
                    feet: this.form.value.depth.above.feet,
                    extra_feet: +this.rpmSheet.depth.above.extra_feet,
                    hrs: this.form.value.depth.above.hrs ? +this.form.value.depth.above.hrs : 0,
                    min: this.form.value.depth.above.min ? +this.form.value.depth.above.min : 0,
                },
                bore: +this.form.value.depth.bore || 0,
                pipe_erection: +this.form.value.depth.pipeErection,
                air: {
                    in_out: (this.form.value.depth.air && this.form.value.depth.air.inOut) || '',
                    rpm_entry_no: (this.form.value.depth.air && +this.form.value.depth.air.rpmNo) || 0,
                    vehicle_number: (this.form.value.depth.air && this.form.value.depth.air.vehicle && this.form.value.depth.air.vehicle.regNo) || '',
                    vehicle_id: (this.form.value.depth.air && this.form.value.depth.air.vehicle && +this.form.value.depth.air.vehicle.vehicle_id) || 0
                }
            },
            month_data: {
                m_depth: this.displayMonthDepth(),
                m_diesel: this.displayDieselTotal(),
                m_rpm: this.displayRunningRpm(),
                m_extra_feet: this.getExtraFeet(),
                m_extra_hour: this.getExtraTime().hrs,
                m_extra_min: this.getExtraTime().min,
                m_diesel_avg: this.displayDieselAvg(),
                m_rebore_feet: this.getReboreDepth(),
                m_other_rpm: this.getOtherRpm()
            },
            bit: {
                ...this.form.value.bit,
                hammer: this.rpmSheet.bit.hammer + this.rpmSheet.bit.running_feet,
                piston: this.rpmSheet.bit.piston + this.rpmSheet.bit.running_feet,
                running_feet: this.rpmSheet.bit.running_feet,
                total_feet: this.rpmSheet.bit.total_feet
            },
            hammer: {
                ...this.form.value.hammer,
                running_feet: this.rpmSheet.hammer.running_feet,
                total_feet: this.rpmSheet.hammer.total_feet
            },
            user_address: {
                driller_name: this.form.value.user.drillerName,
                party: this.form.value.user.party,
                party_mobile: this.form.value.user.partyMobile,
                place: this.form.value.user.place,
                plumber: this.form.value.user.plumber,
                plumber_mobile: this.form.value.user.plumberMobile
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
        };
        this.rpmEntryService.submitRpm(payload).pipe(
            mergeMap((lastRpmEntrySheet) => {

                const bits$ = this.rpmEntryService.getAssignedBits(this.selectedVehicle);
                const hammers$ = this.rpmEntryService.getAssignedHammers(this.selectedVehicle);
                const tractor$ = this.rpmEntryService.getTractors();

                return zip(bits$, tractor$, hammers$).pipe(map(([assignedBits, tractors, hammers]) => {
                    return { lastRpmEntrySheet, assignedBits, tractors, hammers }
                }));
            }),
        ).subscribe(({ lastRpmEntrySheet, assignedBits, tractors, hammers }) => {
            this.toastr.success('Rpm Saved Successfully', null, { timeOut: 3000 });
            this.resetAll();
            this.disableAllControls();
            if (assignedBits) {
                this.assignedBits = assignedBits;
                this.form.get('bit').reset();
            }
            if (hammers) {
                this.assignedHammers = hammers;
                this.form.get('hammer').reset('')
            }
            if (tractors) {
                this.tractors = tractors;
            }
            if (lastRpmEntrySheet && lastRpmEntrySheet.book_page_over) {
                this.resetBook();
                this.common.scrollTop();
                this.addBook(true);
                return;
            }

            this.openDatePicker();
            this.rpmSheet = lastRpmEntrySheet;
            if (this.rpmSheet.rpm) {
                this.previousDieselRpm = this.rpmSheet.rpm.prev_diesel_rpm;
                this.pointDieselRpm = this.rpmSheet.rpm.point_diesel;
            }
            this.addDepthToSheet();
            this.updatePreviousStockFeet(lastRpmEntrySheet);
        }, () => {
            this.toastr.error('Error while saving RPM Entry Sheet')
        })
    }

    private buildPointExpenseForm(pipeType, pipeId, pipeSize) {
        return this.fb.group({ pipeType, pipeId, pipeSize, value: { value: '', disabled: true } })
    }





    // feet avg will be above feet / running rpm - extra feet rpm (if have extra feet)
    // if bore depth is less than above feet(no extra feet and rpm), so feet avg will be bore depth / running rpm
    // bore depth - extra feet (above feet) / running rpm - extra rpm
    updateFeetAvg() {
        const hrs = +this.form.get('depth.above.hrs').value;
        const min = +this.form.get('depth.above.min').value;
        const boreDepth = +this.form.get('depth.bore').value;
        const boreType: BoreType = this.form.get('depth.boreType').value;
        let totalDepth = 0; // numerator
        let totalRpm = 0; // denominator
        let feetAvg = 0;

        if (this.rpmSheet.depth && (boreType.type === 'BoreDepth' || boreType.id === 1)) {
            const extraFeet = +this.rpmSheet.depth.above.extra_feet;
            const runningRpm = +this.rpmSheet.rpm.running;

            if (extraFeet && (hrs || min)) {
                const extraRpm = this.convertToRpm(hrs, min);
                totalDepth = boreDepth - extraFeet;
                totalRpm = runningRpm - extraRpm;
            } else {
                totalDepth = boreDepth;
                totalRpm = runningRpm;
            }

            if (totalDepth > 0 && totalRpm > 0) {
                feetAvg = totalDepth / totalRpm;
                this.rpmSheet.depth.average = Math.floor(feetAvg);
            }
        }
    }

    private getCurrentExtraRpm() {
        const hrs = +this.form.get('depth.above.hrs').value;
        const min = +this.form.get('depth.above.min').value;
        const boreType: BoreType = this.form.get('depth.boreType').value;
        let extraRpm = 0;
        if (this.rpmSheet && this.rpmSheet.depth && (boreType.type === 'BoreDepth' || boreType.id === 1)) {
            const extraFeet = +this.rpmSheet.depth.above.extra_feet;
            if (extraFeet && (hrs || min)) {
                extraRpm = this.convertToRpm(hrs, min);
            }
        }
        return extraRpm
    }

    private convertToRpm(h = 0, m = 0) {
        const hrs = h ? +h : 0;
        const min = m ? +m : 0;
        const rpmMin = 60;
        let rpm = 0;
        const totalMin = hrs * 60 + min;

        if (totalMin) {
            rpm = totalMin / rpmMin;
        }
        return rpm;
    }

    updateExtraFeet() {
        const aboveFeet: ServiceLimit = this.form.get('depth.above.feet').value;
        const boreType: BoreType = this.form.get('depth.boreType').value;
        const boreDepth = +this.form.get('depth.bore').value;
        let extraFeet = 0;

        extraFeet = boreDepth - aboveFeet.limit;

        if (this.rpmSheet.depth) {
            if (extraFeet > 0) {
                if (boreType.type === 'Bore Depth' || boreType.id === 1) {
                    this.rpmSheet.depth.above.extra_feet = extraFeet;
                    this.form.get('depth.above.hrs').enable();
                    this.form.get('depth.above.min').enable();
                }
            } else {
                this.form.get('depth.above.hrs').reset();
                this.form.get('depth.above.min').reset();
                this.form.get('depth.above.hrs').disable();
                this.form.get('depth.above.min').disable();
                this.rpmSheet.depth.above.extra_feet = 0;
            }
        }
        this.updateFeetAvg();
    }

    // as depth details are not available in 
    private addDepthToSheet() {
        setTimeout(() => {
            this.form.get('depth.above.feet').setValue(this.rpmHourFeets[0]);
        });
        this.rpmSheet.depth = {
            bore_type: this.boreTypes[0].type,
            bore_id: +this.boreTypes[0].id,
            above: { extra_feet: 0, feet: this.rpmHourFeets[0], hrs: 0, min: 0 },
            average: 0,
            bore: 0,
            pipe_erection: 0,
            rebore_hrs: 0,
            rebore_mins: 0,
            air: {
                in_out: '',
                rpm_entry_no: 0,
                vehicle_id: 0,
                vehicle_number: ''
            }
        }
    }

    roundValue(value, place = 100) {
        if (value) {
            return Math.round(value * place) / place;
        }

        return 0;
    }

    onTractorChange($event: MatSelectChange) {
        if ($event.value) {
            this.rpmSheet.rpm.tractor_start_hour = $event.value.start_hour ? +$event.value.start_hour : 0;
            return this.form.get('rpm.tracEndHour').enable();
        }
        this.form.get('rpm.tracEndHour').disable();
        this.form.get('rpm.tracEndHour').reset();
        this.tracRunningRpm = 0;
    }

    tableClick($event: MouseEvent) {
        const trigger = $event.target as HTMLElement;
        if (trigger.tagName === 'INPUT' && trigger.attributes.getNamedItem('disabled') && !this.selectedVehicle) {
            return this.snackBar.open('Please Select a Vehicle', null, { duration: 4000 });
        }
    }

    private openDatePicker() {
        setTimeout(() => {
            (this.dateInput.nativeElement as HTMLInputElement).focus();
            this.picker.open();
        })
    }
}