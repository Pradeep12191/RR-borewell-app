import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RpmEntrySheet } from '../../models/RpmEntrySheet';
import { Column } from '../../expand-table/Column';
import { MatTableDataSource, MatDatepicker, MatSelect, } from '@angular/material';
import { RpmEntryService } from '../rpm-entry/rpm-entry.service';
import { RpmEntryReportService } from './rpm-entry-report.service';
import { LoaderService } from '../../services/loader-service';
import { finalize, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Vehicle } from '../../models/Vehicle';

const sheetNoValidation = (control: AbstractControl) => {
    const fromSheetNo = +control.get('fromRpmSheetNo').value;
    const toSheetNo = +control.get('toRpmSheetNo').value;
    if (fromSheetNo && toSheetNo && fromSheetNo > toSheetNo) {
        return {
            sheetNoGreater: true
        }
    }
    return null
}

const dateValidation = (control: AbstractControl) => {
    const fromDate = control.get('from').value as Moment;
    const toDate = control.get('to').value as Moment;
    console.log(fromDate, toDate)
    if (fromDate && toDate && fromDate.isAfter(toDate)) {
        return {
            dateGreater: true
        }
    }
    return null
}

@Component({
    templateUrl: './rpm-entry-report.component.html',
    styleUrls: ['./rpm-entry-report.component.scss']
})
export class RpmEntryReportComponent implements OnDestroy, AfterViewInit {
    routeDataSubcription: Subscription;
    routeParamSubcription: Subscription;
    entries: RpmEntrySheet[];
    entriesDatasource: MatTableDataSource<RpmEntrySheet>;
    vehicleId;
    vehicles: Vehicle[]
    filterForm: FormGroup;
    monthPicker: MatDatepicker<any>;
    loading;
    @ViewChild('vehicleSelect', { static: false }) vehicleSelect: MatSelect;
    searchCriterias = [
        { value: 'rpmSheetNo', display: 'Rpm Sheet No' },
        { value: 'date', display: 'Date' },
        { value: 'month', display: 'Month' },
    ]
    public columns: Column[] = [
        { id: 'serialNo', name: 'COLUMN.SERIAL_NO', type: 'index', width: '10' },
        { id: 'rpm_sheet_no', name: 'RPM Sheet No.', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'vehicle_no', name: 'Vehicle No.', type: 'string', width: '20', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: 'date', name: 'Date', type: 'string', width: '25', style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'more_details', name: 'Collapse All', type: 'toggle', width: '20', isCenter: true }
    ];
    constructor(
        private route: ActivatedRoute,
        private rpmEntryReportService: RpmEntryReportService,
        private loader: LoaderService,
        private fb: FormBuilder
    ) {
        this.routeDataSubcription = this.route.data.subscribe((data) => {
            this.entries = data.entries;
            this.vehicles = data.vehicles
            this.entriesDatasource = new MatTableDataSource(this.entries);
        });
        this.routeParamSubcription = this.route.queryParamMap.subscribe((params) => {
            this.vehicleId = params.get('vehicleId');
            const veh = this.vehicles.find(v => +v.vehicle_id === +this.vehicleId)
            setTimeout(() => {
                if (!veh) {
                    this.vehicleSelect.open();
                    this.vehicleSelect.focus();
                } else {
                    this.filterForm.get('vehicle').setValue(veh);
                    this.filterForm.enable({ emitEvent: false })
                }
            })
        })

        this.filterForm = this.fb.group({
            vehicle: '',
            searchCriteria: { value: 'rpmSheetNo', disabled: true },
            rpm: this.fb.group({
                fromRpmSheetNo: { value: '', disabled: true },
                toRpmSheetNo: { value: '', disabled: true }
            }, { validators: sheetNoValidation }),
            date: this.fb.group({
                from: '',
                to: ''
            }, { validators: dateValidation }),
            month: '',
            type: ''
        });

        this.filterForm.get('rpm').valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((rpmObj) => {
                const rpmCtrl = this.filterForm.get('rpm');
                const vehicle_id = this.filterForm.get('vehicle').value.vehicle_id;
                let from_rpm = '';
                let to_rpm = ''
                if (rpmCtrl.valid) {
                    from_rpm = rpmObj.fromRpmSheetNo || rpmObj.toRpmSheetNo;
                    to_rpm = rpmObj.toRpmSheetNo || rpmObj.fromRpmSheetNo;
                    return this.rpmEntryReportService.getRpmEntries({ from_rpm, to_rpm, vehicle_id });
                }
                return of(null);
            })
        ).subscribe((entries: RpmEntrySheet[]) => {
            if (entries) {
                this.entries = entries;
                this.entriesDatasource = new MatTableDataSource(this.entries);
            }
        });

        this.filterForm.get('date').valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((dateObj) => {
            console.log(dateObj)
        })
    }

    ngAfterViewInit() {
        this.vehicleSelect._closedStream.subscribe(() => {
            if (this.filterForm.value.vehicle) {
                this.filterForm.enable({ emitEvent: false })
            }
        })
    }

    downloadReport() {
        this.loader.showSaveLoader('Generating Report ...')
        this.rpmEntryReportService.downloadPdf(this.vehicleId).pipe(
            finalize(() => {
                this.loader.hideSaveLoader()
            })
        ).subscribe()
    }

    onCriteriaChange() {
        (this.filterForm.get('rpm') as FormGroup).reset({ fromRpmSheetNo: '', toRpmSheetNo: '' }, { emitEvent: false });
        (this.filterForm.get('date') as FormGroup).reset({ from: '', to: '' }, { emitEvent: false });
        (this.filterForm.get('month') as FormGroup).reset('', { emitEvent: false });
    }

    disableControls() {
        this.filterForm.disable()
    }

    enableControls() {
        this.filterForm.enable()
    }

    getMessage() {
        if (this.filterForm.get('date').invalid) {
            return 'To Date should be greater than From Date'
        }
        if (this.filterForm.get('rpm').invalid) {
            return 'To Rpm Sheet no should be greater than From Rpm Sheet no'
        }
    }

    onVehicleChange() {
        this.loading = true;
        const vehicle_id = this.filterForm.value.vehicle ? this.filterForm.value.vehicle.vehicle_id : ''
        this.rpmEntryReportService.getRpmEntries({ vehicle_id }).pipe(finalize(() => this.loading = false)).subscribe((entries) => {
            this.entries = entries;
            this.entriesDatasource = new MatTableDataSource(this.entries);
        })
    }


    ngOnDestroy() {
        if (this.routeDataSubcription) { this.routeDataSubcription.unsubscribe(); }
        if (this.routeParamSubcription) { this.routeParamSubcription.unsubscribe(); }
    }
}